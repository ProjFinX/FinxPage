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
import { GetStgEleCmb,GetEvntExGrpMap } from "../utilities/GetStgScrElements";
import { GetExpGrpLst } from "../utilities/geteventexpression";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";
import { GetExpressiontree,GetEventTree } from "../utilities/getScrexpresiontree";
import { GetStgElmEvntCmb } from "../utilities/GetStgElmEvntCmb";



import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json";

const apiendpoints = appsettings.ApiEndpoints;

const CompanyId = localStorage.getItem("CompanyId");

const schema = yup.object().shape({
  cmbScrId: yup.string().required("Pls Select  Secreen "),
});

//rfce - command
function EventExpGroupMapping() {
  // Const & Var

  console.log("Page rendered");

  const [stageresbody, setstagelistresbody] = useState([]);
  const [StageElementresbody, setStageElementlistresbody] = useState([]);
  const [Stageid, setStageid] = useState(0);
  const [stagefilterlist, setstagefilterlist] = useState([]);
  const [ExpGrpresbody, setExpGrpresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);

  const [Screenid, setScreenid] = useState(0);
  const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [treedata, settreedata] = useState([]);
  const [actualtreedata, setactualtreedata] = useState([]);
  const [GroupExpid, setGroupExpid] = useState(0);

  const [selectedGrpExp, setselectedGrpExp] = useState([]);
  const [EvntList, setEvntList] = useState([]);
  const [Elementid, setElementid] = useState(0);

  
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // General Function

  
  const FetchStageElementList = async (stagid) => {
    const ElementListResponse = await GetStgEleCmb(Screenid,stagid);
    //setStageElementlistresbody(ElementListResponse.body.stgelm);

    setstagefilterlist(ElementListResponse.body.stgelm);
  };

  const FetchStageElmEvntCmb = async (ElementId) => {
    const ElementListResponse = await GetStgElmEvntCmb(Screenid,Stageid,ElementId);
   
    const obj = ElementListResponse.body.elmevnt;

    setEvntList( Array.isArray(obj)?obj:null);
  };

  

  const FetchEvntExGrpMap = async (EventId) => {
    
    const ElementListResponse = await GetEvntExGrpMap(Screenid,Stageid,Elementid,EventId);   

    console.log(ElementListResponse);
    
    const obj = ElementListResponse.body.expgrps;

    console.log(ElementListResponse.body.expgrps);

    console.log(obj);
    
    var mapgrp = [];
    let i;



    for (i = 0; i < obj.length; i += 1) {
     
      var value = [];
       value = ExpGrpresbody.filter(function(item) {
        return item.egid == obj[i].exgrpid
      })

       mapgrp.push(value[0]);

      }
      console.log(mapgrp);
      
      setselectedGrpExp(mapgrp)

      console.log(selectedGrpExp);

   // setEvntList( Array.isArray(obj)?obj:null);
  };


  

  const FetchAllStageList = async (screenid) => {
    const StageListResponse = await GetAllStageList(screenid);
    setstagelistresbody(StageListResponse.body.Stages);
    console.log(JSON.stringify(StageListResponse.body));
  };

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenfilterlist(
      ScreenListResponse.body.Screens.filter((res) => res.IsActive == true)
    );
  };

  const FetchExpGrpList = async (screenid) => {
    const ExpGrpListResponse = await GetExpGrpLst(screenid);
    setExpGrpresbody(ExpGrpListResponse.body.expressions);
  };

  const FetchEventtree = async (screenid) => {
    const FetchExpGrpListtree = await GetEventTree(screenid);

    const expreres = FetchExpGrpListtree.data;
    settreedata(expreres.menutree);
    setactualtreedata(expreres.expresponse);
  };

  //   fetch combo values

  const [resbody, setresbody] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|SETM|";
    const optw = "";
    // 

    const Response = await FetchCombodata(opt, optw);

    setresbody(Response.body.setm);
    console.log(Response.body);
  };

  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();
  }, []);

  // Event function start

  const ScreenOnChange = (e) => {
    setScreenid(e.target.value);
    FetchAllStageList(e.target.value);
    FetchExpGrpList(e.target.value);
    FetchEventtree(e.target.value)
    //settreedata([]);
  };

  const StageOnChange = (e) => {
    let id = "";
    id = e.target.value;

    setStageid(e.target.value);   
    FetchStageElementList(id);
 
  };

  const ElementOnChange = (e) => {
    let id = "";
    id = e.target.value;

    setElementid(e.target.value);   
    FetchStageElmEvntCmb(id);
 
  };

  const getEvntExGrpMap = (e) => {
    let id = "";
    id = e.target.value;

    setElementid(e.target.value);   
    FetchEvntExGrpMap(id);
 
  };





  //--------------------------------------------------------------------------------------------------------


  // - Delete element

  const onSubmitHandler = async (data) => {
    console.log(data);

    var Expgrps = [];        
   let i,ord;

    for (i = 0; i < selectedGrpExp.length; i += 1) {
        ord = i + 1;
         var objgroup = { exgrpid: selectedGrpExp[i].egid, ord: ord };
         Expgrps.push(objgroup);
    }


    let frmData = {
      cmbScrId: data.cmbScrId,
      cmbStgId: data.cmbStgId,
      cmbStgElmDsigId: data.cmbStgElmDsigId,
      cmbEvntId: data.cmbEvntId,
      expgrps: Expgrps
    };

    const Updexgrpmap = apiendpoints.Updexgrpmap;

    console.log(frmData);

 
    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "UpdateExpression",
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
        Updexgrpmap,
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
          toast.success("Successfully expression updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          ResetScreenValue();

          setScreenid(data.cmbScreenId);
          FetchExpGrpList(data.txtExprGroupId);
          setselectedGrpExp([]);

          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };

 

  //---------------onSubmitHandler end------

  function AddParentExpression(rowval) {
    reset({
      txtSeExprnId: "",
      txtParentSeExprnId: "0",
      cmbSeExprType: 0,
      txtExpression: "",
    });
  }

  function Assigngrouplist(rowval) {
    console.log(rowval);
   // FetchExpGrpListtree(Screenid, rowval.egid);
    

    var objgroup = { egid: rowval.egid, egname: rowval.egname };

    let  tmpselectedGrpExp = [...selectedGrpExp] ;
   
    tmpselectedGrpExp.push(objgroup);

    setselectedGrpExp(tmpselectedGrpExp);

   console.log(selectedGrpExp);

  
  }

  const DeleteGroup = async (rowval) => {
    let frmData = { cmbScrId: Screenid, txtExprGroupId: rowval.egid };

    const idToRemove = rowval.egid;

    setselectedGrpExp(
      selectedGrpExp.filter((item) => item.egid !== idToRemove)
    );
  };

//https://codepen.io/itwasmattgregg/pen/OJXXaKR

const handleMoveUp = (index) => {
  if (index === 0) return; // Row is already at the top

  setselectedGrpExp(prevRows => {
    const newRows = [...prevRows];
    const temp = newRows[index];
    newRows[index] = newRows[index - 1];
    newRows[index - 1] = temp;
    return newRows;
  });
};

const handleMoveDown = (index) => {
  if (index === selectedGrpExp.length - 1) return; // Row is already at the bottom

  setselectedGrpExp(prevRows => {
    const newRows = [...prevRows];
    const temp = newRows[index];
    newRows[index] = newRows[index + 1];
    newRows[index + 1] = temp;
    return newRows;
  });
};

  function ResetScreenValue() {
    reset({
      cmbScrId: "0",
      cmbStgId: "",
      cmbStgElmDsigId: "",
      cmbEvntId: "",
     
    });
    settreedata([]);
  }

  // Event Function End

  // Main Function

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };




  const TreeNode = ({ node }) => {

    const hasChildren = node.children.length > 0;
  
  
    return (

      <div>

  
         <div className="row">
         <div className="col-sm">
         
         <span >  <span className="content" dangerouslySetInnerHTML={{__html: node.name}}></span> 
         </span>
        
        </div>
       
        </div>
        

        {hasChildren && (
          <ul>
            {node.children.map(childNode => (
              <li key={childNode.id}>
                <TreeNode node={childNode} />
              </li>
            ))}
          </ul>
        )}
       
      </div>
    );
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
                <strong className="card-title">
                  Event & Expression Group Mapping{" "}
                </strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <div className="row">
                  <div className="col-sm-8">
                    <div className="mb-3">
                      <form                      
                        autocomplete="off"
                      >

                      <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">

                        <label htmlFor="cmbScrId" className="form-label">
                          Screen
                        </label>
                        <select
                          {...register("cmbScrId")}
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
                        <p>{errors.cmbScrId?.message}</p>
                        </div>
                          </div>
                          <div className="col-sm">
                            <div className="mb-3">
                        <label htmlFor="cmbStgId" className="form-label">
                          Stage
                        </label>
                        <select
                          {...register("cmbStgId")}
                          className="form-control"
                          onChange={StageOnChange}
                        >
                          <option value="0">- Select -</option>
                          {
                            //Combo Data binding
                            stageresbody &&
                              stageresbody.map((x) => (
                                <option key={x.StageId} value={x.StageId}>
                                  {x.StageName}
                                </option>
                              ))
                          }
                        </select>
                        <p>{errors.cmbStgId?.message}</p>
                        </div>
                          </div>
                          </div>
                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="cmbStgElmDsigId"
                                className="form-label"
                              >
                                Stage Element
                              </label>
                              <select
                                {...register("cmbStgElmDsigId")}
                                className="form-control"
                                  onChange={ElementOnChange}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding
                                  stagefilterlist &&
                                    stagefilterlist.map((x) => (
                                      <option
                                        key={x.k}
                                        value={x.k}
                                      >
                                        {x.v}
                                      </option>
                                    ))
                                }
                              </select>
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="cmbEvntId"
                                className="form-label"
                              >
                                Element Event
                              </label>
                              <select
                                {...register("cmbEvntId")}
                                className="form-control"
                                onChange={getEvntExGrpMap}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding
                             
                                  EvntList &&
                                  EvntList.map((x) => (
                                      <option
                                        key={x.k}
                                        value={x.k}
                                      >
                                        {x.v}
                                      </option>
                                    ))
                                } 
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-6">
                            <div className="mb-3">
                              <Scrollbar style={{ height: 500 }}>
                                <Table striped bordered hover>
                                  <thead>
                                    <tr>
                                      <th>Select Group Name</th>
                                      <th></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ExpGrpresbody &&
                                      ExpGrpresbody.map((x) => {
                                        return (
                                          <tr>
                                            <td>{x.egname}</td>

                                            <td>
                                              <button
                                                type = "button"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                  Assigngrouplist(x);
                                                }}
                                              >
                                                {" "}
                                                <i className="bi bi-arrow-right"></i>
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
                          <div className="col-sm-6">
                            <div className="mb-3">
                              <Table striped bordered hover>
                                <thead>
                                  <tr>
                                    <th>Selected Group Name</th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedGrpExp &&
                                  
                                    selectedGrpExp.map((x,index) => {
                                      
                                      return (
                                        <tr>
                                          <td>{x.egname}</td>

                                          <td>
                                            <button
                                              className="btn btn-success"
                                              onClick={() => {
                                                handleMoveUp(index);
                                              }}
                                            >
                                              {" "}
                                              <i className="fa fa-arrow-up"></i>
                                            </button>
                                          </td>

                                          <td>
                                            <button
                                              className="btn btn-success"
                                              onClick={() => {
                                                handleMoveDown(index);
                                              }}
                                            >
                                              {" "}
                                              <i className="fa fa-arrow-down"></i>
                                            </button>
                                          </td>
                                         
                                          <td>
                                            <button
                                              className="btn btn-danger"
                                              onClick={() => {
                                                DeleteGroup(x);
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

                              <button
                                type="submit"                               
                                class="btn btn-primary"
                                onClick={handleSubmit(onSubmitHandler)}
                              >
                                Save Mapping
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="mb-3">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          AddParentExpression();
                        }}
                      >
                        {" "}
                        <i className="bi bi-table"></i> Tree Root
                      </button>
                      <div>.</div>
                      <div>
                         <Scrollbar style={{ height: 700 }}>
                          {treedata.map((node) => (
                             <TreeNode key={node.id} node={node} />
                          ))}
                        </Scrollbar> 
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <div className="row"></div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default EventExpGroupMapping;
