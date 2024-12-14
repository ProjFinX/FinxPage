import React from "react";
import { useState, useEffect, useRef } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { PostCall, PostCallHeader } from "../api/Webcall";

import { GetAllScreenList } from "../utilities/getallscreen";
import { GetElementList } from "../utilities/getelementlist";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { PreConstruct } from "ag-grid-community";

const apiendpoints = appsettings.ApiEndpoints;
const schema = yup.object().shape({
  
});

//rfce - command
function ElementMasterOld() {
  // Const & Var

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedFile, setSelectedFile] = useState(null);

  const [Elementresbody, setElementlistresbody] = useState([]);
  const [isLoading, setLoanding] = useState(false);
  const [Screenid, setScreenid] = useState(0);
  const [IsCustomScr, setIsCustomScr] = useState(false);
  const [screenfilterlist, setscreenfilterlist] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ref = useRef();

  // General Function

  const filereset = () => {
    ref.current.value = "";
  };

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenfilterlist(
      ScreenListResponse.body.Screens.filter((res) => res.IsActive == true)
    );
  };

  const FetchElementList = async (screenid) => {
    const ElementListResponse = await GetElementList(screenid);
    setElementlistresbody(ElementListResponse.body.elements);
    console.log(JSON.stringify(ElementListResponse.body.elements));
  };

  //   fetch combo values

  const [cmbctlres, setctlres] = useState([]);
  const [cmbdttyres, setdttyres] = useState([]);
  const [cmbconstrres, setcmbconstrres] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|CTL|DTTY|CTBL|";
    const optw = "";
    // 

    const Response = await FetchCombodata(opt, optw);



    setctlres(Response.body.ctl);
    setdttyres(Response.body.dtty);
    setcmbconstrres(Response.body.ctbl);
    //console.log("rerendering method");
  };

  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();
  }, []);

  useEffect(() => {}, [IsCustomScr]);

  // Event function start

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const ScreenOnChange = (e) => {
    setScreenid(e.target.value);
    FetchElementList(e.target.value);
  };

  //  Main Form Submit

  const OnMainSubmitHandler = async (e) => {
    e.preventDefault(); // 👈️ prevent page refresh

    
    var fileCtrl = ref.current.value;
    var filePath = ref.current.value;

    var fExt = ".csv";
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

    var scrdet = {};
    scrdet["scrid"] = Screenid;
    const formData = new FormData();
    formData.append("_scrdet", JSON.stringify(scrdet));
    formData.append("file", selectedFile);
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    //const reqdata = { hdr: frmHdr, body: formData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    const UpldElements = apiendpoints.UpldElements;
    const UPLOAD_ENDPOINT = UpldElements;

    try {
      const data = formData;
      const url = apiendpoints.UpldElements;

      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
          toast.success("Successfully updated");
          setTimeout(() => {}, 600);
          FetchElementList(Screenid);  

      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };



  const onModalSubmitHandler = async (data) => {




   
   var Caption = data.txtCaption;
   if (data.txtCaption==null)
   {
      Caption = "";
   }

   var ElementId = data.txtElementId;
   if (data.txtElementId==null)
   {
      ElementId = "";
   }

   var FileExt = data.txtFileExt;
   if (data.txtFileExt==null)
   {
    FileExt = "";
   }

   var MaxLength = data.txtMaxLength;
   if (data.txtMaxLength==null)
   {
       MaxLength = "";
   }

   var ParentElement = data.txtParentElement;
   if (data.txtParentElement==null || data.txtParentElement=="0" )
   {
    ParentElement = "";
   }

   var RangeFrom = data.txtRangeFrom;
   if (data.txtRangeFrom==null)
   {
    RangeFrom = "";
   }

   var RangeTo = data.txtRangeTo;
   if (data.txtRangeTo==null)
   {
    RangeTo = "";
   }

   var SizeInKB = data.txtSizeInKB;
   if (data.txtSizeInKB==null)
   {
      SizeInKB = "";
   }
        


   let frmData = { 
            cmbControlType: data.cmbControlType,
            cmbDataType: data.cmbDataType,
            scrid: Screenid,
            txtCaption: Caption,
            txtElementId: ElementId,
            txtElementName: data.txtElementName,
            txtFileExt: FileExt,
            txtMaxLength: MaxLength,
            txtParentElement: ParentElement,
            txtRangeFrom: RangeFrom,
            txtRangeTo: RangeTo,
            txtSizeInKB: SizeInKB,
            txtCmbCode:data.txtCmbCode,
            txtCmbCon:data.txtCmbCon,
            cmbDbShotName:data.cmbDbShortName
            };


    //e.preventDefault();
   /* Header */
   const convID = generateUUID();
   const frmHdr = {
     convid: convID,
     tag: "updateelement",
     orgid: "",
     vendid: "0",
   };


   const token = localStorage.getItem("token");
   const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
   const reqdata = { hdr: frmHdr, body: frmData };
   const UpdateElement = apiendpoints.UpdateElement;

   console.log(reqdata);

   try {
     //
     const response = await api.post(
      UpdateElement,
       compressBase64(reqdata),
       reqHdr
     );

     const strResponse = JSON.parse(decompressBase64(response.data));

     console.log(strResponse);

     if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
       ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
       setLoanding(false);
     } else {
       setTimeout(() => {
         console.log(strResponse.fdr);
         toast.success("Successfully updated");
           handleClose();        
         FetchElementList(Screenid);   
           
       
       }, 300);
     }
   } catch (err) {
     console.log(err.message);
     toast.error("Unable to process request");
     ShowAlert("Error", "Unable to process request");
     setLoanding(false);
   }
 }

  //---------------onSubmitHandler end------

  function SetScreenValue(rowval) {
    handleShow();
  
  
      //let constr = cmbconstrres.filter(res => { if (res.k == rowval.ConStr) return res} ); 



    reset({
      txtElementId: rowval.ElementId,
      txtElementName: rowval.ElmName,
      cmbControlType: rowval.ControlType,
      cmbDataType: rowval.DataType,
      txtCaption: rowval.Caption,
      txtParentElement: rowval.ParentElmName,
      txtMaxLength: rowval.MaxLength,
      txtRangeFrom: rowval.RangeFrom,
      txtSizeInKB: rowval.SizeInKB,
      txtFileExt: rowval.FileExt,
      txtRangeTo: rowval.RangeTo,
      txtCmbCode:rowval.CmbCod,
      txtCmbCon:rowval.CmbCon,
      cmbDbShortName:rowval.ConStr
    });
  }


  
  function AddNewElement() {
    handleShow();
    

    reset({
      txtElementId: "",
      txtElementName: "",
      cmbControlType: "",
      cmbDataType: "",
      txtCaption: "",
      txtParentElement: "",
      txtMaxLength: "",
      txtRangeFrom: "",
      txtSizeInKB: "",
      txtFileExt: "",
      txtRangeTo: "",
      txtCmbCode:"",
      txtCmbCon:"",
      cmbDbShotName:""

    });
  }

