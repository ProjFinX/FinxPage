import React, { useState, useEffect } from "react";
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

 export  const FetchCombodata = async (Opt,Optw,ctr) => {


let Response;

let MasterComboList ="";

const apiendpoints = appsettings.ApiEndpoints;


if(ctr){

 MasterComboList = apiendpoints.CompanyComboList;
}
else{

   
 MasterComboList = apiendpoints.MasterComboList;

}


 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;


//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "signup", orgid: "", vendid: "0" };
 const frmData = {opt:Opt, optw:Optw , _cnstr : ctr}
 const data = { hdr: frmHdr, body: frmData };
 const combonurl =  MasterComboList;

 await api.post(combonurl, compressBase64(data)).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data)); 
   Response = strResponse ;

  })

  return  Response;

};



export  const FetchQryCombodata = async (cmbReq, qDet) => {

  let Response;
  
  const apiendpoints = appsettings.ApiEndpoints;
   let reqCmbData = {
    hdr: { convid: generateUUID(), tag: "Fetch Query CmbData", orgid: "", vendid: "0" },
    body: cmbReq
  };

  if (qDet)
  {
    reqCmbData["qdet"] = qDet;
  }

   await api.post(apiendpoints.QueryComboList, compressBase64(reqCmbData)).then(function (response) {
    let strRes = decompressBase64(response.data);
    Response = JSON.parse(strRes).body.data;

    })
  
    return  Response;
  
  };

  