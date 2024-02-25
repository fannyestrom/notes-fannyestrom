// event listeners for navigation links
document.getElementById('createNoteLink').addEventListener('click', function(event) {
    event.preventDefault();
    createNoteView();
});

document.getElementById('viewNotesLink').addEventListener('click', function(event) {
    event.preventDefault();
    allNotesView();
});

document.getElementById('accountLink').addEventListener('click', function(event) {
    event.preventDefault();
    accountView();
});


/*
* function displaying create new note view
*/
function createNoteView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <h2>New note</h2>

        <input type="text" class="note-title" id="noteTitle" placeholder="Title">
        <textarea class="text-content" id="textContent"></textarea>
        <button class="save-btn" id="saveBtn">Save</button>

        <div class="text-result" id="textResult"></div>
    `;

    // event listener for saving a note
    document.getElementById('saveBtn').addEventListener('click', function() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('textContent').value;
    
        fetch('http://localhost:3000/notes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error saving note:', error);
        });
    
        document.getElementById('textResult').innerHTML = document.getElementById('textContent').value;
    });

    textEditor();
}

/*
* text editor
*/
function textEditor() {
    tinymce.init({
        selector: '#textContent',
        plugins: 'code',
        toolbar: 'new document | undo redo copy cut paste | fontselect fontsizeselect | styleselect bold italic underline | alignleft alignright aligncenter alignjustify | lineheight | forecolor backcolor | code',
    
        setup: function(editor) {
            editor.on('change', function() {
                editor.save();
            })
        }
    });
}

/*
* function to display all notes view
*/
function allNotesView() {
    const mainContent = document.getElementById('mainContent');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        mainContent.innerHTML = `
            <ul class="notes-list" id="notesList"></ul>
            <div class="note-details" id="noteDetails"></div>
        `;
        
        printNotes();
    } else {
        mainContent.innerHTML = `<p class="please-sign-in">Please sign in to view your notes.</p>`;
    }
}


/*
* function to display specific note when clicked
*/
function displayNote(noteId) {
    const noteDetails = document.getElementById('noteDetails');
    if (!noteDetails) {
        console.error('Error: noteDetails element not found in the DOM');
        return;
    }

    fetch(`http://localhost:3000/notes/${noteId}`)
    .then(response => response.json())
    .then(data => {
        if (data.length > 0 && data[0].title && data[0].content) {
            noteDetails.innerHTML = `<h2>${data[0].title}</h2><p>${data[0].content}</p>`;
        } else {
            noteDetails.innerHTML = "<p>Error: Missing data fields</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching note:', error);
    });
}

function printNotes() {
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = ''; // Clear existing notes

    fetch('http://localhost:3000/notes')
    .then(response => response.json())
    .then(data => {
        data.forEach(note => {
            const listItem = document.createElement('li');
            listItem.textContent = note.title;

            // edit button 
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.classList.add('edit-btn'); 
            editBtn.addEventListener('click', () => {
                editNote(note.id);
            });

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.setAttribute('id', `deleteBtn_${note.id}`); 
            deleteBtn.addEventListener('click', () => {
                softDelete(note.id);
            });

            // append edit and delete buttons to list item
            listItem.appendChild(editBtn);
            listItem.appendChild(deleteBtn);

            listItem.addEventListener('click', () => {
                displayNote(note.id);
            });
            notesList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
    });
}


/*
* function to edit note
*/
function editNote(noteId) {
    fetch(`http://localhost:3000/notes/${noteId}`)
    .then(response => response.json())
    .then(data => {
        console.log('Note data:', data);

        // check if the noteTitle and textContent elements exist
        let noteTitleElement = document.getElementById('noteTitle');
        let textContentElement = document.getElementById('textContent');
        
        if (!noteTitleElement || !textContentElement) {
            // create if they don't exist
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = `
                <h2>Edit note</h2>
        
                <input type="text" class="note-title" id="noteTitle" placeholder="Title">
                <textarea class="text-content" id="textContent"></textarea>
                <button class="save-btn" id="saveBtn">Update</button>
        
                <div class="text-result" id="textResult"></div>
            `;
        
            // set values of created elements
            noteTitleElement = document.getElementById('noteTitle');
            textContentElement = document.getElementById('textContent');
        }
        
        // populate the form fields with the note's data
        if (data && data.length > 0 && data[0].title && data[0].content) {
            noteTitleElement.value = data[0].title;
            textContentElement.value = data[0].content;
        } else {
            console.error('Error: Note data is incomplete');
        }

        // change button text to "Update"
        document.getElementById('saveBtn').textContent = 'Update';

        // add event listener to handle update
        document.getElementById('saveBtn').addEventListener('click', () => {
            updateNote(noteId);
        });
    })
    .catch(error => {
        console.error('Error fetching note:', error);
    });
}

/*
* function to update note
*/
function updateNote(noteId) {
    const updatedTitle = document.getElementById('noteTitle').value;
    const updatedContent = document.getElementById('textContent').value;

    const updatedNoteData = {
        title: updatedTitle,
        content: updatedContent
    };

    fetch(`http://localhost:3000/notes/${noteId}/update`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNoteData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update note');
        }
        return response.json();
    })
    .then(data => {
        console.log('Note updated successfully:', data);
        displayNotification('Note updated successfully', 'success');
    })
    .catch(error => {
        console.error('Error updating note:', error);
        displayNotification('Failed to update note', 'error');
    });
}

