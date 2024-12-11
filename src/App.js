import "./App.css";
import React , { Suspense, useEffect, useState   } from "react";
import LoginForm from "./components/User/LoginForm";
import Register from "./components/User/Register";
import Base from "./components/Layout/base";
import ProtectedRouter from "./components/User/protected";
import "bootstrap-icons/font/bootstrap-icons.css"

import "bootstrap-icons/font/bootstrap-icons.css"
import RoleSelect from "./components/User/RoleSelect";
import Registersuccess from "./components/User/Registersuccess";
import Forgotpassword from "./components/User/Forgotpassword";
import Resetpassword from "./components/User/Resetpassword";
import { useDispatch } from "react-redux";
import { actionCreators } from "../src/state/index";
import appsettings from "../src/appsettings.json"
import api  from "../src/components/api/Webcall";
import AuthInterceptor   from "../src/components/api/Webcall";


// React Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../src/components/utilities/utils";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
  Navigate
} from "react-router-dom";
import Footer from "./components/Layout/footer";
import DashBoard from "./components/Inbox";
import NotFoundPage from "./components/Layout/NotFoundPage";
import CompanySelect from "./components/User/CompanySelect";
import Company from "./components/company/Company";
import CompanyVerification from "./components/company/CompanyVerification";

function App() {

  // if (process.env.NODE_ENV === 'development') {
  //   const whyDidYouRender = require('@welldone-software/why-did-you-render');
  //  // whyDidYouRender(React, { trackAllPureComponents: true });
  //   whyDidYouRender(React);
  // }

  const dispatch = useDispatch();

  const basename = '/Finx';


  const [isLoggedIn, setLoginStatus] = useState(false);

  //  const navigate = useNavigate();
  useEffect(() => {
    debugger;
    loginstatuscheck();
  });

  const loginstatuscheck = async () => {


    debugger;

    const apiendpoints = appsettings.ApiEndpoints;

    const longinstatusurl = apiendpoints.LoginStatus

    const loginstatusresponse = await api.post(longinstatusurl);

    let strResponse = JSON.parse(decompressBase64(loginstatusresponse.data));


    if (strResponse.body.IsValid === true) {

      const username = strResponse.body.Username;
      const firstname = strResponse.body.FirstName;
      const lastname = strResponse.body.LastName;
      const userstatusid = strResponse.body.UserId;
      const BRUMapId = strResponse.body.BRUMapId;
      const BranchName = strResponse.body.Branch;
      const CompanyName = strResponse.body.CoName;
      // const AppDate = strResponse.body.AppDate;


      dispatch(actionCreators.userdetails({
        username,
        firstname,
        lastname,
        BranchName,
        CompanyName
        // AppDate
      }));


      setLoginStatus(true);

      // return (
      //   <Router>

      //     <Route exact path="/Home/*" element={<DashBoard />} />

      //   </Router>
      // )

    }


    else {

      setLoginStatus(false);

      // return (
      //   <Router>

      //     <Route exact path="/" name="Login" element={<LoginForm />} /> 

      //   </Router>
      // )
    }

  }


  console.log("reloading APP JS");

  return (
    <>
        
        <Suspense fallback={<div>Loading....</div>}>
          <Routes>
            
            <Route exact path="/" name="Login" element={<LoginForm isLoggedIn ={setLoginStatus}  />} />
            <Route exact path="/Login/*" element={<LoginForm isLoggedIn ={setLoginStatus}  />} />
            <Route exact path="/RoleSelect" name="RoleSelect" element={<RoleSelect />} />
            <Route exact path="/Register" element={<Register />} />
            <Route exact path="/Home/*" element={<ProtectedRouter isLoggedIn={isLoggedIn} />} />
            <Route exact path="/CompanySelect" name="/CompanySelect" element={<CompanySelect />} />
            {/* <Route exact path="/*" element={<Base />} /> */}
            <Route exact path="/Registersuccess" name="Registersuccess" element={<Registersuccess />} />
            <Route path="/Forgotpassword" name="Forgotpassword" element={<Forgotpassword />} />
            <Route exact path="/Resetpassword" name="Resetpassword" element={<Resetpassword />} />
            <Route exact path="/Company" name="Company" element={<Company/>} />
            <Route exact path="/CompanyVerificationMsg" name="CompanyVerificationMsg" element={<CompanyVerification/>} />
            <Route path="/404" element={<NotFoundPage isLoggedIn={isLoggedIn} />} />
            <Route path="*" element={<Navigate to="/404" replace />} />

          </Routes>
          <ToastContainer position="top-right"
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light" />
        </Suspense>
   

    </>
  );
}

export default App;
