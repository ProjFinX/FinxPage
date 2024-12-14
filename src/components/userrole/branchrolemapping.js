import React, { useEffect, useRef } from "react";
import CheckboxTree from 'react-checkbox-tree';
import { useState } from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
// import "font-awesome/css/font-awesome.min.css";
import {BranchRoleMapNodeSource} from "./nodesourse"
import {BranchRoleNodeChecked} from "./nodechecked";
import {BranchRoleNodetojson} from "./convertnodetojson"




import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";

import { GetRoleList } from "../utilities/getrolelist";
import { GetBranchList } from "../utilities/getbranchlist";
import { GetBranchRoleList } from "../utilities/getbranchrolelist";
import { render } from "@testing-library/react";


// Yup validation schema 

const schema = yup.object().shape({
    //txtRoleName: yup.string().required("Role name can not be empty").max(50,"Role name  Max lenght is 50 ")
});



let flag = false;

//Ref

//https://github.com/jakezatecky/react-checkbox-tree/issues/104


const BranchRoleMapping=()=>{


  useEffect(() => {  
    flag = false;
  }, []);


  // useEffect(() => {
  //   window.addEventListener("beforeunload", alertUser);
  //   return () => {
  //     window.removeEventListener("beforeunload", alertUser);
  //   };
  // }, []);
  // const alertUser = (e) => {
  //   e.preventDefault();
  //   e.returnValue = "";
  // };
  
  //Fetch Role List from API

  const[roleresbody,setrolelistresbody]= useState([]);

  const FetchRoleList = async () => {
      // Update state with incremented value

  // debugger;

    const RoleListResponse = await GetRoleList();
   
    //console.log(JSON.stringify(RoleListResponse.body.Roles));
    setrolelistresbody(RoleListResponse.body.Roles)
  
   
  }; 

  useEffect(() => {
      FetchRoleList();      
  
  },[])

  const[branchresbody,setbranchlistresbody]= useState([]);
  const FetchBranchList = async () => {
    
    const BranchListResponse = await GetBranchList();
   
    //console.log(JSON.stringify(BranchListResponse.body.Branches));
    setbranchlistresbody(BranchListResponse.body.Branches)
  
   
  }; 

  useEffect(() => {
    FetchBranchList();       
     
  
  },[])


  const[branchroleresbody,setbranchrolelistresbody]= useState([]);
  const FetchBranchRoleList = async () => {
    
    const BranchRoleListResponse = await GetBranchRoleList();
   
    console.log(JSON.stringify(BranchRoleListResponse.body));
    setbranchrolelistresbody(BranchRoleListResponse.body)
  
   
  }; 

  useEffect(() => {
    FetchBranchRoleList();       
     
  
  },[])

//-----------------------------



 let newnode = [];  
 let nodecheck = []; 




  newnode = BranchRoleMapNodeSource(branchresbody,roleresbody);
  nodecheck= BranchRoleNodeChecked(branchresbody); 
  
 

const [checked, setchecked] = useState([]);
const [expanded, setExpand] = useState([]);
const [database, setdb] = useState([]);





console.log(nodecheck.length)

if (nodecheck.length>0 && flag == false  )
{
  console.log("render");
  setdb(newnode);
  setchecked(nodecheck);
  flag = true;
}

    //const [treenode, settreenode] = useState({});


    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
     });

     
    const [alert, setAlert] = useState("");

    const [isLoading , setLoanding]  = useState(false);

         
 
 const navigate = useNavigate();
 const onSubmitHandler = async(data) => {

      console.log("Enter Button submit");
      console.log(checked);
      const nodeconvertjsonres= BranchRoleNodetojson(branchresbody,checked);

     

      const frmData = {BRM:nodeconvertjsonres};

      console.log(frmData);

       setLoanding(true);

  //e.preventDefault();
  /* Header */
  const convID = generateUUID();
  const frmHdr = {
        convid: convID,
        tag: "brcrolmap",
        orgid: "",
        vendid: "0",
  };    
  
  const reqdata = { hdr: frmHdr, body: frmData }  
  const token =    localStorage.getItem('token');
  const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
  const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
  const createroleurl =  "/cmpstp/brcrolmap";
  console.log(reqHdr)
  try {
    //debugger;
    const response = await api.post(createroleurl, compressBase64(reqdata),reqHdr);
   // const response = await PostCallHeader(createbranchnurl, compressBase64(reqdata),reqHdr);
   
     const strResponse = JSON.parse(decompressBase64(response.data));

    console.log(strResponse);

    if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {             
         ShowAlert("Error", JSON.stringify(strResponse.fdr));
         setLoanding(false);
    } else {
          ShowAlert("Error", JSON.stringify(strResponse.fdr));
          setLoanding(false);
          navigate("/Home");
    }
  } catch (err) {
  
    console.log(err.message);     
    ShowAlert("Error", "Unable to process request")
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
       
                      <div className="card text-black" style={{ borderRadius: "25px" }}>
                      <div className="card-header">
                        <strong className="card-title">Branch Role mapping</strong>
                      </div>
                      <div className="card-body p-md-5">  

                      

                      {isLoading?(<Spinner></Spinner>) :""}                        
                       <Alerts alert={alert} />                 

                     <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                     <CheckboxTree   
                        showExpandAall="true"                  
                      // nodes={newnode}                        
                       nodes={database}
                       checked={checked}
                       // checked={nodecheck}
                    
                        expanded={expanded}
                        onCheck={(checked) => setchecked(checked)}
                        onExpand={(expanded) => setExpand(expanded)}
                       
                        // onClick={(nodes) => settreenode(nodes)}
                         />

                        <br></br>
                                                 
                         

                            <button type="submit" className="btn btn-primary">
                            Submit
                            </button>
                        </form>

                          {console.log(database)}
                          {console.log(checked)}
                          

                      </div>
                  </div>
                </div>
  
          </section>
          </>
      );
}


export default BranchRoleMapping;