import React from 'react'

function Alert(props) {
  
    const capital=(text)=>{
        var tt  = text.toLowerCase();
        if(tt==="danger"){
          tt="error"
        }
        return tt.charAt(0).toUpperCase()+tt.slice(1);
    }

  return (
      <div style={{ height : '50px' }}>
      {props.alert && <div className={`alert alert-${props.alert.type}`} role="alert">
        <strong>{capital(props.alert.type)} : </strong> {props.alert.msg}
     </div>}
     </div>
  )
}

export default Alert
