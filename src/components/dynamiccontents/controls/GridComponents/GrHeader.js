import React from "react";

export default function GrHeader(props) {

  const style = {
    backgroundColor: "#f8f8f8",
    borderColor: "#babfc7 !important"
  };

  // Dynamically add !important to borderColor
  style.borderColor = "#babfc7 !important";


  return (
   
    <div className="ag-header border" style={style}>
      <div className="col-8 ms-2 d-flex align-items-center fw-bold mb-2 mt-2">
        <div> {props.header}</div>
      </div>
      {props.ar && !props.ar.ro ? (
        <div className="col-4 " style={{backgroundColor: "#f8f8f8"}}>
          <div className="d-flex justify-content-end">
              <i className="bi bi-plus me-2" style={{ fontSize: "25px" , cursor: "pointer" }} onClick={props.add}></i>
            
              <i className="bi bi-trash me-2" style={{ fontSize: "25px" , cursor: "pointer" }} onClick={props.remove}></i>
        
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
