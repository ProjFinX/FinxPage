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
import { GetAllStageList } from "../utilities/getallstage";
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

const apiendpoints = appsettings.ApiEndpoints;

const CompanyId = localStorage.getItem("CompanyId")


const schema = yup.object().shape({
  txtStageName: yup.string().required("Pls provide stage Name"),
});

//rfce - command
function StageMaster() {
  // Const & Var

  const [stageresbody, setstagelistresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);
  const [UserStatusMaster, setUserStatusMaster] = useState([]);
  const [UserStatus, setUserStatus] = useState([]);
  
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



  // General Function

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList(); 
    setscreenfilterlist(ScreenListResponse.body.Screens.filter((res) => res.IsActive==true));
  };


  const FetchAllStageList = async (screenid) => {
    
    const StageListResponse = await GetAllStageList(screenid);
     setstagelistresbody(StageListResponse.body.Stages);
    console.log(JSON.stringify(StageListResponse.body.Stages));
  };


  //   fetch combo values

  
  const[resbody,setresbody]= useState([]);
  const LoadCombo = async () => {
      // Update state with incremented value

      const opt = '|STGTY|';
      const optw = '';
  // 

  const Response = await FetchCombodata(opt,optw);

      setresbody(Response.body.stgty)
      console.log('rerendering method')
  }; 



  
  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();   
  }, []);

  useEffect(() => {    
  }, [IsCustomScr]);



  // Event function start


  const ScreenOnChange = (e) => {  
    
       setScreenid(e.target.value);
      FetchAllStageList(e.target.value);
  };


  const onSubmitHandler = async (data) => {
    
     let StageId = data.txtStageId;
    
       if(data.txtStageId==undefined)
       StageId = "0";

    let frmData = { txtStageId:StageId, txtScreenId:Screenid,txtStageName:data.txtStageName,ntxtOrd:data.ntxtOrd, cmbStageTypeId :data.cmbStageTypeId ,txtStageFile : data.txtStageFile};

    const UpdStageMaster = apiendpoints.UpdStageMaster;

    console.log(frmData);


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
        UpdStageMaster,
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
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          ResetScreenValue();
          FetchAllStageList(Screenid);          
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


  //---------------onSubmitHandler end------

  

  
  function SetScreenValue(rowval)  
  {
  

    console.log(rowval);

    reset({ txtStageId: rowval.StageId, txtStageName: rowval.StageName, ntxtOrd : rowval.Ord,
      cmbStageTypeId : rowval.StageTypeId  , txtStageFile: rowval.StageFile })  

     
  
  }

  function ResetScreenValue()  
  {
    
    reset({ txtStageId: "", txtStageName: "",ntxtOrd:"",cmbStageTypeId:"",txtStageFile:""})    

  }

  const CheckboxhandleChange = (e) => {
    console.log(e);
  



     if (e.target.value == true) 
      {
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
                <strong className="card-title">Create New Stage</strong>
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
                        <label htmlFor="txtStageId" className="form-label">
                          {" "}
                          Stage Id
                        </label>
                        <input
                          {...register("txtStageId")}
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
                        <label htmlFor="txtStageName" className="form-label">
                          {" "}
                          Stage Name
                        </label>
                        <input
                          {...register("txtStageName")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtStageName?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="ntxtOrd" className="form-label">
                          {" "}
                          Stage Order
                        </label>
                        <input
                          {...register("ntxtOrd")}
                          type="text"
                          className="form-control"
                          
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                      <label htmlFor="cmbStageTypeId" className="form-label">
                          {" "}
                          Stage Type Id (1-Normal 2 - Auto Run )
                        </label>
                        <select {...register("cmbStageTypeId")}  className="form-control"  onChange={""}> 
                                            <option value="0">- Select -</option>
                                            {                                                         
                                                        resbody.map((res) => 
                                                        (<option key={res.k} value={res.k}>{res.v}</option>))
                                            }
                                        </select>
                        <p>{errors.cmbStageTypeId?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                      <label htmlFor="txtStageFile" className="form-label">
                          {" "}
                          Stage File
                        </label>
                        <input
                          {...register("txtStageFile")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtStageFile?.message}</p>
                      </div>
                    </div>
                  </div>


                
                  
                  
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Stage Id</th>                  
                    <th>Stage</th>
                    <th>Order</th>
                    <th>Type</th>
                    <th>File Name</th>
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
                  {stageresbody && stageresbody.map((x) => {
                    return (
                      <tr>
                        <td>{x.StageId}</td>
                        <td>{x.StageName}</td>
                        <td>{x.Ord}</td>

                        <td>
                            
                            {
                             resbody.find((res) => (res.k == x.StageTypeId))
                               .v
                           } 
 
 
                         </td>           
                        <td>{x.StageFile}</td>
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

export default StageMaster;