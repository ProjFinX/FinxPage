"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[180],{43180:(e,s,t)=>{t.r(s),t.d(s,{default:()=>E});var n=t(65043),a=t(8204),l=t(24858),c=t(18403),r=t(73033),o=t(84756),d=t(47046),i=t(8387),m=t(7129),g=t(727),h=t(24638),x=t(57492),p=t(64196),u=t(2459),b=t(91036),v=t(38709),S=t(80511),j=t(82585);const y=j.F;var N=t(70579);const f=j.F,I=(localStorage.getItem("CompanyId"),r.Ik().shape({cmbScrId:r.Yj().required("Pls Select  Secreen ")}));const E=function(){console.log("Page rendered");const[e,s]=(0,n.useState)([]),[t,r]=(0,n.useState)([]),[j,E]=(0,n.useState)(0),[w,k]=(0,n.useState)([]),[A,C]=(0,n.useState)([]),[F,O]=(0,n.useState)(""),[J,H]=(0,n.useState)(!1),[T,Y]=(0,n.useState)(0),[D,G]=(0,n.useState)([]),[z,M]=(0,n.useState)([]),[$,R]=(0,n.useState)([]),[B,U]=(0,n.useState)(0),[L,q]=(0,n.useState)([]),[P,K]=(0,n.useState)([]),[Z,_]=(0,n.useState)(0),{register:W,handleSubmit:Q,formState:{errors:V},reset:X}=(0,l.mN)({resolver:(0,c.t)(I)}),ee=async e=>{const s=(await(async(e,s,t)=>{let n;const a=y.StgElmEvntCmb,l={hdr:{convid:(0,S.lk)(),tag:"StageElementlist",orgid:"",vendid:"0"},body:{cmbScrId:e,cmbStgId:s,cmbStgElmDsigId:t}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},r=a;return console.log(c),await o.Ay.post(r,(0,S.Yw)(l)).then((function(e){const s=JSON.parse((0,S.H5)(e.data));console.log(s),n=s})),n})(T,j,e)).body.elmevnt;K(Array.isArray(s)?s:null)},se=async e=>{const s=await(0,h.C)(e);C(s.body.expressions)},[te,ne]=(0,n.useState)([]);(0,n.useEffect)((()=>{(async()=>{const e=await(0,x.n)("|SETM|","");ne(e.body.setm),console.log(e.body)})(),(async()=>{const e=await(0,i.m)();G(e.body.Screens.filter((e=>1==e.IsActive)))})()}),[]);const ae=e=>{Y(e.target.value),(async e=>{const t=await(0,m.K)(e);s(t.body.Stages),console.log(JSON.stringify(t.body))})(e.target.value),se(e.target.value),(async e=>{const s=(await(0,v.F4)(e)).data;M(s.menutree),R(s.expresponse)})(e.target.value)},le=e=>{let s="";s=e.target.value,E(e.target.value),(async e=>{const s=await(0,g.zI)(T,e);k(s.body.stgelm)})(s)},ce=e=>{let s="";s=e.target.value,_(e.target.value),ee(s)},re=e=>{let s="";s=e.target.value,_(e.target.value),(async e=>{const s=await(0,g.c$)(T,j,Z,e);console.log(s);const t=s.body.expgrps;console.log(s.body.expgrps),console.log(t);var n=[];let a;for(a=0;a<t.length;a+=1){var l;l=A.filter((function(e){return e.egid==t[a].exgrpid})),n.push(l[0])}console.log(n),q(n),console.log(L)})(s)},oe=async e=>{console.log(e);var s=[];let t,n;for(t=0;t<L.length;t+=1){n=t+1;var a={exgrpid:L[t].egid,ord:n};s.push(a)}let l={cmbScrId:e.cmbScrId,cmbStgId:e.cmbStgId,cmbStgElmDsigId:e.cmbStgElmDsigId,cmbEvntId:e.cmbEvntId,expgrps:s};const c=f.Updexgrpmap;console.log(l),H(!0);const r={convid:(0,S.lk)(),tag:"UpdateExpression",orgid:"",vendid:"0"},d={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},i={hdr:r,body:l};console.log(i);try{const s=await o.Ay.post(c,(0,S.Yw)(i),d),t=JSON.parse((0,S.H5)(s.data));console.log(t),"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?(de("Error",JSON.stringify(t.fdr[0].rstmsg)),H(!1)):setTimeout((()=>{console.log(t.fdr),de("Success",JSON.stringify(t.fdr[0].rstmsg)),b.oR.success("Successfully expression updated"),setTimeout((()=>{O({AlertType:"null",message:"null"})}),600),X({cmbScrId:"0",cmbStgId:"",cmbStgElmDsigId:"",cmbEvntId:""}),M([]),Y(e.cmbScreenId),se(e.txtExprGroupId),q([]),H(!1)}),300)}catch(m){console.log(m.message),b.oR.error("Unable to process request"),de("Error","Unable to process request"),H(!1)}},de=(e,s)=>{O({AlertType:e,message:s})},ie=e=>{let{node:s}=e;const t=s.children.length>0;return(0,N.jsxs)("div",{children:[(0,N.jsx)("div",{className:"row",children:(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("span",{children:["  ",(0,N.jsx)("span",{className:"content",dangerouslySetInnerHTML:{__html:s.name}})]})})}),t&&(0,N.jsx)("ul",{children:s.children.map((e=>(0,N.jsx)("li",{children:(0,N.jsx)(ie,{node:e})},e.id)))})]})};try{var me,ge;return(0,N.jsx)(N.Fragment,{children:(0,N.jsx)("section",{className:"vh-100",children:(0,N.jsx)("div",{className:"container h-100",children:(0,N.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,N.jsx)("div",{className:"card-header",children:(0,N.jsxs)("strong",{className:"card-title",children:["Event & Expression Group Mapping"," "]})}),(0,N.jsxs)("div",{className:"card-body p-md-5",children:[J?(0,N.jsx)(d.A,{}):"",(0,N.jsx)(a.A,{alert:F}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm-8",children:(0,N.jsx)("div",{className:"mb-3",children:(0,N.jsxs)("form",{autocomplete:"off",children:[(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("label",{htmlFor:"cmbScrId",className:"form-label",children:"Screen"}),(0,N.jsxs)("select",{...W("cmbScrId"),className:"form-control",onChange:ae,children:[(0,N.jsx)("option",{value:"0",children:"- Select -"}),D.map((e=>(0,N.jsx)("option",{value:e.ScreenId,children:e.ScrName},e.ScreenId)))]}),(0,N.jsx)("p",{children:null===(me=V.cmbScrId)||void 0===me?void 0:me.message})]})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("label",{htmlFor:"cmbStgId",className:"form-label",children:"Stage"}),(0,N.jsxs)("select",{...W("cmbStgId"),className:"form-control",onChange:le,children:[(0,N.jsx)("option",{value:"0",children:"- Select -"}),e&&e.map((e=>(0,N.jsx)("option",{value:e.StageId,children:e.StageName},e.StageId)))]}),(0,N.jsx)("p",{children:null===(ge=V.cmbStgId)||void 0===ge?void 0:ge.message})]})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("label",{htmlFor:"cmbStgElmDsigId",className:"form-label",children:"Stage Element"}),(0,N.jsxs)("select",{...W("cmbStgElmDsigId"),className:"form-control",onChange:ce,children:[(0,N.jsx)("option",{value:"0",children:"- Select -"}),w&&w.map((e=>(0,N.jsx)("option",{value:e.k,children:e.v},e.k)))]})]})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsx)("label",{htmlFor:"cmbEvntId",className:"form-label",children:"Element Event"}),(0,N.jsxs)("select",{...W("cmbEvntId"),className:"form-control",onChange:re,children:[(0,N.jsx)("option",{value:"0",children:"- Select -"}),P&&P.map((e=>(0,N.jsx)("option",{value:e.k,children:e.v},e.k)))]})]})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm-6",children:(0,N.jsx)("div",{className:"mb-3",children:(0,N.jsx)(u.Ze,{style:{height:500},children:(0,N.jsxs)(p.A,{striped:!0,bordered:!0,hover:!0,children:[(0,N.jsx)("thead",{children:(0,N.jsxs)("tr",{children:[(0,N.jsx)("th",{children:"Select Group Name"}),(0,N.jsx)("th",{})]})}),(0,N.jsx)("tbody",{children:A&&A.map((e=>(0,N.jsxs)("tr",{children:[(0,N.jsx)("td",{children:e.egname}),(0,N.jsx)("td",{children:(0,N.jsxs)("button",{type:"button",className:"btn btn-primary",onClick:()=>{!function(e){console.log(e);var s={egid:e.egid,egname:e.egname};let t=[...L];t.push(s),q(t),console.log(L)}(e)},children:[" ",(0,N.jsx)("i",{className:"bi bi-arrow-right"})]})})]})))})]})})})}),(0,N.jsx)("div",{className:"col-sm-6",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)(p.A,{striped:!0,bordered:!0,hover:!0,children:[(0,N.jsx)("thead",{children:(0,N.jsxs)("tr",{children:[(0,N.jsx)("th",{children:"Selected Group Name"}),(0,N.jsx)("th",{})]})}),(0,N.jsx)("tbody",{children:L&&L.map(((e,s)=>(0,N.jsxs)("tr",{children:[(0,N.jsx)("td",{children:e.egname}),(0,N.jsx)("td",{children:(0,N.jsxs)("button",{className:"btn btn-success",onClick:()=>{(e=>{0!==e&&q((s=>{const t=[...s],n=t[e];return t[e]=t[e-1],t[e-1]=n,t}))})(s)},children:[" ",(0,N.jsx)("i",{className:"fa fa-arrow-up"})]})}),(0,N.jsx)("td",{children:(0,N.jsxs)("button",{className:"btn btn-success",onClick:()=>{(e=>{e!==L.length-1&&q((s=>{const t=[...s],n=t[e];return t[e]=t[e+1],t[e+1]=n,t}))})(s)},children:[" ",(0,N.jsx)("i",{className:"fa fa-arrow-down"})]})}),(0,N.jsx)("td",{children:(0,N.jsxs)("button",{className:"btn btn-danger",onClick:()=>{(async e=>{e.egid;const s=e.egid;q(L.filter((e=>e.egid!==s)))})(e)},children:[" ",(0,N.jsx)("i",{className:"bi bi-trash"})]})})]})))})]}),(0,N.jsx)("button",{type:"submit",class:"btn btn-primary",onClick:Q(oe),children:"Save Mapping"})]})})]})]})})}),(0,N.jsx)("div",{className:"col-sm-4",children:(0,N.jsxs)("div",{className:"mb-3",children:[(0,N.jsxs)("button",{className:"btn btn-success",onClick:()=>{X({txtSeExprnId:"",txtParentSeExprnId:"0",cmbSeExprType:0,txtExpression:""})},children:[" ",(0,N.jsx)("i",{className:"bi bi-table"})," Tree Root"]}),(0,N.jsx)("div",{children:"."}),(0,N.jsx)("div",{children:(0,N.jsx)(u.Ze,{style:{height:700},children:z.map((e=>(0,N.jsx)(ie,{node:e},e.id)))})})]})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3"})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3",children:(0,N.jsx)("div",{className:"row"})})})]}),(0,N.jsxs)("div",{className:"row",children:[(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3"})}),(0,N.jsx)("div",{className:"col-sm",children:(0,N.jsx)("div",{className:"mb-3"})})]})]})]})})})})}catch(he){console.log(he.message)}}},727:(e,s,t)=>{t.d(s,{W1:()=>c,c$:()=>o,zI:()=>r});var n=t(80511),a=t(84756);const l=t(82585).F,c=async e=>{let s;const t=l.FetchStgScrElements,c={hdr:{convid:(0,n.lk)(),tag:"StageElementlist",orgid:"",vendid:"0"},body:{scrid:e}},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},o=t;return console.log(r),await a.Ay.post(o,(0,n.Yw)(c)).then((function(e){const t=JSON.parse((0,n.H5)(e.data));console.log(t),s=t})),s},r=async(e,s)=>{let t;const c=l.StgElmCmb,r={hdr:{convid:(0,n.lk)(),tag:"StgElmCmb",orgid:"",vendid:"0"},body:{cmbScrId:e,cmbStgId:s}},o={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},d=c;return console.log(o),await a.Ay.post(d,(0,n.Yw)(r)).then((function(e){const s=JSON.parse((0,n.H5)(e.data));console.log(s),t=s})),t},o=async(e,s,t,c)=>{let r;const o=l.ExGrpmap,d={cmbScrId:e,cmbStgId:s,cmbStgElmDsigId:t,cmbEvntId:c},i={hdr:{convid:(0,n.lk)(),tag:"StgElmCmb",orgid:"",vendid:"0"},body:d};console.log(d);localStorage.getItem("token");const m=o;return await a.Ay.post(m,(0,n.Yw)(i)).then((function(e){const s=JSON.parse((0,n.H5)(e.data));console.log(s),r=s})),r}},38709:(e,s,t)=>{t.d(s,{F4:()=>r,L1:()=>c,d9:()=>o});var n=t(80511),a=t(84756);const l=t(82585).F,c=async(e,s)=>{let t;const c=l.GetExpTree,r={hdr:{convid:(0,n.lk)(),tag:"Exp Tree",orgid:"",vendid:"0"},body:{cmbScrId:e,txtExprGroupId:s}},o=c;return await a.Ay.post(o,(0,n.Yw)(r),{}).then((function(e){const s=JSON.parse((0,n.H5)(e.data));t=s})),t},r=async e=>{let s;const t={cmbScrId:e},c={hdr:{convid:(0,n.lk)(),tag:"Event Tree",orgid:"",vendid:"0"},body:t};console.log("frmData",t);await a.Ay.post(l.Evtree,(0,n.Yw)(c),{}).then((function(e){s=JSON.parse((0,n.H5)(e.data))}));const r=function(){let e,s,t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],a={},l=[],c=[],r={},o=[];for(t=0;t<n.length;t+=1){var d="";d+="~~~~~~~~~~~~~~~~~~~~".substring(0,n[t].lvl).replace(/~/gi,"&nbsp;&nbsp;&nbsp;")+"<span style='color:blue;'>",1==n[t].flag?d+="Stg-":2==n[t].flag?d+="Evn-":3==n[t].flag?d+="ExGr-":d+="",d+="</span>"+n[t].leaf,a[n[t].id]=t,r={id:n[t].id,name:d,fixMenu:!0,children:o},c=[...c,r],c[t].children=[],null==n[t].prntid&&(n[t].prntid=0)}for(t=0;t<n.length;t+=1)e=n[t],s=c[t],0!==e.prntid?(console.log(c[t]),c[a[e.prntid]].fixMenu=!1,c[a[e.prntid]].children.push(s)):l.push(s);return l}(s.body.expressions);return console.log(r),{data:{menutree:r,expresponse:s.body.expressions}}},o=async(e,s)=>{let t;const c={cmbScrId:e,cmbStgId:s},r={hdr:{convid:(0,n.lk)(),tag:"Get Stg UI Design",orgid:"",vendid:"0"},body:c};console.log("frmData",c);await a.Ay.post(l.uidsgn,(0,n.Yw)(r),{}).then((function(e){t=JSON.parse((0,n.H5)(e.data))}));return{data:{uitree:function(){let e,s,t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],a={},l=[],c=[],r={},o=[];for(t=0;t<n.length;t+=1){var d="";d+="~~~~~~~~~~~~~~~~~~~~".substring(0,n[t].lvl).replace(/~/gi,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")+n[t].uiexprn,a[n[t].uidsgnid]=t,r={id:n[t].uidsgnid,name:d,fixMenu:!0,children:o},c=[...c,r],c[t].children=[],null==n[t].prntid&&(n[t].prntid=0)}for(t=0;t<n.length;t+=1)e=n[t],s=c[t],0!==e.prntid?(console.log(c[t]),c[a[e.prntid]].fixMenu=!1,c[a[e.prntid]].children.push(s)):l.push(s);return l}(t.body.uidsgn),actualUiTree:t.body.uidsgn}}}},8387:(e,s,t)=>{t.d(s,{m:()=>c});var n=t(80511),a=t(84756);const l=t(82585).F,c=async()=>{let e;const s=l.AllScreen,t={hdr:{convid:(0,n.lk)(),tag:"AllScreen",orgid:"",vendid:"0"},body:{}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},r=s;return console.log(r),await a.Ay.post(r,(0,n.Yw)(t),c).then((function(s){const t=JSON.parse((0,n.H5)(s.data));e=t})),e}},7129:(e,s,t)=>{t.d(s,{K:()=>c});var n=t(80511),a=t(84756);const l=t(82585).F,c=async e=>{let s;const t=l.AllStage,c={hdr:{convid:(0,n.lk)(),tag:"AllStage",orgid:"",vendid:"0"},body:{txtScreenId:e}},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},o=t;return await a.Ay.post(o,(0,n.Yw)(c),r).then((function(e){const t=JSON.parse((0,n.H5)(e.data));s=t})),s}},24638:(e,s,t)=>{t.d(s,{C:()=>c});var n=t(80511),a=t(84756);const l=t(82585).F,c=async e=>{let s;const t={hdr:{convid:(0,n.lk)(),tag:"Expgroup",orgid:"",vendid:"0"},body:{cmbScrId:e}},c={};try{return await a.Ay.post(l.GetExpGrpLst,(0,n.Yw)(t),c).then((function(e){const t=JSON.parse((0,n.H5)(e.data));s=t})),s}catch(r){console.log(r)}}}}]);
//# sourceMappingURL=180.57ee54ea.chunk.js.map