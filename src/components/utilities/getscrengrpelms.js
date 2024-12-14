import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetScreenGroupElms = async (cmbScrid) => {


let Response;



const screengroupelms = apiendpoints.Getscreengrpelms;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "Table List", orgid: "", vendid: "0" };
 const frmData = {cmbScrid:cmbScrid}
 const data = { hdr: frmHdr, body: frmData };

 console.log(data); 

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 await api.post(screengroupelms, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      
       Response = strResponse ;

  })

  return  Response;

};
