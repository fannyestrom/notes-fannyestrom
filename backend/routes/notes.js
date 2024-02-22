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

/*
// POST /notes/add, create note
router.post("/add", (req, res) => {
    const newNote = req.body;
    console.log("new product", newProduct);

    connection.connect
    
})
*/

module.exports = router;