import React from "react";
import { useState, useEffect, useRef } from "react";

import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import { GetAllStageList } from "../utilities/getallstage";
import { FetchCombodata } from "../utilities/combodata";
import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import { GetElementList } from "../utilities/getelementlist";
import { GetUIDesignTree } from "../utilities/getScrexpresiontree";
// import UIElmList from "./UIElmList";
import appsettings from "../../appsettings.json";
import { Color } from "ag-grid-community";
import { getDocument } from "pdfjs-dist";

const apiendpoints = appsettings.ApiEndpoints;
const schema = yup.object().shape({
  cmbStgId: yup.string().required("Pls Select Stage "),
});


/* Main Method */
function UIDesign({ ScrId }) {
 
  const [stageList, setStageList] = useState([]);
  const [uiTypeList, setUITypes] = useState([]);
  const [elementList, setElementList] = useState([]);
  const [uiTree, setUiTree] = useState([]);
  const [actualUiTree, setActualUiTree] = useState([]);
  const [detailOpenIds, setDetailOpenIds] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);


  const { register, handleSubmit, getValues, setValue, formState: { errors }, reset, }
    = useForm({ resolver: yupResolver(schema), });

  const FetchAllStageList = async (ScrId) => {
    const StgList = await GetAllStageList(ScrId);
    setStageList(StgList.body.Stages.filter((x) => x.StageTypeId !== 9));
  };

  const FetchUITypes = async () => {
    const opt = "|UIT|";
    const optw = "";
    const Response = await FetchCombodata(opt, optw);
    setUITypes(Response.body.uit);
  };

  const FetchElementList = async (ScrId, StgId) => {
    const ElementLis = await GetElementList(ScrId, StgId);
    setElementList(ElementLis.body.elements);
  };

  const FetchUITree = async (ScrId, StgId) => {
    const uiTree = await GetUIDesignTree(ScrId, StgId);
    setUiTree(uiTree.data.uitree);
    setActualUiTree(uiTree.data.actualUiTree);
  };

  useEffect(() => { FetchUITypes(); }, []);
  useEffect(() => { FetchAllStageList(ScrId); }, []);

  const callServer = async (frmData, tag, endPoint) =>{

    const frmHdr = { convid: generateUUID(), tag: tag, orgid: "", vendid: "0", };

    const reqHdr = { };
    const reqdata = { hdr: frmHdr, body: frmData };

    try {
      const response = await api.post( endPoint, compressBase64(reqdata), reqHdr );
      const resData  = JSON.parse(decompressBase64(response.data));

      if (resData.hdr.rst == "SUCCESS")
      {
        let StgId = getValues("cmbStgId");

        setTimeout(() => {
          toast.success("Successfully updated");
          resetFormData();
          FetchElementList(ScrId, StgId);
          FetchUITree(ScrId, StgId);
        }, 300);
      }
      else {
        setTimeout(() => {
          toast.error(JSON.stringify(resData.fdr[0].rstmsg));
        }, 300);
      }

    } catch (err) {
      setTimeout(() => {
        toast.error("Unable to process request");
      }, 300);
    }

  };

  const stageOnChange = (e) => {
    var StgId = e.target.value;
    FetchElementList(ScrId, StgId);
    FetchUITree(ScrId, StgId);
    resetFormData();
  };

  const copyUiDesign = () => {

    if (window.confirm("Are you sure, replace existing UI design ?") == 1) {

      let fromStgId = getValues("cmbCpyStgId");
      let toStgId = getValues("cmbStgId");
      let frmData = { cmbScrId: ScrId, cmbStgFrom: fromStgId, cmbStgTo: toStgId };
      callServer(frmData, "Copy Stage UI Design", apiendpoints.Cpystgui);

    }

  }

  const ref = useRef();

  const uiTypeOnChange = () => {

  };

  const mbgElmArray = (tf, ElementId, txtField ) => {

    let elm = elementList.find(x => x.ElementId==ElementId);

    let arrayVal;
    if (getValues(txtField) == '') {
      arrayVal = [];
    }
    else {
      arrayVal = JSON.parse(getValues(txtField));
    }

    if (tf) {
      const index = arrayVal.indexOf(ElementId);
      if (index == -1) {
        arrayVal.push(ElementId);
      }
    }
    else {
      const index = arrayVal.indexOf(ElementId);
      if (index > -1) {
        arrayVal.splice(index, 1);
      }
    }

    if (arrayVal.length > 0) {
      setValue("txtSelectedUi", 'input');
    }
    else {
      setValue("txtSelectedUi", '');
    }

    setValue(txtField, JSON.stringify(arrayVal));

  };

  const UIElmList = () => {

    let elmIds = new Array();
    let nCnt = -1;

    const onChangeSelect = (e, ElementId) => {
      mbgElmArray(e.target.checked, ElementId,"txtSelectedElm");
    }

    const onChangeMandatory = (e, ElementId) => {
      mbgElmArray(e.target.checked, ElementId,"txtMandatoryElm");
    }

    const onChangeReadonly = (e, ElementId) => {
      mbgElmArray(e.target.checked, ElementId,"txtReadonlyElm");
    }

    return (
      <>
        {(elementList.length > 0) ? elementList.map((data, index) => {

          ++nCnt;
          elmIds[nCnt] = data.ElementId;

          return (
            <tr key={index}>
              <td><input {...register('S_' + elmIds[nCnt])} type="checkbox" onClick={(e) => onChangeSelect(e, data.ElementId)} /></td>
              <td>{data.ElmName}</td>
              <td>{data.ParentElmName}</td>
              <td><input {...register('M_' + elmIds[nCnt])} type="checkbox" onClick={(e) => onChangeMandatory(e, data.ElementId)} /></td>
              <td><input {...register('R_' + elmIds[nCnt])} type="checkbox" onClick={(e) => onChangeReadonly(e, data.ElementId)} /></td>
            </tr>
          )

        }) : <></>}

      </>
    )

  };

  const UITree = ({ uiTreeLst }) => {
    if (uiTreeLst) {
      let root = uiTreeLst.filter((x) => x.pruidsgnid == null);

      return (
        <>
          {(root.length > 0) ?
            <ul>
              {(root.map((node) => {
                return (
                  <UINode uiTreeLst={uiTreeLst} treenode={node} />
                )
              }))}
            </ul>
            : <></>}
        </>
      )
    }
  };

  const onToggle = (e, id) =>{

    if (e.nativeEvent.newState == "open") {
      const index = detailOpenIds.indexOf(id);
      if (index == -1) {
        detailOpenIds.push(id);
      }
    }
    else {
      const index = detailOpenIds.indexOf(id);
      if (index > -1) {
        detailOpenIds.splice(index, 1);
      }
    }

    setDetailOpenIds(detailOpenIds);
  };

  const ordChanged = (e) =>{

    // console(e.target.value);

  }

  const UINode = ({ uiTreeLst, treenode }) => {

    const handleOnBlur = (id, e) => {
      updateOrder(id, e.target.value);
    };

    const handleOnCheck = (id, e) => {
      mbgElmArray(e.target.checked, id, "txtPropElm");
    }

    const insertUI = (id) => {

      let seltUi = getValues("txtSelectedUi");
      let StgId = getValues("cmbStgId");

      if (seltUi == 'input') {
        let frmData = {
          cmbScrId: ScrId,
          cmbStgId: StgId,
          txtStgUiDesignId: getValues("txtStgUiId"),
          txtParentStgUiId: id,
          cmbUItype: seltUi,
          txtTag: getValues("txtTag"),
          txtClass: getValues("txtClass"),
          txtTagVal: getValues("txtTagVal"),
          txtElmIds: getValues("txtSelectedElm"),
          txtMElmIds: getValues("txtMandatoryElm"),
          txtRElmIds: getValues("txtReadonlyElm")
        };

        callServer(frmData, "Update Group UI  Design", apiendpoints.Updgrpuidsgn);
      }
      else if (seltUi == 'PARENT'){
        callProperty(seltUi, 'Change Parent', null, id);
      }
      else {
        let frmData = {};

        frmData["cmbScrId"] = ScrId;
        frmData["cmbStgId"] = StgId;
        frmData["txtParentStgUiId"] = id;
        frmData["uiType"] = seltUi;

        callServer(frmData, "UI Design", apiendpoints.Upduidsgn);

      }

    };

    let lstNode = uiTreeLst.filter(x => x.pruidsgnid == treenode.uidsgnid)
    if (lstNode.length > 0) {
      
      return (
        <li>
          <details onToggle={(e) => onToggle(e, treenode.uidsgnid)} open={detailOpenIds.indexOf(treenode.uidsgnid) > -1} >
            <summary id={'id'+treenode.uidsgnid}>
              <input type="checkbox" onChange={(e) => handleOnCheck(treenode.uidsgnid, e)} />
              <button type="button" id={'ui'+treenode.uidsgnid} className="btn btn-light" onClick={() => insertUI(treenode.uidsgnid)} >
                <span dangerouslySetInnerHTML={{ __html: treenode.uiexprn }} ></span>
              </button>
              <button type="button" onClick={() => setParentId(treenode)} className="btn btn-light clr-gray"><i className="fa fa-plus"></i></button>
              <button type="button" onClick={() => setValueToEdit(treenode)} className="btn btn-light clr-gray"><i className="fa fa-edit"></i></button>
              <button type="button" onClick={() => deleteUiTreeLeaf(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-trash-o"></i></button>
              <button type="button" onClick={() => upReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-up"></i></button>
              <button type="button" onClick={() => downReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-down"></i></button>
              <input type="text" onBlur={(e) => handleOnBlur(treenode.uidsgnid, e)} />
            </summary>
            <ul>
              {lstNode.map((node) => {
                return (
                  <UINode uiTreeLst={uiTreeLst} treenode={node} />
                )
              })}
            </ul>
          </details>
        </li>
      );

    }
    else if (treenode.uityp=='div' || treenode.uityp=='grid' || treenode.uityp=='popup'
             || treenode.uityp=='tab' || treenode.uityp=='tabpg') {
        
        return(
          <li id={'id'+treenode.uidsgnid}>
            <input type="checkbox" onChange={(e) => handleOnCheck(treenode.uidsgnid, e)} />
            <button type="button" id={'ui'+treenode.uidsgnid} className="btn btn-light" onClick={() => insertUI(treenode.uidsgnid)} >
              <span dangerouslySetInnerHTML={{ __html: treenode.uiexprn }}></span>
            </button>
            <button type="button" onClick={() => setParentId(treenode)} className="btn btn-light clr-gray"><i className="fa fa-plus"></i></button>
            <button type="button" onClick={() => setValueToEdit(treenode)} className="btn btn-light clr-gray"><i className="fa fa-edit"></i></button>
            <button type="button" onClick={() => deleteUiTreeLeaf(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-trash-o"></i></button>
            <button type="button" onClick={() => upReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-up"></i></button>
            <button type="button" onClick={() => downReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-down"></i></button>
            <input type="text" onBlur={(e) => handleOnBlur(treenode.uidsgnid, e)} />
          </li>
        );

    } else {
      
      return (
        <li id={'id' + treenode.uidsgnid}>
          <input type="checkbox" onChange={(e) => handleOnCheck(treenode.uidsgnid, e)} />
          <span dangerouslySetInnerHTML={{ __html: treenode.uiexprn }}></span>
          <button type="button" onClick={() => setValueToEdit(treenode)} className="btn btn-light clr-gray"><i className="fa fa-edit"></i></button>
          <button type="button" onClick={() => deleteUiTreeLeaf(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-trash-o"></i></button>
          <button type="button" onClick={() => upReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-up"></i></button>
          <button type="button" onClick={() => downReorder(treenode.uidsgnid)} className="btn btn-light clr-gray"><i className="fa fa-arrow-down"></i></button>
          <input type="text" onBlur={(e) => handleOnBlur(treenode.uidsgnid, e)} />
        </li>
      );

    }
  };

  const deleteUiTreeLeaf = (StgUiDesignId) => {
    if (window.confirm("Are you sure, do you want delete ?")) {
      let StgId = getValues("cmbStgId");
      let frmData = { cmbScrId: ScrId, cmbStgId: StgId, txtStgUiDesignId: StgUiDesignId };
      callServer(frmData, "Delete UI Design", apiendpoints.Deluidsgn);

    }
  };

  const updateOrder  = async (StgUiDesignId, Ord) => {
    let StgId = getValues("cmbStgId");
    let frmData = { cmbScrId: ScrId, cmbStgId: StgId, txtStgUiDesignId: StgUiDesignId,  txtOrd: Ord };
    callServer(frmData, "Reorder UI Design", apiendpoints.UpdUiOrd);
  };

  const reOrder = async (StgUiDesignId, dir) => {
    let StgId = getValues("cmbStgId");
    let frmData = { cmbScrId: ScrId, cmbStgId: StgId, txtStgUiDesignId: StgUiDesignId, txtDirection: dir };
    callServer(frmData, "Reorder UI Design", apiendpoints.Reordui);
  };

  const resetFormData = () => {

    elementList.map((elm) => {
      setValue('S_' + elm.ElementId, false);
      setValue('M_' + elm.ElementId, false);
      setValue('R_' + elm.ElementId, false);
    });
  
    reset({
      txtStgUiId: "", cmbUItype: "", txtTag: "", txtClass: "", txtTagVal: "", txtParentStgUiId: "",
      txtSelectedElm: "[]", txtMandatoryElm: "[]", txtReadonlyElm: "[]", txtPropElm: "[]",
      cbIsAddRow:false, cbIsCheckBox: false, cbIsFilter:false, cbIsManageBtns:false
    })
  };

  const resetElmSelect  = () => {
    elementList.map((elm) => {
      setValue('S_'+elm.ElementId,false);
      setValue('M_'+elm.ElementId,false);
      setValue('R_'+elm.ElementId,false);
    });
  };

  const setValueToEdit = (data) => {
    resetElmSelect();
    resetFormData();
    reset({
      txtStgUiId: data.uidsgnid, cmbUItype: data.uityp, txtTag: data.tag, txtClass: data.cls,
      txtTagVal: data.tagval, txtParentStgUiId: data.pruidsgnid, 
      txtSelectedElm: "[]", txtMandatoryElm: "[]", txtReadonlyElm: "[]",
      cbIsAddRow:false, cbIsCheckBox: false, cbIsFilter:false, cbIsManageBtns:false
    })
  };

  const upReorder = (uidsgnid) => {
    var dir = "U";
    reOrder(uidsgnid, dir)
  };

  const downReorder = (uidsgnid) => {
    var dir = "D";
    reOrder(uidsgnid, dir)
  };

  const setParentId = (data) => {
    resetElmSelect();
    reset({
      txtStgUiId: "", cmbUItype: "", txtTag: "", txtClass: "", txtTagVal: "", txtParentStgUiId: data.uidsgnid,
      txtSelectedElm: "[]", txtMandatoryElm: "[]", txtReadonlyElm: "[]",
      cbIsAddRow:false, cbIsCheckBox: false, cbIsFilter:false, cbIsManageBtns:false
    })
  };


  const handleSetMandatory = () =>{
    callProperty('SETMAN', 'Set mandatory');
  };


  const handleSetReadonly = () =>{
    callProperty('SETRED', 'Set readonly');
  };

  const handleRemoveMandatory = () =>{
    callProperty('REMOMAN', 'Remove mandatory');
  };

  const handleRemoveReadonly = () =>{
    callProperty('REMRED', 'Remove readonly');
  };

  const handleDeleteUIElm = () =>{
    callProperty('DELETE', 'Delete UI Element');
  };

  const handleUpdateCSS = () =>{
    let css = getValues('txtClass');
    callProperty('CSS', 'Update UI Element CSS', css);
  };

  const callProperty = (flag, tag, css, parentid) => {
    let StgId = getValues("cmbStgId");
    let PropElm = getValues("txtPropElm");
    let frmData = { cmbScrId: ScrId, cmbStgId: StgId, txtProp: flag, txtPropElm: PropElm, txtClass: css, txtParentStgUiId: parentid };
    callServer(frmData, tag, apiendpoints.Upduiprop);
  };


  const updateGridProperty = () => {
    let StgId = getValues("cmbStgId");
    let PropElm = getValues("txtPropElm");
    let isAddRow = getValues("cbIsAddRow");
    let isCheckBox = getValues("cbIsCheckBox");
    let isFilter = getValues("cbIsFilter");
    let isManageBtns = getValues("cbIsManageBtns");

    let frmData = { cmbScrId: ScrId, cmbStgId: StgId, txtPropElm: PropElm, cbIsAddRow : isAddRow,
        cbIsCheckBox:isCheckBox, cbIsFilter:isFilter, cbIsManageBtns:isManageBtns };
    callServer(frmData, "Update Grid Prop", apiendpoints.Updgrdprop);

  };


  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }

  };

  const OnFileUpladHandler = async (e) => {
    e.preventDefault(); // 👈️ prevent page refresh

    var fileCtrl = ref.current.value;
    var filePath = ref.current.value;

    var fExt = ".html";
    var allowedExtns = fExt.replace(/\,/g, "|");
    allowedExtns = allowedExtns.replace(/\./g, "\\.");
    allowedExtns = "/(" + allowedExtns.replace(/ /g, "") + ")$/i;";
    allowedExtns = eval(allowedExtns);
    if (!allowedExtns.exec(filePath)) {
      toast.error("Invalid file type");
      ref.current.value = "";
      return false;
    }

    const MAX_FILE_SIZE = 2048; // 2MB

    if (!selectedFile) {
      toast.error("Please choose a file");
      return false;
    }

    const fileSizeKiloBytes = selectedFile.size / 1024;

    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than maximum limit");
      return false;
    }

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "uploadfilelments",
      orgid: "",
      vendid: "0",
    };

    let StgId = getValues("cmbStgId");

    var scrdet = {};
    scrdet["scrid"] = ScrId;
    scrdet["stgid"] = StgId;
    const formData = new FormData();

    console.log(fileSizeKiloBytes);

    formData.append("_scrdet", JSON.stringify(scrdet));
    formData.append("file", selectedFile);
    const token = localStorage.getItem("token");

    try {
      const url = apiendpoints.Uplduihtml;

      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        //ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        // setLoanding(false);
      } else {
        toast.success("Successfully updated");
        setTimeout(() => { }, 600);
        // FetchEventtree(Screenid, StgId);
        // FetchStageElementList(Screenid);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      //ShowAlert("Error", "Unable to process request");
      // setLoanding(false);
    }
  };

  /* Submit form */
  const onSubmitHandler = (data) => {

    if (data.txtStgUiDesignId !== '')
    {
      resetElmSelect();
      reset({
        txtSelectedElm: "[]", txtMandatoryElm: "[]", txtReadonlyElm: "[]"
      })
    }

    let frmData = {
      cmbScrId: ScrId,
      cmbStgId: data.cmbStgId,
      txtStgUiDesignId: data.txtStgUiId,
      txtParentStgUiId: data.txtParentStgUiId,
      cmbUItype: data.cmbUItype,
      txtTag: data.txtTag,
      txtClass: data.txtClass,
      txtTagVal: data.txtTagVal,
      txtElmIds: data.txtSelectedElm,
      txtMElmIds: data.txtMandatoryElm,
      txtRElmIds: data.txtReadonlyElm
    };

    callServer(frmData, "Update Group UI  Design", apiendpoints.Updgrpuidsgn);

  };

  const selectedUi = (para) => {

    let seltUi = getValues("txtSelectedUi");

    if (seltUi == para) {
      setValue("txtSelectedUi", '');
    }
    else {
      setValue("txtSelectedUi", para);
    }

  };
 

  try {

    return (
      <>
      
        <form onSubmit={handleSubmit(onSubmitHandler)} autoComplete="off" >

          <div className="row">
            <div className="col-md-6">

              <div className="row">
                <div className="col-md-6">

                  <div className="row">

                    <div className="col-md-12">
                      <label htmlFor="cmbStgId" className="form-label">Stage</label>
                      <select {...register("cmbStgId")} className="form-select" onChange={stageOnChange} >
                        <option value="0">- Select -</option>
                        {
                          stageList.map((x) => (<option key={x.StageId} value={x.StageId}>{x.StageName}</option>))
                        }
                      </select>
                      <p>{errors.cmbStgId?.message}</p>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="txtUItype" className="form-label">UI type</label>
                      <select {...register("cmbUItype")} className="form-select" onChange={uiTypeOnChange} >
                        <option value="0">- Select -</option>
                        {
                          uiTypeList.map((x) => (<option key={x.k} value={x.v} >{x.v}</option>))
                        }
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="txtTag" className="form-label">H Tag</label>
                      <input {...register("txtTag")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="txtClass" className="form-label" >Css Class</label>
                      <input {...register("txtClass")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="txtTagVal" className="form-label" >TagVal</label>
                      <input {...register("txtTagVal")} type="text" className="form-control" />
                    </div>


                    

                    <div className="col-md-6">
                      <label htmlFor="txtParentStgUiId" className="form-label" >Parent</label>
                      <input {...register("txtParentStgUiId")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="txtStgUiId" className="form-label" >Stage UI Id</label>
                      <input {...register("txtStgUiId")} type="text" className="form-control" disabled="disabled" readonly="readonly" />
                    </div>

                    <div className="col-md-12">
                      <input {...register("txtSelectedElm")} type="text" readonly="readonly" disabled="disabled" className="dispNone" />
                      <input {...register("txtMandatoryElm")} type="text" readonly="readonly" disabled="disabled" className="dispNone" />
                      <input {...register("txtReadonlyElm")} type="text" readonly="readonly" disabled="disabled" className="dispNone" />
                      <input {...register("txtPropElm")} type="text" readonly="readonly" disabled="disabled" className="dispNone" />
                    </div>

                    <div className="row pad-top-15">

                      <div className="col-md-3">
                        <button type="submit" className="btn btn-success">
                          Submit
                        </button>
                      </div>

                      <div className="col-md-3">
                        <button type="button" className="btn btn-warning" onClick={resetFormData} >
                          Reset
                        </button>
                      </div>

                    </div>


                    <fieldset className="col-md-12 pad-top-0-5em">

                      <legend>Grid Property</legend>

                      <div className="row">
                        <div className="col-md-3">
                          <label htmlFor="cbIsAddRow" className="form-label">Add Row</label><br />
                          <input {...register("cbIsAddRow")} type="checkbox" />
                        </div>

                        <div className="col-md-3">
                          <label htmlFor="cbIsCheckBox" className="form-label">CheckBox</label><br />
                          <input {...register("cbIsCheckBox")} type="checkbox" />
                        </div>

                        <div className="col-md-3">
                          <label htmlFor="cbIsFilter" className="form-label">Col Filter</label><br />
                          <input {...register("cbIsFilter")} type="checkbox" />
                        </div>

                        <div className="col-md-3 pad-bottom-0-5em">
                          <label htmlFor="cbIsManageBtns" className="form-label">Mng Btns</label><br />
                          <input {...register("cbIsManageBtns")} type="checkbox" />
                        </div>

                      </div>

                    </fieldset>

                    <div className="row pad-top-15">
                    
                      <div className="col-md-12">
                        <label htmlFor="cmbCpyStgId" className="form-label">UI design copy from</label>
                        <select {...register("cmbCpyStgId")} className="form-select" >
                          <option value="0">- Select -</option>
                          {
                            stageList.map((x) => (<option key={x.StageId} value={x.StageId}>{x.StageName}</option>))
                          }
                        </select>
                      </div>

                      <div className="col-md-12">
                        <button type="button" className="btn-link" onClick={copyUiDesign} >
                          Copy
                        </button>
                      </div>

                    </div>

                    <div className="row pad-top-15">

                      <div className="col-md-12">

                        <label htmlFor="filElements" className="form-label">UI Html File</label>
                        <input type="file" name="filElements" onChange={handleFileChange}
                          ref={ref} className="form-control" />

                      </div>

                      <div className="col-md-12">
                        <button type="button"
                          onClick={OnFileUpladHandler}
                          className="btn btn-primary mar-top-2em">
                          <span className="bi bi-upload"></span> upload
                        </button>
                      </div>

                    </div>

                  </div>

                </div>

                <div className="col-md-6">

                  <div className="row">
                    
                    
                    <div className="col-md-3 ui-div" onClick={() => selectedUi('HDRDIV')} >HdrDiv</div>
                    <div className="col-md-3 ui-div" onClick={() => selectedUi('HDR')} >Hdr</div>
                    <div className="col-md-3 ui-div" onClick={() => selectedUi('TAB')} >TAB</div>
                    <div className="col-md-3 ui-div" onClick={() => selectedUi('TABPG')} >TabPag</div>

                    <div className="col-md-3 ui-div" onClick={() => selectedUi('ROW')} >Row</div>
                    <div className="col-md-3 ui-div" onClick={() => selectedUi('DIV')} >Div</div>
                    <div className="col-md-2 ui-div" onClick={() => selectedUi('DIV6')} >Div6</div>
                    <div className="col-md-2 ui-div" onClick={() => selectedUi('DIV4')} >Div4</div>
                    <div className="col-md-2 ui-div" onClick={() => selectedUi('DIV3')} >Div3</div>
                    
                    
                  </div>

                  <div className="row">
                    <input {...register("txtSelectedUi")} type="text" className="form-control" disabled="disabled" readonly="readonly" />
                  </div>

                  <div className="row">
                    <table className="lst-grid">
                      <thead>
                        <tr>
                          <th>
                            <input {...register("cbIsSelectAll")} type="checkbox" />
                          </th>
                          <th>Element</th>
                          <th>Parent</th>
                          <th>MN</th>
                          <th>RO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <UIElmList elmList={elementList} register={register} />
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            <div className="col-md-6">

              {/* <div className="tree">
              <ul>

                <li>
                  <details>
                    <summary>Root 1</summary>
                    <ul>
                      <li>R1 Element 1</li>
                      <li>R1 Element 2</li>
                      <li>
                        <details>
                          <summary>R1 Grid 1</summary>
                          <ul>
                            <li>Grid Element 1</li>
                            <li>Grid Element 2</li>
                          </ul>
                        </details>
                      </li>
                      <li>R1 Element 4</li>
                    </ul>
                  </details>
                </li>

                <li>
                  <details>
                    <summary>Root 2</summary>
                    <ul>
                      <li>R2 Element 1</li>
                      <li>R2 Element 2</li>
                      <li>
                        <details>
                          <summary>R2 Popup 1</summary>
                          <ul>
                            <li>Popup Element 1</li>
                            <li>Popup Element 2</li>
                          </ul>
                        </details>
                      </li>
                      <li>R2 Element 4</li>
                      <li>
                        <details>
                          <summary>R2 Grid 1</summary>
                          <ul>
                            <li>Grid2 Element 1</li>
                            <li>Grid2 Element 2</li>
                          </ul>
                        </details>
                      </li>
                    </ul>
                  </details>
                </li>

              </ul>
            </div> */}


              {/* <ul>
              {uiTree.map((node) => (
                <TreeNode key={node.id} node={node} />
              ))}
            </ul> */}


              {/* <NewTreeNode uiTreeLst={actualUiTree} /> */}

              <div className="pad-bottom-0-5em">

                <b>Mandatory :</b> 
                <button type="button" className="btn-link" onClick={handleSetMandatory}>Set</button>
                <b>/</b>
                <button type="button" className="btn-link" onClick={handleRemoveMandatory}>Remove</button>

                <b>Readonly :</b>
                <button type="button" className="btn-link" onClick={handleSetReadonly}>Set </button>
                <b>/</b>
                <button type="button" className="btn-link" onClick={handleRemoveReadonly}>Remove</button>
                
                <br/>

                <button type="button" className="btn-link" onClick={handleDeleteUIElm}>Delete</button>

                <button type="button" className="btn-link" onClick={handleUpdateCSS}>Update CSS</button>

                <button type="button" className="btn-link" onClick={() => selectedUi('PARENT')} >Change Parent</button>

                <button type="button" className="btn-link" onClick={updateGridProperty} >Update Grid Property</button>

              </div>

              <div className="tree">
                <UITree uiTreeLst={actualUiTree} />
              </div>

            </div>

          </div>

        </form>

      </>
    );


  } catch (error) {
    console.log(error.message);
  }

}

export default UIDesign;
