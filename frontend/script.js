/*
* text editor
*/
tinymce.init({
    selector: '#textContent',
    plugins: 'code',
    toolbar: 'new document | undo redo copy cut paste | fontselect fontsizeselect | styleselect bold italic underline | alignleft alignright aligncenter alignjustify | lineheight | forecolor backcolor | code',

    setup: function(editor) {
        editor.on('change', function() {
            editor.save();
        })
    }
})

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

/* 
* display specific note when clicked
*/
/* 
* display specific note when clicked
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
* print list of notes
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

printNotes();
