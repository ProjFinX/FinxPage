import React, { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/imgs/FinXLogo.png"
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthProvider";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Alerts from "../htmlcomponents/Alerts";
import api from "../api/Webcall";




export default function RoleSelect() {

  const navigate = useNavigate();

   let UserRole =  JSON.parse(localStorage.getItem("UserRolelist"));
   let crdata = JSON.parse(localStorage.getItem("Credentials"));
   const Username = crdata.txtUsername;
   const Password = crdata.txtPassword
   
  
  
   

  const { setAuth } = useContext(AuthContext);
  const [LoginStatus, setLoginStatus] = useState("pending");
  const [alert, setAlert] = useState("");
  const [RoleId, setRoleId] = useState(0);

  const onChange = (e) => {  
    let id = 0;        
        id = e;   
        localStorage.setItem("UserRoleId",id ); 
        setRoleId(id); 
  };
  
  const roleselectsubmit = async (e) => {
         
         
    if (RoleId==0) {
      setLoginStatus("Failed");         
      ShowAlert("Error", "Select Role");
      return;
    }
   
      console.log("Enter validated login");
      e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = { convid: convID, tag: "signup", orgid: "", vendid: "0" };
      const frmData = {txtUsername:Username,txtPassword:Password, txtBRUMapId:RoleId}
      
      const data = { hdr: frmHdr, body: frmData };
      //const loginurl ="/Authentication/Login";
      const loginurl =  "/auth/login";
      try {
       // debugger;
        const response = await api.post(loginurl, compressBase64(data));
                              
        console.log(decompressBase64(response.data));
       
        const strResponse = JSON.parse(decompressBase64(response.data));
  
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          setLoginStatus("Failed");         
          ShowAlert("Error", "Invalid Credentials");
        } else {
          const username = strResponse.body.Username;
          const firstname = strResponse.body.FirstName;
          const lastname = strResponse.body.LastName;
          const userstatusid = strResponse.body.UserStatusId;
          const userstatus = strResponse.body.UserStatus;
          const accessToken = strResponse.body.token;
          
          setAuth(
           { username,
            firstname,
            lastname,
            userstatusid,
            userstatus,
            accessToken }
          );
  
          localStorage.setItem("token", accessToken);
          
          localStorage.setItem("authdetails", { username,
            firstname,
            lastname,
            userstatusid,
            userstatus,
            accessToken });

            setLoginStatus("Success");
         
           navigate("/Home");
          
        }
      } catch (e) {  
        setLoginStatus("Failed");
        ShowAlert("Error", "Unable to process request");    
      
      }
  
      
       
  }

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };

  return (
    <>
      <div className="bg_one">
 
 
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

                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                    </div>

                        {LoginStatus == "Failed" ? (
                          <Alerts alert={alert} />
                        ) : (
                          <div />
                        )}
                       
                        <form onSubmit={roleselectsubmit}>
                          <h5>Select Role </h5>

                          <div className="form-outline mb-4">
                           
                          {/* <select {...register("cmbProvinceStateId")}  className="form-control"  onChange={onChange}>  */}
                          <select  className="form-control"  onChange= {e => onChange(e.target.value)}> 
                                            <option value="0">- Select -</option>
                                            {  //Combo Data binding                                                        
                                                        UserRole.map((res) => 
                                                        (<option key={res.BRUMapId} value={res.BRUMapId}>{res.RoleName}</option>))
                                            }
                                        </select>
                          </div>

                        
                          <div className="d-grid gap-2 text-center pt-1 mb-5 pb-1">
                            <button
                              type="submit"
                              className="btn btn-primary btn-block  mb-3"
                            >
                              Submit
                            </button>

                           
                          </div>

                        
                        </form>
                      </div>
                    </div>

                    
                  </div>
                </div>
              </div>
            
         
        </section>
      </div>
    </>
  );
}
