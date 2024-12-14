import React from "react";
import adimg from "../../assets/img/accessdenied.jpg";

const AccessDenied = () => {

    return <>
    
    <div className="container text-center">
      <h1>Access Denied</h1>
      <p>Sorry, you don't have access to this page</p>
      <img  className="ms-5"  src={adimg} alt="Access Denied"/>
    </div>
    
    </>


}


export default AccessDenied;