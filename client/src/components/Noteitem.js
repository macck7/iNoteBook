import React, {useContext} from 'react'
import noteContext from "../context/notes/noteContext"


const Noteitem = (props) => {
    const context = useContext(noteContext);
    const { deletenote} = context;
    const { note,updateNote } = props;
  

    const handledelete=()=>{
        deletenote(note._id)
        props.showAlert("Note Deleted Successfully", "success")
    }

    const handleedit=()=>{
        updateNote(note)
    }

    // const handleClick=()=>{
    //     navigate("/veiw");
    //     <Veiw title={"hi"} disc={"gggggk"} />
    // }

    return (
         <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-2" onClick={handledelete}></i>
                        <i className="far fa-edit mx-2" onClick={handleedit}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                    {/* <button type="button" className="btn btn-success" onClick={handleClick}>Veiw</button> */}
                </div>
            </div>
        </div>
    )
}

export default Noteitem