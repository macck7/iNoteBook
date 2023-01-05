// importing express
const express = require('express');
const fetchUser = require('../middleware/fetchUser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');
// using router from express
const router = express.Router();


// ROUTE 1:Getting all the notes from user: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.send(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})


// ROUTE 2:Add a note for a user: POST "/api/notes/addnote". Login required
router.post('/addnote', [
    body('title', 'Enter a valid title').exists(),
    body('description', 'Description should of 10 words').isLength({ min: 10 }),
], fetchUser, async (req, res) => {

    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new user
        note = await Note.create({ title, description, tag, user: req.user.id });
        res.json(note)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})

// ROUTE 3:Update note for a existing user: PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    // create a new object
    const newNote = {}
    if (title) { newNote.title = title }
    if (description) { newNote.description = description }
    if (tag) { newNote.tag = tag }

    try {
        //find a note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        // check if valid user is updating or not
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})

// ROUTE 4:Delete anote for a existing user:DELETE  "/api/notes/deletenote/id". Login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {

    try {
        //find a note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }

        // check if valid user is deleting or not
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

        note = await Note.findByIdAndDelete(req.params.id)
        res.send({"Success":"Note is Deleted", note:note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occured");
    }
})


module.exports = router
