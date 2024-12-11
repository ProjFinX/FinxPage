import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";

import { GetRoleList } from "../utilities/getrolelist";
import Table from 'react-bootstrap/Table';

// //https://dev.to/fromwentzitcame/working-with-tables-in-react-how-to-render-and-edit-fetched-data-5fl5


const schema = yup.object().shape({
    txtRoleName: yup.string().required("Role name can not be empty").max(50,"Role name  Max lenght is 50 ")
});


// Function Component Role

const Role = () => {

      
        const [roles, setRoles] = useState({ txtRoleId: "", txtRoleName: ""});

        const { register, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema), defaultValues: roles
         });

        
    
         
        const [alert, setAlert] = useState("");

        const [roleid, setRoleid] = useState(0);

        const [isLoading , setLoanding]  = useState(false);

                      
     
     const navigate = useNavigate();

    //Fetch Role List from API

            const[roleresbody,setrolelistresbody]= useState([]);
            const FetchRoleList = async () => {
                // Update state with incremented value

            // debugger;

              const RoleListResponse = await GetRoleList();
             
              console.log(JSON.stringify(RoleListResponse.body.Roles));
              setrolelistresbody(RoleListResponse.body.Roles)
            
             
            }; 

            useEffect(() => {
                FetchRoleList(); 
                console.log('rerendering')
               
            
            },[roleid])


       //-----------------------------


     const onSubmitHandler = async(data,e) => {
      
      e.preventDefault();
      setLoanding(true);
      console.log("Enter Create new branch api call");
      console.log(data);
      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
            convid: convID,
            tag: "NewRole",
            orgid: "",
            vendid: "0",
      };    
      const frmData = data;
      const reqdata = { hdr: frmHdr, body: frmData }  
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      const createroleurl =  "/cmpstp/mngrole";
      console.log(reqHdr)
      try {
        //debugger;
        const response = await api.post(createroleurl, compressBase64(reqdata),reqHdr);
       // const response = await PostCallHeader(createbranchnurl, compressBase64(reqdata),reqHdr);
       
         const strResponse = JSON.parse(decompressBase64(response.data));

        console.log(strResponse);
        
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {             
             ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
             setLoanding(false);
        } else {
              ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
              setLoanding(false);
            //  navigate("/Home");
        }
      } catch (err) {
      
        console.log(err.message);     
        ShowAlert("Error", "Unable to process request")
        setLoanding(false);
        
      }
    };


    function SetRoleValue(rowval)  
    {
    


      //setRoles({ txtRoleId: rowval.RoleId, txtRoleName: rowval.RoleName})  ;
      reset({ txtRoleId: rowval.RoleId, txtRoleName: rowval.RoleName})  
    
      setRoleid(rowval.RoleId)

      console.log(handleSubmit);

    }

    function ResetRoleValue()  
    {
      
      reset({ txtRoleId: "", txtRoleName: ""})    

    }

    
    
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
                        <strong className="card-title">Create New Role</strong>
                      </div>
                      <div className="card-body p-md-5">

                      {isLoading?(<Spinner></Spinner>) :""}                        
                       <Alerts alert={alert} />                      

                        <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                        <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtRoleName" className="form-label"> Role Name</label>
                                    <input {...register("txtRoleName")} type="text" className="form-control"   />
                                    <p>{errors.txtRoleName?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                  <label htmlFor="txtRoleId" className="form-label"> Role Id</label>
                                  <input {...register("txtRoleId")} type="text" className="form-control" disabled="disabled"  readonly="readonly" />      
                                  </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3"> 
                                 
                                    <input {...register("cbIsActive")}  type="checkbox" defaultChecked="true" /> &nbsp; 
                                    <label htmlFor="cbIsActive" className="form-label">Active</label>
                                    <p>{errors.cbIsActive?.message}</p>                             
                                                                
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
                              <th>Id</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th><button  className="btn btn-success" onClick={() => {  
                                    ResetRoleValue();                                                 
                                    }} > <i className="bi bi-table"></i> Add </button></th>
                            </tr>
                          </thead>
                          <tbody>
                           
                          {
                                roleresbody.map(x=> {
                                  return(
                                      <tr>
                                  <td>{x.RoleId}</td>
                                  <td>{x.RoleName}</td>
                                  <td>{x.BRUMapStatus}</td>
                                  <td> 
                            
                                    <button className="btn btn-primary"   onClick={() => {   

                                                  SetRoleValue(x);                                                 
                                                }} >  <i className="bi bi-pen"></i> Edit</button></td>
                                 
                                </tr>
                                  )} )}
                          </tbody>
                        </Table>
                  </div>
                {/* </div>
            </div> */}
            </div>
          </section>
    </>
  );

} catch (error) {

  console.log(error.message)
    
}

};

export default Role;