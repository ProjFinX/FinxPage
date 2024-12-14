import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import {

  GetAtchelmlst,
  DelMailTmpltAttachmentelmt
} from "../utilities/getsmtpmaster";
import { GetAllScreenList } from "../utilities/getallscreen";
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
import { Scrollbar } from "react-scrollbars-custom";
import Table from "react-bootstrap/Table";

import { toast } from 'react-toastify';
import appsettings from "../../appsettings.json"
const apiendpoints = appsettings.ApiEndpoints;

// Yup validation schema



const schema = yup.object().shape({
  cmbAtchElement: yup
    .string()
    .required("Eement name  can not be empty") 
  
});

// Function Component Branch

const MailAttchElms = () => {
  // Combo Data fetching------------------------------
  const [smtplst, setsmtplst] = useState([]);
  const [miltmpltlsbody, setmiltmpltlsresbody] = useState([]);
  const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [resbody, setresbody] = useState([]);
  const [childelms, setscrchildelms] = useState([]);
  const [Screenid, setScreenid] = useState(0);
  const [MailTemplateId, setMailTemplateId] = useState(0);  
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|MILTMP|";
    const optw = "";
    // debugger;

    const Response = await FetchCombodata(opt, optw); // JSON.stringify(await FetchCombodata(opt,optw));

    setresbody(Response.body.miltmp);

  };

  useEffect(() => {       
    FetchAllScreenList();
    LoadCombo();
  }, []);

  // Useeffect

  //-----------------------------



  
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState("");

  const [isLoading, setLoanding] = useState(false);

  
  
  const MailTemplateOnChange = (e) => {  
    
    setMailTemplateId(e.target.value);  
    FetchMailTemplateAttachmentList(e.target.value)

};



const FetchMailTemplateAttachmentList = async (MailTemplateId) => {
  const MailTemplateAttachmentList = await GetAtchelmlst(MailTemplateId);
  console.log(JSON.stringify(MailTemplateAttachmentList));   
  setmiltmpltlsresbody(MailTemplateAttachmentList.body.atchelm);  
};



  const ScreenOnChange = (e) => {  
    
    setScreenid(e.target.value);  
    FetchScreenChildElements(0,e.target.value)

};

const FetchScreenChildElements = async (parentelmid, scrid) => {
  // Update state with incremented value
   const opt = "|DUELM|";

  const optw = {
    DUELM: "ScreenId=" + scrid + " and ParentElementId=" + parentelmid,
  };

  const Response = await FetchCombodata(opt, optw);

  console.log(Response);

  setscrchildelms(Response.body.duelm);
};


  const navigate = useNavigate();

  
  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList(); 
    setscreenfilterlist(ScreenListResponse.body.Screens.filter((res) => res.IsActive==true));
  };


  const ref = useRef();

  
  const DeleteTemplateAttachmentOnclick = (rowval) => {  
 
    DelMailTmpltAttachmentElement(rowval.atchelmid)
};



const DelMailTmpltAttachmentElement = async (MailTemplateelemntId) => {
  const strResponse = await DelMailTmpltAttachmentelmt(MailTemplateelemntId); 

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        //ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        // setLoanding(false);
      } else {
        toast.success("Successfully Deleted");
        setTimeout(() => { }, 600);
        FetchMailTemplateAttachmentList(MailTemplateId)         
      }

  
};



  const onSubmitHandler = async (data) => {   


    let MailAttchElmsId = 0;
    if (data.txtMailTemplateId!=undefined)
       MailAttchElmsId = data.txtMailTemplateId;

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "updatchelm",
      orgid: "",
      vendid: "0",
    };
    const frmData = {"txtMailAttchElmsId":MailAttchElmsId,
                     "txtMailTemplateId":data.cmbMailTemplateId,
                     "cmbAtchElement":data.cmbAtchElement}

    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   const updsmtp  = apiendpoints.updatchelm ;
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
          FetchMailTemplateAttachmentList(data.cmbMailTemplateId)       
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
           // ResetScreenValue();
          // FetchMailAttchElmsList();
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
              <strong className="card-title">Mail Template Attachment</strong>
            </div>
            <div className="card-body p-md-5">
              {isLoading ? <Spinner></Spinner> : ""}
              <Alerts alert={alert} />

              <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                    <label htmlFor="cmbMailTemplateId" className="form-label">
                        Template name
                      </label>
                      <select
                        {...register("cmbMailTemplateId")}
                        className="form-control"  onChange={MailTemplateOnChange} 
                      >
                        <option value="">- Select -</option>
                        {
                          //Combo Data binding
                          resbody &&
                          resbody.map((res) => (
                            <option key={res.k} value={res.k}>
                             {res.v}
                            </option>
                          ))
                        }
                      </select>
                      <p>{errors.cmbMailTemplateId?.message}</p>
                    </div>
                  </div>
                 

                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtMailAttchElmsId" className="form-label">
                        {" "}
                        Template Attachment Id
                      </label>
                      <input
                        {...register("txtMailAttchElmsId")}
                        type="text"
                        disabled="disabled"
                        readonly="readonly"
                        className="form-control"
                      />
                      <p>{errors.txtMailAttchElmsId?.message}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
               
                <div className="col-sm">
                                    <div className="mb-3">
                                        <label htmlFor="cmbScreenId" className="form-label">Screen</label>
                                        <select {...register("cmbScreenId")}  className="form-control"  onChange={ScreenOnChange}> 
                                            <option value="0">- Select -</option>
                                            {  //Combo Data binding
                                                        
                                                        screenfilterlist.map((res) => 
                                                        (<option key={res.ScreenId} value={res.ScreenId}>{res.ScrName}</option>))
                                            }
                                            
                                        </select>
                                        <p>{errors.cmbScreenId?.message}</p>
                                    </div>
                                </div>
                                <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="cmbAtchElement" className="form-label">
                          {" "}
                          Element
                        </label>
                        <select {...register("cmbAtchElement")}  className="form-control"  onChange={""}> 
                                            <option value="0">- Select -</option>
                                            {                                                         
                                                        childelms.map((res) => 
                                                        (<option key={res.k} value={res.k}>{res.v}</option>))
                                            }
                                        </select>
                                        <p>{errors.cmbAtchElement?.message}</p>
                      </div>
                  
                    </div>

                    <div className="col-md-12">
                  
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
                    <th className="text-center">Element</th>   
                  
                    <th>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                         
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
                          <td>{x.atchelmid}</td>
                          <td>{x.elmna}</td>
                         
                         
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                DeleteTemplateAttachmentOnclick(x);
                              }}
                            >
                              {" "}
                              <i className="bi bi-pen"></i> Delete
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

export default MailAttchElms;
