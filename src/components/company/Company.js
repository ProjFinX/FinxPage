import React, { useEffect, useRef } from "react";
import { useState } from "react";

import Alerts from "../htmlcomponents/Alerts";
import api  from "../api/Webcall";
import {
  generateUUID,
  compressLZW,
  decompressLZW,
  compressBase64,
  decompressBase64
} from "../utilities/utils";

import ProvinceStateMaster from "./ProvinceStateMaster";

import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

export default function Company() {


 // const ProvinceState = ProvinceStateMaster();

  const [createcompanyStatus, setcreatecompanyStatus] = useState("pending");
  const [errMsg, setErrMsg] = useState("");

  const [companymaster, setcompanymaster] = useState({
    txtName: "",
    txtBranchName: "",
  });


  const CreateCompany = apiendpoints.CreateCompany;
  const CoreUrl = process.env.REACT_APP_FinXCoreUrl;


  const [alert, setAlert] = useState("");
  
  useEffect(() => {
    setAlert({
      AlertType: "null",
      message: "null",
    });
  }, [companymaster]);

  const onChange = (e) => {
    setcompanymaster({ ...companymaster, [e.target.id]: e.target.value });
  };

  const submitcompanymaster = async (e) => {
    console.log("Enter submitcompanymaster  ");
    e.preventDefault();
    /* Header */
    const convID = generateUUID();
    
    const token =    localStorage.getItem('token');

    const frmHdr = {
      convid: convID,
      tag: "CreateCompany",
      orgid: "",
      vendid: "0",
    };    
    const frmData = companymaster;
    const data = { hdr: frmHdr, body: frmData };
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const createcompanyurl = CreateCompany ;

    console.log(reqHdr);

    console.log(frmData);

    try {

    let response = await api.post(createcompanyurl, compressBase64(data));


    
        const strResponse = JSON.parse(decompressBase64(response.data));
        console.log(strResponse);
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          setcreatecompanyStatus("Failed");
          ShowAlert("Error", JSON.stringify(strResponse.fdr));
          console.log(JSON.stringify(strResponse.fdr));
        } else {
          setcreatecompanyStatus("Failed");
          ShowAlert("Error", "Successfully Company Created");

          // navigate("/Home");
        }
      }
      catch(error) {
        console.log(error); // Network Error
        console.log(error.status); // undefined
        console.log(error.code); // undefined

        if (error.code == "ERR_NETWORK") {
          setcreatecompanyStatus("Failed");
          ShowAlert("Error", "Network Error ");
        }
      };
  };

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };

  return (
    <>
      <section className="vh-100">


        <div className="container h-100">
        {/* <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Company
        </p> */}
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                                <strong className="card-title">Company</strong>
                 </div>
                <div className="card-body p-md-5">
               
                
                  {/* <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1"> */}
                     
                      {createcompanyStatus == "Failed" ? (
                        <Alerts alert={alert} />
                      ) : (
                        <div />
                      )}

                      <form onSubmit={submitcompanymaster}>

                      <div className="row">
                          <div className="col-sm">
                          <div className="mb-3">
                              <label htmlFor="txtName" className="form-label">
                                Company Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtName"
                                onChange={onChange}
                                placeholder="Company Name"
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                          <div className="mb-3">
                              <label htmlFor="txtBranchName" className="form-label">
                                {" "}
                                Branch Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtBranchName"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                    
                        <div className="mb-3">
                          <label htmlFor="txtAddress" className="form-label">
                            Address
                          </label>
                          <textarea
                            type="textarea"
                            height={20}
                            className="form-control"
                            required
                            id="txtAddress"
                           
                            onChange={onChange}
                          />
                        </div>

                        <div className="row">
                            <div className="col-sm">
                              <div className="mb-3">
                                <label htmlFor="txtCity" className="form-label">
                                  {" "}
                                  City
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  required
                                  id="txtCity"
                                  onChange={onChange}
                                />
                              </div>
                            </div>

                            <div className="col-sm">
                              <div className="mb-3">
                                <label
                                  htmlFor="cmbProvinceStateId"
                                  className="form-label"
                                >
                                  Province State
                                </label>
                                <select
                                  id="cmbProvinceStateId"
                                  name="cmbProvinceStateId"
                                  required
                                  className="form-control"
                                  onChange={onChange}
                                >
                                  <option value="0">- Select -</option>
                                  <option value="1">Central</option>
                                  <option value="2">Copperbelt</option>
                                  <option value="3">Eastern</option>
                                  <option value="4">Luapula</option>
                                  <option value="5">Lusaka</option>
                                  <option value="6">Muchinga</option>
                                  <option value="7">Northern</option>
                                </select>
                              </div>
                            </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtPhoneNo"
                                className="form-label"
                              >
                                {" "}
                                Phone
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtPhoneNo"
                                onChange={onChange}
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtAltPhoneNo"
                                className="form-label"
                              >
                                Alt Phone No
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtAltPhoneNo"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label htmlFor="txtEmail" className="form-label">
                                {" "}
                                Email
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtEmail"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                onChange={onChange}
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtAltEmail"
                                className="form-label"
                              >
                                Alt EMail{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtAltEmail"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtShortName"
                                className="form-label"
                              >
                                {" "}
                                Short Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtShortName"
                                onChange={onChange}
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtRegNumber"
                                className="form-label"
                              >
                                Reg Number{" "}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtRegNumber"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label htmlFor="txtRegOn" className="form-label">
                                {" "}
                                Registered On
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtRegOn"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtBookStartedOn"
                                className="form-label"
                              >
                                Book Started On
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtBookStartedOn"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtFYStartsOn"
                                className="form-label"
                              >
                                {" "}
                                FY Starts On
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                required
                                id="txtFYStartsOn"
                                onChange={onChange}
                              />
                            </div>
                          </div>
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="cmbBaseCurrid"
                                className="form-label"
                              >
                                Base Currency
                              </label>
                              <select
                                id="cmbBaseCurrid"
                                name="cmbBaseCurrid"
                                required
                                className="form-control"
                                onChange={onChange}
                              >
                                <option value="0">- Select -</option>
                                <option value="1">INR</option>
                                <option value="2">ZMW</option>
                                <option value="3">USD</option>
                                <option value="4">EUR</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </form>
                    {/* </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
