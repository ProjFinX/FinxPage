import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetTableColumn = async (cmbScrid,tbcmbDbShotName,cmbTblName) => {


let Response;



const TableColumn = apiendpoints.GetTableColumn;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "Table List", orgid: "", vendid: "0" };
 const frmData = {cmbScrid:cmbScrid,cmbDbShotName:tbcmbDbShotName,cmbTblName:cmbTblName}
 const data = { hdr: frmHdr, body: frmData };

 console.log(data); 

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 await api.post(TableColumn, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      
       Response = strResponse ;

       
 console.log(Response); 

  })

  return  Response;

};
