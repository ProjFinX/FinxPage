"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[308],{79308:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(65043),react_hook_form__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__(24858),_hookform_resolvers_yup__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__(18403),yup__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(73033),_utilities_combodata__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(57492),_utilities_getsmtpmaster__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(67560),_api_Webcall__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(84756),_utilities_utils__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(80511),_htmlcomponents_Spinner__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(47046),_htmlcomponents_Alerts__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(8204),react_router_dom__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__(86971),react_scrollbars_custom__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(2459),react_bootstrap_Table__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__(64196),react_toastify__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(91036),_appsettings_json__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__(82585),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__(70579);const apiendpoints=_appsettings_json__WEBPACK_IMPORTED_MODULE_10__.F,schema=yup__WEBPACK_IMPORTED_MODULE_1__.Ik().shape({txtTemplatename:yup__WEBPACK_IMPORTED_MODULE_1__.Yj().required("Template name  can not be empty")}),MailTmplAttachment=()=>{var _errors$cmbMailTempla,_errors$txtMailTmpAtt;const[smtplst,setsmtplst]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),[miltmpltlsbody,setmiltmpltlsresbody]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),[resbody,setresbody]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]),[selectedFile,setSelectedFile]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[MailTemplateId,setMailTemplateId]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(0),LoadCombo=async()=>{const _=await(0,_utilities_combodata__WEBPACK_IMPORTED_MODULE_2__.n)("|MILTMP|","");setresbody(_.body.miltmp)};(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((()=>{LoadCombo()}),[]);const{register:register,getValues:getValues,handleSubmit:handleSubmit,formState:{errors:errors},reset:reset}=(0,react_hook_form__WEBPACK_IMPORTED_MODULE_12__.mN)({resolver:(0,_hookform_resolvers_yup__WEBPACK_IMPORTED_MODULE_13__.t)(schema)}),[alert,setAlert]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),[isLoading,setLoanding]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1);function ResetScreenValue(){reset({filElements:""})}const handleFileChange=_=>{_.target.files.length>0&&setSelectedFile(_.target.files[0])},MailTemplateOnChange=_=>{setMailTemplateId(_.target.value),FetchMailTemplateAttachmentList(_.target.value)},DeleteTemplateAttachmentOnclick=_=>{DeleteTemplateAttachment(_.attchid)},navigate=(0,react_router_dom__WEBPACK_IMPORTED_MODULE_14__.Zp)(),FetchMailTemplateAttachmentList=async _=>{const e=await(0,_utilities_getsmtpmaster__WEBPACK_IMPORTED_MODULE_3__.dp)(_);console.log(JSON.stringify(e)),setmiltmpltlsresbody(e.body.attachment)},DeleteTemplateAttachment=async _=>{const e={convid:(0,_utilities_utils__WEBPACK_IMPORTED_MODULE_5__.lk)(),tag:"delmiltmltdoc",orgid:"",vendid:"0"};let t=parseInt(MailTemplateId);const a={hdr:e,body:{cmbMailTemplateId:t,txtMailTmplAttchId:_}},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},s=apiendpoints.delmiltmltdoc;console.log(a);try{const _=await _api_Webcall__WEBPACK_IMPORTED_MODULE_4__.Ay.post(s,(0,_utilities_utils__WEBPACK_IMPORTED_MODULE_5__.Yw)(a),r),e=JSON.parse((0,_utilities_utils__WEBPACK_IMPORTED_MODULE_5__.H5)(_.data));"FAILED"==e.hdr.rst||"ERROR"==e.hdr.rst?react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error(JSON.stringify(e.fdr[0].rstmsg)):(react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.success("Successfully updated"),setTimeout((()=>{}),600),FetchMailTemplateAttachmentList(t),ResetScreenValue())}catch(l){console.log(l.message),react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error("Unable to process request")}},ref=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(),OnFileUpladHandler=async e=>{e.preventDefault();var fileCtrl=ref.current.value,filePath=ref.current.value;let MailTempltId=parseInt(MailTemplateId);var fExt=".html",allowedExtns=fExt.replace(/\,/g,"|");if(allowedExtns=allowedExtns.replace(/\./g,"\\."),allowedExtns="/("+allowedExtns.replace(/ /g,"")+")$/i;",allowedExtns=eval(allowedExtns),!allowedExtns.exec(filePath))return react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error("Invalid file type"),ref.current.value="",!1;const MAX_FILE_SIZE=2048;if(!selectedFile)return react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error("Please choose a file"),!1;const fileSizeKiloBytes=selectedFile.size/1024;if(fileSizeKiloBytes>MAX_FILE_SIZE)return react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error("File size is greater than maximum limit"),!1;const convID=(0,_utilities_utils__WEBPACK_IMPORTED_MODULE_5__.lk)(),frmHdr={convid:convID,tag:"uploadfilelments",orgid:"",vendid:"0"};console.log(fileSizeKiloBytes);const tmpltDet={};tmpltDet.cmbMailTemplateId=getValues("cmbMailTemplateId");const formData=new FormData;formData.append("tmpltdet",JSON.stringify(tmpltDet)),formData.append("file",selectedFile);const token=localStorage.getItem("token");try{const _=apiendpoints.upldmiltmltdoc;let e=await _api_Webcall__WEBPACK_IMPORTED_MODULE_4__.Ay.post(_,formData),t=JSON.parse((0,_utilities_utils__WEBPACK_IMPORTED_MODULE_5__.H5)(e.data));console.log(t),"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error(JSON.stringify(t.fdr[0].rstmsg)):(react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.success("Successfully updated"),setTimeout((()=>{}),600),FetchMailTemplateAttachmentList(MailTempltId),ResetScreenValue())}catch(err){console.log(err.message),react_toastify__WEBPACK_IMPORTED_MODULE_9__.oR.error("Unable to process request")}},onSubmitHandler=async _=>{},ShowAlert=(_,e)=>{setAlert({AlertType:_,message:e})};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.Fragment,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("section",{className:"vh-100",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div",{className:"container h-100",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div",{className:"card-header",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("strong",{className:"card-title",children:"Mail Template Attachment"})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"card-body p-md-5",children:[isLoading?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_htmlcomponents_Spinner__WEBPACK_IMPORTED_MODULE_6__.A,{}):"",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_htmlcomponents_Alerts__WEBPACK_IMPORTED_MODULE_7__.A,{alert:alert}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("form",{onSubmit:handleSubmit(onSubmitHandler),autocomplete:"off",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"row",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div",{className:"col-sm",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"mb-3",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label",{htmlFor:"cmbMailTemplateId",className:"form-label",children:"Template name"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select",{...register("cmbMailTemplateId"),onChange:MailTemplateOnChange,className:"form-control",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option",{value:"",children:"- Select -"}),resbody&&resbody.map((_=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option",{value:_.k,children:_.v},_.k)))]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p",{children:null===(_errors$cmbMailTempla=errors.cmbMailTemplateId)||void 0===_errors$cmbMailTempla?void 0:_errors$cmbMailTempla.message})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div",{className:"col-sm",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"mb-3",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("label",{htmlFor:"txtMailTmpAttchId",className:"form-label",children:[" ","Template Attachment Id"]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input",{...register("txtMailTmpAttchId"),type:"text",disabled:"disabled",readonly:"readonly",className:"form-control"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("p",{children:null===(_errors$txtMailTmpAtt=errors.txtMailTmpAttchId)||void 0===_errors$txtMailTmpAtt?void 0:_errors$txtMailTmpAtt.message})]})})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"row",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div",{className:"col-md-12",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("label",{htmlFor:"filElements",className:"form-label",children:"UI Html File"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input",{type:"file",name:"filElements",...register("filElements"),onChange:handleFileChange,ref:ref,className:"form-control"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div",{className:"col-md-12",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button",{type:"button",onClick:OnFileUpladHandler,className:"btn btn-primary mar-top-2em",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span",{className:"bi bi-upload"})," upload"]})})]})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(react_scrollbars_custom__WEBPACK_IMPORTED_MODULE_8__.Ze,{style:{width:1200,height:550},children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)(react_bootstrap_Table__WEBPACK_IMPORTED_MODULE_15__.A,{striped:!0,bordered:!0,hover:!0,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("thead",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th",{className:"text-center",children:"Id"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th",{className:"text-center",children:"File Name"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button",{className:"btn btn-success",onClick:()=>{},children:[" ",(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("i",{className:"bi bi-table"})," Add"," "]})})]})}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tbody",{children:miltmpltlsbody&&miltmpltlsbody.map((_=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr",{children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td",{children:_.attchid}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td",{children:_.filename}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td",{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button",{className:"btn btn-primary",onClick:()=>{DeleteTemplateAttachmentOnclick(_)},children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("i",{className:"bi bi-pen"})," Delete"]})})]})))})]})})]})})})})},__WEBPACK_DEFAULT_EXPORT__=MailTmplAttachment},67560:(_,e,t)=>{t.d(e,{Rd:()=>n,U_:()=>E,Yq:()=>i,dp:()=>c,fG:()=>l});t(65043);var a=t(80511),r=t(84756);const s=t(82585).F,l=async()=>{let _;const e=s.smtplst,t={hdr:{convid:(0,a.lk)(),tag:"smtplst",orgid:"",vendid:"0"},body:{}},l={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},i=e;return await r.Ay.post(i,(0,a.Yw)(t),l).then((function(e){const t=JSON.parse((0,a.H5)(e.data));_=t})),_},i=async()=>{let _;const e=s.miltmpltlst,t={hdr:{convid:(0,a.lk)(),tag:"miltmpltlst",orgid:"",vendid:"0"},body:{}},l={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},i=e;return await r.Ay.post(i,(0,a.Yw)(t),l).then((function(e){const t=JSON.parse((0,a.H5)(e.data));_=t})),_},c=async _=>{let e;const t=s.miltmltdoclst,l={hdr:{convid:(0,a.lk)(),tag:"miltmltdoclst",orgid:"",vendid:"0"},body:{cmbMailTemplateId:_}},i={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},c=t;return await r.Ay.post(c,(0,a.Yw)(l),i).then((function(_){const t=JSON.parse((0,a.H5)(_.data));e=t})),e},n=async _=>{let e;const t=s.delatchelm,l={txtMailAttchElmsId:_},i={hdr:{convid:(0,a.lk)(),tag:"delatchelm",orgid:"",vendid:"0"},body:l};console.log(l);const c=t;return await r.Ay.post(c,(0,a.Yw)(i),{}).then((function(_){const t=JSON.parse((0,a.H5)(_.data));e=t})),e},E=async _=>{let e;const t=s.getatchelmlst,l={hdr:{convid:(0,a.lk)(),tag:"getatchelmlst",orgid:"",vendid:"0"},body:{txtMailTemplateId:_}},i={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},c=t;return await r.Ay.post(c,(0,a.Yw)(l),i).then((function(_){const t=JSON.parse((0,a.H5)(_.data));e=t})),e}}}]);
//# sourceMappingURL=308.0e1f3686.chunk.js.map