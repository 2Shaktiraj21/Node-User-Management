// document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch user data
    // function fetchUsers(searchQuery) {
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', '/getUsers?search=' + encodeURIComponent(searchQuery), true);
    //     xhr.onreadystatechange = function () {
    //         if (xhr.readyState === XMLHttpRequest.DONE) {
    //             if (xhr.status === 200) {
    //                 var users = JSON.parse(xhr.responseText);
    //                 populateUserTable(users);
    //             } else {
    //                 console.error(xhr.responseText);
    //             }
    //         }
    //     };
    //     xhr.send();
    // }

//     // Function to fetch user data with pagination
//     var currentpage = 1;
//     function fetchUsers(page = 1, limit = 5, searchQuery = '') {
//         var xhr = new XMLHttpRequest();
//         xhr.open('GET', `/getUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`, true);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     var result = JSON.parse(xhr.responseText);
//                     populateUserTable(result.users);
//                     renderPagination(result.totalPages, page);
//                 } else {
//                     console.error(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send();
//     }

//     // Function to render pagination UI
//     function renderPagination(totalPages, currentPage) {
//         var paginationElement = document.getElementById('pagination');
//         paginationElement.innerHTML = '';

//         for (var i = 1; i <= totalPages; i++) {
//             var li = document.createElement('li');
//             li.classList.add('page-item');
//             var link = document.createElement('a');
//             link.classList.add('page-link');
//             link.textContent = i;
//             link.href = '#';
//             if (i === currentPage) {
//                 li.classList.add('active');
//             }
//             link.addEventListener('click', function () {
//                 fetchUsers(parseInt(this.textContent));
//             });
//             li.appendChild(link);
//             paginationElement.appendChild(li);
//         }
//     }


//     // Function to populate user table
//     function populateUserTable(users) {
//         var tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
//         tableBody.innerHTML = '';

//         users.forEach(function (user) {
//             var row = tableBody.insertRow();

//             var usernameCell = row.insertCell(0);
//             usernameCell.textContent = user.username;

//             var emailCell = row.insertCell(1);
//             emailCell.textContent = user.email;

//             var phoneCell = row.insertCell(2);
//             phoneCell.textContent = user.phone;

//             var profileImageCell = row.insertCell(3);
//             var profileImage = document.createElement('img');
//             profileImage.src = '/' + user.profileImage;
//             profileImage.height = 80;
//             profileImage.width = 130;
//             profileImage.className = 'img-fluid';
//             profileImageCell.appendChild(profileImage);
//             var editButton = document.createElement('button');
//             var actionCell = row.insertCell(4);
//             editButton.textContent = 'Edit';
//             editButton.className = 'btn btn-primary btn-sm mr-1';
//             editButton.addEventListener('click', function () {
//                 // Prefill form with user details for editing
//                 document.getElementById('userId').value = user._id;
//                 document.getElementById('editUsername').value = user.username;
//                 document.getElementById('editEmail').value = user.email;
//                 document.getElementById('editPhone').value = user.phone;

//                 // Show the edit form modal
//                 $('#editModal').modal('show');
//             });
//             actionCell.appendChild(editButton);

//             var deleteButton = document.createElement('button');
//             deleteButton.textContent = 'Delete';
//             deleteButton.className = 'btn btn-danger btn-sm';
//             deleteButton.addEventListener('click', function () {
//             // Confirm deletion
//             if (confirm('Are you sure you want to delete this user?')) {
//                 // Send delete request to server
//                 var xhr = new XMLHttpRequest();
//                 xhr.open('DELETE', '/deleteUser/' + user._id, true);
//                 xhr.onreadystatechange = function () {
//                     if (xhr.readyState === XMLHttpRequest.DONE) {
//                         if (xhr.status === 200) {
//                             // Reload users after deletion
//                             fetchUsers(currentpage);
//                             alert("User deleted successfully");
//                         } else {
//                             alert(xhr.responseText);
//                         }
//                     }
//                 };
//                 xhr.send();
//             }
//         });
//         actionCell.appendChild(deleteButton);
//         });
//     }

//     // Function to handle form submission
//     document.getElementById('userForm').addEventListener('submit', function (event) {
//         event.preventDefault();

//         var formData = new FormData(this);

//         var xhr = new XMLHttpRequest();
//         xhr.open('POST', '/saveUser?search=' + encodeURIComponent(document.getElementById('searchInput').value.trim()), true);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     // Reload users after deletion
//                     fetchUsers(currentpage);
//                     document.getElementById('userForm').reset(); // Reset form fields after successful submission
//                     alert('user added successfully');
//                 } else {
//                     alert(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send(formData);
//     });

//     // Function to handle form submission for editing
//     document.getElementById('editForm').addEventListener('submit', function (event) {
//         event.preventDefault();

//         var formData = new FormData(this);

