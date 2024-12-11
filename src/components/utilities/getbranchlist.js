import React, { useState, useEffect } from "react";
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

 export const GetBranchList = async () => {


let Response;

const apiendpoints = appsettings.ApiEndpoints;
const BranchList = apiendpoints.BranchList;

 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "brchlst", orgid: "", vendid: "0" };
 const frmData = {}
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl =  BranchList;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })

  return  Response;

};
