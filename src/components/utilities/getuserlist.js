import React, { useState, useEffect } from "react";
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetUserList = async () => {


let Response;
const UserList = apiendpoints.UserList;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "brchlst", orgid: "", vendid: "0" };
 const frmData = {}
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl = UserList;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })

  return  Response;

};


 export const GetAllUserList = async () => {


let Response;
const AllUserList = apiendpoints.AllUserList;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "brchlst", orgid: "", vendid: "0" };
 const frmData = {}
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl =AllUserList;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })

  return  Response;

};


