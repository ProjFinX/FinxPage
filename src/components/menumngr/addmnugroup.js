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

import { GetMenuItems} from "../utilities/getmenulist";
import appsettings from "../../appsettings.json"

import Table from 'react-bootstrap/Table';


const apiendpoints = appsettings.ApiEndpoints;
// //https://dev.to/fromwentzitcame/working-with-tables-in-react-how-to-render-and-edit-fetched-data-5fl5


const schema = yup.object().shape({
   txtMnuGroup: yup.string().required("Role name can not be empty").max(50,"Role name  Max lenght is 50 "),
   txtMnuGroupOrder: yup.string().required("Order can not be empty")
});


// Function Component Role

const MnuGroup = () => {

      
        const [roles, setRoles] = useState({ txtMnuGroupId: "", txtMnuGroup: "",txtMnuGroupOrder:""});

        const { register, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema), defaultValues: roles
         });

        
    
         
        const [alert, setAlert] = useState("");

        const [roleid, setRoleid] = useState(0);

        const [isLoading , setLoanding]  = useState(false);

                      
     
     const navigate = useNavigate();

    //Fetch Role List from API

            const[mnugroupresbody,setmnugroupresbody]= useState([]);

            const FetchMenuGroupList = async () => {
                // Update state with incremented value

            // debugger;

              const MenuGroupListResponse = await GetMenuItems();
             
              console.log(JSON.stringify( MenuGroupListResponse.body.mnugrpitm));
              setmnugroupresbody(MenuGroupListResponse.body.mnugrpitm)           
             
            }; 

            useEffect(() => {
              FetchMenuGroupList(); 
                console.log('rerendering')
               
            
            },[roleid])


       //-----------------------------


       const onSubmitHandler = async (data, e) => {

        try {
    
        e.preventDefault();
        console.log(data);
        console.log("Enter Save role ");
    
        let frmData = {};
    
        
        let createmenuurl = apiendpoints.ManageMenuGroup; 
        frmData = { txtMnuGrpId: data.txtMnuGroupId, txtMnuGrpName:data.txtMnuGroup,ntxtOrd:data.txtMnuGroupOrder };    
  
    
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
    
        const reqdata = { hdr: frmHdr, body: frmData };
        const token = localStorage.getItem("token");
        const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
        const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    
        console.log(reqHdr);
        try {
          //
          const response = await api.post(
            createmenuurl,
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
              FetchMenuGroupList(); 
              ResetMenuGroupValue() ;
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
  

    function SetMnuGroupValue(rowval)  
    {
    


      //setRoles({ txtMnuGroupId: rowval.RoleId, txtMnuGroup: rowval.RoleName})  ;
      reset({ txtMnuGroupId: rowval.MnuGrpId, txtMnuGroup: rowval.MnuGrpName, txtMnuGroupOrder:rowval.Ord})  
    
      setRoleid(rowval.MnuGrpName)

      console.log(handleSubmit);

    }

    function ResetMenuGroupValue()  
    {
      
      reset({ txtMnuGroupId: "", txtMnuGroup: "", txtMnuGroupOrder: ""})    

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
                        <strong className="card-title">Create Menu Group</strong>
                      </div>
                      <div className="card-body p-md-5">

                      {isLoading?(<Spinner></Spinner>) :""}                        
                       <Alerts alert={alert} />                      
                       <div className="row">
                          <div className="col-sm">
                          <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Id</th>
                              <th>Menu Group</th>    
                              <th>Order</th>                            
                              <th><button  className="btn btn-success" onClick={() => {  
                                    ResetMenuGroupValue();                                                 
                                    }} > <i className="bi bi-table"></i> Add </button></th>
                               <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                           
                          {
                                mnugroupresbody.map(x=> {
                                  return(
                                      <tr>

                                  <td>{x.MnuGrpId}</td>
                                  <td>{x.MnuGrpName}</td>  
                                  <td>{x.Ord}</td>                               
                                  <td> 
                            
                                    <button className="btn btn-primary"   onClick={() => {   
                                                SetMnuGroupValue(x);                                                 
                                                }} >  <i className="bi bi-pen"></i> </button></td>
                                  <td> 
                            
                            <button className="btn btn-danger"   onClick={() => {   
                                        SetMnuGroupValue(x);                                                 
                                        }} >  <i class="bi bi-trash"></i> </button></td>
                                 
                                </tr>
                                  )} )}
                          </tbody>
                        </Table>
                          </div>
                          <div className="col-sm">
                          <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                        <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtMnuGroup" className="form-label"> Menu Group</label>
                                    <input {...register("txtMnuGroup")} type="text" className="form-control"   />
                                    <p>{errors.txtMnuGroup?.message}</p>
                                  </div>
                              </div>
                            
                            </div>

                            <div className="row">
                             
                              <div className="col-sm">
                                  <div className="mb-3">
                                  <label htmlFor="txtMnuGroupOrder" className="form-label"> Order</label>
                                  <input {...register("txtMnuGroupOrder")} type="text" className="form-control"  />      
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                  <label htmlFor="txtMnuGroupId" className="form-label"> Menu Group Id</label>
                                  <input {...register("txtMnuGroupId")} type="text" className="form-control" disabled="disabled"  readonly="readonly" />      
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

export default MnuGroup;