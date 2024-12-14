import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const Getqxmap = async (screenid,SeExprnId) => {


let Response;



const getqxmapami = apiendpoints.Getqxmap;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "getqxmap", orgid: "", vendid: "0" };
 const frmData = {cmbScrId:screenid,txtSeExprnId:SeExprnId}
 const data = { hdr: frmHdr, body: frmData };


 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const url = getqxmapami;

 await api.post(url, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      

    console.log(strResponse);
       Response = strResponse ;

  })

  return  Response;

};
