import React from "react";
import CheckboxTree from "react-checkbox-tree";
import { useState, useEffect } from "react";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { GetAllScreenList } from "../utilities/getallscreen";
import {GetscreenList,GetScreenRole } from "../utilities/getmenulist";
import { GetBranchList } from "../utilities/getbranchlist";
import { GetAllStageList } from "../utilities/getallstage";
import {
  StageBranchRoleMapNodeSource
} from "./treenodesource";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

//Ref
//https://react-bootstrap.github.io/components/modal//

let count = 0;

const getNodeIds = (nodes) => {
  let ids = [];

  nodes?.forEach(({ value, children }) => {
    ids = [...ids, value, ...getNodeIds(children)];
  });

  return ids;
};

const schema = yup.object().shape({
  
});


let menunode = [];
let rolenode = [];

function MngStageRole() {

  


  var menudetails;
  let menures;
  

  let sourcearr = [];
  let nodecheck = [];


  const [roleexpanded, setRoleExpand] = useState([]);
  const [rolechecked, setRolechecked] = useState([]);
  const [Screenid, setScreenid] = useState(0);
  const [StageId, setStageId] = useState('')
  const [StageName, setStageName] = useState('')



  const [isLoading, setLoanding] = useState(false);

  // GetScreen and Stage
  const [ScreenList, setScreenList] = useState([]);
 

  const FetchScreenList = async () => {

    const StageListResponse = await GetscreenList();
    console.log('StageListResponse',StageListResponse.body.scrstgs)
     setScreenList(StageListResponse.body.scrstgs);

    // const ScreenListResponse = await GetAllScreenList();
    // console.log('ScreenListResponse',ScreenListResponse.body.Screens)
    //  setScreenList(ScreenListResponse.body.Screens.filter((res) => res.IsActive==true));
  };


    
  // Get Branch List

  const [branchresbody, setbranchlistresbody] = useState([]);
  const FetchBranchList = async () => {
    const BranchListResponse = await GetBranchList();

    console.log('BranchListResponse',BranchListResponse.body.Branches)
    setbranchlistresbody(BranchListResponse.body.Branches);
  };

  useEffect(() => {
    FetchScreenList();
    FetchBranchList();
    
  }, []);


// Stage Branch Role Map
  const [SBRMap, setSBRMap] = useState([]);
  const FetchScreenRole = async (scrid) => {
    console.log(scrid);
    const ScreenRoleResponse = await GetScreenRole(scrid);
    console.log(ScreenRoleResponse);
    setSBRMap(ScreenRoleResponse.body.SBRMap);
  };
  


  const [StageList, setStageList] = useState([]);
  const [stageresbody, setstagelistresbody] = useState([]);

  // rerender the stage list
  useEffect(() => {  
    // Role list 
    
  }, [StageList]);

//  Screen combo change event function

  const onScreenChange=(ScreenId)=>{  
    
    
    if (ScreenId=='')
    {
     return;
    }
       
    const  stagelistarr =  ScreenList.find(screenitem => screenitem.ScrId== ScreenId)         
    setStageList(stagelistarr.Stages) ;
    
    let checkednodearr=[]; 
    setRolechecked(checkednodearr)

        
    console.log(ScreenId);
       setScreenid(ScreenId);
      // FetchAllStageList(e.target.value);
       FetchScreenRole(ScreenId);

  }

  
 
  const FetchAllStageList = async (screenid) => {
    console.log(screenid);
    const StageListResponse = await GetAllStageList(screenid);
    setstagelistresbody(StageListResponse.body.Screens);
    console.log(JSON.stringify(StageListResponse.body.Screens));
  };


  // Stage on change event function 
  const onStageChange=(Stageid)=>{        
      let Rolearr=[]; 
      let checkednodearr=[]; 
      let Expandnodearr=[];
      console.log(StageList) 
      setStageId(Stageid);
    

     let stagearr = StageList.filter(stageitem => stageitem.StgId== Stageid);
      setStageName(stagearr[0].StgName)
      
      
      
      console.log(SBRMap);

      let  stagerolearr =  SBRMap.filter(stageitem => stageitem.StageId== Stageid);  

      console.log(stagerolearr);

       if (stagerolearr==undefined)
       {
        setRolechecked(checkednodearr);
        return
       }

      Rolearr = stagerolearr[0].Rights; 
      


      Rolearr.forEach(arritem =>{  
        
            let BRMapId =   arritem.BRMapId;
            let RWFlag = arritem.Flag;

            Expandnodearr.push(BRMapId)
           
            if (RWFlag == 'WR'||RWFlag == 'RW' )
            {
              checkednodearr.push(BRMapId+'-W')
              checkednodearr.push(BRMapId+'-R')
            }
            if (RWFlag == 'W' )
            {
              checkednodearr.push(BRMapId+'-W')              
            }
            if (RWFlag == 'R' )
            {
              checkednodearr.push(BRMapId+'-R')
            }

      }

     
      )

      Expandnodearr.push(checkednodearr)

      console.log(checkednodearr) 
      console.log(Expandnodearr) 
      //console.log(getNodeIds(rolenode)) 

     //debugger;
      setRoleExpand(getNodeIds(rolenode));
      //setRolechecked(getNodeIds(rolenode));
      
      setRolechecked(checkednodearr);
   
      


}





  if ( rolenode.length ==0  ) {       
       rolenode = StageBranchRoleMapNodeSource(branchresbody);
    console.log(rolenode);
  }


 


  // Add Role Popup
  useEffect(() => {    
    //setRoleExpand(getNodeIds(rolenode));
  }, [rolechecked]);
  


  //---------------------------------------------




  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema)
   
  });

  const [alert, setAlert] = useState("");

  

  //Update Role change for the selected menu


  const onSubmitHandler = async (data, e) => {

    try {

    e.preventDefault();
    console.log(data);
    console.log("Enter Save role ");

    let frmData = {};
    let Rights = [];

    let UpdateStageRoleRights = apiendpoints.UpdateStageRoleRights;

       let SBRMap = [];
      
     
       rolechecked.forEach(arritem =>{  
          
        let  BRMapId;
        let  RWFlag;
        let Right={};
        let    nodearr =  arritem.split("-");
            if (nodearr.length == 2) {
              BRMapId = nodearr[0];
              RWFlag = nodearr[1];
            }

           //let preflag = Rights.find((res) => (res.BRMapId == BRMapId)).Flag

           let  objIndex = Rights.findIndex(obj => obj.BRMapId == BRMapId); 
           console.log("objIndex ", objIndex)
           if (objIndex !=-1)
           {
            Rights[objIndex].Flag = Rights[objIndex].Flag +  RWFlag;
           }
          else
          {
            Right = {BRMapId:BRMapId,Flag:RWFlag}
            Rights.push(Right)
          }  
       })

      

       let StgId = {StgId:StageId,Rights:Rights}

       SBRMap.push(StgId);

      frmData = {  SBRMap: SBRMap };
        
    console.log(JSON.stringify(frmData) );

    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "UpdateStageRoleRights",
      orgid: "",
      vendid: "0",
    };

    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqHdr);
    try {
      //debugger;
      const response = await api.post(
        UpdateStageRoleRights,
        compressBase64(reqdata),
        reqHdr
      );      

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr));
        setLoanding(false);
      } else {

        setTimeout(() => {
          
       
        console.log(strResponse.fdr);
        ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));         
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
            
          }, 600);
       
          setRolechecked([]);
          setRoleExpand([]);
          reset({
            txtStageId: "",
            txtStagename: "",
          });

          FetchScreenRole(StageId);

        setLoanding(false);
      }, 300);
      }
    } catch (err) {
      console.log(err.message);
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }

  } catch (error) {

    ShowAlert("Error", error.message);
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
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div
                  className="card text-black"
                  style={{ borderRadius: "25px" }}
                >
                  <div className="card-body p-md-5">                   

                    <div></div>
                    <div className="row justify-content-center">
                      <div className="row">
                        <div className="col-sm">
                          <div className="mb-3">
                            <p className="text-left h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                             Manage Stage role rights
                            </p>

                            <div className="col-sm">
                                  <div className="mb-3">                                   
                                    <label htmlFor="cmbScrId" className="form-label">Screen</label>
                                    <select {...register("cmbScrId")}  className="form-control" 
                                    // onChange= {onScreenChange}  
                                    onChange= {e => onScreenChange(e.target.value)}
                                    > 
                                    <option value="0">- Select -</option>
                                    {  //Combo Data binding
                                    ScreenList &&  ScreenList.map((res) => 
                                    (
                                      <option key={res.ScrId} value={res.ScrId}>
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
                               
                                    <label  className="form-label"> Stage List</label>
                                    
                                        <select                                        
                                        name="list-box"
                                        size={20} 

                                        className="form-control"
                                        onChange= {e => onStageChange(e.target.value)}                                        
                                        >                                  
                                        
                                      {  //Combo Data binding
                                        StageList && StageList.map((res) => 
                                        (
                                        <option key={res.StgId} value={res.StgId}>{res.StgName}</option>
                                        ))
                                        }
                                        
                                    </select> 
                                    </div>
                              </div>

                           
                          </div>
                        </div>
                        <div className="col-sm">
                          <div className="mb-3">
                            <p className="text-center h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                              Role
                            </p>
                            <div>
                         {isLoading ? <Spinner></Spinner> : ""} 
                         </div>
                            <Alerts alert={alert} />
                            <form
                              onSubmit={handleSubmit(onSubmitHandler)}
                              autocomplete="off"
                            >
                              <div className="row">
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <input
                                      {...register("txtStageId")}
                                      type="text"
                                      className="form-control"
                                      id="txtStageId"
                                      disabled
                                      placeholder="Stage Id"
                                      value={StageId}
                                    />
                                    <p>{errors.txtStageId?.message}</p>
                                  </div>
                                </div>
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <input
                                      {...register("txtStagename")}
                                      type="text"
                                      className="form-control"
                                      id="txtStagename"
                                      disabled
                                      placeholder=" Name"
                                      value={StageName}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <CheckboxTree
                                      //nodes={nodes}
                                      nodes={rolenode}
                                      checked={rolechecked}
                                      expanded={roleexpanded}
                                      onCheck={(checked) =>
                                        setRolechecked(checked)
                                      }
                                      onExpand={(expanded) =>
                                        setRoleExpand(expanded)
                                      }

                                      // onClick={(nodes) => settreenode(nodes)}
                                    />
                                     
                                  </div>
                                </div>
                              </div>

                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
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

export default MngStageRole;