//--------------------------------------------------------------------------------------------------------
  // - Delete element 

  const DeleteScreenValue = async(rowval)  =>{
   
    console.log(rowval);
    
    var frmData = { scrid: Screenid,  txtElementId: rowval.ElementId,
        }


        const convID = generateUUID();
        const frmHdr = {
          convid: convID,
          tag: "Deleteelement",
          orgid: "",
          vendid: "0",
        };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const DeleteElement = apiendpoints.DeleteElement;
 
    console.log(reqdata);
 
    try {
      //
      const response = await api.post(
        DeleteElement,
        compressBase64(reqdata),
        reqHdr
      );
 
      const strResponse = JSON.parse(decompressBase64(response.data));
 
      console.log(strResponse);
 
      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {       
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));     
      } else {
        
          toast.success("Deleted Successfully");         
          FetchElementList(Screenid);   

      }
    } catch (err) {    
      toast.error("Unable to process request");    
    }

  }

  //---------------------------------------------------------------------------------------------------------------

  function ResetScreenValue() {
   
    ref.current.value = "";
  }

  const CheckboxhandleChange = (e) => {
    console.log(e);

    if (e.target.value == true) {
      setIsCustomScr(true);
    } else {
      setIsCustomScr(false);
    }
  };
  // Event Function End

  // Main Function

  const ShowAlert = (alertType, message) => {};

  try {
    return (
      <>
        <section className="vh-100">
          <div className="container h-100">
            {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">Create Element</strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <form onSubmit={OnMainSubmitHandler} autocomplete="off">
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="scrid" className="form-label">
                          Screen
                        </label>

                        <select
                            {...register("scrid")}
                          className="form-control"
                          onChange={ScreenOnChange}
                        >
                          <option value="0">- Select -</option>
                          {
                            //Combo Data binding

                            screenfilterlist.map((res) => (
                              <option key={res.ScreenId} value={res.ScreenId}>
                                {res.ScrName}
                              </option>
                            ))
                          }
                        </select>
                        <p>{errors.scrid?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <div>
                          <label htmlFor="filElements" className="form-label">
                            {" "}
                            Element File
                          </label>
                        </div>
                        <input
                          type="file"
                          name="filElements"
                          onChange={handleFileChange}
                          ref={ref}     className="form-control"
                        />{" "}
                        {/* <button onClick={filereset} className="btn btn-danger">
                          X
                        </button>{" "} */}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <span className="bi bi-upload"></span> upload
                  </button>
                </form>
              </div>

              <Scrollbar style={{ height: 550 }}>
                <Table striped bordered hover  >
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Name </th>
                      <th>Control Type </th>
                      <th>Data Type </th>
                      <th>Caption</th>
                      <th>Parent Element </th>
                      <th>Max Length </th>
                      <th>Range From </th>
                      <th>Range To </th>
                      <th>Size (KB) </th>
                      <th>File Ext. </th>
                      <th>Cmb Cod</th>
                      <th>Cmb con</th>
                      <th>Con str</th>
                      <th>
                        <button
                          className="btn btn-success"
                          onClick={AddNewElement}
                        >
                          {" "}
                          <i className="bi bi-table"></i> Add{" "}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Elementresbody &&
                      Elementresbody.map((x) => {
                        return (
                          <tr>
                            <td>{x.ElementId}</td>
                            <td>{x.ElmName}</td>
                            <td>{x.ControlType}</td>
                            <td>{x.DataType}</td>
                            <td>{x.Caption}</td>
                            <td>{x.ParentElmName}</td>
                            <td>{x.MaxLength}</td>
                            <td>{x.RangeFrom}</td>
                            <td>{x.RangeTo}</td>
                            <td>{x.SizeInKB}</td>
                            <td>{x.FileExt}</td>
                            <td>{x.CmbCod}</td>
                            <td>{x.CmbCon}</td>
                            <td>{x.ConStr}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  SetScreenValue(x);
                                }}
                              >
                                {" "}
                                <i className="bi bi-pen"></i> 
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  DeleteScreenValue(x);
                                }}
                              >
                                {" "}
                                <i className="bi bi-trash"></i> 
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Scrollbar>
            </div>
          </div>
        </section>

        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Element Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form  onSubmit={handleSubmit(onModalSubmitHandler)}
                  autocomplete="off">
            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtElementName " className="form-label">
                    {" "}
                    Element Name
                  </label>
                  <input
                    {...register("txtElementName")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtElementName?.message}</p>
                </div>
              </div>
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtElementId" className="form-label">
                    {" "}
                    Element Id
                  </label>
                  <input
                    {...register("txtElementId")}
                    type="text"
                    className="form-control"
                    disabled="disabled"
                    readonly="readonly"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="cmbControlType  " className="form-label">
                    {" "}
                    Control Type
                  </label>
                 
                  <select
                    {...register("cmbControlType")}
                    className="form-control"
                    
                  >
                     <option value="0">- Select -</option>
                    {
                      //Combo Data binding

                      cmbctlres.map((res) => 
                      (<option key={res.k} value={res.v}>{res.v}</option>))
                
                    }
                  </select>

                  <p>{errors.cmbControlType?.message}</p>
                </div>
              </div>
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="cmbDataType  " className="form-label">
                    {" "}
                    Data Type
                  </label>
                  
                  <select
                    {...register("cmbDataType")}
                    className="form-control"                   
                  >
                     <option value="0">- Select -</option>
                    {
                      //Combo Data binding

                      cmbdttyres.map((res) => 
                       (<option key={res.k} value={res.v}>{res.v}</option>))
           
                    
                    }
                  </select>

                  <p>{errors.cmbDataType?.message}</p>
                 
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtCaption" className="form-label">
                    {" "}
                    Caption
                  </label>
                  <input
                    {...register("txtCaption")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtCaption?.message}</p>
                </div>
              </div>

              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtParentElement" className="form-label">
                    {" "}
                    Parent Element
                  </label>
                  <select
                    {...register("txtParentElement")}
                    type="text"
                    className="form-control"
                  >

                    <option value="0">- Select -</option>
                    {
                      //Combo Data binding

                      Elementresbody.map((res) => 
                       (<option key={res.ElementId} value={res.ElmName}>{res.ElmName}</option>))
           
                    
                    }

                  </select>

                 
                  <p>{errors.txtParentElement?.message}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtMaxLength" className="form-label">
                    {" "}
                    Max Length
                  </label>
                  <input
                    {...register("txtMaxLength")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtMaxLength?.message}</p>
                </div>
              </div>

              <div className="col-sm">
                <div className="mb-3">
                <label htmlFor="txtFileExt" className="form-label">
                    {" "}
                    File Ext.
                  </label>
                  <input
                    {...register("txtFileExt")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtFileExt?.message}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtRangeFrom" className="form-label">
                    {" "}
                    Range From
                  </label>
                  <input
                    {...register("txtRangeFrom")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtRangeFrom?.message}</p>
                </div>
              </div>

              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtRangeTo" className="form-label">
                    {" "}
                    Range To
                  </label>
                  <input
                    {...register("txtRangeTo")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtRangeTo?.message}</p>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtSizeInKB" className="form-label">
                    {" "}
                    Size(KB)
                  </label>
                  <input
                    {...register("txtSizeInKB")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtSizeInKB?.message}</p>
                </div>
              </div>

              <div className="col-sm">
                <div className="mb-3">
                <label htmlFor="txtCmbCode" className="form-label">
                    {" "}
                    Combo Code
                  </label>
                  <input
                    {...register("txtCmbCode")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtCmbCode?.message}</p>
                
                </div>
              </div>
              </div>
              <div className="row">
              <div className="col-sm">
                <div className="mb-3">
                  <label htmlFor="txtCmbCon" className="form-label">
                    {" "}
                    Combo condition
                  </label>
                  <input
                    {...register("txtCmbCon")}
                    type="text"
                    className="form-control"
                  />
                  <p>{errors.txtCmbCon?.message}</p>
                </div>
              </div>

              <div className="col-sm">
                <div className="mb-3">
                <label htmlFor="cmbDbShortName" className="form-label">
                          Combo Connection String
                        </label>

                        <select
                          {...register("cmbDbShortName")}
                         // value={DBid}
                          className="form-control"  
                                           
                        >
                          {<option value="0">-select-</option>}
                          {                           
                            cmbconstrres.map((res) => (
                              <option key={res.v} value={res.k}>
                                {res.k}
                              </option>
                            ))
                          }
                        </select>
                
                </div>
              </div>
            </div>

            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button type="submit" variant="secondary" >
              Update
            </Button>
          </Modal.Footer>
            </form>
          </Modal.Body>
         
        </Modal>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default ElementMasterOld;
