"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[867],{8867:(s,t,e)=>{e.r(t),e.d(t,{default:()=>S});var a=e(65043),l=e(24858),r=e(18403),c=e(73033),o=e(57492),d=e(84756),i=e(80511),n=e(47046),m=e(8204),x=e(86971),h=e(67560),j=e(2459),b=e(64196),p=e(91036),u=e(82585),N=e(70579);const v=u.F,g=c.Ik().shape({txtHostname:c.Yj().required("Host name  can not be empty").email("Pls provide Valid  Email id"),txtPassword:c.Yj().required("Password can not be empty").min(3,"Password Min length is 3").max(20,"Password. Max lenght is 20 ")}),S=()=>{const[s,t]=(0,a.useState)([]),[e,c]=(0,a.useState)([]);(0,a.useEffect)((()=>{(async()=>{const s=await(0,o.n)("|CUN|","");c(s.body.cun),console.log("rerendering method")})(),E()}),[]);const{register:u,handleSubmit:S,formState:{errors:y},reset:f}=(0,l.mN)({resolver:(0,r.t)(g)}),[I,w]=(0,a.useState)(""),[P,A]=(0,a.useState)(!1);function k(){f({txtSMTPId:"",txtHostname:"",txtPort:"",txtEmail:"",txtPassword:"",cbIsSSL:!1,cbIsActive:!1})}(0,x.Zp)();const E=async()=>{const s=await(0,h.fG)();console.log(JSON.stringify(s)),t(s.body.smpt)},H=async s=>{let t=0;""!=s.txtSMTPId&&(t=s.txtSMTPId);const e={convid:(0,i.lk)(),tag:"updscr",orgid:"",vendid:"0"},a={txtSmtpId:t,txtHost:s.txtHostname,cbIsSSL:s.cbIsSSL,txtPortNo:s.txtPort,txtEmail:s.txtEmail,txtPwd:s.txtPassword,cbIsActive:s.cbIsActive},l={hdr:e,body:a},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},c=v.updsmtp;console.log(a);try{const s=await d.Ay.post(c,(0,i.Yw)(l),r),t=JSON.parse((0,i.H5)(s.data));console.log(t),"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?(T("Error",JSON.stringify(t.fdr)),p.oR.error(JSON.stringify(t.fdr)),A(!1)):setTimeout((()=>{console.log(t.fdr),T("Success",JSON.stringify(t.fdr[0].rstmsg)),p.oR.success("Successfully updated"),setTimeout((()=>{w({AlertType:"null",message:"null"})}),600),k(),E(),A(!1)}),300)}catch(o){console.log(o.message),T("Error","Unable to process request"),A(!1)}},T=(s,t)=>{w({AlertType:s,message:t})};try{var M,O,F,J;return(0,N.jsx)(N.Fragment,{children:(0,N.jsx)("section",{className:"vh-100",children:(0,N.jsx)("div",{className:"container h-100",children:(0,N.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,N.jsx)("div",{className:"card-header",children:(0,N.jsx)("strong",{className:"card-title",children:"SMTP Master"})}),(0,N.jsxs)("div",{className:"card-body p-md-5",children:[P?(0,N.jsx)(n.A,{}):"",(0,N.jsx)(m.A,{alert:I}),P?(0,N.jsx)(n.A,{}):"",(0,N.jsx)(m.A,{alert:I}),(0,N.jsxs)("form",{onSubmit:S(H),autocomplete:"off",children:[(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)("label",{htmlFor:"txtHostname",className:"form-label",children:[" ","Host Name"]}),(0,N.jsx)("input",{...u("txtHostname"),type:"email",className:"form-control"}),(0,N.jsx)("p",{children:null===(M=y.txtHostname)||void 0===M?void 0:M.message})]})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)("label",{htmlFor:"txtSMTPId",className:"form-label",children:[" ","SMTP Id"]}),(0,N.jsx)("input",{...u("txtSMTPId"),disabled:"disabled",readonly:"readonly",className:"form-control"})]})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)("label",{htmlFor:"txtPort",className:"form-label",children:[" ","Port"]}),(0,N.jsx)("input",{...u("txtPort"),type:"text",className:"form-control"}),(0,N.jsx)("p",{children:null===(O=y.txtPort)||void 0===O?void 0:O.message})]})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("label",{htmlFor:"txtEmail",className:"form-label",children:"Email"}),(0,N.jsx)("input",{...u("txtEmail"),type:"email",className:"form-control"}),(0,N.jsx)("p",{children:null===(F=y.txtEmail)||void 0===F?void 0:F.message})]})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)("label",{htmlFor:"txtPassword",className:"form-label",children:[" ","Password."]}),(0,N.jsx)("input",{...u("txtPassword"),type:"text",className:"form-control"}),(0,N.jsx)("p",{children:null===(J=y.txtPassword)||void 0===J?void 0:J.message})]})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3",children:(0,N.jsxs)("div",{className:"col-md-1",children:[(0,N.jsx)("input",{...u("cbIsSSL"),type:"checkbox"})," ",(0,N.jsx)("label",{htmlFor:"cbIsSSL",className:"form-label",children:"IsSSL"})]})})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3",children:(0,N.jsxs)("div",{className:"col-md-1",children:[(0,N.jsx)("input",{...u("cbIsActive"),type:"checkbox"})," ",(0,N.jsx)("label",{htmlFor:"cbIsActive",className:"form-label",children:"IsActive "})]})})})]}),(0,N.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"})]})]}),(0,N.jsx)(j.Ze,{style:{width:1200,height:550},children:(0,N.jsxs)(b.A,{striped:!0,bordered:!0,hover:!0,children:[(0,N.jsx)("thead",{children:(0,N.jsxs)("tr",{children:[(0,N.jsx)("th",{className:"text-center",children:"Id"}),(0,N.jsx)("th",{className:"text-center",children:"HOST"}),(0,N.jsx)("th",{className:"text-center",children:"Port"}),(0,N.jsx)("th",{className:"text-center",children:"Email."}),(0,N.jsx)("th",{className:"text-center",children:"IsSSL"}),(0,N.jsx)("th",{className:"text-center",children:"SMTPStatus"}),(0,N.jsx)("th",{children:(0,N.jsxs)("button",{className:"btn btn-success",onClick:()=>{k()},children:[" ",(0,N.jsx)("i",{className:"bi bi-table"})," Add"," "]})})]})}),(0,N.jsx)("tbody",{children:s&&s.map((s=>(0,N.jsxs)("tr",{children:[(0,N.jsx)("td",{children:s.id}),(0,N.jsx)("td",{children:s.host}),(0,N.jsx)("td",{children:s.portno}),(0,N.jsx)("td",{children:s.email}),(0,N.jsx)("td",{children:s.isssl}),(0,N.jsx)("td",{children:s.isactive}),(0,N.jsx)("td",{children:(0,N.jsxs)("button",{className:"btn btn-primary",onClick:()=>{var t;t=s,console.log(t),f({txtSMTPId:t.id,txtHostname:t.host,txtPort:t.portno,txtEmail:t.email,txtPassword:"",cbIsSSL:t.isssl,cbIsActive:t.isactive})},children:[" ",(0,N.jsx)("i",{className:"bi bi-pen"})," Edit"]})})]})))})]})})]})})})})}catch(L){console.log(L.message)}}},67560:(s,t,e)=>{e.d(t,{Rd:()=>i,U_:()=>n,Yq:()=>o,dp:()=>d,fG:()=>c});e(65043);var a=e(80511),l=e(84756);const r=e(82585).F,c=async()=>{let s;const t=r.smtplst,e={hdr:{convid:(0,a.lk)(),tag:"smtplst",orgid:"",vendid:"0"},body:{}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},o=t;return await l.Ay.post(o,(0,a.Yw)(e),c).then((function(t){const e=JSON.parse((0,a.H5)(t.data));s=e})),s},o=async()=>{let s;const t=r.miltmpltlst,e={hdr:{convid:(0,a.lk)(),tag:"miltmpltlst",orgid:"",vendid:"0"},body:{}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},o=t;return await l.Ay.post(o,(0,a.Yw)(e),c).then((function(t){const e=JSON.parse((0,a.H5)(t.data));s=e})),s},d=async s=>{let t;const e=r.miltmltdoclst,c={hdr:{convid:(0,a.lk)(),tag:"miltmltdoclst",orgid:"",vendid:"0"},body:{cmbMailTemplateId:s}},o={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},d=e;return await l.Ay.post(d,(0,a.Yw)(c),o).then((function(s){const e=JSON.parse((0,a.H5)(s.data));t=e})),t},i=async s=>{let t;const e=r.delatchelm,c={txtMailAttchElmsId:s},o={hdr:{convid:(0,a.lk)(),tag:"delatchelm",orgid:"",vendid:"0"},body:c};console.log(c);const d=e;return await l.Ay.post(d,(0,a.Yw)(o),{}).then((function(s){const e=JSON.parse((0,a.H5)(s.data));t=e})),t},n=async s=>{let t;const e=r.getatchelmlst,c={hdr:{convid:(0,a.lk)(),tag:"getatchelmlst",orgid:"",vendid:"0"},body:{txtMailTemplateId:s}},o={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},d=e;return await l.Ay.post(d,(0,a.Yw)(c),o).then((function(s){const e=JSON.parse((0,a.H5)(s.data));t=e})),t}}}]);
//# sourceMappingURL=867.a4e258b0.chunk.js.map