const express = require('express');
const connection = require('../lib/conn');
const router = express.Router();


// GET /notes, get all notes
router.get("/", (req, res) => {

    connection.connect((err) => {
        if (err) console.log("err", err);

        let query = "SELECT * FROM notes";

        connection.query(query, (err, data) => {
            if (err) console.log("err", err);

            console.log("notes", data);
            res.json(data);
        })

    })
})

// GET /notes/:id, get specific note
router.get("/:id", (req, res) => {

    connection.connect((err) => {
        if (err) console.log("err", err);

        let query = `SELECT * FROM notes WHERE id = ${req.params.id}`;

        connection.query(query, (err, data) => {
            if (err) console.log("err", err);

            console.log("note", data);
            res.json(data);
        })
    })
})

// POST /notes/add, create note
router.post("/add", (req, res) => {
    const { title, content } = req.body;
    connection.connect((err) => {
        if (err) {
            console.log("Error connecting to database:", err);
            return res.status(500).json({ error: "Database connection error" });
        }

        const query = `INSERT INTO notes (title, content) VALUES (?, ?)`;
        connection.query(query, [title, content], (err, result) => {
            if (err) {
                console.log("Error inserting note:", err);
                return res.status(500).json({ error: "Error saving note to database" });
            }

            console.log("Note saved successfully");
            res.status(201).json({ message: "Note saved successfully" });
        });
    }); 
});


module.exports = router;