const express = require('express');
const multer  = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define user schema and model
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  profileImage: String
});
const User = mongoose.model('User', userSchema);

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('uploads'));

//Home page route
app.get('/', (req, res) => {
    res.render('index');
});

// Regular expression for email validation
const emailRegex = /^\S+@\S+\.\S+$/;

// Regular expression for phone number validation
const phoneRegex = /^\d{10}$/;

// Route to save user data
app.post('/saveUser', upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if(req.file){
          fs.unlinkSync(req.file.path);
      }
      return res.status(400).send('Email already exists.');
    }
    // Validate username
    if (!username.trim()) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }  
        return res.status(400).send('Username cannot be empty.');
    }

    // Validate email
    if (!emailRegex.test(email)) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }  
        return res.status(400).send('Please enter a valid email address.');
    }

    // Validate phone number
    if (!phoneRegex.test(phone)) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).send('Please enter a valid 10-digit phone number.');
    }


    const profileImage = req.file ? req.file.filename : '';
    // Validate profile image
    if (!profileImage) {
      return res.status(400).send('Profile image cannot be empty.');
    }

    // Save user data to MongoDB
    const newUser = new User({ username, email, phone, profileImage });
    await newUser.save();

    // Fetch users based on the current search query
    const searchQuery = req.query.search || '';
    let users;

    if (searchQuery === '') {
      // If search query is empty, return all users
      users = await User.find();
    } else {
      // If search query is provided, search across multiple fields
      users = await User.find({
        $or: [
          { username: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { phone: { $regex: searchQuery, $options: 'i' } }
        ]
      });
    }

    res.json("User saved successfully");
  } catch (error) {
    if(req.file){
        fs.unlinkSync(req.file.path);
    }
    console.error(error);
    res.status(500).send('Error saving user data.');
  }
});

// Route to get users based on search query
// app.get('/getUsers', async (req, res) => {
//     try {
//       const searchQuery = req.query.search || ''; // Get search query parameter
//       let users;
  
//       if (searchQuery === '') {
//         // If search query is empty, return all users
//         users = await User.find();
//       } else {
//         // If search query is provided, search across multiple fields
//         users = await User.find({
//           $or: [
//             { username: { $regex: searchQuery, $options: 'i' } },
//             { email: { $regex: searchQuery, $options: 'i' } },
//             { phone: { $regex: searchQuery, $options: 'i' } }
//           ]
//         });
//       }
  
//       res.json(users);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error fetching users.');
//     }
//   });

// Route to get users based on pagination and search query
app.get('/getUsers', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;
      const searchQuery = req.query.search || '';

      const totalUsers = await User.countDocuments({
          $or: [
              { username: { $regex: searchQuery, $options: 'i' } },
              { email: { $regex: searchQuery, $options: 'i' } },
              { phone: { $regex: searchQuery, $options: 'i' } }
          ]
      });

      const totalPages = Math.ceil(totalUsers / limit);

      const users = await User.find({
          $or: [
              { username: { $regex: searchQuery, $options: 'i' } },
              { email: { $regex: searchQuery, $options: 'i' } },
              { phone: { $regex: searchQuery, $options: 'i' } }
          ]
      }).skip(skip).limit(limit);

      res.json({ users, totalPages });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching users.');
  }
});


// Route to delete user by ID
app.delete('/deleteUser/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find the user by ID
      const user = await User.findById(userId);
  
      // If user is not found, return error
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
      // Delete user's profile image file if it exists
      if (user.profileImage) {
        const imagePath = path.join(__dirname, 'uploads', user.profileImage);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      // Delete the user from the database
      await User.findByIdAndDelete(userId);
      res.json("User deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting user.');
    }
  });
    
// Route to edit user by ID
app.put('/editUser/:userId', upload.single('profileImage'), async (req, res) => {
    try {
      const userId = req.params.userId;
      const { username, email, phone } = req.body;  
      
      // Find the user by ID
      const user = await User.findById(userId);

      // If user is not found, return error
      if (!user) {
        return res.status(404).send('User not found.');
      }

      // Validate username
      if (!username.trim()) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).send('Username cannot be empty.');
      }

      // Validate email
      if (!emailRegex.test(email)) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).send('Please enter a valid email address.');
      }

      // Validate phone number
      if (!phoneRegex.test(phone)) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).send('Please enter a valid 10-digit phone number.');
      }
      

      let updateFields = { username, email, phone };
  
        // If a new profile image is uploaded, replace the existing image
        if (req.file) {
        // Delete existing profile image file if it exists
        if (user.profileImage) {
          const imagePath = path.join(__dirname, 'uploads', user.profileImage);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        updateFields.profileImage = req.file.filename;
        }
  
      // Update the user details in the database
      await User.findByIdAndUpdate(userId, updateFields);
      res.send("User updated successfully");
    } catch (error) {
        if(req.file){
            fs.unlinkSync(req.file.path);
        }  
      console.error(error);
      res.status(500).send('Error editing user.');
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
