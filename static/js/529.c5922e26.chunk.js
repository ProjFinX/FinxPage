"use strict";(self.webpackChunkfinxapp=self.webpackChunkfinxapp||[]).push([[529],{3529:(e,a,t)=>{t.r(a),t.d(a,{default:()=>k});var s=t(65043),l=t(8204),r=t(24858),c=t(18403),n=t(73033),o=t(84756),d=t(47046),i=t(8387),m=t(80511),h=t(82585);const b=h.F;var u=t(76793);const x=h.F,v=h.F;var p=t(57492),j=t(64196),N=t(2459),g=t(91036),S=t(70579);const y=function(e){var a;const[t,l]=(0,s.useState)(e.value),r=(0,s.useCallback)(((e,a)=>{a.ontblcolChange(e,a.id),l(e.target.value)}),[]);return(0,s.useEffect)((()=>{l(e.value)}),[]),(0,S.jsxs)("select",{className:"form-control",value:t,onChange:a=>r(a,e),children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),(null===(a=e.options)||void 0===a?void 0:a.map)&&e.options.map((e=>(0,S.jsx)("option",{value:e.k,children:e.v},e.v)))]})},D=h.F,f=n.Ik().shape({txtDDName:n.Yj().required("Pls Provide the Domain Data mappe Name")});const k=function(){const[e,a]=(0,s.useState)(!1),[t,n]=(0,s.useState)(""),[h,k]=(0,s.useState)(0),[w,E]=(0,s.useState)([]),[I,C]=(0,s.useState)([]),[A,T]=(0,s.useState)([]),[F,M]=(0,s.useState)([]),[G,B]=(0,s.useState)([]),[L,P]=(0,s.useState)(""),[O,J]=(0,s.useState)([]),[R,Y]=(0,s.useState)(100),[z,H]=(0,s.useState)(""),[$,K]=(0,s.useState)([]),[U,q]=(0,s.useState)(""),[Z,Q]=(0,s.useState)(""),[V,W]=(0,s.useState)([]),{register:X,handleSubmit:_,formState:{errors:ee},reset:ae}=(0,r.mN)({resolver:(0,c.t)(f)}),te=(e,a)=>{const t=G.map((t=>t.id===a?{...t,tblelm:e.target.value}:t));return B(t)},se=e=>{le(e.target.value),Q(e.target.value)},le=async e=>{ae({cmbScrid:0,txtDDName:"",cmbDbShortName:"",cmbTblName:"",txtPrKey:"",CmbGrpElementId:100}),P(""),B([]);const a=await(async e=>{let a;const t=v.GetDomainDataMapping,s={txtDDMapId:e},l={hdr:{convid:(0,m.lk)(),tag:"brchlst",orgid:"",vendid:"0"},body:s},r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};return console.log(s),await o.Ay.post(t,(0,m.Yw)(l),r).then((function(e){const t=JSON.parse((0,m.H5)(e.data));console.log(t),a=t})),a})(e);var t=a.body;ae({cmbScrid:t.scrid,txtDDName:t.ddname,cmbDbShortName:t.shorname,cmbTblName:t.tblname,txtPrKey:t.prkey,CmbGrpElementId:t.grpeid}),n(t.scrid),k(t.shorname),ce(t.scrid),q(t.tblname),P(t.prkey),Y(t.grpeid);var s=(await oe(t.scrid,t.shorname)).filter((function(e){return e.na==t.tblname}))[0];he(t.grpeid,t.scrid);let l=[...await ie(t.scrid,t.shorname,s.id)];console.log(l),t.colmap.forEach((e=>{l.forEach((a=>{a.na===e.tc&&(a.tblelm=e.eid)}))})),B(l),T(s.id)},re=e=>{n(e.target.value),ce(e.target.value)},ce=async e=>{const a=await(0,u.B)(e);M(a.body.elements)},ne=e=>{k(e.target.value),oe(t,e.target.value)},oe=async(e,a)=>{const t=await(async(e,a)=>{let t;const s=b.GetTableList,l={hdr:{convid:(0,m.lk)(),tag:"Table List",orgid:"",vendid:"0"},body:{cmbScrid:e,cmbDbShotName:a}};console.log(l);const r={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};return await o.Ay.post(s,(0,m.Yw)(l),r).then((function(e){const a=JSON.parse((0,m.H5)(e.data));t=a})),t})(e,a);return C(t.body.tbls),t.body.tbls},de=e=>{var a=I.filter((function(a){return a.na==e.target.value}))[0];ie(t,h,a.id),q(e.target.value),T(a.id)},ie=async(e,a,t)=>{const s=await(async(e,a,t)=>{let s;const l=x.GetTableColumn,r={hdr:{convid:(0,m.lk)(),tag:"Table List",orgid:"",vendid:"0"},body:{cmbScrid:e,cmbDbShotName:a,cmbTblName:t}};console.log(r);const c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};return await o.Ay.post(l,(0,m.Yw)(r),c).then((function(e){const a=JSON.parse((0,m.H5)(e.data));s=a,console.log(s)})),s})(e,a,t);return s.body.cols.forEach((function(e){e.tblelm=""})),B(s.body.cols),P(s.body.prkey),s.body.cols},me=e=>{Y(e.target.value),he(e.target.value,t)},he=async(e,a)=>{const t={DUELM:"ScreenId="+a+" and ParentElementId="+e},s=await(0,p.n)("|DUELM|",t);console.log(s),J(s.body.duelm)},be=async e=>{var s=[],l={};G.forEach((e=>{""!=e.tblelm&&(l={tc:e.na,eid:e.tblelm},s.push(l))}));var r=e.txtDDMapid;"undefined"===r&&(r="0");let c={cmbScrid:t,txtDDMapId:r,txtDDName:e.txtDDName,cmbDbShotName:e.cmbDbShortName,txtTblName:U,cmbTblName:A,txtPrKey:L,cmbGrpElementId:e.CmbGrpElementId,colmap:s};const n={convid:(0,m.lk)(),tag:"updateelement",orgid:"",vendid:"0"},d={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},i={hdr:n,body:c},h=D.UpdtDomainDataMapping;try{const e=await o.Ay.post(h,(0,m.Yw)(i),d),t=JSON.parse((0,m.H5)(e.data));"FAILED"==t.hdr.rst||"ERROR"==t.hdr.rst?(g.oR.error(JSON.stringify(t.fdr[0].rstmsg)),a(!1)):setTimeout((()=>{g.oR.success("Successfully updated")}),300)}catch(b){console.log(b.message),g.oR.error("Unable to process request"),a(!1)}};(0,s.useEffect)((()=>{(async()=>{const e=await(0,p.n)("|CTBL|DDM|","");W(e.body.ctbl),K(e.body.ddm)})(),(async()=>{const e=await(0,i.m)();E(e.body.Screens.filter((e=>1==e.IsActive)))})()}),[]),(0,s.useEffect)((()=>{}),[O,Z,I,G]),(0,s.useEffect)((()=>{}),[G]);try{var ue,xe,ve,pe,je,Ne,ge;return(0,S.jsx)(S.Fragment,{children:(0,S.jsx)("section",{className:"vh-100",children:(0,S.jsx)("div",{className:"container h-100",children:(0,S.jsxs)("div",{className:"card text-black",style:{borderRadius:"25px"},children:[(0,S.jsx)("div",{className:"card-header",children:(0,S.jsx)("strong",{className:"card-title",children:"Domain Data Mapping"})}),(0,S.jsxs)("div",{className:"card-body p-md-5",children:[e?(0,S.jsx)(d.A,{}):"",(0,S.jsx)(l.A,{alert:alert}),(0,S.jsxs)("form",{onSubmit:_(be),autocomplete:"off",children:[(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsxs)("div",{className:"mb-3",children:[(0,S.jsx)("label",{htmlFor:"txtDDMapid",className:"form-label",children:"Edit Domain Data"}),(0,S.jsxs)("select",{...X("txtDDMapid"),className:"form-control",onChange:se,children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),$.length>0&&$.map((e=>(0,S.jsx)("option",{value:e.k,children:e.v},e.k)))]}),(0,S.jsx)("p",{children:null===(ue=ee.txtDDMapid)||void 0===ue?void 0:ue.message})]})}),(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsx)("div",{className:"mb-3",children:(0,S.jsx)("button",{type:"submit",className:"btn btn-primary",children:"Submit"})})})]}),(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsxs)("div",{className:"mb-3",children:[(0,S.jsx)("label",{htmlFor:"txtDDName",className:"form-label",children:"Domain Data Name"}),(0,S.jsx)("input",{...X("txtDDName"),type:"text",className:"form-control",id:"txtDDName"}),(0,S.jsx)("p",{children:null===(xe=ee.txtDDName)||void 0===xe?void 0:xe.message})]})}),(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsx)("div",{className:"mb-3",children:(0,S.jsxs)("div",{children:[(0,S.jsx)("label",{htmlFor:"cmbScrid",className:"form-label",children:"Screen"}),(0,S.jsxs)("select",{...X("cmbScrid"),className:"form-control",onChange:re,children:[(0,S.jsx)("option",{value:"0",children:"- Select -"}),w.map((e=>(0,S.jsx)("option",{value:e.ScreenId,children:e.ScrName},e.ScreenId)))]}),(0,S.jsx)("p",{children:null===(ve=ee.cmbScrid)||void 0===ve?void 0:ve.message})]})})})]}),(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsxs)("div",{className:"mb-3",children:[(0,S.jsx)("label",{htmlFor:"scrid",className:"form-label",children:"DB short Name"}),(0,S.jsxs)("select",{...X("cmbDbShortName"),value:h,className:"form-control",onChange:ne,children:[(0,S.jsx)("option",{value:"0",children:"-select-"}),V.map((e=>(0,S.jsx)("option",{value:e.k,children:e.k},e.v)))]}),(0,S.jsx)("p",{children:null===(pe=ee.cmbDbShortName)||void 0===pe?void 0:pe.message})]})}),(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsx)("div",{className:"mb-3",children:(0,S.jsxs)("div",{children:[(0,S.jsx)("label",{htmlFor:"cmbTblName",className:"form-label",children:"Table List"}),(0,S.jsxs)("select",{value:U,...X("cmbTblName"),className:"form-control",onChange:de,children:[(0,S.jsx)("option",{value:"0",children:"-select-"}),I&&I.map((e=>(0,S.jsx)("option",{value:e.na,children:e.na},e.id)))]}),(0,S.jsx)("p",{children:null===(je=ee.cmbTblName)||void 0===je?void 0:je.message})]})})})]}),(0,S.jsxs)("div",{className:"row",children:[(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsxs)("div",{className:"mb-3",children:[(0,S.jsx)("label",{htmlFor:"txtPrkey",className:"form-label",children:"primary Key"}),(0,S.jsx)("input",{...X("txtPrkey"),type:"text",className:"form-control",value:L}),(0,S.jsx)("p",{children:null===(Ne=ee.txtPrkey)||void 0===Ne?void 0:Ne.message})]})}),(0,S.jsx)("div",{className:"col-sm",children:(0,S.jsx)("div",{className:"mb-3",children:(0,S.jsxs)("div",{children:[(0,S.jsx)("label",{htmlFor:"CmbGrpElementId",className:"form-label",children:"Group Element"}),(0,S.jsxs)("select",{value:R,...X("CmbGrpElementId"),className:"form-control",onChange:me,children:[(0,S.jsx)("option",{value:"100",children:"-select-"}),F&&F.map((e=>(0,S.jsx)("option",{value:e.elid,children:e.elna},e.elna)))]}),(0,S.jsx)("p",{children:null===(ge=ee.CmbGrpElementId)||void 0===ge?void 0:ge.message})]})})})]}),(0,S.jsx)("label",{className:"form-label",children:"Screen and Table Element Mapping"}),(0,S.jsx)(N.Ze,{style:{width:1200,height:550},children:(0,S.jsxs)(j.A,{striped:!0,bordered:!0,hover:!0,id:"tblgridprop",children:[(0,S.jsx)("thead",{children:(0,S.jsxs)("tr",{children:[(0,S.jsx)("th",{className:"text-center",children:"Id"}),(0,S.jsx)("th",{className:"text-center",children:"Column"}),(0,S.jsx)("th",{className:"text-center",children:"Element"})]})}),(0,S.jsx)("tbody",{children:G&&G.map((e=>(0,S.jsxs)("tr",{children:[(0,S.jsx)("td",{children:e.id}),(0,S.jsx)("td",{children:e.na}),(0,S.jsx)("td",{children:(0,S.jsx)(y,{options:O,value:e.tblelm,ontblcolChange:te,id:e.id})}),(0,S.jsx)("td",{children:e.tblelm})]})))})]})})]})]})]})})})})}catch(Se){console.log(Se.message)}}},8387:(e,a,t)=>{t.d(a,{m:()=>c});var s=t(80511),l=t(84756);const r=t(82585).F,c=async()=>{let e;const a=r.AllScreen,t={hdr:{convid:(0,s.lk)(),tag:"AllScreen",orgid:"",vendid:"0"},body:{}},c={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}},n=a;return console.log(n),await l.Ay.post(n,(0,s.Yw)(t),c).then((function(a){const t=JSON.parse((0,s.H5)(a.data));e=t})),e}},76793:(e,a,t)=>{t.d(a,{B:()=>c});var s=t(80511),l=t(84756);const r=t(82585).F,c=async e=>{let a;const t=r.Getscreengrpelms,c={hdr:{convid:(0,s.lk)(),tag:"Table List",orgid:"",vendid:"0"},body:{cmbScrid:e}};console.log(c);const n={headers:{Authorization:`Bearer ${localStorage.getItem("token")}`}};return await l.Ay.post(t,(0,s.Yw)(c),n).then((function(e){const t=JSON.parse((0,s.H5)(e.data));a=t})),a}}}]);
//# sourceMappingURL=529.c5922e26.chunk.js.map