/*
* function to soft delete a note
*/
function softDelete(noteId) {
    console.log('Soft delete function called for note:', noteId);
    
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Note soft deleted successfully');
            // remove deleted note from the list
            const deleteBtn = document.getElementById(`deleteBtn_${noteId}`);
            if (deleteBtn) {
                const listItem = deleteBtn.parentElement;
                if (listItem && listItem.tagName === 'LI') {
                    listItem.remove();
                }
            }
        } else {
            throw new Error('Error deleting note');
        }
    })
    .catch(error => {
        console.error('Error deleting note:', error);
    });
}

/*
* function to display notification message to user
*/
function displayNotification(message, type) {
    const notificationElement = document.getElementById('notification');
    notificationElement.textContent = message;

    notificationElement.className = type === 'success' ? 'success' : 'error';

    // clear notification after 3 seconds
    setTimeout(() => {
        notificationElement.textContent = '';
        notificationElement.className = '';
    }, 3000);
}

/*
* display account view (sign in/out & create user)
*/
function accountView() {
    const mainContent = document.getElementById('mainContent');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        // if user is logged in, display sign-out button
        mainContent.innerHTML = `
            <div class="login-container">
                <h2 class="welcome-heading">Welcome!</h2>
                <button class="sign-out-btn" id="signOutBtn">Sign Out</button>
            </div>
        `;

        // add event listener to sign-out button
        document.getElementById('signOutBtn').addEventListener('click', () => {
            // Clear user from localStorage
            localStorage.removeItem('user');
            // refresh view to toggle button visibility
            accountView();
        });
    } else {
        // if user is not logged in display sign-in form
        mainContent.innerHTML = `
            <div class="login-container">
                <h2>Account</h2>
                <div class="user-form" id="userForm"></div>
                <button class="sign-in-btn" id="signInBtn">Sign In</button>
            </div>
            <a href="#" class="register-link" id="registerLink">Don't have an account yet? Register here.</a>
        `;

        let userForm = document.getElementById('userForm');
        let inputEmail = document.createElement('input');
        inputEmail.placeholder = "Email";
        let inputPassword = document.createElement('input');
        inputPassword.placeholder = "Password";
        inputPassword.type = "password";
        let signInBtn = document.getElementById('signInBtn');

        // add event listener to sign in button
        signInBtn.addEventListener('click', () => {
            let sendUser = { email: inputEmail.value, password: inputPassword.value };

            fetch('http://localhost:3000/users/signin', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sendUser),
            })
                .then(res => res.json())
                .then(data => {
                    console.log("post user", data);

                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        // after signing in refresh the view to toggle button visibility
                        accountView();
                    } else {
                        alert('Incorrect login');
                    }
                });
        });

        let registerLink = document.getElementById('registerLink');
        registerLink.addEventListener('click', function (event) {
            event.preventDefault();
            registerAccountView();
        });

        userForm.innerHTML = '';
        userForm.append(inputEmail, inputPassword);
    }
}


/*
* function to display register account view
*/
function registerAccountView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="register-container">
            <h2>Register account</h2>
            <div class="register-form" id="registerForm"></div>
        </div>
        <a href="#" class="already-have-account" id="alreadyHaveAccount">Already have an account? Sign in here.</a>
    `;

    let registerForm = document.getElementById('registerForm');

    let registerEmail = document.createElement('input');
    registerEmail.placeholder = "Email";
    let registerPassword = document.createElement('input');
    registerPassword.placeholder = "Password";
    registerPassword.type = "password";
    let registerBtn = document.createElement('button');
    registerBtn.innerText = "Sign up";

    // add event listener to register button
    registerBtn.addEventListener('click', () => {
        let newUser = {email: registerEmail.value, password: registerPassword.value};

        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error registering user:', error);
        });
    });

    let alreadyHaveAccount = document.getElementById('alreadyHaveAccount');
    alreadyHaveAccount.addEventListener('click', function(event) {
        event.preventDefault();
        accountView();
    });

    registerForm.innerHTML = '';
    registerForm.append(registerEmail, registerPassword, registerBtn);
}


registerAccountView();
