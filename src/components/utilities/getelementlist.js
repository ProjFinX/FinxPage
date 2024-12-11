import { generateUUID, compressBase64, decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

export const GetElementList = async (screenid, stageid) => {


   let Response;



   const ElementList = apiendpoints.Elementlist;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Elementlist", orgid: "", vendid: "0" };
   const frmData = { scrid: screenid, stgid: stageid };
   const data = { hdr: frmHdr, body: frmData };

   const reqHdr = {};

   const url = ElementList;
   await api.post(url, compressBase64(data), reqHdr).then(function (response) {
      const strResponse = JSON.parse(decompressBase64(response.data));
      Response = strResponse;

   })

   return Response;

};

export const GetElementDefValue = async (screenid, elmid) => {

   let Response;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Element default value", orgid: "", vendid: "0" };
   const frmData = { scrid: screenid, txtElementId: elmid };
   const data = { hdr: frmHdr, body: frmData };

   console.log(frmData);
   
   const reqHdr = {};
  
   await api.post( apiendpoints.ElementDefaultValue, compressBase64(data), reqHdr).then(function (response) {
      const strResponse = JSON.parse(decompressBase64(response.data));
      Response = strResponse;

   })

   return Response;

};
