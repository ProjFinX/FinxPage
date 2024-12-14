import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthProvider";
import logo from "../../assets/imgs/FinXLogo.png";
import messages1 from "../../assets/imgs/messages-1.jpg";
import messages2 from "../../assets/imgs/messages-2.jpg";
import messages3 from "../../assets/imgs/messages-3.jpg";
import profPic from "../../assets/imgs/profile-img.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json";
import dateformater from "../utilities/dateformater";

const apiendpoints = appsettings.ApiEndpoints;

const Newheader = () => {
  debugger;
  const logindata = useSelector((state) => state.logindata);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);


  const Logout = async () => {
    // debugger;

    let frmData = {};

    let Response;

    const Logout = apiendpoints.Logout;
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    //  /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "logout", orgid: "", vendid: "0" };

    const data = { hdr: frmHdr, body: frmData };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };

    const logout = Logout;
    try {
      const response = await api.post(logout, compressBase64(data), reqHdr);


      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
      
        alert(strResponse.hdr);
      } else {
        localStorage.clear("token");
        navigate("/Login");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onsidebarclik = () => {
    document.querySelector("body").classList.toggle("toggle-sidebar");
  };

  const setTransformNotification = () => {
    document.querySelector(".notifications").style.transform =
      "translate(-25px, 35px)";
  };

  const setTransformMessage = () => {
    document.querySelector(".messages ").style.transform =
      "translate(-25px, 35px)";
  };

  return (
    <>
      <header
        id="header"
        className="header fixed-top d-flex align-items-center "
      >
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src={logo} alt="" />

            <span className="d-none d-lg-block">Fin </span>
            <span className="d-none d-lg-block" style={{ color: "#98C843" }}>
              {" "}
              X
            </span>
          </a>

          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={onsidebarclik}
          ></i>
        </div>
        {/* End Logo */}

        <nav className="navbar navbar-expand-lg ms-auto justify-content-center">
          <div className="container-fluid">
            <div className="navbar-text ms-auto my-auto nav-small-text">
              <span className="text-muted me-2">{logindata.CompanyName}</span>
              <span className="text-muted">|</span>
              <span className="text-muted ms-2 me-2">
                {logindata.BranchName}
              </span>
            </div>
          </div>
        </nav>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item d-block d-lg-none">
              <a className="nav-link nav-icon search-bar-toggle " href="#">
                <i className="bi bi-search"></i>
              </a>
            </li>
            {/* End Search Icon*/}

            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
                onClick={setTransformNotification}
              >
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number">4</span>
              </a>
              {/* End Notification Icon */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  You have 4 new notifications
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <div>
                    <h4>Lorem Ipsum</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>30 min. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-x-circle text-danger"></i>
                  <div>
                    <h4>Atque rerum nesciunt</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>1 hr. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <div>
                    <h4>Sit rerum fuga</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>2 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="notification-item">
                  <i className="bi bi-info-circle text-primary"></i>
                  <div>
                    <h4>Dicta reprehenderit</h4>
                    <p>Quae dolorem earum veritatis oditseno</p>
                    <p>4 hrs. ago</p>
                  </div>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-footer">
                  <a href="#">Show all notifications</a>
                </li>
              </ul>
              {/* End Notification Dropdown Items */}
            </li>
            {/* End Notification Nav */}

            <li className="nav-item dropdown">
              <a
                className="nav-link nav-icon"
                href="#"
                data-bs-toggle="dropdown"
                onClick={setTransformMessage}
              >
                <i className="bi bi-chat-left-text"></i>
                <span className="badge bg-success badge-number">3</span>
              </a>
              {/* End Messages Icon */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                <li className="dropdown-header">
                  You have 3 new messages
                  <a href="#">
                    <span className="badge rounded-pill bg-primary p-2 ms-2">
                      View all
                    </span>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img src={messages1} alt="" className="rounded-circle" />
                    <div>
                      <h4>Maria Hudson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>4 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img src={messages2} alt="" className="rounded-circle" />
                    <div>
                      <h4>Anna Nelson</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>6 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="message-item">
                  <a href="#">
                    <img src={messages3} alt="" className="rounded-circle" />
                    <div>
                      <h4>David Muldon</h4>
                      <p>
                        Velit asperiores et ducimus soluta repudiandae labore
                        officia est ut...
                      </p>
                      <p>8 hrs. ago</p>
                    </div>
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li className="dropdown-footer">
                  <a href="#">Show all messages</a>
                </li>
              </ul>
              {/* End Messages Dropdown Items */}
            </li>
            {/* End Messages Nav */}

            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                <img src={profPic} alt="Profile" className="rounded-circle" />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  {logindata.firstname + " " + logindata.lastname}
                </span>
              </a>
              {/* End Profile Iamge Icon */}

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{logindata.firstname + " " + logindata.lastname}</h6>
                  <span>{logindata.UserRole}</span>
                </li>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <Link
                    to="./UserProfile"
                    key="User Profile"
                    className="dropdown-item d-flex align-items-center"
                  >
                    <i className="bi bi-person"></i>
                    <span onClick={onsidebarclik} >My Profile</span>

                  </Link>
         
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
{/* 
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="users-profile.html"
                  >
                    <i className="bi bi-gear"></i>
                    <span>Account Settings</span>
                  </a>
                </li> 
                <li>
                  <hr className="dropdown-divider" />
                </li> */}
{/* 
                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    href="pages-faq.html"
                  >
                    <i className="bi bi-question-circle"></i>
                    <span>Need Help?</span>
                  </a>
                </li> 
                <li>
                  <hr className="dropdown-divider" />
                </li>*/}

                <li>
                  <a
                    className="dropdown-item d-flex align-items-center"
                    onClick={Logout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Newheader;
