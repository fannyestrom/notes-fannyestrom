const express = require('express');
const connection = require('../lib/conn');
const router = express.Router();


// GET /notes, get all documents
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


// GET /notes/:id, get specific document
router.get("/:id", (req, res) => {

    connection.connect((err) => {
        if (err) console.log("err", err);

        let query = `SELECT * FROM notes WHERE id = ${req.params.id}`;

        connection.query(query, (err, data) => {
            if (err) console.log("err", err);

            console.log("notes", data);
            res.json(data);
        })
    })
})




module.exports = router;