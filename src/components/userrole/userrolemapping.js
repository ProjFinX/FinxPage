import React from 'react';
import CheckboxTree from 'react-checkbox-tree';
import { useState ,useEffect} from 'react';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
// import "font-awesome/css/font-awesome.min.css";
import db from "./data.json";
import {UserBranchRoleMapNodeSource} from "./nodesourse"
import {UserBranchRoleNodeChecked} from "./nodechecked"
import {UserBranchRoleNodetojson} from "./convertnodetojson"



import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from  "yup";
import api from "../api/Webcall";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";

import { GetRoleList } from "../utilities/getrolelist";
import { GetBranchList } from "../utilities/getbranchlist";
import { GetUserList } from '../utilities/getuserlist';


// Yup validation schema 

const schema = yup.object().shape({
   // txtRoleName: yup.string().required("Role name can not be empty").max(50,"Role name  Max lenght is 50 ")
});





//Ref

//https://github.com/jakezatecky/react-checkbox-tree/issues/104






const UserRoleMapping=()=>{


  //Fetch Role List from API

  const[roleresbody,setrolelistresbody]= useState([]);

  const FetchRoleList = async () => {

    const RoleListResponse = await GetRoleList();

    setrolelistresbody(RoleListResponse.body.Roles)
  
   
  }; 

  useEffect(() => {
      FetchRoleList();      
  
  },[])

  const[branchresbody,setbranchlistresbody]= useState([]);
  const FetchBranchList = async () => {

    const BranchListResponse = await GetBranchList();

    setbranchlistresbody(BranchListResponse.body.Branches)  
   
  }; 

  useEffect(() => {
    FetchBranchList();     
  },[])

  const[userresbody,setuserlistresbody]= useState([]);
  const FetchUserList = async () => {
    const UserListResponse = await GetUserList(); 
    setuserlistresbody(UserListResponse.body.Users) 
       
    console.log(JSON.stringify(UserListResponse.body.Users));
   
  }; 

  useEffect(() => {
    FetchUserList();       
     
  
  },[])

//-----------------------------



 let newnode = [];  
 let nodecheck = []; 
 if (newnode.length == 0)
 {
  newnode = UserBranchRoleMapNodeSource(branchresbody);
 }






const [checked, setchecked] = useState([]);
const [expanded, setExpand] = useState([]);
const [database, setdb] = useState(newnode);
const [UserId, setUserId] = useState(0);

 


    //const [treenode, settreenode] = useState({});

  


    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
     });

     
    const [alert, setAlert] = useState("");

    const [isLoading , setLoanding]  = useState(false);

   
    useEffect(() => {        
      }, [database]);
      
    const onChange = (e) => {  
       // setchecked(checked=>[...checked,'manager1'])
           

        let id = 0;        
            id = e; 
        let filterbrmap =[];       
        const filtered = userresbody.filter(user => {          
                         return user.UserId == id;
        });

        filterbrmap = filtered[0].BRUMap;  
        console.log(filterbrmap);
        console.log(branchresbody);

        nodecheck= UserBranchRoleNodeChecked(branchresbody,filterbrmap); 

        setchecked(nodecheck);
        setdb(newnode) ; 
        setUserId(id);

      };




 
 const navigate = useNavigate();
 
 const onSubmitHandler = async(data) => {


  console.log("Enter Button submit");
  console.log(checked);
  const nodeconvertjsonres= UserBranchRoleNodetojson(branchresbody,checked);

 

  const frmData = {BRUMap:{ UserId:UserId, Branches:nodeconvertjsonres}};

  console.log(frmData);
  

  setLoanding(true);

  //e.preventDefault();
  /* Header */
  const convID = generateUUID();
  const frmHdr = {
        convid: convID,
        tag: "rolusrmap",
        orgid: "",
        vendid: "0",
  };    

  const reqdata = { hdr: frmHdr, body: frmData }  
  const token =    localStorage.getItem('token');
  const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
  const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
  const createroleurl =  "/cmpstp/rolusrmap";
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
          console.log(strResponse.fdr);    
          ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
          setLoanding(false);
          navigate("/UserRoleMapping");
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


try {
  



    return (

        
        <>
          <section className="vh-100">
            <div className="container h-100">
       
                      <div className="card text-black" style={{ borderRadius: "25px" }}>
                      <div className="card-header">
                        <strong className="card-title">User Role mapping</strong>
                      </div>
                      <div className="card-body p-md-5">                  

                      {isLoading?(<Spinner></Spinner>) :""}                        
                       <Alerts alert={alert} />                 

                     <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">

                     <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                               
                                    <label  className="form-label"> User List</label>
                                    
                                        <select                                        
                                        name="list-box"
                                        size={20} 

                                        className="form-control"
                                        onChange= {e => onChange(e.target.value)}                                        
                                        >                                  
                                        {  //Combo Data binding
                                        userresbody.map((res) => 
                                        (
                                        <option key={res.UserId} value={res.UserId}>{res.Username}</option>
                                        ))
                                        }
                                        
                                    </select> 
                                    </div>
                              </div>
                                   
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtConformPassword" className="form-label"> Branch and Role</label>
                                                <CheckboxTree                      
                                            //nodes={nodes}                        
                                            nodes={database}
                                            checked={checked}
                                            expanded={expanded}
                                            onCheck={(checked) => setchecked(checked)}
                                            onExpand={(expanded) => setExpand(expanded)}
                                            // onClick={(nodes) => settreenode(nodes)}
                                            />
                                   
                                  </div>
                                  
                              </div>                             
                            </div>
                            


                             
                                <br></br>
                                                 
                         

                            <button type="submit" className="btn btn-primary">
                            Submit
                            </button>
                        </form>

                          {console.log(checked)}

                      </div>
                  </div>
                </div>
  
          </section>
          </>
      );

    } catch (error) {

      console.log(error.message)
  
    }
}


export default UserRoleMapping;