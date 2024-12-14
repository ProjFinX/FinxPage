import { generateUUID, compressBase64, decompressBase64 } from "./utils";
import api from "../api/Webcall";


import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

export const GetStgEvents = async (ScrId, StgId) => {

   let Response;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Stage Events", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: ScrId, cmbStgId: StgId }
   const data = { hdr: frmHdr, body: frmData };

   await api.post(apiendpoints.Stgevtree, compressBase64(data)).then(function (response) {
      Response = JSON.parse(decompressBase64(response.data));
   })

   return Response;

};



export const GetStgClientEvents = async (ScrId, StgId) => {

   let Response;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Stage Events", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: ScrId, cmbStgId: StgId }
   const data = { hdr: frmHdr, body: frmData };

   await api.post(apiendpoints.Stgclntevtree, compressBase64(data)).then(function (response) {
      Response = JSON.parse(decompressBase64(response.data));
   })

   return Response;

};
