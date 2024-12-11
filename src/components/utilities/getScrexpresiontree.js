
import { generateUUID, compressBase64, decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

export const GetExpressiontree = async (ScrId, GroupId) => {

   let Response;

   const ExpressionTree = apiendpoints.GetExpTree;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Exp Tree", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: ScrId, txtExprGroupId: GroupId }
   const data = { hdr: frmHdr, body: frmData };
   const reqHdr = { };
   const combonurl = ExpressionTree;

   await api.post(combonurl, compressBase64(data), reqHdr).then(function (response) {
      const strResponse = JSON.parse(decompressBase64(response.data));
      Response = strResponse;
   })


   // var indent = '~~~~~~~~~~~~~~~~~~~~';

   // const listToTree = (arr = []) => {
   //    let map = {}, node, node1, res = [], i, arr1 = [], obj = {}, children = [];

   //    for (i = 0; i < arr.length; i += 1) {

   //       var exprStr = "";

   //       var indentSpace = indent.substring(0, arr[i].lvl).replace(/~/gi, "&nbsp;&nbsp;&nbsp;")

   //       if (arr[i].exprntyid != 1) {
   //          exprStr += "<span style='color:blue;' >" + indentSpace + arr[i].exprnty + "</span>";
   //          if (arr[i].exprntyid != 3) {
   //             exprStr += "("
   //          }
   //          exprStr += "<span style='color:maroon;' >" + arr[i].exprn + "</span>";

   //          if (arr[i].exprntyid == 21) {
   //             exprStr += '-' + arr[i].stgname
   //          }

   //          if (arr[i].exprntyid != 3) {
   //             exprStr += ")"
   //          }
   //       }
   //       else {
   //          exprStr += indentSpace + arr[i].exprn;
   //       }


   //       map[arr[i].exprnid] = i;


   //       obj = { id: arr[i].exprnid, name: exprStr, fixMenu: true, children: children }
   //       arr1 = [...arr1, obj]
   //       arr1[i].children = [];
   //       if (arr[i].prexprnid == null) {
   //          arr[i].prexprnid = 0;
   //       }


   //    };


   //    for (i = 0; i < arr.length; i += 1) {
   //       node = arr[i];
   //       node1 = arr1[i];
   //       if (node.prexprnid !== 0) {
   //          console.log(arr1[i]);
   //          arr1[map[node.prexprnid]].fixMenu = false;
   //          arr1[map[node.prexprnid]].children.push(node1);
   //       }
   //       else {
   //          res.push(node1);
   //       };
   //    };
   //    return res;
   // };


   // const menutree = listToTree(Response.body.expressions)

   // console.log(menutree)

   return Response;

};

export const GetEventTree = async (ScrId) => {

   let Response;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Event Tree", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: ScrId }
   const data = { hdr: frmHdr, body: frmData };
   console.log('frmData', frmData)
   const reqHdr = {  };

   await api.post(apiendpoints.Evtree, compressBase64(data), reqHdr).then(function (response) {
      Response = JSON.parse(decompressBase64(response.data));
   })

   var indent = '~~~~~~~~~~~~~~~~~~~~';

   const listToTree = (arr = []) => {
      let map = {}, node, node1, res = [], i, arr1 = [], obj = {}, children = [];

      for (i = 0; i < arr.length; i += 1) {

         var exprStr = "";

         var indentSpace = indent.substring(0, arr[i].lvl).replace(/~/gi, "&nbsp;&nbsp;&nbsp;")

         exprStr += indentSpace + "<span style='color:blue;'>";


         if (arr[i].flag == 1)
            exprStr += "Stg-";
         else if (arr[i].flag == 2)
            exprStr += "Evn-";
         else if (arr[i].flag == 3)
            exprStr += "ExGr-";
         else
            exprStr += "";

         exprStr += "</span>" + arr[i].leaf;

         map[arr[i].id] = i;

         obj = { id: arr[i].id, name: exprStr, fixMenu: true, children: children }
         arr1 = [...arr1, obj]
         arr1[i].children = [];
         if (arr[i].prntid == null) {
            arr[i].prntid = 0;
         }

      };


      for (i = 0; i < arr.length; i += 1) {
         node = arr[i];
         node1 = arr1[i];
         if (node.prntid !== 0) {
            console.log(arr1[i]);
            arr1[map[node.prntid]].fixMenu = false;
            arr1[map[node.prntid]].children.push(node1);
         }
         else {
            res.push(node1);
         };
      };
      return res;
   };


   const menutree = listToTree(Response.body.expressions)

   console.log(menutree)

   return { data: { menutree: menutree, expresponse: Response.body.expressions } };



};


export const GetUIDesignTree = async (ScrId, StgId) => {

   let Response;

   //  /* Header */
   const convID = generateUUID();
   const frmHdr = { convid: convID, tag: "Get Stg UI Design", orgid: "", vendid: "0" };
   const frmData = { cmbScrId: ScrId, cmbStgId: StgId }
   const data = { hdr: frmHdr, body: frmData };
   console.log('frmData', frmData)
   const reqHdr = { };

   await api.post(apiendpoints.uidsgn, compressBase64(data), reqHdr).then(function (response) {
      Response = JSON.parse(decompressBase64(response.data));
   })

   var indent = '~~~~~~~~~~~~~~~~~~~~';

   const listToTree = (arr = []) => {
      let map = {}, node, node1, res = [], i, arr1 = [], obj = {}, children = [];

      for (i = 0; i < arr.length; i += 1) {

         var exprStr = "";

         var indentSpace = indent.substring(0, arr[i].lvl).replace(/~/gi, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")

         exprStr += indentSpace + arr[i].uiexprn;

         map[arr[i].uidsgnid] = i;

         obj = { id: arr[i].uidsgnid, name: exprStr, fixMenu: true, children: children }
         arr1 = [...arr1, obj]
         arr1[i].children = [];
         if (arr[i].prntid == null) {
            arr[i].prntid = 0;
         }

      };


      for (i = 0; i < arr.length; i += 1) {
         node = arr[i];
         node1 = arr1[i];
         if (node.prntid !== 0) {
            console.log(arr1[i]);
            arr1[map[node.prntid]].fixMenu = false;
            arr1[map[node.prntid]].children.push(node1);
         }
         else {
            res.push(node1);
         };
      };
      return res;
   };

   const uitree  = listToTree(Response.body.uidsgn)
   return { data: { uitree: uitree, actualUiTree : Response.body.uidsgn } };

};










// const data = [
//   {
//     id: 1,
//     name: 'Node 1',
//     children: [
//       {
//         id: 2,
//         name: 'Node 1.1',
//         children: [
//           {
//             id: 3,
//             name: 'Node 1.1.1',
//             children: []
//           }
//         ]
//       },
//       {
//         id: 4,
//         name: 'Node 1.2',
//         children: []
//       }
//     ]
//   },
//   {
//     id: 5,
//     name: 'Node 2',
//     children: [
//       {
//         id: 6,
//         name: 'Node 2.1',
//         children: []
//       },
//       {
//         id: 7,
//         name: 'Node 2.2',
//         children: []
//       }
//     ]
//   }
// ];