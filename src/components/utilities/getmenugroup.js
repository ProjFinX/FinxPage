
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;



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
   

   export const ManageMenuGroup = async () => {
   


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
   
       const MenuGroups = apiendpoints.ManageMenuGroup;
      
       const combonurl =    MenuGroups;
      
       await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
          const strResponse = JSON.parse(decompressBase64(response.data));
          console.log(strResponse);    
             Response = strResponse ;
           
      
        })
      
      
          return  Response;
      
      };

   

   
