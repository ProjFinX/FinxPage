import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetStageFlowBranchMapping = async (MapId) => {


let Response;



const stgflbrchmap    = apiendpoints.stgflbrchmap;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "stgflbrchmap", orgid: "", vendid: "0" };
 const frmData = {StageFlowMapId:MapId}
 const data = { hdr: frmHdr, body: frmData };

 console.log(data);
 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl = stgflbrchmap;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      
    console.log(strResponse);
       Response = strResponse ;

  })

  return  Response;

};
