

/* 
* print list of documents
*/
function printNotes() {
    fetch('http://localhost:3000/notes')
    .then(response => response.json())
    .then(data => {
        const notesList = document.getElementById('notesList');
        data.forEach(notes => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
        
            link.textContent = notes.title;
            link.href = `http://localhost:3000/notes/${notes.id}`;
            link.style.cursor = 'pointer';

            listItem.appendChild(link);
            notesList.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
    });
}

printNotes();
