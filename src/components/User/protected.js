
import React ,{useEffect} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
  Navigate 
} from "react-router-dom";
import Base from '../Layout/base';



const ProtectedRouter = (props)=>{

  const isLoggedIn = props.isLoggedIn 

  debugger;


  return(



    isLoggedIn ? (

        <Base>
        </Base>


  ) :
  <Navigate to = "/Login"></Navigate>

  )
 
    // const navigate = useNavigate();
    
    // useEffect(() => {
    
    //   debugger;
    //     if(props.isLoggedIn) 
    //     {
    //       navigate("/*");
    //     }  
    //     else
    //     {
    //         navigate("/Login");

    //     }     
       
    //    }, [])




}

export default ProtectedRouter;