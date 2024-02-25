const express = require('express');
const connection = require('../lib/conn');
const router = express.Router();

// GET /notes, get all notes
router.get("/", (req, res) => {
    let query = "SELECT * FROM notes";
    connection.query(query, (err, data) => {
        if (err) {
            console.log("Error fetching notes:", err);
            return res.status(500).json({ error: "Error fetching notes" });
        }
        console.log("notes", data);
        res.json(data);
    });
});

// GET /notes/:id, get specific note
router.get("/:id", (req, res) => {
    let query = `SELECT * FROM notes WHERE id = ${req.params.id}`;
    connection.query(query, (err, data) => {
        if (err) {
            console.log("Error fetching note:", err);
            return res.status(500).json({ error: "Error fetching note" });
        }
        console.log("note", data);
        res.json(data);
    });
});

// POST /notes/add, create note
router.post("/add", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required fields" });
    }

    const query = "INSERT INTO notes (title, content) VALUES (?, ?)";
    connection.query(query, [title, content], (err, result) => {
        if (err) {
            console.log("Error creating note:", err);
            return res.status(500).json({ error: "Error creating note" });
        }
        console.log("Note created successfully");
        res.json({ message: "Note created successfully", noteId: result.insertId });
    });
});


// PUT /notes/:id/update, update a specific note
router.put("/:id/update", (req, res) => {
    const noteId = req.params.id;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
    }

    const query = `UPDATE notes SET title = ?, content = ? WHERE id = ?`;
    connection.query(query, [title, content, noteId], (err, result) => {
        if (err) {
            console.log("Error updating note:", err);
            return res.status(500).json({ error: "Error updating note" });
        }
        console.log("Note updated successfully");
        res.json({ message: "Note updated successfully" });
    });
});

// DELETE /notes/:id, soft delete a note
router.delete("/:id", (req, res) => {
    const noteId = req.params.id;

    const query = `UPDATE notes SET deleted = 1 WHERE id = ?`;
    connection.query(query, [noteId], (err, result) => {
        if (err) {
            console.log("Error deleting note:", err);
            return res.status(500).json({ error: "Error deleting note" });
        }
        console.log("Note soft deleted successfully");
        res.json({ message: "Note soft deleted successfully" });
    });
});


module.exports = router;