import React from "react";
import { useState, useEffect } from "react";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { GetRoleList } from "../utilities/getrolelist";
import { statuschangeRoleMapNodeSource } from "./nodesourse";
import {FetchCombodata} from '../utilities/combodata';
import { Scrollbar } from "react-scrollbars-custom";
import Table from "react-bootstrap/Table";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";


 


const schema = yup.object().shape({
       cmbStatus: yup.string().required("Pls select the role status")
  });






  //------------------------------------------Main function--------------------------------------------------------------


//main function start

function RoleStatusChange() {



// Variable declaration

// const & Use state 

const [isLoading, setLoanding] = useState(false);
const [alert, setAlert] = useState("");
const [roleresbody, setrolelistresbody] = useState([]);
const [BRUMapStatusMaster,setBRUMapStatusMaster]= useState([]);
const [RoleSelected,setRoleSelected]=useState([]);


const {
    register,
    handleSubmit,
    formState: { errors },  
  } = useForm({
    resolver: yupResolver(schema),
  });





//General function

// Get Rle List


const FetchRoleList = async () => {
    const RoleListResponse = await GetRoleList();
    setrolelistresbody(RoleListResponse.body.Roles);
  };


  //   fetch combo values
 
 const LoadCombo = async () => {

  const opt = '|BRUS|';
  const optw = '';
  const ComboResponse = await FetchCombodata(opt,optw);
        setBRUMapStatusMaster(ComboResponse.body.brus)

  }


const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };

//General end

// Event Function start

//--------------------CheckboxhandleChange------------------------

const CheckboxhandleChange = (e, x) => {
  console.log(e);
  console.log(x);

  let ustatus = RoleSelected;

  if (e.target.value == true) ustatus.push(x.RoleId);
  else {
    const index = ustatus.indexOf(x.RoleId);
    if (index > -1) {
      ustatus.splice(index, 1);
    }
  }

  console.log(RoleSelected);
};


//-----------------CheckboxhandleChange end------



//---------------onSubmitHandler start------
const onSubmitHandler = async (data, e) => {    
     

    
     let frmData = { txtNewStatusId:data.cmbStatus,txtRoleIds:RoleSelected};

     let createmenuurl = "/cmpstp/cngrolstus";
     console.log(frmData);
 

     setLoanding(true);

     //e.preventDefault();
     /* Header */
     const convID = generateUUID();
     const frmHdr = {
       convid: convID,
       tag: "cngrolstus",
       orgid: "",
       vendid: "0",
     };

     const token = localStorage.getItem("token");
     const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
     const reqdata = { hdr: frmHdr, body: frmData };

     const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

     console.log(reqdata);

     try {
       //debugger;
       const response = await api.post(
         createmenuurl,
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
           setTimeout(() => {
             setAlert({
               AlertType: "null",
               message: "null",
             });
           }, 600);
           FetchRoleList();          
           setLoanding(false);
         }, 300);
       }
     } catch (err) {
       console.log(err.message);
       ShowAlert("Error", "Unable to process request");
       setLoanding(false);
     }
   }


//---------------onSubmitHandler end------

// Event Fnction end




// use effect

useEffect(() => {
    LoadCombo();
    FetchRoleList();
  }, []);


 // HTML part

    try {

      return (
        <>
          <section className="vh-100">
            <div className="container h-100">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-header">
                  <strong className="card-title">Role Status Change</strong>
                </div>
               

                <Scrollbar style={{ width: 1200, height: 550 }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th className="text-center">Select</th>
                      <th className="text-center">Id</th>
                      <th className="text-center">Role</th>                  
                      <th className="text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleresbody.map((x) => {
                      return (
                        <tr>
                          <td align="center">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                CheckboxhandleChange(
                                  {
                                    target: {
                                      value: e.target.checked,
                                    },
                                  },
                                  x
                                );
                              }}
                            ></input>
                          </td>
                          <td>{x.RoleId}</td>
                          <td>{x.RoleName}</td>      
                          <td>{x.BRUMapStatus}</td>                      
                          <td>
                           
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                </Scrollbar>


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
                          <label htmlFor="cmbStatus" className="form-label">
                            Status
                          </label>
                          <select
                            {...register("cmbStatus")}
                            className="form-control"
                            id="cmbStatus"
                          >
                            <option value="">- Select -</option>
                            {
                              //Combo Data binding
  
                              BRUMapStatusMaster.map((res) => (
                                <option key={res.k} value={res.k}>
                                  {res.v}
                                </option>
                              ))
                            }
                          </select>
                          <p>{errors.cmbStatus?.message}</p>
                        </div>
                      </div>
                      <div className="col-sm">
                        <div className="mb-3"><br></br> 
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                
              </div>
             
              {/* </div>
                </div> */}
            </div>
          </section>
        </>
      );

      
    } catch (error) {
      
    }


    

}

export default RoleStatusChange;