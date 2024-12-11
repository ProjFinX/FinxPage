import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";

import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetScrElementsForCmb = async (screenid) => {

   let Response;

   //const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Screen Elemens for Combo", orgid: "", vendid: "0" };
   const frmData = {scrid:screenid}
   const data = { hdr: frmHdr, body: frmData };

   console.log(data);

   await api.post(apiendpoints.AllElementForCmb, compressBase64(data)).then(function (response) {
      const strResponse = JSON.parse(decompressBase64(response.data));      
      
      console.log(strResponse);

      Response = strResponse;
   })

   return  Response;

};