//         var xhr = new XMLHttpRequest();
//         xhr.open('PUT', '/editUser/' + formData.get('userId') + '?search=' + encodeURIComponent(document.getElementById('searchInput').value.trim()), true);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status === 200) {
//                     // Reload users after deletion
//                     fetchUsers(currentpage);
//                     $('#editModal').modal('hide'); // Hide the edit form modal after successful submission
//                     alert('user updated successfully');
//                 } else {
//                     alert(xhr.responseText);
//                 }
//             }
//         };
//         xhr.send(formData);
//     });

//     // Initial fetch when the page loads
//     fetchUsers(1);

//     // Event listener for search input
//     document.getElementById('searchInput').addEventListener('input', function () {
//         var searchQuery = this.value.trim();
//         fetchUsers(1,5,searchQuery);
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
    // Define a variable to keep track of the current page
    var currentPage = 1;

    // Function to fetch user data with pagination
    function fetchUsers(page = currentPage, limit = 5, searchQuery = '') {
        // Update the currentPage variable with the current page
        currentPage = page;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/getUsers?page=${page}&limit=${limit}&search=${encodeURIComponent(searchQuery)}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var result = JSON.parse(xhr.responseText);
                    populateUserTable(result.users);
                    renderPagination(result.totalPages, page);
                } else {
                    console.error(xhr.responseText);
                }
            }
        };
        xhr.send();
    }

    // Function to render pagination UI
    function renderPagination(totalPages, currentPage) {
        var paginationElement = document.getElementById('pagination');
        paginationElement.innerHTML = '';

        for (var i = 1; i <= totalPages; i++) {
            var li = document.createElement('li');
            li.classList.add('page-item');
            var link = document.createElement('a');
            link.classList.add('page-link');
            link.textContent = i;
            link.href = '#';
            if (i === currentPage) {
                li.classList.add('active');
            }
            link.addEventListener('click', function () {
                fetchUsers(parseInt(this.textContent));
            });
            li.appendChild(link);
            paginationElement.appendChild(li);
        }
    }

    // Function to populate user table
    function populateUserTable(users) {
        var tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        users.forEach(function (user) {
            var row = tableBody.insertRow();

            var usernameCell = row.insertCell(0);
            usernameCell.textContent = user.username;

            var emailCell = row.insertCell(1);
            emailCell.textContent = user.email;

            var phoneCell = row.insertCell(2);
            phoneCell.textContent = user.phone;

            var profileImageCell = row.insertCell(3);
            var profileImage = document.createElement('img');
            profileImage.src = '/' + user.profileImage;
            profileImage.height = 80;
            profileImage.width = 130;
            profileImage.className = 'img-fluid';
            profileImageCell.appendChild(profileImage);
            var editButton = document.createElement('button');
            var actionCell = row.insertCell(4);
            editButton.textContent = 'Edit';
            editButton.className = 'btn btn-primary btn-sm mr-1';
            editButton.addEventListener('click', function () {
                // Prefill form with user details for editing
                document.getElementById('userId').value = user._id;
                document.getElementById('editUsername').value = user.username;
                document.getElementById('editEmail').value = user.email;
                document.getElementById('editPhone').value = user.phone;

                // Show the edit form modal
                $('#editModal').modal('show');
            });
            actionCell.appendChild(editButton);

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'btn btn-danger btn-sm';
            deleteButton.addEventListener('click', function () {
                // Confirm deletion
                if (confirm('Are you sure you want to delete this user?')) {
                    // Send delete request to server
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/deleteUser/' + user._id, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status === 200) {
                                // Reload users after deletion
                                fetchUsers(currentPage,5,document.getElementById('searchInput').value.trim()); // Fetch current page
                                alert("User deleted successfully");
                            } else {
                                alert(xhr.responseText);
                            }
                        }
                    };
                    xhr.send();
                }
            });
            actionCell.appendChild(deleteButton);
        });
    }

    // Function to handle form submission
    document.getElementById('userForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(this);

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/saveUser?search=' + encodeURIComponent(document.getElementById('searchInput').value.trim()), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Reload users after adding
                    fetchUsers(currentPage,5,document.getElementById('searchInput').value.trim()); // Fetch current page
                    document.getElementById('userForm').reset(); // Reset form fields after successful submission
                    alert('User added successfully');
                } else {
                    alert(xhr.responseText);
                }
            }
        };
        xhr.send(formData);
    });

    // Function to handle form submission for editing
    document.getElementById('editForm').addEventListener('submit', function (event) {
        event.preventDefault();

        var formData = new FormData(this);

        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/editUser/' + formData.get('userId') + '?search=' + encodeURIComponent(document.getElementById('searchInput').value.trim()), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Reload users after editing
                    fetchUsers(currentPage,5,document.getElementById('searchInput').value.trim()); // Fetch current page
                    $('#editModal').modal('hide'); // Hide the edit form modal after successful submission
                    alert('User updated successfully');
                } else {
                    alert(xhr.responseText);
                }
            }
        };
        xhr.send(formData);
    });

    // Initial fetch when the page loads
    fetchUsers(1);

    // Event listener for search input
    document.getElementById('searchInput').addEventListener('input', function () {
        var searchQuery = this.value.trim();
        fetchUsers(1, 5, searchQuery); // Always start from first page when searching
    });
});
