import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import api from "../api/Webcall";
import {
  generateUUID,
  compressLZW,
  decompressLZW,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import { useNavigate } from "react-router-dom";
import { Getsmtplist } from "../utilities/getsmtpmaster";
import { Scrollbar } from "react-scrollbars-custom";
import Table from "react-bootstrap/Table";
import { toast } from 'react-toastify';
import appsettings from "../../appsettings.json"
const apiendpoints = appsettings.ApiEndpoints;
// Yup validation schema

const schema = yup.object().shape({
  txtHostname: yup
    .string()
    .required("Host name  can not be empty")
    .email("Pls provide Valid  Email id") ,
    txtPassword: yup
    .string()
    .required("Password can not be empty")
    .min(3, "Password Min length is 3")
    .max(20, "Password. Max lenght is 20 "),
});

// Function Component Branch

const SMTPMaster = () => {
  // Combo Data fetching------------------------------

  const [smtplst, setsmtplst] = useState([]);
  const [resbody, setresbody] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|CUN|";
    const optw = "";
    // debugger;

    const Response = await FetchCombodata(opt, optw); // JSON.stringify(await FetchCombodata(opt,optw));

    setresbody(Response.body.cun);
    console.log("rerendering method");
  };

  useEffect(() => {
    LoadCombo();
    FetchSMTPList();
  }, []);

  // Useeffect

  //-----------------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState("");

  const [isLoading, setLoanding] = useState(false);

  function SetScreenValue(rowval) {
    console.log(rowval);

    reset({   
      txtSMTPId: rowval.id,  
      txtHostname: rowval.host,
      txtPort: rowval.portno,
      txtEmail: rowval.email,
      txtPassword: "",
      cbIsSSL: rowval.isssl,
      cbIsActive: rowval.isactive,     
    });
  }


  function ResetScreenValue() {
    reset({
      txtSMTPId: "",  
      txtHostname: "",
      txtPort: "",
      txtEmail: "",
      txtPassword: "",
      cbIsSSL: false,
      cbIsActive: false, 
    });
  }

  const navigate = useNavigate();

  const FetchSMTPList = async () => {
    const SMTPListResponse = await Getsmtplist();
    console.log(JSON.stringify(SMTPListResponse));
    setsmtplst(SMTPListResponse.body.smpt);    
  };

  const onSubmitHandler = async (data) => {   


    let SmtpId = 0;
    if (data.txtSMTPId!="")
      SmtpId = data.txtSMTPId;

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "updscr",
      orgid: "",
      vendid: "0",
    };
    const frmData = {  "txtSmtpId":SmtpId, "txtHost":data.txtHostname, "cbIsSSL":data.cbIsSSL, "txtPortNo":data.txtPort,
      "txtEmail":data.txtEmail, "txtPwd":data.txtPassword, "cbIsActive":data.cbIsActive }

    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   const updsmtp  = apiendpoints.updsmtp ;
    console.log(frmData);
    try {
      //debugger;
      const response = await api.post(
        updsmtp,
        compressBase64(reqdata),
        reqHdr
      );
   
      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);
  
       

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {        
        ShowAlert("Error", JSON.stringify(strResponse.fdr));
        toast.error( JSON.stringify(strResponse.fdr));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
            ResetScreenValue();
            FetchSMTPList();
            setLoanding(false);
        }, 300); 
       
      }
    } catch (err) {
      console.log(err.message);
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };
  
  try {

  return (
    <>
      <section className="vh-100">
        <div className="container h-100">
          {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
          <div className="card text-black" style={{ borderRadius: "25px" }}>
            <div className="card-header">
              <strong className="card-title">SMTP Master</strong>
            </div>
            <div className="card-body p-md-5">

            {isLoading?(<Spinner></Spinner>) :""}                        
            <Alerts alert={alert} />                      

              {isLoading ? <Spinner></Spinner> : ""}
              <Alerts alert={alert} />

              <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtHostname" className="form-label">
                        {" "}
                        Host Name
                      </label>
                      <input
                        {...register("txtHostname")}
                        type="email"
                        className="form-control"
                        
                      />
                      <p>{errors.txtHostname?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                    <label htmlFor="txtSMTPId" className="form-label">
                        {" "}
                        SMTP Id
                      </label>
                      <input
                        {...register("txtSMTPId")}
                        disabled="disabled"
                        readonly="readonly"
                        className="form-control"
                       
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtPort" className="form-label">
                        {" "}
                        Port
                      </label>
                      <input
                        {...register("txtPort")}
                        type="text"
                        className="form-control"                      
                      />
                      <p>{errors.txtPort?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtEmail" className="form-label">
                        Email
                      </label>
                      <input
                        {...register("txtEmail")}
                        type="email"
                        className="form-control"
                      />
                      <p>{errors.txtEmail?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtPassword" className="form-label">
                        {" "}
                        Password.
                      </label>
                      <input
                        {...register("txtPassword")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtPassword?.message}</p>
                    </div>
                  </div>
                 
                 
                  <div className="col-sm">
                    <div className="mb-3">

                    <div className="col-md-1">
                        <input {...register("cbIsSSL")} type="checkbox"/>
                        {" "}<label htmlFor="cbIsSSL" className="form-label">IsSSL</label>
                    </div>

                    
                    
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                    <div className="col-md-1">
                        <input {...register("cbIsActive")} type="checkbox" />
                        {" "}<label htmlFor="cbIsActive" className="form-label">IsActive </label>
                    </div>
                    </div>
                  </div>
                </div>
                
               

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <Scrollbar style={{ width: 1200, height: 550 }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-center">Id</th>
                    <th className="text-center">HOST</th>
                    <th className="text-center">Port</th>
                    <th className="text-center">Email.</th>
                    <th className="text-center">IsSSL</th>                   
                    <th className="text-center">SMTPStatus</th>
                   
                    <th>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          ResetScreenValue();
                        }}
                      >
                        {" "}
                        <i className="bi bi-table"></i> Add{" "}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {smtplst &&
                    smtplst.map((x) => {
                      return (
                        <tr>
                          <td>{x.id}</td>
                          <td>{x.host}</td>
                          <td>{x.portno }</td>
                          <td>{ x.email}</td>
                          <td>{ x.isssl}</td>
                          <td>{ x.isactive}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SetScreenValue(x);
                              }}
                            >
                              {" "}
                              <i className="bi bi-pen"></i> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Scrollbar>
          </div>
          {/* </div>
            </div> */}
        </div>
      </section>
    </>
  );
} catch (error) {

  console.log(error.message)
    
}
};

export default SMTPMaster;
