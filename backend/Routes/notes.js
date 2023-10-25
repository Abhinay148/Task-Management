const express = require('express')
const router = express.Router()
const fetchuser = require('../Middleware/Fetchuser');
const authuser = require('../Middleware/authuser');
const Notes = require('../Models/Notes')
const { body, validationResult } = require('express-validator');


//Route 1: get all notes by admin
router.get('/fetchnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({})
    res.json(notes)
})


//Route 2: add notes by user
router.post('/addnotes', authuser, async (req, res) => {
    try {
        const { name, date, topic } = req.body; // Ensure you include "date" and "topic" fields
        const note = new Notes({ name, date, topic, user: req.user.id });
        const savedNote = await note.save(); // Use "await" when saving the note
        res.json(savedNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).json('Some error occurred');
    }
});


router.get('/fetchusernotes/:id', authuser, async (req, res) => {
    const notes = await Notes.find({ user: req.params.id })
    res.json(notes)
})

router.put('/updatenote/:noteid', fetchuser, async (req, res) => {
    try {
        // Implement code to update the task using req.params.noteid
        // For example:
        const updatedNote = await Notes.findByIdAndUpdate(
            req.params.noteid,
            req.body,
            { new: true } // To return the updated note
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deletenote/:noteid', fetchuser, async (req, res) => {
    try {
        
        const deletedNote = await Notes.findByIdAndDelete(req.params.noteid);

        if (!deletedNote) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router
