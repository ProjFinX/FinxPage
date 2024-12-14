import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import {
  Getsmtplist,
  GetMailTemplateList,
} from "../utilities/getsmtpmaster";
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
import { GetUserList } from "../utilities/getuserlist";
import { Scrollbar } from "react-scrollbars-custom";
import Table from "react-bootstrap/Table";

import { toast } from 'react-toastify';
import appsettings from "../../appsettings.json"
const apiendpoints = appsettings.ApiEndpoints;

// Yup validation schema

const schema = yup.object().shape({
  txtTemplatename: yup
    .string()
    .required("Template name  can not be empty") 
  
});

// Function Component Branch

const MailTemplate = () => {
  // Combo Data fetching------------------------------
  const [smtplst, setsmtplst] = useState([]);
  const [miltmpltlsbody, setmiltmpltlsresbody] = useState([]);
  const [resbody, setresbody] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|MILTY|";
    const optw = "";
    // debugger;

    const Response = await FetchCombodata(opt, optw); // JSON.stringify(await FetchCombodata(opt,optw));

    setresbody(Response.body.milty);

  };

  useEffect(() => {
    FetchSMTPList();
    LoadCombo();
    FetchMailTemplateList();
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
      txtUserId: rowval.UserId,
      txtUsername: rowval.Username,
      txtFirstname: rowval.FName,
      txtLastname: rowval.LName,
      txtPhone: rowval.tleid,
      cmbCountryId: rowval.tleid,
      txtPassword: rowval.tleid,
      txtConformPassword: rowval.tleid,
    });
  }

  function ResetScreenValue() {
    reset({
      txtTemplatename: "",
      cmbSMTPId: "",
      cmbMailType: "",
      cbIsHTML: "",
      cbIsActive: "",
      txtSubject: "",
      txtBody: "",
    });
  }

  const navigate = useNavigate();

  const FetchSMTPList = async () => {
    const SMTPListResponse = await Getsmtplist();
    console.log(JSON.stringify(SMTPListResponse));
    setsmtplst(SMTPListResponse.body.smpt);
  };

  const FetchMailTemplateList = async () => {
    const UserListResponse = await GetMailTemplateList();
    console.log(JSON.stringify(UserListResponse));
    setmiltmpltlsresbody(UserListResponse.body.smpt);

    console.log(JSON.stringify(UserListResponse.body.Users));
  };

  const onSubmitHandler = async (data) => {
    setLoanding(true);


    let MailTemplateId = 0;
    if (data.txtMailTemplateId==undefined)
      MailTemplateId = 0;
    else
      MailTemplateId = data.txtMailTemplateId;

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "NewUser",
      orgid: "",
      vendid: "0",
    };
    const frmData = {
      txtMailTemplateId: MailTemplateId,
      txtTemplateName: data.txtTemplatename,
      cmbMailTypeId: data.cmbMailType,
      cmbSMTPId: data.cmbSMTPId,
      txtMailSubject: data.txtSubject,
      txtMailContent: data.txtBody,
      cbIsHtml: data.cbIsHTML,
      cbIsActive: data.cbIsActive,
    };
    console.log(frmData);
    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    const updmiltmplt = apiendpoints.updmiltmplt;
   
    try {
      //debugger;
      const response = await api.post(updmiltmplt, compressBase64(reqdata), reqHdr);

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr));
        toast.error(JSON.stringify(strResponse.fdr));
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
          FetchMailTemplateList();
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

  return (
    <>
      <section className="vh-100">
        <div className="container h-100">
          {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
          <div className="card text-black" style={{ borderRadius: "25px" }}>
            <div className="card-header">
              <strong className="card-title">Mail Template</strong>
            </div>
            <div className="card-body p-md-5">
              {isLoading ? <Spinner></Spinner> : ""}
              <Alerts alert={alert} />

              <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtTemplatename" className="form-label">
                        {" "}
                        Template Name
                      </label>
                      <input
                        {...register("txtTemplatename")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtTemplatename?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="cmbSMTPId" className="form-label">
                        SMTP
                      </label>
                      <select
                        {...register("cmbSMTPId")}
                        className="form-control"
                      >
                        <option value="">- Select -</option>
                        {
                          //Combo Data binding
                          smtplst.map((res) => (
                            <option key={res.id} value={res.id}>
                              {res.email}
                            </option>
                          ))
                        }
                      </select>
                      <p>{errors.cmbSMTPId?.message}</p>
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtMailTemplateId" className="form-label">
                        {" "}
                        MailTemplate Id
                      </label>
                      <input
                        {...register("txtMailTemplateId")}
                        type="text"
                        disabled="disabled"
                        readonly="readonly"
                        className="form-control"
                      />
                      <p>{errors.txtMailTemplateId?.message}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="cmbMailType" className="form-label">
                        Mail Type
                      </label>
                      <select
                        {...register("cmbMailType")}
                        className="form-control"
                      >
                        <option value="">- Select -</option>
                       
                        {
                          //Combo Data binding
                          resbody.map((res) => (
                            <option key={res.k} value={res.k}>
                              {res.v}
                            </option>
                          ))
                        }
                      </select>
                      <p>{errors.cmbMailType?.message}</p>
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3">
                      <div className="col-md-1">
                        <input {...register("cbIsHTML")} type="checkbox" />{" "}
                        <label htmlFor="cbIsHTML" className="form-label">
                          IsHTML
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <div className="col-md-1">
                        <input {...register("cbIsActive")} type="checkbox" />{" "}
                        <label htmlFor="cbIsActive" className="form-label">
                          IsActive{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtSubject" className="form-label">
                        {" "}
                        Mail Subject
                      </label>
                      <input
                        {...register("txtSubject")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtSubject?.message}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtBody" className="form-label">
                        {" "}
                        Mail Body
                      </label>
                      <textarea
                        {...register("txtBody")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtBody?.message}</p>
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
                    <th className="text-center">Name</th>
                    <th className="text-center">SMTP</th>
                    <th className="text-center">Subject</th>
                    <th className="text-center">Mail Type</th>
                    <th className="text-center">Status</th>

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
                  {miltmpltlsbody &&
                    miltmpltlsbody.map((x) => {
                      return (
                        <tr>
                          <td>{x.tmpltid}</td>
                          <td>{x.tmpltna}</td>
                          <td>{x.email}</td>
                          <td>{x.subj}</td>
                          <td></td>
                          <td></td>
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
};

export default MailTemplate;
