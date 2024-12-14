import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import { generateUUID, compressBase64, decompressBase64 } from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import {useNavigate} from "react-router-dom";



// Yup validation schema 

const schema = yup.object().shape({
  txtUsername: yup.string().required("User Email  can not be empty").email("Pls provide Valid  Email id")
});


// main Component Start here 


export default function Forgotpassword() {

        

        const { register, handleSubmit, formState: { errors }, reset } = useForm({
            resolver: yupResolver(schema),
         });

         
        const [alert, setAlert] = useState("");

        const [isLoading , setLoanding]  = useState(false);

           
     
     const navigate = useNavigate();


     const onSubmitHandler = async( data) => {
     
      
      setLoanding(true);     
      console.log(data);
      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
            convid: convID,
            tag: "Forgotpassword",
            orgid: "",
            vendid: "0",
      };    
      const frmData = data;
      const reqdata = { hdr: frmHdr, body: frmData }  
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };    
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      const createusernurl =  "/auth/fgtpwd";
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
                        Forgot Password
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
