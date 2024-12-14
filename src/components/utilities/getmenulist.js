
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const GetMenuitemList = async (GroupId) => {

let Response;



 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
 
const MenuItems = apiendpoints.MenuItems;

//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "Menu Item", orgid: "", vendid: "0" };
 const frmData = {MnuGroupId:GroupId}
 const data = { hdr: frmHdr, body: frmData };
 console.log('frmData',frmData)
 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl =   MenuItems;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })


  
  const listToTree = (arr = []) => {
   let map = {}, node,node1, res = [], i, arr1=[],obj={},childrens = [];

   for (i = 0; i < arr.length; i += 1) {
      map[arr[i].mnuid] = i;
     
            if (arr[i].link ==null)
       {
         arr[i].link="/";
       }

       obj={name:arr[i].mnuname,fixMenu:true,path:arr[i].link,childrens:childrens}
       arr1=[...arr1,obj]
       arr1[i].childrens = [];
       if (arr[i].pmnuid ==null)
       {
         arr[i].pmnuid=0;
       }
       
       
   };
   for (i = 0; i < arr.length; i += 1) {
      node = arr[i];
      node1 = arr1[i];
      if (node.pmnuid !== 0) { 
         console.log(arr1[i]);
         arr1[map[node.pmnuid]].fixMenu=false;         
         arr1[map[node.pmnuid]].childrens.push(node1);
      }
      else {         
         res.push(node1);
      };
   };
   return res;
 };




 const menutree =  listToTree(Response.body.mnuitms)

 console.log(menutree)
  return  menutree;



};



export const GetMenuGroupList = async () => {
   


   //{"BRUMapId":"0"}

   let BRUMapId = 0;

     BRUMapId = localStorage.getItem("UserRoleId");

    let frmData = {};

    if (BRUMapId!=0)
    {
         frmData = {BRUMapId:BRUMapId};
    }


   let Response;
   
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   //  /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "mnuggrps", orgid: "", vendid: "0" };

    const data = { hdr: frmHdr, body: frmData };

    console.log(data);
   
    const token =    localStorage.getItem('token');
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

    const MenuGroups = apiendpoints.MenuGroups;
   
    const combonurl =    MenuGroups;
   
    await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
       const strResponse = JSON.parse(decompressBase64(response.data));
       console.log(strResponse);    
          Response = strResponse ;
        
   
     })
   
   
       return  Response;
   
   };


   
export const GetMenuItems = async () => {
   

    let frmData = {};


   let Response;
   
   const MenuGroupItems = apiendpoints.MenuGroupItems;
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   //  /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "mnugrpsitms", orgid: "", vendid: "0" };

    const data = { hdr: frmHdr, body: frmData };

    console.log(data);
   
    const token =    localStorage.getItem('token');
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
   
    const combonurl = MenuGroupItems;
   
    await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
       const strResponse = JSON.parse(decompressBase64(response.data));
       console.log(strResponse);    
          Response = strResponse ;
        
   
     })
   
   
       return  Response;
   
   };


   export const GetMenuRole = async (MnuGroupId,MnuItemId) => {
   

      let frmData = { MnuGroupId:MnuGroupId, MnuItemId:MnuItemId};
  
  
     let Response;

     const MenuGroupItemsRights = apiendpoints.MenuGroupItemsRights;
     
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
     //  /* Header */
      const convID = generateUUID();
      const frmHdr = { convid: convID, tag: "mnugrpitmrght", orgid: "", vendid: "0" };
  
      const data = { hdr: frmHdr, body: frmData };
  
      console.log(data);
     
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
     
      const combonurl =MenuGroupItemsRights;
     
      await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
         const strResponse = JSON.parse(decompressBase64(response.data));
         console.log(strResponse);    
            Response = strResponse ;
          
     
       })
     
     
         return  Response;
     
     };


     export const GetscreenList = async () => {
   

      let frmData = {};
  
  
     let Response;
     
     const StageAndScreen = apiendpoints.StageAndScreen;

      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
     //  /* Header */
      const convID = generateUUID();
      const frmHdr = { convid: convID, tag: "scrstglst", orgid: "", vendid: "0" };
  
      const data = { hdr: frmHdr, body: frmData };
  
      console.log(data);
     
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
     
      const combonurl = StageAndScreen;
     
      await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
         const strResponse = JSON.parse(decompressBase64(response.data));
         console.log(strResponse);    
            Response = strResponse ;
          
     
       })
     
     
         return  Response;
     
     };


     export const GetScreenRole = async (ScrId) => {
      

      let frmData = {cmbScrId:ScrId};
  
  
     let Response;
     
     const StageRoleRights = apiendpoints.StageRoleRights;
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
     //  /* Header */
      const convID = generateUUID();
      const frmHdr = { convid: convID, tag: "stgrolrgt", orgid: "", vendid: "0" };
  
      const data = { hdr: frmHdr, body: frmData };
  
      console.log(data);
     
      const token =    localStorage.getItem('token');
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
     
      const combonurl = StageRoleRights;
     
      await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
         const strResponse = JSON.parse(decompressBase64(response.data));
         console.log(strResponse);    
            Response = strResponse ;
          
     
       })
     
     
         return  Response;
     
     };
  
   

   
