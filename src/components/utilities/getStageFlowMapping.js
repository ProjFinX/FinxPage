import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetStageFlowMapping = async (screenid) => {


let Response;



const stgflmap    = apiendpoints.stgflmap;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "stgflmap", orgid: "", vendid: "0" };
 const frmData = {cmbScrId:screenid}
 const data = { hdr: frmHdr, body: frmData };


 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl = stgflmap;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      

       Response = strResponse ;

  })

  return  Response;

};
