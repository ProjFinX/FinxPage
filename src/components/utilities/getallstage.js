import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetAllStageList = async (screenid) => {


let Response;



const AllStage = apiendpoints.AllStage;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "AllStage", orgid: "", vendid: "0" };
 const frmData = {txtScreenId:screenid}
 const data = { hdr: frmHdr, body: frmData };


 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl = AllStage;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      

       Response = strResponse ;

  })

  return  Response;

};
