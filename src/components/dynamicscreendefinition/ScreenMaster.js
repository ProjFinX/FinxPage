import React from "react";
import { useState, useEffect } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";

import { GetAllScreenList } from "../utilities/getallscreen";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from 'react-toastify';

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json"
import { getPostData } from "../utilities/apidataformatter";

const apiendpoints = appsettings.ApiEndpoints;

const CompanyId = localStorage.getItem("CompanyId")


const schema = yup.object().shape({
  txtScreenName: yup.string().required("Pls select Screen Name"),
});

//rfce - command
function ScreenMaster() {
  // Const & Var

  const [screenresbody, setscreenlistresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);
  const [UserStatusMaster, setUserStatusMaster] = useState([]);
  const [UserStatus, setUserStatus] = useState([]);
  
  const [screenid, setScreenid] = useState(0);
  const [IsCustomScr, setIsCustomScr] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });



  // General Function

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenlistresbody(ScreenListResponse.body.Screens);

    console.log(ScreenListResponse.body.Screens);

  };

  //   fetch combo values

  
  // Useeffect

  useEffect(() => {
    FetchAllScreenList();
  }, []);

  useEffect(() => {    
  }, [IsCustomScr]);



  // Event function start

  const onSubmitHandler = async (data) => {
     let scrpath= "";
     let ScreenId = data.txtScreenId;
    if(data.cbIsCustomScreen)
       scrpath = data.txtCustScreenPath;

       if(data.txtScreenId==undefined)
         ScreenId = "0";

    let frmData = {
      txtScreenId: ScreenId,
      txtScrName: data.txtScreenName,
      cbIsActive: data.cbIsActive,
      cbIsSubmit: data.cbIsSubmit,
      cbIsSave: data.cbIsSave,
      cbIsSaveClose: data.cbIsSaveClose,
      cbIsClose: data.cbIsClose,
      cbIsAction: data.cbIsAction,
      cbIsCustomScreen: data.cbIsCustomScreen,
      txtScrPath: scrpath
    };

    const UpdScreenMaster = apiendpoints.UpdScreenMaster;

    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "cngusrstus",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        UpdScreenMaster,
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
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          ResetScreenValue();
          FetchAllScreenList();          
          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  }


  const publishscreen = async() =>{

    

    let qdata = getValues();

    let frmData = {};
        frmData["scrid"] = qdata.txtScreenId;
        frmData["scrname"] = qdata.txtScreenName;

        const buildscrURL = apiendpoints.BuildScrn;
        
        frmData = getPostData("BuildScreen", frmData);

        const response = await api.post(buildscrURL, compressBase64(frmData));

        let bldresp = JSON.parse(decompressBase64(response.data));


       if(bldresp.hdr.rst =="SUCCESS"){

        
        toast.success("Screen Published ");

       }
       else{
        toast.error("Failed to Publish")
       }


       

  }


  //---------------onSubmitHandler end------

  

  
  function SetScreenValue(rowval)  
  {
  
    // window.alert( rowval.IsActive);

    reset({
      txtScreenId: rowval.ScreenId, txtScreenName: rowval.ScrName,
      cbIsActive: rowval.IsActive, cbIsCustomScreen: rowval.IsCustomScreen,
      cbIsSubmit:rowval.IsSubmitCancel, cbIsSave:rowval.IsSave,
      cbIsSaveClose:rowval.IsSaveClose, cbIsClose:rowval.IsClose,
      cbIsAction:rowval.IsAction,
      txtCustScreenPath: (rowval.ScrPath) ? rowval.ScrPath : ''
    })

    setScreenid(rowval.ScreenId)

  }

  function ResetScreenValue()  
  {
    reset({ txtScreenId: "", txtScreenName: "", txtCustScreenPath:"", cbIsActive:false,
      cbIsCustomScreen:false, cbIsSubmit:false, cbIsSave:false, cbIsSaveClose:false,
      cbIsClose:false, cbIsAction:false,
     })    
  }

  const CheckboxhandleChange = (e) => {

    if (e.target.value == true) {
      setIsCustomScr(true)
    }
    else {
      setIsCustomScr(false)
    }

  };
  // Event Function End

  // Main Function

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
                <strong className="card-title">Create New Screen</strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <form
                  onSubmit={handleSubmit(onSubmitHandler)}
                  autocomplete="off"
                >
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtScreenName" className="form-label">
                          {" "}
                          Screen Name
                        </label>
                        <input
                          {...register("txtScreenName")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtScreenName?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtScreenId" className="form-label">
                          {" "}
                          Screen Id
                        </label>
                        <input
                          {...register("txtScreenId")}
                          type="text"
                          className="form-control"
                          disabled="disabled"
                          readonly="readonly"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    
                    <div className="col-md-1">
                        <input {...register("cbIsActive")} type="checkbox" />
                        {" "}<label htmlFor="cbIsActive" className="form-label">Active</label>
                    </div>

                    <div className="col-md-2">
                        <input {...register("cbIsSubmit")} type="checkbox" />
                        {" "}<label htmlFor="cbIsSubmit" className="form-label">Submit & Cancel</label>
                    </div>

                    <div className="col-md-1">
                        <input {...register("cbIsSave")} type="checkbox" />
                        {" "}<label htmlFor="cbIsSave" className="form-label">Save</label>
                    </div>

                    <div className="col-md-2">
                        <input {...register("cbIsSaveClose")} type="checkbox"/>
                        {" "}<label htmlFor="cbIsSaveClose" className="form-label">Save & Close</label>
                    </div>

                    <div className="col-md-1">
                        <input {...register("cbIsClose")} type="checkbox"/>
                        {" "}<label htmlFor="cbIsClose" className="form-label">Close</label>
                    </div>

                    <div className="col-md-1">
                        <input {...register("cbIsAction")} type="checkbox" />
                        {" "}<label htmlFor="cbIsAction" className="form-label">Action</label>
                    </div>

                    <div className="col-md-2">
                      <input {...register("cbIsCustomScreen")} type="checkbox"
                        onChange={(e) => { CheckboxhandleChange( { target: { value: e.target.checked } } ); } } />
                      {" "}
                      <label htmlFor="cbIsCustomScreen" className="form-label" >Is Custom Screen</label>
                    </div>

                  </div>
                  
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtCustScreenPath" className="form-label">
                          {" "}
                          Custom Screen path
                        </label>
                        <input
                          {...register("txtCustScreenPath")}
                          type="text"
                          className="form-control"                         
                          disabled= {(IsCustomScr)?false: true}                    
                        />
                        <p>{errors.txtCustScreenPath?.message}</p>
                      </div>
                    </div>
                   
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button type="button" className="btn m-3 btn-success" onClick={() => publishscreen()}>
                    Publish
                  </button>
                </form>
              </div>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Sreen</th>
                    <th>Status</th>
                    <th>Is Custom</th>
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
                  {screenresbody.map((x) => {
                    return (
                      <tr>
                        <td>{x.ScreenId}</td>
                        <td>{x.ScrName}</td>
                        <td>{ x.IsActive? "Active":"InActive"
                            }</td>
                       
                        <td>{ x.IsCustomScreen? "YES":"NO"
                            }</td>
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
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default ScreenMaster;