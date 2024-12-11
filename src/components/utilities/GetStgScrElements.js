import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetStgScrElements = async (screenid) => {


let Response;



const FetchStgScrElements = apiendpoints.FetchStgScrElements;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "StageElementlist", orgid: "", vendid: "0" };
 const frmData = {scrid:screenid}
 const data = { hdr: frmHdr, body: frmData };


 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const url = FetchStgScrElements;

 console.log(reqHdr);

 await api.post(url, compressBase64(data)).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));      

    console.log(strResponse);
       Response = strResponse ;

  })

  return  Response;

};




export const GetStgEleCmb = async (screenid,StgId) => {


   let Response;
   
   
   
   const StgElmCmb = apiendpoints.StgElmCmb;
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   //  /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "StgElmCmb", orgid: "", vendid: "0" };
    const frmData = {cmbScrId:screenid,cmbStgId:StgId}
    const data = { hdr: frmHdr, body: frmData };
   
   
    const token =    localStorage.getItem('token');
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
   
    const url = StgElmCmb;
   
    console.log(reqHdr);
   
    await api.post(url, compressBase64(data)).then(function (response) {
       const strResponse = JSON.parse(decompressBase64(response.data));      
   
       console.log(strResponse);
          Response = strResponse ;
   
     })
   
     return  Response;
   
   };


   export const GetEvntExGrpMap = async (screenid,StgId,StgElmDsigId,EvntId) => {


      let Response;
      
      const ExGrpmap = apiendpoints.ExGrpmap;
       const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      //  /* Header */
       const convID = generateUUID();
       const frmHdr = { convid: convID, tag: "StgElmCmb", orgid: "", vendid: "0" };
       const frmData = {cmbScrId:screenid,cmbStgId:StgId,cmbStgElmDsigId:StgElmDsigId,cmbEvntId:EvntId}
       const data = { hdr: frmHdr, body: frmData };
      
       console.log(frmData);
       
      
       const token =    localStorage.getItem('token');
       const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
      
       const url = ExGrpmap; 
      
       await api.post(url, compressBase64(data)).then(function (response) {
          const strResponse = JSON.parse(decompressBase64(response.data));      
      
          console.log(strResponse);
             Response = strResponse ;
      
        })
      
        return  Response;
      
      };
   
