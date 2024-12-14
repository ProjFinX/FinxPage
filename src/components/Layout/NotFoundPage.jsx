import React from 'react';
import { Button } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
  Navigate
} from "react-router-dom";


function NotFoundPage(props) {

  const isLoggedIn = props.isLoggedIn ; 

  const navigate = useNavigate();

  const redirect =  (isLoggedIn) =>{
    navigate("/Home"  , { props: { isLoggedIn: true } })
  } 
  
  return (
    <div className="container text-center my-5">
      <h1 className="display-4">404 - Not Found</h1>
      <p className="lead">Sorry, the page you are looking for could not be found.</p>
      <Button  className="btn btn-primary" onClick = { () => {redirect(isLoggedIn)}} >Go back to homepage</Button>
    </div>
  );
}

export default NotFoundPage;