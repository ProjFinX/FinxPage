import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {FetchCombodata} from '../utilities/combodata';
import api from "../api/Webcall";
import { generateUUID, compressLZW, decompressLZW, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";


// Yup validation schema 

const schema = yup.object().shape({
    txtBranchName: yup.string().required("Branch Name can not be empty"),
    txtAddress: yup.string().required("Address can not be empty").min(10).max(250),
    txtCity: yup.string().required("City can not be empty").min(3).max(250),
     cmbProvinceStateId: yup.string().required("Please select the Provicence"),
     txtPhoneNo: yup.string().required("Phone no. can not be empty").max(10,"Phone no. Max lenght is 10 "),   
     txtEmail: yup.string().email("Pls provide Valid  Email id").required("Email can not be empty"),
     txtAltEmail: yup.string().email("Pls provide Valid Alternate Email id"),
     txtBookStartedOn: yup.string().required("Book Stated on date can not be empty"),
     txtFYStartsOn: yup.string().required("Fin. year Stated on date can not be empty"),
     cmbBaseCurrid: yup.string().required("Please select Base Currency")

});


// Function Component Branch

const Branch = () => {


 
    
        // Combo Data fetching------------------------------

        const[resbody,setresbody]= useState([]);
        const LoadCombo = async () => {
            // Update state with incremented value

            const opt = '|CUN|PSM|';
            const optw = '';
        // debugger;

        const Response = await FetchCombodata(opt,optw);// JSON.stringify(await FetchCombodata(opt,optw));

            setresbody(Response.body.psm)
            console.log('rerendering method')
        }; 

        useEffect(() => {
            LoadCombo(); 
            console.log('rerendering')
        
        },[])


        //-----------------------------


        const { register, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema),
         });

         
        const [alert, setAlert] = useState("");

        const [isLoading , setLoanding]  = useState(false);

         const [branchmaster, setbranchmaster] = useState({            
          });

              
     
     const navigate = useNavigate();
     const onSubmitHandler = async(data) => {
      setLoanding(true);
      console.log("Enter Create new branch api call");
      console.log(data);
      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
            convid: convID,
            tag: "NewBranch",
            orgid: "",
            vendid: "0",
      };    
      const frmData = data;
      const reqdata = { hdr: frmHdr, body: frmData }  
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      const createbranchnurl =  "/cmpstp/crtbrch";
      console.log(reqHdr)
      try {
        //debugger;
        const response = await api.post(createbranchnurl, compressBase64(reqdata),reqHdr);
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


  try {
    


  return (


        <>
          <section className="vh-100">
            <div className="container h-100">
                {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
                      <div className="card text-black" style={{ borderRadius: "25px" }}>
                      <div className="card-header">
                        <strong className="card-title">Branch</strong>
                      </div>
                      <div className="card-body p-md-5">

                      {isLoading?(<Spinner></Spinner>) :""}                        
                       <Alerts alert={alert} />                       

                        <form onSubmit={handleSubmit(onSubmitHandler)}>
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtBranchName" className="form-label"> Branch Name</label>
                                    <input {...register("txtBranchName")} type="text" className="form-control"  />
                                    <p>{errors.txtBranchName?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtAddress" className="form-label">Address</label>
                                    <textarea {...register("txtAddress")}  type="textarea" height={20} className="form-control"   />
                                    <p>{errors.txtAddress?.message}</p>
                                  </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtCity" className="form-label"> City</label>
                                    <input {...register("txtCity")} type="text" className="form-control"  />
                                    <p>{errors.txtCity?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="cmbProvinceStateId" className="form-label">Province State</label>
                                    <select {...register("cmbProvinceStateId")}  className="form-control" > 
                                    <option value="">- Select -</option>
                                    {  //Combo Data binding
                                    resbody.map((res) => 
                                    (
                                    <option key={res.k} value={res.k}>{res.v}</option>
                                    ))
                                    }
                                    </select>
                                    <p>{errors.cmbProvinceStateId?.message}</p>
                                  </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtPhoneNo" className="form-label"> Phone no</label>
                                    <input {...register("txtPhoneNo")} type="text" className="form-control"  />
                                    <p>{errors.txtPhoneNo?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtAltPhoneNo" className="form-label">Alt Phone no</label>
                                    <input {...register("txtAltPhoneNo")} type="text" className="form-control"  />
                                    <p>{errors.txtAltPhoneNo?.message}</p>
                                  </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtEmail" className="form-label"> EMail</label>
                                    <input {...register("txtEmail")} type="email" className="form-control"  />
                                    <p>{errors.txtEmail?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtAltEmail" className="form-label">Alt Email</label>
                                    <input {...register("txtAltEmail")} type="email" className="form-control"  />
                                    <p>{errors.txtAltEmail?.message}</p>
                                  </div>
                              </div>
                            </div>
                           
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtBookStartedOn" className="form-label"> Book Started On</label>
                                    <input {...register("txtBookStartedOn")} type="date" className="form-control"   placeholder="YYYY-MM-DD"/>
                                    <p>{errors.txtBookStartedOn?.message}</p>
                                  </div>
                              </div>
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="txtFYStartsOn" className="form-label">FY Starts On</label>
                                    <input {...register("txtFYStartsOn")} type="date" className="form-control"   placeholder="YYYY-MM-DD"/>
                                    <p>{errors.txtFYStartsOn?.message}</p>
                                  </div>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-sm">
                                  <div className="mb-3">
                                    <label htmlFor="cmbBaseCurrid" className="form-label"> Base Currency</label>
                                    <select {...register("cmbBaseCurrid")} className="form-control" >
                                    <option value="">- Select -</option>
                                    <option value="1">INR</option>
                                    <option value="2">ZMW</option>
                                    <option value="3">USD</option>
                                    <option value="4">EUR</option>
                                    </select>
                                    <p>{errors.cmbBaseCurrid?.message}</p>
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
                  </div>
                </div>
            {/* </div>
            </div> */}
          </section>
    </>
  );

} catch (err) {

  console.log(err.message);     
      
}

};

export default Branch;