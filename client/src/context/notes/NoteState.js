import NoteContext from "./noteContext"
import React, { useState } from 'react'

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesIntial = []

    const [notes, setNotes] = useState(notesIntial)

    //cget all notes
    const getNotes = async () => {
        //API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem("token")
            }
        });
        // eslint-disable-next-line
        const json = await response.json();
        // logic
        setNotes(json)

    }

    // Add a Note
    const addnote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        setNotes(notes.concat(note))
    }

    // delete a note
    const deletenote = async (id) => {
        // API CALL
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem("token")
            }
        });
        // logic
        const newNotes = notes.filter((note) => { return (note._id !== id) })
        setNotes(newNotes)
    }


    // edit a node
    const editnote = async (id, title, description, tag) => {
        //API CALL
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem("token")
            },
            body: JSON.stringify({ title, description, tag })
        });
        const json = response.json();
        console.log(json);

        // becoz of this refresh nhi krna padega
        let newNotes = JSON.parse(JSON.stringify(notes))
        // logic
        for (let i = 0; i < newNotes.length; i++) {

            if (newNotes[i]._id === id) {
                newNotes[i].title = title
                newNotes[i].description = description
                newNotes[i].tag = tag
                break;
            }
        }
        setNotes(newNotes)
    }

    return (
        <NoteContext.Provider value={{ notes, addnote, deletenote, editnote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
