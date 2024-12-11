import React, { useState, useEffect } from "react";
import { generateUUID, compressBase64,decompressBase64 } from "./utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;

 export const UpdSmtpMaster = async (x) => {


let Response;
const updscr  = apiendpoints.updscr ;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

 let SmtpId = 0;
 if (x.txtSMTPId!="")
   SmtpId = x.txtSMTPId;


//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "updscr", orgid: "", vendid: "0" };
 const frmData = {  "txtSmtpId":SmtpId, "txtHost":x.txtHostname, "cbIsSSL":x.cbIsSSL, "txtPortNo":x.txtPort,
                    "txtEmail":x.txtEmail, "txtPwd":x.txtPassword, "cbIsActive":x.cbIsActive }
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl = updscr;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
    console.log(strResponse);    
       Response = strResponse ;

  })

  return  Response;

};


 export const Getsmtplist = async () => {


let Response;
const smtplst = apiendpoints.smtplst;
 const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
//  /* Header */
 const convID = generateUUID();
 const frmHdr = { convid: convID, tag: "smtplst", orgid: "", vendid: "0" };
 const frmData = {}
 const data = { hdr: frmHdr, body: frmData };

 const token =    localStorage.getItem('token');
 const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  

 const combonurl =smtplst;

 await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    const strResponse = JSON.parse(decompressBase64(response.data));
   
       Response = strResponse ;

  })

  return  Response;

};


export const GetMailType = async () => {


   let Response;
   const smtplst = apiendpoints.smtplst;
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
   //  /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "smtplst", orgid: "", vendid: "0" };
    const frmData = {}
    const data = { hdr: frmHdr, body: frmData };
   
    const token =    localStorage.getItem('token');
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
   
    const combonurl =smtplst;
   
    await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
       const strResponse = JSON.parse(decompressBase64(response.data));
          
          Response = strResponse ;
   
     })
   
     return  Response;
   
   };


   export const GetMailTemplateList = async () => {


      let Response;
      const miltmpltlst = apiendpoints.miltmpltlst;
       const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
      //  /* Header */
       const convID = generateUUID();
       const frmHdr = { convid: convID, tag: "miltmpltlst", orgid: "", vendid: "0" };
       const frmData = {}
       const data = { hdr: frmHdr, body: frmData };
      
       const token =    localStorage.getItem('token');
       const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
      
       const combonurl =miltmpltlst;
      
       await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
          const strResponse = JSON.parse(decompressBase64(response.data));
         
             Response = strResponse ;
      
        })
      
        return  Response;
      
      };


      export const GetMailTemplateAttachmentList = async (MailTemplateId) => {


         let Response;
         const miltmpltlst = apiendpoints.miltmltdoclst;
          const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
         //  /* Header */
          const convID = generateUUID();
          const frmHdr = { convid: convID, tag: "miltmltdoclst", orgid: "", vendid: "0" };
          const frmData = {cmbMailTemplateId:MailTemplateId}
          const data = { hdr: frmHdr, body: frmData };
         
          const token =    localStorage.getItem('token');
          const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
         
          const combonurl =miltmpltlst;
         
          await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
             const strResponse = JSON.parse(decompressBase64(response.data));
            
                Response = strResponse ;
         
           })
         
           return  Response;
         
         };

         export const DelMailTmpltAttachmentelmt = async (MailTmplAttchelmtId) => {     
           
            let Response;
            const Delmiltmltdoc = apiendpoints.delatchelm ;
             const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
            //  /* Header */
             const convID = generateUUID();
             const frmHdr = { convid: convID, tag: "delatchelm", orgid: "", vendid: "0" };
             const frmData = {txtMailAttchElmsId:MailTmplAttchelmtId}
             const data = { hdr: frmHdr, body: frmData };
             console.log(frmData); 
             
             const reqHdr = { };  
            
             const combonurl =Delmiltmltdoc;   
             await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
    
               const strResponse = JSON.parse(decompressBase64(response.data));              
                   Response = strResponse ;
            
              })
            
              return  Response;
            
            };

            export const GetAtchelmlst  = async (MailTemplateId) => {


               let Response;
               const getatchelmlst = apiendpoints.getatchelmlst;
                const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
               //  /* Header */
                const convID = generateUUID();
                const frmHdr = { convid: convID, tag: "getatchelmlst", orgid: "", vendid: "0" };
                const frmData = {txtMailTemplateId:MailTemplateId}
                const data = { hdr: frmHdr, body: frmData };
               
                const token =    localStorage.getItem('token');
                const reqHdr = { headers: { Authorization: `Bearer ${token}` } };  
               
                const combonurl =getatchelmlst;
               
                await api.post(combonurl, compressBase64(data),reqHdr).then(function (response) {
                   const strResponse = JSON.parse(decompressBase64(response.data));
                  
                      Response = strResponse ;
               
                 })
               
                 return  Response;
               
               };
      
   

