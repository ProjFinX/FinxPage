"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[813],{22813:(e,t,s)=>{s.r(t),s.d(t,{default:()=>N});var l=s(65043),a=s(24858),c=s(18403),n=s(73033),r=s(57492),d=s(67560),o=s(8387),i=s(84756),m=s(80511),h=s(47046),u=s(8204),p=s(86971),x=s(2459),b=s(64196),g=s(91036),v=s(82585),j=s(70579);const y=v.F,S=n.Ik().shape({cmbAtchElement:n.Yj().required("Eement name  can not be empty")}),N=()=>{var e,t,s,n;const[v,N]=(0,l.useState)([]),[f,A]=(0,l.useState)([]),[I,k]=(0,l.useState)([]),[w,E]=(0,l.useState)([]),[M,T]=(0,l.useState)([]),[O,R]=(0,l.useState)(0),[J,F]=(0,l.useState)(0);(0,l.useEffect)((()=>{Z(),(async()=>{const e=await(0,r.n)("|MILTMP|","");E(e.body.miltmp)})()}),[]);const{register:Y,getValues:C,handleSubmit:H,formState:{errors:z},reset:B}=(0,a.mN)({resolver:(0,c.t)(S)}),[D,$]=(0,l.useState)(""),[L,U]=(0,l.useState)(!1),q=async e=>{const t=await(0,d.U_)(e);console.log(JSON.stringify(t)),A(t.body.atchelm)},P=async(e,t)=>{const s={DUELM:"ScreenId="+t+" and ParentElementId="+e},l=await(0,r.n)("|DUELM|",s);console.log(l),T(l.body.duelm)},Z=((0,p.Zp)(),async()=>{const e=await(0,o.m)();k(e.body.Screens.filter((e=>1==e.IsActive)))}),_=((0,l.useRef)(),async e=>{const t=await(0,d.Rd)(e);"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?g.oR.error(JSON.stringify(t.fdr[0].rstmsg)):(g.oR.success("Successfully Deleted"),setTimeout((()=>{}),600),q(J))}),G=(e,t)=>{$({AlertType:e,message:t})};return(0,j.jsx)(j.Fragment,{children:(0,j.jsx)("section",{className:"vh-100",children:(0,j.jsx)("div",{className:"container h-100",children:(0,j.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,j.jsx)("div",{className:"card-header",children:(0,j.jsx)("strong",{className:"card-title",children:"Mail Template Attachment"})}),(0,j.jsxs)("div",{className:"card-body p-md-5",children:[L?(0,j.jsx)(h.A,{}):"",(0,j.jsx)(u.A,{alert:D}),(0,j.jsxs)("form",{onSubmit:H((async e=>{let t=0;void 0!=e.txtMailTemplateId&&(t=e.txtMailTemplateId);const s={convid:(0,m.lk)(),tag:"updatchelm",orgid:"",vendid:"0"},l={txtMailAttchElmsId:t,txtMailTemplateId:e.cmbMailTemplateId,cmbAtchElement:e.cmbAtchElement},a={hdr:s,body:l},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},n=y.updatchelm;console.log(l);try{const t=await i.Ay.post(n,(0,m.Yw)(a),c),s=JSON.parse((0,m.H5)(t.data));console.log(s),"FAILED"==s.hdr.rst||"ERROR"==s.hdr.rst?(G("Error",JSON.stringify(s.fdr)),g.oR.error(JSON.stringify(s.fdr)),U(!1)):setTimeout((()=>{console.log(s.fdr),G("Success",JSON.stringify(s.fdr[0].rstmsg)),g.oR.success("Successfully updated"),q(e.cmbMailTemplateId),setTimeout((()=>{$({AlertType:"null",message:"null"})}),600),U(!1)}),300)}catch(r){console.log(r.message),G("Error","Unable to process request"),U(!1)}})),autocomplete:"off",children:[(0,j.jsxs)("div",{className:"row",children:[(0,j.jsx)("div",{className:"col-sm",children:(0,j.jsxs)("div",{className:"mb-3",children:[(0,j.jsx)("label",{htmlFor:"cmbMailTemplateId",className:"form-label",children:"Template name"}),(0,j.jsxs)("select",{...Y("cmbMailTemplateId"),className:"form-control",onChange:e=>{F(e.target.value),q(e.target.value)},children:[(0,j.jsx)("option",{value:"",children:"- Select -"}),w&&w.map((e=>(0,j.jsx)("option",{value:e.k,children:e.v},e.k)))]}),(0,j.jsx)("p",{children:null===(e=z.cmbMailTemplateId)||void 0===e?void 0:e.message})]})}),(0,j.jsx)("div",{className:"col-sm",children:(0,j.jsxs)("div",{className:"mb-3",children:[(0,j.jsxs)("label",{htmlFor:"txtMailAttchElmsId",className:"form-label",children:[" ","Template Attachment Id"]}),(0,j.jsx)("input",{...Y("txtMailAttchElmsId"),type:"text",disabled:"disabled",readonly:"readonly",className:"form-control"}),(0,j.jsx)("p",{children:null===(t=z.txtMailAttchElmsId)||void 0===t?void 0:t.message})]})})]}),(0,j.jsxs)("div",{className:"row",children:[(0,j.jsx)("div",{className:"col-sm",children:(0,j.jsxs)("div",{className:"mb-3",children:[(0,j.jsx)("label",{htmlFor:"cmbScreenId",className:"form-label",children:"Screen"}),(0,j.jsxs)("select",{...Y("cmbScreenId"),className:"form-control",onChange:e=>{R(e.target.value),P(0,e.target.value)},children:[(0,j.jsx)("option",{value:"0",children:"- Select -"}),I.map((e=>(0,j.jsx)("option",{value:e.ScreenId,children:e.ScrName},e.ScreenId)))]}),(0,j.jsx)("p",{children:null===(s=z.cmbScreenId)||void 0===s?void 0:s.message})]})}),(0,j.jsx)("div",{className:"col-sm",children:(0,j.jsxs)("div",{className:"mb-3",children:[(0,j.jsxs)("label",{htmlFor:"cmbAtchElement",className:"form-label",children:[" ","Element"]}),(0,j.jsxs)("select",{...Y("cmbAtchElement"),className:"form-control",onChange:"",children:[(0,j.jsx)("option",{value:"0",children:"- Select -"}),M.map((e=>(0,j.jsx)("option",{value:e.k,children:e.v},e.k)))]}),(0,j.jsx)("p",{children:null===(n=z.cmbAtchElement)||void 0===n?void 0:n.message})]})}),(0,j.jsx)("div",{className:"col-md-12"})]}),(0,j.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"})]})]}),(0,j.jsx)(x.Ze,{style:{width:1200,height:550},children:(0,j.jsxs)(b.A,{striped:!0,bordered:!0,hover:!0,children:[(0,j.jsx)("thead",{children:(0,j.jsxs)("tr",{children:[(0,j.jsx)("th",{className:"text-center",children:"Id"}),(0,j.jsx)("th",{className:"text-center",children:"Element"}),(0,j.jsx)("th",{children:(0,j.jsxs)("button",{className:"btn btn-success",onClick:()=>{},children:[" ",(0,j.jsx)("i",{className:"bi bi-table"})," Add"," "]})})]})}),(0,j.jsx)("tbody",{children:f&&f.map((e=>(0,j.jsxs)("tr",{children:[(0,j.jsx)("td",{children:e.atchelmid}),(0,j.jsx)("td",{children:e.elmna}),(0,j.jsx)("td",{children:(0,j.jsxs)("button",{className:"btn btn-primary",onClick:()=>{_(e.atchelmid)},children:[" ",(0,j.jsx)("i",{className:"bi bi-pen"})," Delete"]})})]})))})]})})]})})})})}},8387:(e,t,s)=>{s.d(t,{m:()=>n});var l=s(80511),a=s(84756);const c=s(82585).F,n=async()=>{let e;const t=c.AllScreen,s={hdr:{convid:(0,l.lk)(),tag:"AllScreen",orgid:"",vendid:"0"},body:{}},n={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},r=t;return console.log(r),await a.Ay.post(r,(0,l.Yw)(s),n).then((function(t){const s=JSON.parse((0,l.H5)(t.data));e=s})),e}},67560:(e,t,s)=>{s.d(t,{Rd:()=>o,U_:()=>i,Yq:()=>r,dp:()=>d,fG:()=>n});s(65043);var l=s(80511),a=s(84756);const c=s(82585).F,n=async()=>{let e;const t=c.smtplst,s={hdr:{convid:(0,l.lk)(),tag:"smtplst",orgid:"",vendid:"0"},body:{}},n={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},r=t;return await a.Ay.post(r,(0,l.Yw)(s),n).then((function(t){const s=JSON.parse((0,l.H5)(t.data));e=s})),e},r=async()=>{let e;const t=c.miltmpltlst,s={hdr:{convid:(0,l.lk)(),tag:"miltmpltlst",orgid:"",vendid:"0"},body:{}},n={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},r=t;return await a.Ay.post(r,(0,l.Yw)(s),n).then((function(t){const s=JSON.parse((0,l.H5)(t.data));e=s})),e},d=async e=>{let t;const s=c.miltmltdoclst,n={hdr:{convid:(0,l.lk)(),tag:"miltmltdoclst",orgid:"",vendid:"0"},body:{cmbMailTemplateId:e}},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},d=s;return await a.Ay.post(d,(0,l.Yw)(n),r).then((function(e){const s=JSON.parse((0,l.H5)(e.data));t=s})),t},o=async e=>{let t;const s=c.delatchelm,n={txtMailAttchElmsId:e},r={hdr:{convid:(0,l.lk)(),tag:"delatchelm",orgid:"",vendid:"0"},body:n};console.log(n);const d=s;return await a.Ay.post(d,(0,l.Yw)(r),{}).then((function(e){const s=JSON.parse((0,l.H5)(e.data));t=s})),t},i=async e=>{let t;const s=c.getatchelmlst,n={hdr:{convid:(0,l.lk)(),tag:"getatchelmlst",orgid:"",vendid:"0"},body:{txtMailTemplateId:e}},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},d=s;return await a.Ay.post(d,(0,l.Yw)(n),r).then((function(e){const s=JSON.parse((0,l.H5)(e.data));t=s})),t}}}]);
//# sourceMappingURL=813.47fd5d50.chunk.js.map