"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[694],{90724:(e,t,s)=>{s.r(t),s.d(t,{default:()=>j});var l=s(65043),r=s(24858),a=s(91036),n=s(8204),c=s(47046),d=s(18403),i=s(73033),o=s(57492),m=s(80511),x=s(84756),u=s(82585),p=s(89312),_=s(70579);const g=function(e){let{elmList:t,setElementValue:s,delElement:l}=e;return t.map(((e,t)=>{const{ElmName:r,ControlType:a,DataType:n,Caption:c,ParentElmName:d,MaxLength:i,RangeFrom:o,RangeTo:m,SizeInKB:x,FileExt:u,IsFrmGrid:p,ElementId:g,ControlId:h,DataTypeId:b,ParentElementId:j,ParentControlId:E,CmbCod:S,CmbCon:y,ConStr:v}=e;let f="";return 3==h?f=S+" | "+(null!=v?v:"")+" | "+(null!=y?y:""):2==h?f=(null!=o?o:"")+" - "+(null!=m?m:""):9==h?f=(null!=x?x+"kb":"")+" - "+(null!=u?u:""):10==h&&(f=p?"From Grid":""),(0,_.jsxs)("tr",{children:[(0,_.jsx)("td",{children:g}),(0,_.jsxs)("td",{children:[" ",(0,_.jsx)("button",{onClick:()=>s(e),class:"btn btn-link",children:r}),"  "]}),(0,_.jsx)("td",{children:d}),(0,_.jsxs)("td",{children:[a,"/",n]}),(0,_.jsx)("td",{children:i}),(0,_.jsx)("td",{children:f}),(0,_.jsx)("td",{children:(0,_.jsx)("button",{onClick:()=>l(g),class:"btn btn-light clr-gray",children:(0,_.jsx)("i",{class:"fa fa-trash-o"})})})]},t)}))},h=u.F,b=i.Ik().shape({txtElementName:i.Yj().required("Pls provide element name"),txtCaption:i.Yj().required("Pls provide caption "),cmbControlType:i.Yj().required("Pls select control type"),cmbDataType:i.Yj().required("Pls select data type")});const j=function(e){let{ScrId:t}=e;const[s,i]=(0,l.useState)([]),[u,j]=(0,l.useState)([]),[E,S]=(0,l.useState)([]),[y,v]=(0,l.useState)([]),[f,I]=(0,l.useState)([]),[N,C]=(0,l.useState)(""),[T,D]=(0,l.useState)(!1),{register:M,handleSubmit:F,formState:{errors:O},reset:A,getValues:P}=(0,r.mN)({resolver:(0,d.t)(b)}),R=async e=>{const t=await(0,p.R)(e);v(t.body.elements)};(0,l.useEffect)((()=>{(async()=>{const e=await(0,o.n)("|CTL|DTTY|CTBL|","");i(e.body.ctl),j(e.body.dtty),S(e.body.ctbl)})()}),[]),(0,l.useEffect)((()=>{R(t)}),[]);const w=e=>{let t=e.target.value;"File"!=t&&A({txtSizeInKB:"",txtFileExt:""}),"ComboBox"!=t&&A({txtCmbCode:"",txtCmbCon:"",cmbDbShortName:"0"}),"NumericBox"!=t&&A({txtRangeFrom:"",txtRangeTo:""})},k=()=>{A({txtElementId:"",txtElementName:"",cmbControlType:"0",cmbDataType:"0",txtCaption:"",txtParentElement:"0",txtMaxLength:"",txtRangeFrom:"",cbIsFrmGrid:!1,txtSizeInKB:"",txtFileExt:"",txtRangeTo:"",txtCmbCode:"",txtCmbCon:"",cmbDbShortName:"0",txtDefaultValue:""})};(0,l.useEffect)((()=>{A({txtDefaultValue:f})}),[f]);const U=async e=>{if(window.confirm("Are you sure, do you want delete this element ?")){let l={scrid:t,txtElementId:e};const r=h.DeleteElement,n={},c={hdr:{convid:(0,m.lk)(),tag:"Delete Element",orgid:"",vendid:"0"},body:l};try{const e=await x.Ay.post(r,(0,m.Yw)(c),n),s=JSON.parse((0,m.H5)(e.data));if("SUCCESS"==s.hdr.rst)setTimeout((()=>{C({AlertType:"Success",message:"Successfully updated"}),a.oR.success("Successfully updated"),setTimeout((()=>{C({AlertType:"null",message:"null"})}),600),k(),R(t),D(!1)}),300);else{let e=JSON.stringify(s.fdr[0].rstmsg);setTimeout((()=>{C({AlertType:"Error",message:e}),a.oR.error(e),setTimeout((()=>{C({AlertType:"null",message:"null"})}),600),D(!1)}),300)}}catch(s){console.log(s.message),a.oR.error("Unable to process request"),C({AlertType:"Error",message:"Unable to process request"}),D(!1)}}},L=async e=>{var s=e.txtCaption;null==e.txtCaption&&(s="");e.txtElementId;e.txtElementId;var l=e.txtFileExt;null==e.txtFileExt&&(l="");var r=e.txtMaxLength;null==e.txtMaxLength&&(r="");var n=e.txtParentElement;null!=e.txtParentElement&&"0"!=e.txtParentElement||(n="");var c=e.txtRangeFrom;null==e.txtRangeFrom&&(c="");var d=e.txtRangeTo;null==e.txtRangeTo&&(d="");var i=e.txtSizeInKB;null==e.txtSizeInKB&&(i="");var o=e.cbIsFrmGrid;null==e.cbIsFrmGrid&&(o=!1);let u={cmbControlType:e.cmbControlType,cmbDataType:e.cmbDataType,scrid:t,txtCaption:s,txtElementId:P("txtElementId"),txtElementName:e.txtElementName,txtFileExt:l,txtMaxLength:r,txtParentElement:n,txtRangeFrom:c,txtRangeTo:d,cbIsFrmGrid:o,txtSizeInKB:i,txtCmbCode:e.txtCmbCode,txtCmbCon:e.txtCmbCon,cmbDbShotName:e.cmbDbShortName,txtDefaultValue:e.txtDefaultValue};const p={},_={hdr:{convid:(0,m.lk)(),tag:"Update Element",orgid:"",vendid:"0"},body:u},g=h.UpdateElement;try{const e=await x.Ay.post(g,(0,m.Yw)(_),p),s=JSON.parse((0,m.H5)(e.data));if(console.log(s),"SUCCESS"==s.hdr.rst)setTimeout((()=>{C({AlertType:"Success",message:"Successfully updated"}),a.oR.success("Successfully updated"),setTimeout((()=>{C({AlertType:"null",message:"null"})}),600),k(),R(t),D(!1)}),300);else{let e=JSON.stringify(s.fdr[0].rstmsg);setTimeout((()=>{C({AlertType:"Error",message:e}),a.oR.error(e),setTimeout((()=>{C({AlertType:"null",message:"null"})}),600),D(!1)}),300)}}catch(b){console.log(b.message),a.oR.error("Unable to process request"),C({AlertType:"Error",message:"Unable to process request"}),D(!1)}};try{var B,K,W,G,q;return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)("div",{children:[T?(0,_.jsx)(c.A,{}):"",(0,_.jsx)(n.A,{alert:N})]}),(0,_.jsxs)("div",{className:"row",children:[(0,_.jsx)("div",{className:"col-md-4",children:(0,_.jsx)("form",{onSubmit:F(L),autoComplete:"off",children:(0,_.jsxs)("div",{className:"row",children:[(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtElementName",className:"form-label",children:"Element Name"}),(0,_.jsx)("input",{...M("txtElementName"),type:"text",className:"form-control"}),(0,_.jsx)("p",{children:null===(B=O.txtElementName)||void 0===B?void 0:B.message})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtCaption",className:"form-label",children:"Caption"}),(0,_.jsx)("input",{...M("txtCaption"),type:"text",className:"form-control"}),(0,_.jsx)("p",{children:null===(K=O.txtCaption)||void 0===K?void 0:K.message})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"cmbControlType",className:"form-label",children:"Control Type"}),(0,_.jsxs)("select",{...M("cmbControlType"),className:"form-control",onChange:w,children:[(0,_.jsx)("option",{value:"0",children:"- Select -"}),s.map((e=>(0,_.jsx)("option",{value:e.v,children:e.v},e.k)))]}),(0,_.jsx)("p",{children:null===(W=O.cmbControlType)||void 0===W?void 0:W.message})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"cmbDataType",className:"form-label",children:"Data Type"}),(0,_.jsxs)("select",{...M("cmbDataType"),className:"form-control",children:[(0,_.jsx)("option",{value:"0",children:"- Select -"}),u.map((e=>(0,_.jsx)("option",{value:e.v,children:e.v},e.k)))]}),(0,_.jsx)("p",{children:null===(G=O.cmbDataType)||void 0===G?void 0:G.message})]}),(0,_.jsxs)("div",{className:"col-md-3",children:[(0,_.jsx)("label",{htmlFor:"txtMaxLength",className:"form-label",children:"Max Length"}),(0,_.jsx)("input",{...M("txtMaxLength"),type:"text",className:"form-control"}),(0,_.jsx)("p",{children:null===(q=O.txtMaxLength)||void 0===q?void 0:q.message})]}),(0,_.jsxs)("div",{className:"col-md-3 pad-top-2-5em",children:[(0,_.jsx)("input",{...M("cbIsFrmGrid"),type:"checkbox"}),"\xa0\xa0",(0,_.jsx)("label",{htmlFor:"cbIsFrmGrid",className:"form-label",children:"Form Grid"})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtParentElement",className:"form-label",children:"Parent Element"}),(0,_.jsxs)("select",{...M("txtParentElement"),type:"text",className:"form-control",children:[(0,_.jsx)("option",{value:"0",children:"- Select -"}),y.map((e=>(0,_.jsx)("option",{value:e.ElmName,children:e.ElmName},e.ElementId)))]})]}),(0,_.jsx)("div",{id:"divRange",className:"dispNone1",children:(0,_.jsxs)("div",{className:"row",children:[(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtRangeFrom",className:"form-label",children:"Range From"}),(0,_.jsx)("input",{...M("txtRangeFrom"),type:"text",className:"form-control"})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtRangeTo",className:"form-label",children:"Range To"}),(0,_.jsx)("input",{...M("txtRangeTo"),type:"text",className:"form-control"})]})]})}),(0,_.jsx)("div",{id:"divFile",className:"dispNone1",children:(0,_.jsxs)("div",{className:"row",children:[(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtSizeInKB",className:"form-label",children:"Size(KB)"}),(0,_.jsx)("input",{...M("txtSizeInKB"),type:"text",className:"form-control"})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtFileExt",className:"form-label",children:"File Ext."}),(0,_.jsx)("input",{...M("txtFileExt"),type:"text",className:"form-control"})]})]})}),(0,_.jsx)("div",{id:"divCmbConfig",className:"dispNone1",children:(0,_.jsxs)("div",{className:"row",children:[(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtCmbCode",className:"form-label",children:"Combo Code"}),(0,_.jsx)("input",{...M("txtCmbCode"),type:"text",className:"form-control"})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"cmbDbShortName",className:"form-label",children:"Combo Db Connection"}),(0,_.jsxs)("select",{...M("cmbDbShortName"),className:"form-control",children:[(0,_.jsx)("option",{value:"0",children:"-select-"}),E.map((e=>(0,_.jsx)("option",{value:e.k,children:e.k},e.v)))]})]}),(0,_.jsxs)("div",{className:"col-md-12",children:[(0,_.jsx)("label",{htmlFor:"txtCmbCon",className:"form-label",children:"Combo condition / Query"}),(0,_.jsx)("input",{...M("txtCmbCon"),type:"text",className:"form-control"})]}),(0,_.jsxs)("div",{className:"col-md-12",children:[(0,_.jsx)("label",{htmlFor:"txtDefaultValue",className:"form-label",children:"Default Value"}),(0,_.jsx)("input",{...M("txtDefaultValue"),type:"text",className:"form-control"})]})]})}),(0,_.jsxs)("div",{className:"row pad-top-15",children:[(0,_.jsx)("div",{className:"col-md-3",children:(0,_.jsx)("button",{type:"submit",className:"btn btn-success",children:"Submit"})}),(0,_.jsx)("div",{className:"col-md-3",children:(0,_.jsx)("button",{type:"button",className:"btn btn-warning",onClick:k,children:"Reset"})}),(0,_.jsx)("div",{className:"col-md-6",children:(0,_.jsx)("input",{...M("txtElementId"),type:"text",className:"form-control",readonly:"readonly"})})]})]})})}),(0,_.jsx)("div",{className:"col-md-8",children:(0,_.jsxs)("table",{className:"lst-grid",children:[(0,_.jsx)("thead",{children:(0,_.jsxs)("tr",{children:[(0,_.jsx)("th",{children:"Id"}),(0,_.jsx)("th",{children:"Name / Caption"}),(0,_.jsx)("th",{children:"Parent"}),(0,_.jsx)("th",{children:"Ctl / Data"}),(0,_.jsx)("th",{children:"Length"}),(0,_.jsx)("th",{children:"Property"}),(0,_.jsx)("th",{children:"Manage"})]})}),(0,_.jsx)("tbody",{children:(0,_.jsx)(g,{elmList:y,setElementValue:function(e){(async(e,t)=>{const s=await(0,p.b)(e,t);I(s.body.defaultvalue)})(t,e.ElementId),A({txtElementId:e.ElementId,txtElementName:e.ElmName,cmbControlType:e.ControlType,cmbDataType:e.DataType,txtCaption:e.Caption,txtParentElement:e.ParentElmName,txtMaxLength:e.MaxLength,txtRangeFrom:e.RangeFrom,txtRangeTo:e.RangeTo,cbIsFrmGrid:e.IsFrmGrid,txtSizeInKB:e.SizeInKB,txtFileExt:e.FileExt,txtCmbCode:e.CmbCod,txtCmbCon:e.CmbCon,cmbDbShortName:e.ConStr,txtDefaultValue:f})},delElement:U})})]})})]})]})}catch(V){console.log(V.message)}}},91694:(e,t,s)=>{s.r(t),s.d(t,{default:()=>M});var l=s(65043),r=(s(97950),s(91036)),a=s(84391),n=s(24858),c=s(5328),d=s(21761),i=s(18403),o=s(73033),m=s(98517),x=s(90724),u=s(25644),p=s(1747),_=s(84756),g=s(7129),h=s(40913),b=s(24638),j=s(80511),E=s(82585),S=s(70579);const y=E.F;const v=function(e){let{ScrId:t}=e;const[s,a]=(0,l.useState)([]),[c,d]=(0,l.useState)([]),[i,o]=(0,l.useState)([]),{register:m,getValues:x,setValue:u,formState:{errors:p},reset:E}=(0,n.mN)(),v=async(e,s,l,a)=>{const n={},c={hdr:{convid:(0,j.lk)(),tag:s,orgid:"",vendid:"0"},body:e};let d=x("cmbStgId");try{const e=await _.Ay.post(l,(0,j.Yw)(c),n),s=JSON.parse((0,j.H5)(e.data));"SUCCESS"==s.hdr.rst?setTimeout((()=>{r.oR.success("Successfully updated"),1==a&&D(t,d)}),300):setTimeout((()=>{r.oR.error(JSON.stringify(s.fdr[0].rstmsg))}),300)}catch(i){setTimeout((()=>{r.oR.error("Unable to process request")}),300)}},f=e=>{let s=x("cmbStgId"),l=x("txtSelectedExpGroupId"),r=e.stgelmdsgid,a=e.evntid;if("[]"!=l){let e=[],n=JSON.parse(l),c=0;n.forEach((t=>{var s={exgrpid:t,ord:++c};e.push(s)})),v({cmbScrId:t,cmbStgId:s,cmbStgElmDsigId:r,cmbEvntId:a,expgrps:e},"Update Event ExpGroup Map",y.Updexgrpmap,1)}},I=(e,s)=>{let l=x("cmbStgId"),r={cmbScrId:t,cmbStgId:l,exprGrpMapId:e.exprgrpmapid,txtDirection:s};v(r,"Reorder Event ExpGroup Map",y.Reordexgrpmap,1)},N=()=>{if(c){let e=c.filter((e=>null==e.parentid));return(0,S.jsx)(S.Fragment,{children:e.length>0?(0,S.jsx)("ul",{children:e.map((e=>(0,S.jsx)(S.Fragment,{children:(0,S.jsx)(C,{treenode:e})})))}):(0,S.jsx)(S.Fragment,{})})}},C=e=>{let{treenode:s}=e,l=c.filter((e=>e.parentid==s.id));return l.sort(((e,t)=>e.ord<t.ord?-1:1)),l.length>0?(0,S.jsx)("li",{children:(0,S.jsxs)("details",{open:!0,children:[(0,S.jsx)("summary",{id:"id"+s.id,children:"EVNT"==s.ty?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("input",{type:"checkbox",onChange:e=>{}}),(0,S.jsx)("button",{type:"button",id:"expgrp"+s.id,className:"btn btn-light",onClick:()=>f(s),children:(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.elmname}})}),(0,S.jsx)("button",{type:"button",className:"btn btn-light clr-gray",onClick:()=>(e=>{if(window.confirm("Are you sure, do you want delete this event mapping ?")){let s=x("cmbStgId"),l=[];c.filter((t=>t.parentid==e.id)).forEach((e=>{l.push(e.exprgrpmapid)}));let r={cmbScrId:t,cmbStgId:s,cmbStgElmDsigId:e.stgelmdsgid,cmbEvntId:e.evntid,exprGrpMapIds:l};v(r,"Delete Event ExpGroup Map",y.Delexgrpmap,1)}})(s),children:(0,S.jsx)("i",{className:"fa fa-trash-o"})})]}):(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.elmname}})}),(0,S.jsx)("ul",{children:l.map((e=>(0,S.jsx)(C,{treenode:e})))})]})}):(0,S.jsxs)("li",{id:"id"+s.id,children:["EXPGR"==s.ty?(0,S.jsx)("input",{type:"checkbox",id:"expgrp"+s.id}):(0,S.jsx)(S.Fragment,{}),(0,S.jsx)("span",{children:"\xa0"}),"EVNT"==s.ty?(0,S.jsx)("button",{type:"button",id:"expgrp"+s.id,className:"btn btn-light",onClick:()=>f(s),children:(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.elmname}})}):(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.ord+" "+s.elmname}}),"EXPGR"==s.ty?(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)("button",{type:"button",className:"btn btn-light clr-gray",onClick:()=>(e=>{if(window.confirm("Are you sure, do you want delete this expression mapping ?")){let s=x("cmbStgId"),l=[];l.push(e.exprgrpmapid);let r={cmbScrId:t,cmbStgId:s,cmbStgElmDsigId:e.stgelmdsgid,cmbEvntId:e.evntid,exprGrpMapIds:l};v(r,"Delete Event ExpGroup Map",y.Delexgrpmap,1)}})(s),children:(0,S.jsx)("i",{className:"fa fa-trash-o"})}),(0,S.jsx)("button",{type:"button",className:"btn btn-light clr-gray",onClick:()=>I(s,"U"),children:(0,S.jsx)("i",{className:"fa fa-arrow-up"})}),(0,S.jsx)("button",{type:"button",className:"btn btn-light clr-gray",onClick:()=>I(s,"D"),children:(0,S.jsx)("i",{className:"fa fa-arrow-down"})})]}):(0,S.jsx)(S.Fragment,{})]})},T=()=>{let e=new Array,t=-1;const s=(e,t)=>{((e,t)=>{let s;if(s="[]"==x("txtSelectedExpGroupId")?[]:JSON.parse(x("txtSelectedExpGroupId")),e)-1==s.indexOf(t)&&s.push(t);else{const e=s.indexOf(t);e>-1&&s.splice(e,1)}u("txtSelectedExpGroupId",JSON.stringify(s))})(e.target.checked,t)};return i?(0,S.jsx)(S.Fragment,{children:i.length>0?i.map(((l,r)=>(++t,e[t]=l.egid,(0,S.jsxs)("tr",{children:[(0,S.jsx)("td",{align:"center",children:(0,S.jsx)("input",{...m("S_"+e[t]),type:"checkbox",onClick:e=>s(e,l.egid)})}),(0,S.jsx)("td",{children:l.egname})]},r)))):(0,S.jsx)(S.Fragment,{})}):(0,S.jsx)(S.Fragment,{})},D=async(e,t)=>{const s=await(0,h.M)(e,t);d(s.body.evnts),E({txtSelectedExpGroupId:"[]"})};return(0,l.useEffect)((()=>{(async e=>{const t=await(0,g.K)(e);a(t.body.Stages.filter((e=>9!==e.StageTypeId)))})(t)}),[]),(0,l.useEffect)((()=>{(async()=>{const e=await(0,b.C)(t);o(e.body.expressions)})()}),[]),(0,S.jsx)(S.Fragment,{children:(0,S.jsx)("form",{autoComplete:"off",children:(0,S.jsxs)("div",{className:"row",children:[(0,S.jsxs)("div",{className:"col-md-5",children:[(0,S.jsx)("div",{className:"row",children:(0,S.jsxs)("div",{className:"col-md-12",children:[(0,S.jsx)("label",{htmlFor:"cmbStgId",className:"form-label",children:"Stage"}),(0,S.jsxs)("select",{...m("cmbStgId"),className:"form-select",onChange:e=>{var s=e.target.value;D(t,s)},children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),s.map((e=>(0,S.jsx)("option",{value:e.StageId,children:e.StageName},e.StageId)))]})]})}),(0,S.jsx)("div",{className:"tree",children:(0,S.jsx)(N,{})})]}),(0,S.jsx)("div",{className:"col-md-7",children:(0,S.jsxs)("div",{className:"row",children:["Expression Group List",(0,S.jsx)("input",{...m("txtSelectedExpGroupId"),type:"text",readonly:"readonly",disabled:"disabled",className:"dispNone1"}),(0,S.jsxs)("table",{className:"lst-grid",children:[(0,S.jsx)("thead",{children:(0,S.jsxs)("tr",{children:[(0,S.jsx)("th",{className:"col-md-1",children:(0,S.jsx)("button",{type:"button",className:"btn-link",onClick:()=>(u("txtSelectedExpGroupId","[]"),void i.map((e=>{u("S_"+e.egid,!1)}))),children:"Clear"})}),(0,S.jsx)("th",{className:"col-md-11",children:"Expression Group"})]})}),(0,S.jsx)("tbody",{children:(0,S.jsx)(T,{})})]})]})})]})})})},f=E.F;const I=function(e){let{ScrId:t}=e;const[s,a]=(0,l.useState)([]),[c,d]=(0,l.useState)([]),{register:i,getValues:o,setValue:m,formState:{errors:x},reset:u}=(0,n.mN)(),p=async(e,s,l,a)=>{const n={},c={hdr:{convid:(0,j.lk)(),tag:s,orgid:"",vendid:"0"},body:e};let d=o("cmbStgId");try{const e=await _.Ay.post(l,(0,j.Yw)(c),n),s=JSON.parse((0,j.H5)(e.data));if("SUCCESS"==s.hdr.rst)if(2==a){if(m("txtScrCEventId",""),m("txtStgElmDesignId",""),m("txtEventId",""),m("txtScript",""),s.body.evnts&&s.body.evnts.length>0){var i=s.body.evnts[0];document.getElementById("lblClientScript").innerHTML=i.elmna+" - "+i.evnt,m("txtScrCEventId",i.scrcevntid),m("txtStgElmDesignId",i.stgemldsnid),m("txtEventId",i.evntid),m("txtScript",i.script)}}else setTimeout((()=>{r.oR.success("Successfully updated"),m("txtScrCEventId",""),m("txtStgElmDesignId",""),m("txtEventId",""),m("txtScript",""),y(t,d)}),300);else setTimeout((()=>{r.oR.error(JSON.stringify(s.fdr[0].rstmsg))}),300)}catch(x){setTimeout((()=>{r.oR.error("Unable to process request")}),300)}},b=()=>{if(c){console.log(c);let e=c.filter((e=>null==e.parentid));return(0,S.jsx)(S.Fragment,{children:e.length>0?(0,S.jsx)("ul",{children:e.map((e=>(0,S.jsx)(S.Fragment,{children:(0,S.jsx)(E,{treenode:e})})))}):(0,S.jsx)(S.Fragment,{})})}},E=e=>{let{treenode:s}=e,l=c.filter((e=>e.parentid==s.id));return l.sort(((e,t)=>e.ord<t.ord?-1:1)),l.length>0?(0,S.jsx)("li",{children:(0,S.jsxs)("details",{children:[(0,S.jsx)("summary",{id:"id"+s.id,children:(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.elmname}})}),(0,S.jsx)("ul",{children:l.map((e=>(0,S.jsx)(E,{treenode:e})))})]})}):(0,S.jsxs)("li",{id:"id"+s.id,children:[(0,S.jsx)("button",{type:"button",id:"expgrp"+s.id,className:"btn btn-light",onClick:()=>(e=>{let s=o("cmbStgId"),l=e.stgelmdsgid,r=e.evntid;p({cmbScrId:t,cmbStgId:s,cmbStgElmDsigId:l,cmbEvntId:r},"Get client Event script",f.Getclntsrpt,2)})(s),children:(0,S.jsx)("span",{dangerouslySetInnerHTML:{__html:s.elmname}})}),s.scrceventid?(0,S.jsx)("button",{type:"button",className:"btn btn-light clr-gray",onClick:()=>(e=>{if(window.confirm("Are you sure, do you want delete this script ?")){let s=o("cmbStgId"),l={cmbScrId:t,cmbStgId:s,txtScrCEventId:e.scrceventid};p(l,"Delete client Script",f.Delclntsrpt,1)}})(s),children:(0,S.jsx)("i",{className:"fa fa-trash-o"})}):(0,S.jsx)(S.Fragment,{})]})},y=async(e,t)=>{const s=await(0,h.N)(e,t);d(s.body.evnts)};return(0,l.useEffect)((()=>{(async e=>{const t=await(0,g.K)(e);a(t.body.Stages.filter((e=>9!==e.StageTypeId)))})(t)}),[]),(0,S.jsx)(S.Fragment,{children:(0,S.jsx)("form",{autoComplete:"off",children:(0,S.jsxs)("div",{className:"row",children:[(0,S.jsxs)("div",{className:"col-md-5",children:[(0,S.jsx)("div",{className:"row",children:(0,S.jsxs)("div",{className:"col-md-12",children:[(0,S.jsx)("label",{htmlFor:"cmbStgId",className:"form-label",children:"Stage"}),(0,S.jsxs)("select",{...i("cmbStgId"),className:"form-select",onChange:e=>{var s=e.target.value;m("txtScrCEventId",""),m("txtStgElmDesignId",""),m("txtEventId",""),m("txtScript",""),y(t,s)},children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),s.map((e=>(0,S.jsx)("option",{value:e.StageId,children:e.StageName},e.StageId)))]})]})}),(0,S.jsx)("div",{className:"tree",children:(0,S.jsx)(b,{})})]}),(0,S.jsx)("div",{className:"col-md-7",children:(0,S.jsxs)("div",{className:"row",children:[(0,S.jsxs)("div",{className:"col-md-12",children:[(0,S.jsx)("span",{children:(0,S.jsx)("b",{children:"Client Script :"})}),(0,S.jsx)("label",{id:"lblClientScript",className:"form-label"})]}),(0,S.jsxs)("div",{className:"col-md-12",children:[(0,S.jsx)("input",{...i("txtScrCEventId"),type:"text",readonly:"readonly",disabled:"disabled"}),(0,S.jsx)("input",{...i("txtStgElmDesignId"),type:"text",readonly:"readonly",disabled:"disabled"}),(0,S.jsx)("input",{...i("txtEventId"),type:"text",readonly:"readonly",disabled:"disabled"}),(0,S.jsx)("span",{children:"\xa0\xa0"}),(0,S.jsx)("button",{type:"button",className:"btn-link btn-link-bg-border",onClick:()=>{let e=o("cmbStgId"),s={cmbScrId:t,cmbStgId:e,txtScrCEventId:o("txtScrCEventId"),txtStgElmDsigId:o("txtStgElmDesignId"),txtEvntId:o("txtEventId"),txtScript:o("txtScript")};p(s,"Update client Event script",f.Updclntsrpt,3)},children:"Update"})]}),(0,S.jsx)("div",{className:"col-md-12",children:(0,S.jsx)("textarea",{...i("txtScript"),type:"textarea",rows:20,className:"form-control"})})]})})]})})})};var N=s(50956),C=s(8387);const T=E.F,D=o.Ik().shape({txtStageName:o.Yj().required("Pls provide stage Name")});const M=function(){const[e,t]=(0,l.useState)([]),[s,o]=(0,l.useState)([]),{register:g,formState:{errors:h}}=(0,n.mN)({resolver:(0,i.t)(D)});(0,l.useEffect)((()=>{(async()=>{const e=await(0,C.m)();o(e.body.Screens.filter((e=>1==e.IsActive)))})()}),[]);const b=e=>{t(e.target.value);const s=document.getElementById("divStageMaster");(0,a.createRoot)(s).render((0,S.jsx)(S.Fragment,{}));const l=document.getElementById("divElementMaster");(0,a.createRoot)(l).render((0,S.jsx)(S.Fragment,{}));const r=document.getElementById("divUIDesign");(0,a.createRoot)(r).render((0,S.jsx)(S.Fragment,{}));const n=document.getElementById("divEvntExprGroup");(0,a.createRoot)(n).render((0,S.jsx)(S.Fragment,{}));const c=document.getElementById("divEvntExprGroupMap");(0,a.createRoot)(c).render((0,S.jsx)(S.Fragment,{}));const d=document.getElementById("divClientEvent");(0,a.createRoot)(d).render((0,S.jsx)(S.Fragment,{}))},E=e=>{switch(e){case"stage":y();break;case"element":f();break;case"uidesign":M();break;case"expression":F();break;case"expevntmap":O();break;case"clientevent":A();break;case"taskelement":P()}},y=()=>{const t=document.getElementById("divStageMaster");(0,a.createRoot)(t).render((0,S.jsx)(m.default,{ScrId:e}))},f=()=>{const t=document.getElementById("divElementMaster");(0,a.createRoot)(t).render((0,S.jsx)(x.default,{ScrId:e}))},M=()=>{const t=document.getElementById("divUIDesign");(0,a.createRoot)(t).render((0,S.jsx)(u.default,{ScrId:e}))},F=()=>{const t=document.getElementById("divEvntExprGroup");(0,a.createRoot)(t).render((0,S.jsx)(p.default,{ScrId:e}))},O=()=>{const t=document.getElementById("divEvntExprGroupMap");(0,a.createRoot)(t).render((0,S.jsx)(v,{ScrId:e}))},A=()=>{const t=document.getElementById("divClientEvent");(0,a.createRoot)(t).render((0,S.jsx)(I,{ScrId:e}))},P=()=>{const t=document.getElementById("divTaskElements");(0,a.createRoot)(t).render((0,S.jsx)(N.A,{ScrId:e}))};try{var R;return(0,S.jsxs)(S.Fragment,{children:[(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"card-header",children:(0,S.jsx)("strong",{className:"card-title",children:"Screen Definer "})}),(0,S.jsxs)("div",{className:"col-md-4",children:[(0,S.jsxs)("select",{...g("cmbScrId"),className:"form-control",onChange:b,children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),s.map((e=>(0,S.jsx)("option",{value:e.ScreenId,children:e.ScrName},e.ScreenId)))]}),(0,S.jsx)("p",{children:null===(R=h.cmbScreenId)||void 0===R?void 0:R.message})]}),(0,S.jsx)("div",{className:"col-md-3",children:(0,S.jsx)("button",{className:"btn btn-primary",onClick:()=>(async()=>{let t={};t.scrid=e,t.scrname="";const s={},l={hdr:{convid:(0,j.lk)(),tag:"Pubish Screen",orgid:"",vendid:"0"},body:t};try{const e=await _.Ay.post(T.BuildScrn,(0,j.Yw)(l),s);"SUCCESS"==JSON.parse((0,j.H5)(e.data)).hdr.rst?setTimeout((()=>{r.oR.success("Screen Published")}),300):setTimeout((()=>{r.oR.error("Failed to Publish")}),300)}catch(a){setTimeout((()=>{r.oR.error("Unable to process request")}),300)}})(),children:"Publish"})})]}),(0,S.jsx)("div",{className:"row",children:(0,S.jsxs)(d.A,{defaultActiveKey:"profile",id:"uncontrolled-tab-example",className:"mb-3",onSelect:E,children:[(0,S.jsx)(c.A,{eventKey:"stage",title:"Stage",children:(0,S.jsx)("div",{id:"divStageMaster"})}),(0,S.jsx)(c.A,{eventKey:"element",title:"Elements",children:(0,S.jsx)("div",{id:"divElementMaster"})}),(0,S.jsx)(c.A,{eventKey:"uidesign",title:"UI Design",children:(0,S.jsx)("div",{id:"divUIDesign"})}),(0,S.jsx)(c.A,{eventKey:"expression",title:"Expression Group",children:(0,S.jsx)("div",{id:"divEvntExprGroup"})}),(0,S.jsx)(c.A,{eventKey:"expevntmap",title:"Expression & Event Map",children:(0,S.jsx)("div",{id:"divEvntExprGroupMap"})}),(0,S.jsx)(c.A,{eventKey:"clientevent",title:"Client Event",children:(0,S.jsx)("div",{id:"divClientEvent"})}),(0,S.jsx)(c.A,{eventKey:"taskelement",title:"Task Element",children:(0,S.jsx)("div",{id:"divTaskElements"})})]})})]})}catch(w){throw console.log(w.message),w}}},98517:(e,t,s)=>{s.r(t),s.d(t,{default:()=>j});var l=s(65043),r=s(24858),a=s(91036),n=s(8204),c=s(47046),d=s(18403),i=s(73033),o=s(57492),m=s(7129),x=s(80511),u=s(84756),p=s(82585),_=s(70579);const g=function(e){let{stageList:t,setStageValue:s,delStage:l}=e;return void 0!==t?t.map(((e,t)=>{const{StageId:r,ScreenId:a,StageName:n,Ord:c,StageTypeId:d,StageFile:i,StageType:o}=e;return(0,_.jsxs)("tr",{children:[(0,_.jsx)("td",{children:c}),(0,_.jsx)("td",{children:r}),(0,_.jsxs)("td",{children:[" ",(0,_.jsx)("button",{onClick:()=>s(e),class:"btn btn-link",children:n}),"  "]}),(0,_.jsx)("td",{children:o}),(0,_.jsx)("td",{children:(0,_.jsx)("button",{onClick:()=>l(r),class:"btn btn-light clr-gray",children:(0,_.jsx)("i",{class:"fa fa-trash-o"})})})]},t)})):(0,_.jsx)(_.Fragment,{})},h=p.F,b=i.Ik().shape({txtStageName:i.Yj().required("Pls provide stage name"),cmbStageTypeId:i.Yj().required("Pls select stage type"),ntxtOrd:i.Yj().required("Pls provide order")});const j=function(e){let{ScrId:t}=e;const[s,i]=(0,l.useState)([]),[p,j]=(0,l.useState)([]),[E,S]=(0,l.useState)(""),[y,v]=(0,l.useState)(!1),{register:f,handleSubmit:I,formState:{errors:N},reset:C}=(0,r.mN)({resolver:(0,d.t)(b)}),T=async e=>{const t=await(0,m.K)(e);j(t.body.Stages)};(0,l.useEffect)((()=>{(async()=>{const e=await(0,o.n)("|STGTY|","");i(e.body.stgty)})()}),[]),(0,l.useEffect)((()=>{T(t)}),[]);const D=()=>{C({txtStageId:"",txtStageName:"",ntxtOrd:"",cmbStageTypeId:"",txtStageFile:""})},M=async e=>{if(window.confirm("Are you sure, do you want delete this stage ?")){let l={txtStageId:e};const r=h.DelStageMaster,n={},c={hdr:{convid:(0,x.lk)(),tag:"Delete Stage",orgid:"",vendid:"0"},body:l};try{const e=await u.Ay.post(r,(0,x.Yw)(c),n),s=JSON.parse((0,x.H5)(e.data));if("SUCCESS"==s.hdr.rst)setTimeout((()=>{S({AlertType:"Success",message:"Successfully updated"}),a.oR.success("Successfully updated"),setTimeout((()=>{S({AlertType:"null",message:"null"})}),600),D(),T(t),v(!1)}),300);else{let e=JSON.stringify(s.fdr[0].rstmsg);setTimeout((()=>{S({AlertType:"Error",message:e}),a.oR.error(e),setTimeout((()=>{S({AlertType:"null",message:"null"})}),600),v(!1)}),300)}}catch(s){console.log(s.message),a.oR.error("Unable to process request"),S({AlertType:"Error",message:"Unable to process request"}),v(!1)}}},F=async e=>{let s=e.txtStageId;void 0==e.txtStageId&&(s="0");let l={txtStageId:s,txtScreenId:t,txtStageName:e.txtStageName,ntxtOrd:e.ntxtOrd,cmbStageTypeId:e.cmbStageTypeId,txtStageFile:e.txtStageFile};const r=h.UpdStageMaster;v(!0);const n={},c={hdr:{convid:(0,x.lk)(),tag:"Stage Update",orgid:"",vendid:"0"},body:l};try{const e=await u.Ay.post(r,(0,x.Yw)(c),n),s=JSON.parse((0,x.H5)(e.data));"SUCCESS"==s.hdr.rst?setTimeout((()=>{S({AlertType:"Success",message:"Successfully updated"}),a.oR.success("Successfully updated"),setTimeout((()=>{S({AlertType:"null",message:"null"})}),600),D(),T(t),v(!1)}),300):(S({AlertType:"Error",message:JSON.stringify(s.fdr[0].rstmsg)}),v(!1))}catch(d){console.log(d.message),a.oR.error("Unable to process request"),S({AlertType:"Error",message:"Unable to process request"}),v(!1)}};try{var O,A,P;return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsxs)("div",{className:"",children:[y?(0,_.jsx)(c.A,{}):"",(0,_.jsx)(n.A,{alert:E})]}),(0,_.jsxs)("div",{className:"row",children:[(0,_.jsx)("div",{className:"col-md-4",children:(0,_.jsxs)("form",{onSubmit:I(F),autoComplete:"off",children:[(0,_.jsxs)("div",{className:"col-md-12",children:[(0,_.jsx)("label",{htmlFor:"txtStageName",className:"form-label",children:"Stage Name"}),(0,_.jsx)("input",{...f("txtStageName"),type:"text",className:"form-control"}),(0,_.jsx)("p",{className:"err-msg",children:null===(O=N.txtStageName)||void 0===O?void 0:O.message})]}),(0,_.jsxs)("div",{className:"col-md-12",children:[(0,_.jsx)("label",{htmlFor:"cmbStageTypeId",className:"form-label",children:"Stage Type Id (1-Normal 2 - Auto Run )"}),(0,_.jsxs)("select",{...f("cmbStageTypeId"),className:"form-control",onChange:"",children:[(0,_.jsx)("option",{value:"",children:"- Select -"}),s.map((e=>(0,_.jsx)("option",{value:e.k,children:e.v},e.k)))]}),(0,_.jsx)("p",{className:"err-msg",children:null===(A=N.cmbStageTypeId)||void 0===A?void 0:A.message})]}),(0,_.jsxs)("div",{className:"col-md-12",children:[(0,_.jsx)("label",{htmlFor:"txtStageFile",className:"form-label",children:"Stage File"}),(0,_.jsx)("input",{...f("txtStageFile"),type:"text",className:"form-control"})]}),(0,_.jsxs)("div",{className:"row pad-top-15",children:[(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"ntxtOrd",className:"form-label",children:"Stage Order"}),(0,_.jsx)("input",{...f("ntxtOrd"),type:"text",className:"form-control"}),(0,_.jsx)("p",{className:"err-msg",children:null===(P=N.ntxtOrd)||void 0===P?void 0:P.message})]}),(0,_.jsxs)("div",{className:"col-md-6",children:[(0,_.jsx)("label",{htmlFor:"txtStageId",className:"form-label",children:"Stage Id"}),(0,_.jsx)("input",{...f("txtStageId"),type:"text",className:"form-control",disabled:"disabled",readonly:"readonly"})]})]}),(0,_.jsxs)("div",{className:"row pad-top-15",children:[(0,_.jsx)("div",{className:"col-md-3",children:(0,_.jsx)("button",{type:"submit",className:"btn btn-success",children:"Submit"})}),(0,_.jsx)("div",{className:"col-md-3",children:(0,_.jsx)("button",{type:"button",className:"btn btn-warning",onClick:D,children:"Reset"})})]})]})}),(0,_.jsx)("div",{className:"col-md-8",children:(0,_.jsxs)("table",{className:"lst-grid",children:[(0,_.jsx)("thead",{children:(0,_.jsxs)("tr",{children:[(0,_.jsx)("th",{children:"Ord"}),(0,_.jsx)("th",{children:"Id"}),(0,_.jsx)("th",{children:"Stage"}),(0,_.jsx)("th",{children:"Type"}),(0,_.jsx)("th",{children:"Manage"})]})}),(0,_.jsx)("tbody",{children:(0,_.jsx)(g,{stageList:p,setStageValue:function(e){C({txtStageId:e.StageId,txtStageName:e.StageName,ntxtOrd:e.Ord,cmbStageTypeId:e.StageTypeId,txtStageFile:e.StageFile})},delStage:M})})]})})]})]})}catch(R){console.log(R.message)}}},50956:(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(65043),react_toastify__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(91036),react_hook_form__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(24858),_api_Webcall__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(84756),_utilities_getallstage__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(7129),_utilities_GetStgEvents__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(40913),_utilities_geteventexpression__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(24638),_utilities_utils__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(80511),_appsettings_json__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(82585),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(70579);const apiendpoints=_appsettings_json__WEBPACK_IMPORTED_MODULE_7__.F;function TaskElements(_ref){let{ScrId:ScrId}=_ref;const[selectedFile,setSelectedFile]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),[isLoading,setLoanding]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),{register:register,getValues:getValues,setValue:setValue,formState:{errors:errors},reset:reset}=(0,react_hook_form__WEBPACK_IMPORTED_MODULE_9__.mN)(),ref=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(),[alert,setAlert]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),handleFileChange=e=>{e.target.files.length>0&&setSelectedFile(e.target.files[0])},OnMainSubmitHandler=async e=>{e.preventDefault();var fileCtrl=ref.current.value,filePath=ref.current.value,fExt=".pdf,.doc,.txt,.csv,.xls,.xlsx,.jpg",allowedExtns=fExt.replace(/\,/g,"|");if(allowedExtns=allowedExtns.replace(/\./g,"\\."),allowedExtns="/("+allowedExtns.replace(/ /g,"")+")$/i;",allowedExtns=eval(allowedExtns),!allowedExtns.exec(filePath))return react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.error("Invalid file type"),ref.current.value="",!1;const MAX_FILE_SIZE=2048;if(!selectedFile)return react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.error("Please choose a file"),!1;const fileSizeKiloBytes=selectedFile.size/1024;if(fileSizeKiloBytes>MAX_FILE_SIZE)return react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.error("File size is greater than maximum limit"),!1;const tmpltDet={};tmpltDet.cmbMailTemplateId=getValues("cmbMailTemplateId");const formData=new FormData;formData.append("tmpltdet",JSON.stringify(tmpltDet)),formData.append("file",selectedFile);try{const e=apiendpoints.MailTmpltAttachment;let t=await _api_Webcall__WEBPACK_IMPORTED_MODULE_2__.Ay.post(e,formData),s=JSON.parse((0,_utilities_utils__WEBPACK_IMPORTED_MODULE_6__.H5)(t.data));if(console.log(s),"SUCCESS"==s.hdr.rst)setTimeout((()=>{setAlert({AlertType:"Success",message:"Successfully updated"}),react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.success("Successfully updated"),setTimeout((()=>{setAlert({AlertType:"null",message:"null"})}),600),setLoanding(!1)}),300);else{let e=JSON.stringify(s.fdr[0].rstmsg);setTimeout((()=>{setAlert({AlertType:"Error",message:e}),react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.error(e),setTimeout((()=>{setAlert({AlertType:"null",message:"null"})}),600),setLoanding(!1)}),300)}}catch(err){console.log(err.message),react_toastify__WEBPACK_IMPORTED_MODULE_1__.oR.error("Unable to process request"),setAlert({AlertType:"Error",message:"Unable to process request"}),setLoanding(!1)}};return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment,{children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("form",{onSubmit:OnMainSubmitHandler,autocomplete:"off",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div",{className:"row",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div",{className:"col-md-4",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("label",{htmlFor:"cmbMailTemplateId",className:"form-label",children:"Mail Template"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input",{...register("cmbMailTemplateId"),type:"text",className:"form-control"})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div",{className:"col-md-6",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("label",{htmlFor:"filAttachment",className:"form-label",children:"Attachment"}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("input",{type:"file",name:"filElements",onChange:handleFileChange,ref:ref,className:"form-control"})]})]}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("br",{}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div",{className:"row",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div",{className:"col-md-2",children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("button",{type:"submit",className:"btn btn-primary",children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span",{className:"bi bi-upload"})," upload"]})})})]})})}const __WEBPACK_DEFAULT_EXPORT__=TaskElements},40913:(e,t,s)=>{s.d(t,{M:()=>n,N:()=>c});var l=s(80511),r=s(84756);const a=s(82585).F,n=async(e,t)=>{let s;const n={hdr:{convid:(0,l.lk)(),tag:"Stage Events",orgid:"",vendid:"0"},body:{cmbScrId:e,cmbStgId:t}};return await r.Ay.post(a.Stgevtree,(0,l.Yw)(n)).then((function(e){s=JSON.parse((0,l.H5)(e.data))})),s},c=async(e,t)=>{let s;const n={hdr:{convid:(0,l.lk)(),tag:"Stage Events",orgid:"",vendid:"0"},body:{cmbScrId:e,cmbStgId:t}};return await r.Ay.post(a.Stgclntevtree,(0,l.Yw)(n)).then((function(e){s=JSON.parse((0,l.H5)(e.data))})),s}},8387:(e,t,s)=>{s.d(t,{m:()=>n});var l=s(80511),r=s(84756);const a=s(82585).F,n=async()=>{let e;const t=a.AllScreen,s={hdr:{convid:(0,l.lk)(),tag:"AllScreen",orgid:"",vendid:"0"},body:{}},n={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},c=t;return console.log(c),await r.Ay.post(c,(0,l.Yw)(s),n).then((function(t){const s=JSON.parse((0,l.H5)(t.data));e=s})),e}}}]);
//# sourceMappingURL=694.0d378e9f.chunk.js.map