import React from 'react';
import { useLocation } from 'react-router-dom';
import logo from "../../assets/imgs/logo.png"




const CompanyVerification = () => {

  const location = useLocation();

  debugger;
  return (


<section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

        <div className="d-flex justify-content-center py-4">
          <a href="index.html" className="logologin d-flex align-items-center w-auto">
            <img src={logo} alt="" /><br></br>
          </a>
        </div>

        <div className="card mb-3">

          <div className="card-body">

          {location.state.message}
        
          </div>
        </div>



      </div>
    </div>
  </div>

</section>

  );
};

export default CompanyVerification;