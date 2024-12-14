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
import { GetAllTaskElementList } from "../utilities/getallTaskElementList";
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
  txtHeader: yup.string().required("Pls provide Header Name"),
});

//rfce - command
function TaskElement() {
  // Const & Var

  const [Taskresbody, settasklistresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);
  const [UserStatusMaster, setUserStatusMaster] = useState([]);
  const [UserStatus, setUserStatus] = useState([]);
  const [childelms, setscrchildelms] = useState([]);
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


  const FetchAllTaskList = async (screenid) => {
    
    const TaskListResponse = await GetAllTaskElementList(screenid);
    console.log(JSON.stringify(TaskListResponse.body.tskcols));
     settasklistresbody(TaskListResponse.body.tskcols);
    
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
      FetchAllTaskList(e.target.value);
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


  const onSubmitHandler = async (data) => {
    
     let StageId = data.txtTaskElmentId;
    
       if(data.txtTaskElmentId==undefined)
       StageId = "0";

    let frmData = { txtTLEId:StageId, cmbScrId:Screenid,txtHdr:data.txtHeader,txtOrd:data.txtOrder, cmbElmId :data.cmbStageTypeId};

    const UpdTaskElement = apiendpoints.UpdTaskElement;

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
        UpdTaskElement,
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
          FetchAllTaskList(Screenid);          
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

    reset({ txtTaskElmentId: rowval.tleid, txtHeader: rowval.hdr, txtOrder : rowval.ord,
      cmbStageTypeId : rowval.elmid   })  

     
  
  }

  function ResetScreenValue()  
  {
    
    reset({ txtTaskElmentId: "", txtHeader: "",txtOrder:"",cmbStageTypeId:""})    

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
                <strong className="card-title">Create Task Element</strong>
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
                        <label htmlFor="txtTaskElmentId" className="form-label">
                          {" "}
                          Task Element Id
                        </label>
                        <input
                          {...register("txtTaskElmentId")}
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
                        <label htmlFor="txtHeader" className="form-label">
                          {" "}
                          Header
                        </label>
                        <input
                          {...register("txtHeader")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtHeader?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="ntxtOrd" className="form-label">
                          {" "}
                          Element
                        </label>
                        <select {...register("cmbStageTypeId")}  className="form-control"  onChange={""}> 
                                            <option value="0">- Select -</option>
                                            {                                                         
                                                        childelms.map((res) => 
                                                        (<option key={res.k} value={res.k}>{res.v}</option>))
                                            }
                                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                      <label htmlFor="txtOrder" className="form-label">
                          {" "}
                          Order
                        </label>
                        <input
                          {...register("txtOrder")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtOrder?.message}</p>
                   
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                    
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
                    <th>ID</th>       
                    <th>Header</th>                  
                    <th>Element</th>
                    <th>Order</th>                    
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
                  {Taskresbody && Taskresbody.map((x) => {
                    return (
                      <tr>
                        <td>{x.tleid}</td>
                        <td>{x.hdr}</td>
                        <td>{x.elmid}</td>
                        {/* <td>{ childelms.filter((res) => res.k==x.elmid)}</td> */}
                        <td>{x.ord}</td>

                         
                       
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

export default TaskElement;