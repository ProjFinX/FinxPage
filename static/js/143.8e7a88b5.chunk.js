"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[143],{68916:(e,s,t)=>{t.d(s,{Rw:()=>a,gp:()=>l});t(65043);function l(e,s){let t={},l={},a=[],r=[];return console.log(e),console.log(s),e.forEach((e=>{s.forEach((s=>{l={value:s.RoleId+"-"+e.BranchId,label:s.RoleName},r=[...r,l]})),t={value:e.BranchId,label:e.Name,children:r},a=[...a,t],r=[]})),a}function a(e){let s={},t={},l=[],a=[],r=[];return console.log(e),console.log(r),e.forEach((e=>{r=e.Roles,r.forEach((s=>{t={value:s.BRMapId+"-"+e.BranchId,label:s.RName},a=[...a,t]})),s={value:e.BranchId,label:e.Name,children:a},l=[...l,s],a=[]})),l}},2143:(e,s,t)=>{t.r(s),t.d(s,{default:()=>b});var l=t(65043),a=t(8204),r=t(24858),c=t(18403),o=t(73033),n=t(84756),d=t(47046),i=t(60458),h=(t(68916),t(57492)),u=t(2459),m=t(64196),x=t(80511),g=t(70579);const j=o.Ik().shape({cmbStatus:o.Yj().required("Pls select the role status")});const b=function(){const[e,s]=(0,l.useState)(!1),[t,o]=(0,l.useState)(""),[b,p]=(0,l.useState)([]),[v,S]=(0,l.useState)([]),[N,f]=(0,l.useState)([]),{register:y,handleSubmit:R,formState:{errors:I}}=(0,r.mN)({resolver:(0,c.t)(j)}),k=async()=>{const e=await(0,i.h)();p(e.body.Roles)},w=(e,s)=>{o({AlertType:e,message:s})},A=async(e,t)=>{let l={txtNewStatusId:e.cmbStatus,txtRoleIds:N};console.log(l),s(!0);const a={convid:(0,x.lk)(),tag:"cngrolstus",orgid:"",vendid:"0"},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},c={hdr:a,body:l};console.log(c);try{const e=await n.Ay.post("/cmpstp/cngrolstus",(0,x.Yw)(c),r),t=JSON.parse((0,x.H5)(e.data));console.log(t),"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?(w("Error",JSON.stringify(t.fdr[0].rstmsg)),s(!1)):setTimeout((()=>{console.log(t.fdr),w("Success",JSON.stringify(t.fdr[0].rstmsg)),setTimeout((()=>{o({AlertType:"null",message:"null"})}),600),k(),s(!1)}),300)}catch(d){console.log(d.message),w("Error","Unable to process request"),s(!1)}};(0,l.useEffect)((()=>{(async()=>{const e=await(0,h.n)("|BRUS|","");S(e.body.brus)})(),k()}),[]);try{var B;return(0,g.jsx)(g.Fragment,{children:(0,g.jsx)("section",{className:"vh-100",children:(0,g.jsx)("div",{className:"container h-100",children:(0,g.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,g.jsx)("div",{className:"card-header",children:(0,g.jsx)("strong",{className:"card-title",children:"Role Status Change"})}),(0,g.jsx)(u.Ze,{style:{width:1200,height:550},children:(0,g.jsxs)(m.A,{striped:!0,bordered:!0,hover:!0,children:[(0,g.jsx)("thead",{children:(0,g.jsxs)("tr",{children:[(0,g.jsx)("th",{className:"text-center",children:"Select"}),(0,g.jsx)("th",{className:"text-center",children:"Id"}),(0,g.jsx)("th",{className:"text-center",children:"Role"}),(0,g.jsx)("th",{className:"text-center",children:"Status"})]})}),(0,g.jsx)("tbody",{children:b.map((e=>(0,g.jsxs)("tr",{children:[(0,g.jsx)("td",{align:"center",children:(0,g.jsx)("input",{type:"checkbox",onChange:s=>{((e,s)=>{console.log(e),console.log(s);let t=N;if(1==e.target.value)t.push(s.RoleId);else{const e=t.indexOf(s.RoleId);e>-1&&t.splice(e,1)}console.log(N)})({target:{value:s.target.checked}},e)}})}),(0,g.jsx)("td",{children:e.RoleId}),(0,g.jsx)("td",{children:e.RoleName}),(0,g.jsx)("td",{children:e.BRUMapStatus}),(0,g.jsx)("td",{})]})))})]})}),(0,g.jsxs)("div",{className:"card-body p-md-5",children:[e?(0,g.jsx)(d.A,{}):"",(0,g.jsx)(a.A,{alert:t}),(0,g.jsx)("form",{onSubmit:R(A),autocomplete:"off",children:(0,g.jsxs)("div",{className:"row",children:[(0,g.jsx)("div",{className:"col-sm",children:(0,g.jsxs)("div",{className:"mb-3",children:[(0,g.jsx)("label",{htmlFor:"cmbStatus",className:"form-label",children:"Status"}),(0,g.jsxs)("select",{...y("cmbStatus"),className:"form-control",id:"cmbStatus",children:[(0,g.jsx)("option",{value:"",children:"- Select -"}),v.map((e=>(0,g.jsx)("option",{value:e.k,children:e.v},e.k)))]}),(0,g.jsx)("p",{children:null===(B=I.cmbStatus)||void 0===B?void 0:B.message})]})}),(0,g.jsx)("div",{className:"col-sm",children:(0,g.jsxs)("div",{className:"mb-3",children:[(0,g.jsx)("br",{}),(0,g.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"})]})})]})})]})]})})})})}catch(E){}}},60458:(e,s,t)=>{t.d(s,{h:()=>c});t(65043);var l=t(80511),a=t(84756);const r=t(82585).F,c=async()=>{let e;const s=r.RoleList,t={hdr:{convid:(0,l.lk)(),tag:"brchlst",orgid:"",vendid:"0"},body:{}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},o=s;return await a.Ay.post(o,(0,l.Yw)(t),c).then((function(s){const t=JSON.parse((0,l.H5)(s.data));console.log(t),e=t})),e}}}]);
//# sourceMappingURL=143.8e7a88b5.chunk.js.map