import React , {useState} from "react";

export default function Alerts(props) {


  
  const handleDismiss = () => {

    debugger;

    props.alert.showAlert(false)

  }
  


  if (props && props.alert.show ) {
    if (props.alert.AlertType == "Success") {
      return (
        <>
          <div id= "notification" className="alert alert-success alert-dismissible d-flex align-items-center fade show">
            <i className="bi-check-circle-fill"></i>
            <strong className="mx-2">Success!</strong> {props.alert.message}
            <button
              type="button"
              className="btn-close"
              onClick= {()=> props.onChange(false)}
            ></button>
          </div>
        </>
      );
    }
    if (props.alert.AlertType == "Error") {
      return (
        <>
          <div  id= "notification"  className="alert alert-danger alert-dismissible d-flex align-items-center fade show">
            <i className="bi-exclamation-octagon-fill"></i>&nbsp;
            {props.alert.message}
            <button
              type="button"
              className="btn-close"
              onClick= {()=> props.onChange(false)}
            ></button>
          </div>
        </>
      );
    }

    if (props.alert.AlertType == "Warning") {
      return (
        <>
          <div  id= "notification"  className="alert alert-warning alert-dismissible d-flex align-items-center fade show">
            <i className="bi-exclamation-triangle-fill"></i>
            <strong className="mx-2">Warning!</strong> {props.alert.messagesage}
            <button
              type="button"
              className="btn-close"
              onClick= {()=> props.onChange(false)}
            ></button>
          </div>
        </>
      );
    }

    if (props.alert.AlertType == "Info") {
      return (
        <>
          <div   id= "notification"  className="alert alert-info alert-dismissible d-flex align-items-center fade show">
            <i className="bi-info-circle-fill"></i>
            <strong className="mx-2">Info!</strong> {props.alert.message}
            <button
              type="button"
              className="btn-close"
              onClick= {()=> props.onChange(false)}
            ></button>
          </div>
        </>
      );
    }
  }

  else{
    return (
      <>
      </>
      )

  }
}
