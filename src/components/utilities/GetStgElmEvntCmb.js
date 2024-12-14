import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetStgElmEvntCmb = async (screenid,Stgid,StgElmDsigId) => {


let Response;



const StgElmEvntCmb = apiendpoints.StgElmEvntCmb;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "StageElementlist", orgid: "", vendid: "0" };
 const frmData = {cmbScrId:screenid,cmbStgId:Stgid,cmbStgElmDsigId:StgElmDsigId}
 const data = { hdr: frmHdr, body: frmData };


 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const url = StgElmEvntCmb;

 console.log(reqHdr);

 await api.post(url, compressBase64(data)).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      

    console.log(strResponse);
       Response = strResponse ;

  })

  return  Response;

};



