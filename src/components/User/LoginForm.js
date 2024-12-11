import React, { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/imgs/FinXLogo.png"
import Home from "../Home";
import AuthContext from "../../contexts/AuthProvider";
import { bindActionCreators } from 'redux'
import { useDispatch } from "react-redux";
import { actionCreators } from "../../state/index";
import appsettings from "../../appsettings.json"
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link,
} from "react-router-dom";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Alerts from "../htmlcomponents/Alerts";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { toast } from 'react-toastify';


export default function LoginForm(props) {
  // let show = true
  const [credentials, setCredentials] = useState({
    txtUsername: "",
    txtPassword: "",
  });
  const { setAuth } = useContext(AuthContext);
  const [LoginStatus, setLoginStatus] = useState("pending");
  const [showLoginScreen, setLoginScreen] = useState(false);
  const userRef = useRef();
  const apiendpoints = appsettings.ApiEndpoints;
  const dispatch = useDispatch();
  const [alert, setAlert] = useState("");
  const [show, enableAlert] = useState(true);
  const [isLoading, setLoanding] = useState(false);
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    loginstatuscheck();
   // userRef.current.focus();
  }, []);

  useEffect(() => {
    setAlert({
      AlertType: "null",
      message: "null",
      show: false
    });
  }, [credentials]);


  const navigate = useNavigate();

  const loginstatuscheck = async () => {

    const longinstatusurl = apiendpoints.LoginStatus

    const loginstatusresponse = await api.post(longinstatusurl);

    let strResponse = JSON.parse(decompressBase64(loginstatusresponse.data));

    if (strResponse.body.IsValid === true) {

      debugger;

      props.isLoggedIn(true);

      navigate("/Home", { props: { isLoggedIn: true } });

    }

    else {

      setLoginScreen(true);
    }

  }
  const validatelogin = async (e) => {
    setLoanding(true);
    console.log("Enter validated login");
    e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "signup", orgid: "", vendid: "0" };
    const frmData = credentials;
    const data = { hdr: frmHdr, body: frmData };
    //const loginurl ="/Authentication/Login";
    const loginurl = apiendpoints.Login;
    try {
       debugger;
      const response = await api.post(loginurl, compressBase64(data));

      console.log(decompressBase64(response.data));

      const strResponse = JSON.parse(decompressBase64(response.data));


      console.log(strResponse);

      if ((strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR")) {
        setLoginStatus("Failed");
        enableAlert(true);
        setLoanding(false);
        //ShowAlert("Error", "Invalid Credentials");
        toast.error("Invalid Credentials");
      } else {
        debugger;
        const username = strResponse.body.Username;
        const firstname = strResponse.body.FirstName;
        const lastname = strResponse.body.LastName;
        const userstatusid = strResponse.body.UserStatusId;
        const userstatus = strResponse.body.UserStatus;
        const accessToken = strResponse.body.token;
        const BRUMapIdCnt = strResponse.body.BRUMapIdCnt;
        const UserRoles = strResponse.body.Roles;
        const UserRole = strResponse.body.RoleName;
        const BRUMapId = strResponse.body.BRUMapId;
        const Companies = strResponse.body.Companies;
        const BranchName = strResponse.body.Branch;
        const CompanyName = strResponse.body.Name;
        const AppDate = strResponse.body.AppDate;
        const CompanyId = strResponse.body.CompanyId;
        const CompanyStatusid = strResponse.body.CoBrStatusId;
        setAuth(
          {
            username,
            firstname,
            lastname,
            userstatusid,
            userstatus,
            accessToken,
            BranchName,
            CompanyName,
            AppDate,
            UserRole
          }
        );

        debugger;

        dispatch(actionCreators.userdetails({
          username,
          firstname,
          lastname,
          userstatusid,
          userstatus,
          accessToken,
          BranchName,
          CompanyName,
          AppDate,
          UserRole,
          UserRoles
        }));

        //   localStorage.setItem("token", accessToken);

        /* localStorage.setItem("authdetails", {
           username,
           firstname,
           lastname,
           userstatusid,
           userstatus,
           accessToken
         }); */

        setLoginStatus("Success");
        const logindetails = { fullname: strResponse.body.FirstName };
        setLoanding(false);


        console.log(JSON.stringify(strResponse.body));


        if (BRUMapIdCnt == "0") {
          localStorage.setItem("CompanyMaster", JSON.stringify(Companies));
          localStorage.setItem("UserRolelist", JSON.stringify(userrole));
          localStorage.setItem("Credentials", JSON.stringify(frmData));
          navigate("/CompanySelect");
        }

        else if (BRUMapIdCnt > 1) {
          var userrole = [];
          userrole = UserRoles;

          localStorage.setItem("UserRolelist", JSON.stringify(userrole));
          localStorage.setItem("Credentials", JSON.stringify(frmData));
          navigate("/RoleSelect");
        }

        else if(userstatusid==5 && !CompanyId){
          navigate("/Company")
        }

        else if(userstatusid==5 && CompanyId && CompanyStatusid == 4){
          navigate("/CompanyVerificationMsg", {state : {message : "Company verification is in pending, please check your email for verification new"}})
        }
        else if(userstatusid==5 && CompanyId && CompanyStatusid == 5){
          navigate("/CompanyVerificationMsg", {state : {message : "Your Environtment is getting ready , please come back after sometime. "}})
        }

        else if(userstatusid==1){
          localStorage.setItem("UserRoleId", BRUMapId);
          navigate("/Home");
        }

      


      }
    } catch (e) {
      setLoginStatus("Failed");
      //  ShowAlert("Error", "Unable to process request");

      toast.error("Unable to process request");
      setLoanding(false);
    }

    /* PostCall(loginurl, compressLZW(data)).then(function (response) {
      console.log(decompressLZW(response.data));
      const strResponse = JSON.parse(decompressLZW(response.data));
      console.log(strResponse);
      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        setLoginStatus("Failed");
        ShowAlert("Error", "Invalid Credentials");
      } else {
        setLoginStatus("Success");
        const logindetails = { fullname: strResponse.body.FirstName };
        <LoginState props={logindetails} />;
        navigate("/Home");
      }
    }); */
  };

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
      show: true

    });


  };

  return (
    <>
      {showLoginScreen ? (
        <div className="container">

          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                  <div className="d-flex justify-content-center">

                       <img src={logo} width="80" height="80" ></img> 
      
                  </div>

                  <div className="d-flex justify-content-center">
 <h5 className="card-title text-center pb-0 fs-2">FinX</h5>

</div>

                  <div className="card mb-3">

                    <div className="card-body">

              

                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                      </div>
                      {isLoading ? (<Spinner></Spinner>) : ""}
                      {show ? (
                        <Alerts alert={alert} onChange={(value) => { enableAlert(value) }} />
                      ) : (
                        <div />
                      )}
                      <form className="row g-3 needs-validation" noValidate="" onSubmit={validatelogin}>

                        <div className="col-12">
                          <label htmlFor="txtUsername" className="form-label">Username</label>
                          <div className="input-group has-validation">
                            <input
                              type="email"
                              id="txtUsername"
                              onChange={onChange}
                              ref={userRef}
                              value={credentials.txtUsername}
                              className="form-control"
                              placeholder="Email address"
                              required
                            />
                            <div className="invalid-feedback">Please enter your username.</div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label htmlFor="txtPassword" className="form-label">Password</label>
                          <input
                            type="password"
                            id="txtPassword"
                            className="form-control"
                            onChange={onChange}
                            value={credentials.txtPassword}
                            placeholder="Password"
                            required
                          />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        <div className="col-6">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe" />
                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>

                          </div>

                        </div>
                        <div className="col-6">
                          <div >
                          <Link to="/Forgotpassword">  
                          Forgot password?
                          </Link>
                          </div>
                        </div>

                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">Login</button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0 text-center">Don't have account? <br></br> </p>

                          <Link
                            className="btn   btn-outline-danger w-100"
                            to="/Register">
                            {" "}
                            Sign Up
                          </Link>
                        </div>
                      </form>

                    </div>
                  </div>



                </div>
              </div>
            </div>

          </section>

        </div>

      ) : <> </>}
    </>
  );
}
