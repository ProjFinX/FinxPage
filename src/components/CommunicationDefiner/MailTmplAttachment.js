import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import {

  GetMailTemplateAttachmentList,  
 
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

const MailTmplAttachment = () => {
  // Combo Data fetching------------------------------
  const [smtplst, setsmtplst] = useState([]);
  const [miltmpltlsbody, setmiltmpltlsresbody] = useState([]);
  const [resbody, setresbody] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
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

  
  
  function ResetScreenValue() {
    reset({
      filElements: ""       
    });
  }


  
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }

  };

  const MailTemplateOnChange = (e) => {  
    
    setMailTemplateId(e.target.value);  
    FetchMailTemplateAttachmentList(e.target.value)

};

const DeleteTemplateAttachmentOnclick = (x) => {  
 
       DeleteTemplateAttachment(x.attchid)
};





  const navigate = useNavigate();

  
  const FetchMailTemplateAttachmentList = async (MailTemplateId) => {
    const MailTemplateAttachmentList = await GetMailTemplateAttachmentList(MailTemplateId);
    console.log(JSON.stringify(MailTemplateAttachmentList));   
    setmiltmpltlsresbody(MailTemplateAttachmentList.body.attachment);  
  };

  const DeleteTemplateAttachment = async (attchid) => {
    
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "delmiltmltdoc",
      orgid: "",
      vendid: "0",
    };
    
    let MailTempltId = parseInt(MailTemplateId);
    const frmData = {cmbMailTemplateId:MailTempltId,txtMailTmplAttchId:attchid}
    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    const updmiltmplt = apiendpoints.delmiltmltdoc;
   
    console.log(reqdata);

    try {
      //debugger;
      const response = await api.post(updmiltmplt, compressBase64(reqdata), reqHdr);

      const strResponse = JSON.parse(decompressBase64(response.data));   

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        //ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        // setLoanding(false);
      } else {
        toast.success("Successfully updated");
        setTimeout(() => { }, 600);
        // FetchEventtree(Screenid, StgId);
         FetchMailTemplateAttachmentList(MailTempltId)
         ResetScreenValue();
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      //ShowAlert("Error", "Unable to process request");
      // setLoanding(false);
    }
  };

  const ref = useRef();

  const OnFileUpladHandler = async (e) => {
    e.preventDefault(); // 👈️ prevent page refresh

    var fileCtrl = ref.current.value;
    var filePath = ref.current.value;
    let MailTempltId = parseInt(MailTemplateId);

    var fExt = ".html";
    var allowedExtns = fExt.replace(/\,/g, "|");
    allowedExtns = allowedExtns.replace(/\./g, "\\.");
    allowedExtns = "/(" + allowedExtns.replace(/ /g, "") + ")$/i;";
    allowedExtns = eval(allowedExtns);
    if (!allowedExtns.exec(filePath)) {
      toast.error("Invalid file type");
      ref.current.value = "";
      return false;
    }

    const MAX_FILE_SIZE = 2048; // 2MB

    if (!selectedFile) {
      toast.error("Please choose a file");
      return false;
    }

    const fileSizeKiloBytes = selectedFile.size / 1024;

    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than maximum limit");
      return false;
    }

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "uploadfilelments",
      orgid: "",
      vendid: "0",
    };

   

    console.log(fileSizeKiloBytes);


    
    const tmpltDet = {};
    tmpltDet["cmbMailTemplateId"] = getValues("cmbMailTemplateId");
    
    const formData = new FormData();
    formData.append("tmpltdet", JSON.stringify(tmpltDet));
    formData.append("file", selectedFile);

    const token = localStorage.getItem("token");

    try {
      const url = apiendpoints.upldmiltmltdoc;

      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        //ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        // setLoanding(false);
      } else {
        toast.success("Successfully updated");
        setTimeout(() => { }, 600);
        // FetchEventtree(Screenid, StgId);
        FetchMailTemplateAttachmentList(MailTempltId)
        ResetScreenValue();
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      //ShowAlert("Error", "Unable to process request");
      // setLoanding(false);
    }
  };



  const onSubmitHandler = async (data) => {
    
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
                        {...register("cmbMailTemplateId") } onChange={MailTemplateOnChange}
                        className="form-control"
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
                      <label htmlFor="txtMailTmpAttchId" className="form-label">
                        {" "}
                        Template Attachment Id
                      </label>
                      <input
                        {...register("txtMailTmpAttchId")}
                        type="text"
                        disabled="disabled"
                        readonly="readonly"
                        className="form-control"
                      />
                      <p>{errors.txtMailTmpAttchId?.message}</p>
                    </div>
                  </div>
                </div>

                <div className="row">
                <div className="col-md-12">

                    <label htmlFor="filElements" className="form-label">UI Html File</label>
                    <input type="file" name="filElements"  {...register("filElements")}  onChange={handleFileChange}
                     ref={ref} 
                       className="form-control" />

                    </div>

                    <div className="col-md-12">
                    <button type="button"
                       onClick={OnFileUpladHandler}
                      className="btn btn-primary mar-top-2em">
                      <span className="bi bi-upload"></span> upload
                    </button>
                    </div>
                </div>
              
              </form>
            </div>
            <Scrollbar style={{ width: 1200, height: 550 }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-center">Id</th>
                    <th className="text-center">File Name</th>
                  
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
                          <td>{x.attchid}</td>
                          <td>{x.filename}</td>                         
                         
                          <td>
                            <button
                              className="btn btn-primary"   
                              onClick={() => {
                                DeleteTemplateAttachmentOnclick(x);
                              }}                          
                            >                             
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

export default MailTmplAttachment;
