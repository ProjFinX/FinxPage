import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {FetchCombodata} from '../utilities/combodata';
import api from "../api/Webcall";
import { generateUUID, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";



// Yup validation schema 

const schema = yup.object().shape({
  txtUsername: yup.string().required("User Email  can not be empty").email("Pls provide Valid  Email id"),
  txtFirstname: yup.string().required("First Name can not be empty").max(50,"First name  Max lenght is 50 "),
   txtLastname: yup.string().required("Last name not be empty").max(50,"Last name  Max lenght is 50 "),
   txtPhone: yup.string().required("Phone no. can not be empty").max(15,"Phone no. Max lenght is 15 "),  
   cmbCountryId: yup.string().required("Please select the Country"),
   txtPassword: yup.string().required("Password can not be empty").min(3, "Password Min length is 3").max(20,"Password. Max lenght is 20 ")   

});


// main Component Start here 


export default function Register() {


        // Combo Data fetching------------------------------

        const[resbody,setresbody]= useState([]);
        const LoadCombo = async () => {
            // Update state with incremented value

            const opt = '|CUN|';
            const optw = '';
        // debugger;

        const Response = await FetchCombodata(opt,optw);// JSON.stringify(await FetchCombodata(opt,optw));

            setresbody(Response.body.cun)
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

           
     
     const navigate = useNavigate();


     const onSubmitHandler = async( data) => {
     
      
      setLoanding(true);
      console.log("Enter Create new branch api call");
      console.log(data);
      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
            convid: convID,
            tag: "NewUser",
            orgid: "",
            vendid: "0",
      };    
      const frmData = data;
      const reqdata = { hdr: frmHdr, body: frmData }  
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      const createusernurl =  "/auth/signup";
      console.log(reqHdr)
      try {
        //debugger;
        const response = await api.post(createusernurl, compressBase64(reqdata),reqHdr);
       // const response = await PostCallHeader(createbranchnurl, compressBase64(reqdata),reqHdr);
       
         const strResponse = JSON.parse(decompressBase64(response.data));

        console.log(strResponse);
       // debugger; 
  
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {             
             ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
           
        } else {
              ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));   
              navigate("/Registersuccess");
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
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>

                      <Alerts alert={alert} />     
                      <form  onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                        <div className="mb-3">
                          <label htmlFor="txtUsername" className="form-label">
                            User Name
                          </label>
                          <input  {...register("txtUsername")}
                            type="text"
                            className="form-control"                           
                            id="txtUsername"
                          />
                         <p>{errors.txtUsername?.message}</p>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="txtFirstname" className="form-label">
                            First Name
                          </label>
                          <input {...register("txtFirstname")}
                            type="text"
                            className="form-control"                            
                            id="txtFirstname"
                          />
                         <p>{errors.txtFirstname?.message}</p>
                        </div>
                       
                        <div className="mb-3">
                          <label htmlFor="txtLastname" className="form-label">
                            Last Name
                          </label>
                          <input  {...register("txtLastname")}
                            type="text"
                            className="form-control"                           
                            id="txtLastname"
                          />
                        <p>{errors.txtLastname?.message}</p>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="txtPhone" className="form-label">
                            Phone
                          </label>
                          <input
                            type="text"  {...register("txtPhone")}
                            className="form-control"                           
                            id="txtPhone"
                          />
                        <p>{errors.txtPhone?.message}</p>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="cmbCountryId" className="form-label">
                            Country
                          </label>

                          <select {...register("cmbCountryId")}  className="form-control" > 
                                    <option value="">- Select -</option>
                                    {  //Combo Data binding
                                    resbody.map((res) => 
                                    (
                                    <option key={res.k} value={res.k}>{res.v}</option>
                                    ))
                                    }
                                    </select>
                                    <p>{errors.cmbCountryId?.message}</p>

                        </div>

                        <div className="mb-3">
                          <label htmlFor="txtPassword" className="form-label">
                            Password
                          </label>
                          <input  {...register("txtPassword")}
                            type="password"
                            className="form-control"
                            id="txtPassword"
                          />
                        <p>{errors.txtPassword?.message}</p>
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
      </section>
    </>
  );
}
