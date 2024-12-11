import { generateUUID, compressBase64, decompressBase64 } from "./utils";
import api from "../api/Webcall";

import appsettings from "../../appsettings.json"
const apiendpoints = appsettings.ApiEndpoints;

export const GetExpGrpLst = async (screenid) => {

   let Response;

   /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Expgroup", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: screenid }
   const data = { hdr: frmHdr, body: frmData };
   const reqHdr = {};

   try {

      await api.post(apiendpoints.GetExpGrpLst, compressBase64(data), reqHdr).then(function (response) {
         const strResponse = JSON.parse(decompressBase64(response.data));
         Response = strResponse;
      })

      return Response;
   }
   catch (error) {
      console.log(error); // Network E
   }
};
