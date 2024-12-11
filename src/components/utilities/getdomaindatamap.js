import React, { useState, useEffect } from "react";
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetDomainDataMap = async (DDMapId) => {


let Response;
const  DomainDataMapping = apiendpoints.GetDomainDataMapping;

//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "brchlst", orgid: "", vendid: "0" };
 const frmData = {txtDDMapId:DDMapId}
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 console.log(frmData)


 await api.post(DomainDataMapping, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })

  return  Response;

};

