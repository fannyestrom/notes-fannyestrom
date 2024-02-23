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
    mainContent.innerHTML = `
        <ul class="notes-list" id="notesList"></ul>
        <div class="note-details" id="noteDetails"></div>
    `;

    printNotes();
}

/*
* function to display specific note when clicked
*/
function displayNote(noteId) {
    fetch(`http://localhost:3000/notes/${noteId}`)
    .then(response => response.json())
    .then(data => {
        const noteDetails = document.getElementById('noteDetails');

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

/* 
* function to print list of notes
*/
function printNotes() {
    fetch('http://localhost:3000/notes')
    .then(response => response.json())
    .then(data => {
        const notesList = document.getElementById('notesList');
        
        data.forEach(note => {
            const listItem = document.createElement('li');
            listItem.textContent = note.title;
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
* display account view (sign in/out & create user)
*/
function accountView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="login-container">
            <h2>Account</h2>
        <div id="userForm"></div>
    `;

    let userForm = document.getElementById('userForm');

    let inputEmail = document.createElement('input');
    inputEmail.placeholder = "Email";
    let inputPassword = document.createElement('input');
    inputPassword.placeholder = "Password";
    inputPassword.type = "password";
    let signInBtn = document.createElement('button');
    signInBtn.innerText = "Sign in";

    signInBtn.addEventListener('click', () => {
        let sendUser = {email: inputEmail.value, password: inputPassword.value};

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
                localStorage.setItem('user', data.user);
            } else {
                alert('Incorrect login');
            }
        });
    });

    userForm.innerHTML = '';
    userForm.append(inputEmail, inputPassword, signInBtn);
}


accountView();
