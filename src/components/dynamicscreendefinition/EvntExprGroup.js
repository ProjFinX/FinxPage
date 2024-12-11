import React, { Children } from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import { GetExpGrpLst } from "../utilities/geteventexpression";
import { GetExpressiontree } from "../utilities/getScrexpresiontree";
import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import appsettings from "../../appsettings.json"
import { FetchCombodata } from "../utilities/combodata";
import { GetScreenGroupElms } from "../utilities/getscrengrpelms";
import Modal from "react-bootstrap/Modal";
import { ModalBody, ModalTitle } from "react-bootstrap";

const apiendpoints = appsettings.ApiEndpoints;

const schema = yup.object().shape({
  txtExpGroupName: yup.string().required("Please enter expression group"),
});



function EvntExprGroup({ ScrId }) {

  const [exprGroup, setExprGroup] = useState([]);
  const { register, handleSubmit, getValues, setValue, formState: { errors }, reset, } = useForm({ resolver: yupResolver(schema) });
  const [expressionTree, setExpressionTree] = useState([]);

  const [selectedexprn, setSelectedExprn] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [dbConnId, setDbConnId] = useState(0);
  const [elementGroupId, setElementGroupId] = useState(-1);

  const [dbConn, setDbConn] = useState([]);
  const [mapType, setMapType] = useState(1);
  const [uniqueField, setUniqueField] = useState(null);
  const [elementGroups, setElementGroups] = useState([]);
  const [chileElements, setChileElements] = useState([]);
  const [elementMap, setElementMap] = useState([]);

  const [exprnId, setExprnId] = useState(0);
  const [parentExprnId, setPrntExprnId] = useState(0);
  const [exprnTypeId, setExprnTypeId] = useState(0);

 


  const callServer = async (frmData, tag, endPoint, refreshFlag) => {

    const frmHdr = { convid: generateUUID(), tag: tag, orgid: "", vendid: "0", };

    const reqHdr = {};
    const reqdata = { hdr: frmHdr, body: frmData };

    try {
      const response = await api.post(endPoint, compressBase64(reqdata), reqHdr);
      const resData = JSON.parse(decompressBase64(response.data));

      if (resData.hdr.rst == "SUCCESS") {
        setTimeout(() => {
          toast.success("Successfully updated");
          if (refreshFlag == 1) {
            resetExprGroup();
            FetchExpGrpList(ScrId);
          }
          else if (refreshFlag == 2) {
            resetExpression();
            FetchExpTree(frmData.txtExprGroupId);
            setModalVisible(false);
          }
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


  const resetExprGroup = () => {
    reset({ txtExprGroupId: "", txtExpGroupName: "" });
  };

  const LoadCombo = async () => {
    const opt = '|DBCN|';
    const optw = '';
    const Response = await FetchCombodata(opt, optw);

    setDbConn(Response.body.dbcn);

  };

  const FetchExpGrpList = async (ScrId) => {
    const response = await GetExpGrpLst(ScrId);
    setExprGroup(response.body.expressions);
  };

  const FetchElementGroups = async () => {
    const Response = await GetScreenGroupElms(ScrId);
    setElementGroups(Response.body.elements);
  };


  const FetchExpTree = async (ExprGroupId) => {
    const response = await GetExpressiontree(ScrId, ExprGroupId);
    setExpressionTree(response.body.expressions);
  };




  const ExprGroupList = () => {

    const editExprGroup = (data) => {
      reset({
        txtExprGroupId: data.egid, txtExpGroupName: data.egname
      })
    }

    const delExprGroup = (id) => {
      if (window.confirm("Are you sure")) {
        let frmData = { cmbScrId: ScrId, txtExprGroupId: id };
        callServer(frmData, "Delete Expression Group", apiendpoints.Delexprngrp, 1);
      }
    }

    const setExprGroupName = (data) => {
      document.getElementById("lblExprGroup").innerHTML = data.egid + " / " + data.egname;

      reset({
        txtExprGrpId: data.egid, txtParentExprnId: "", txtSeExprTypeId: "", txtExprnId: "", txtExpression: ""
      });

      FetchExpTree(data.egid);
    };


    return (

      <>

        {(exprGroup) ?

          exprGroup.map((data, index) => {

            return (
              <tr key={index}>
                <td>{data.egid}</td>
                <td> <button onClick={() => (setExprGroupName(data))} className="btn btn-link">{data.egname}</button></td>
                <td>
                  <button onClick={() => (editExprGroup(data))} className="btn btn-light clr-gray"><i className="fa fa-edit"></i></button>
                  <button onClick={() => (delExprGroup(data.egid))} className="btn btn-light clr-gray"><i className="fa fa-trash-o"></i></button>
                </td>
              </tr>
            )
          })

          : <></>}

      </>

    )

  };


  const ExpTree = ({ expTreeLst }) => {

    if (expTreeLst) {

      let root = expTreeLst.filter((x) => x.prexprnid == null);

      return (
        <>
          {(root.length > 0) ?
            <ul>
              {(root.map((node) => {
                return (
                  <>
                    <ExpNode expTreeLst={expTreeLst} treenode={node} />
                  </>
                )
              }))}
            </ul>
            : <></>}
        </>
      )

    }
  };


  const ExpNode = ({ expTreeLst, treenode }) => {


    let lstNode = expTreeLst.filter(x => x.prexprnid == treenode.exprnid)
    if (lstNode.length > 0) {

      return (
        <li>
          <details open>
            <summary id={'id' + treenode.exprnid}>
              <input type="checkbox" />
              <button type="button" id={'ui' + treenode.exprnid} className="btn btn-light"  >
                <span dangerouslySetInnerHTML={{ __html: treenode.exprn }} ></span>
              </button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => setParentExprnId(treenode.exprnid)} ><i className="fa fa-plus"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => editExpression(treenode)}><i className="fa fa-edit"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => deleteExpression(treenode.exprnid)} ><i className="fa fa-trash-o"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExpression(treenode.exprnid, 'U')} ><i className="fa fa-arrow-up"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExpression(treenode.exprnid, 'D')}><i className="fa fa-arrow-down"></i></button>

            </summary>
            <ul>
              {lstNode.map((node) => {
                return (
                  <ExpNode expTreeLst={expTreeLst} treenode={node} />
                )
              })}
            </ul>
          </details>
        </li>
      );

    }
    else {

      return (
        <li id={'id' + treenode.exprnid}>
          <span>&nbsp;</span>
          <input type="checkbox" />
          &nbsp;
          <span dangerouslySetInnerHTML={{ __html: treenode.exprn }}></span>
          
          {
            ( treenode.exprntyid==2 || treenode.exprntyid==3 || treenode.exprntyid==4 || treenode.exprntyid==6 ) ?
            <button type="button" className="btn btn-light clr-gray" onClick={() => setParentExprnId(treenode.exprnid)} ><i className="fa fa-plus"></i></button>
            :<></>
          }
          
          <button type="button" className="btn btn-light clr-gray" onClick={() => editExpression(treenode)}><i className="fa fa-edit"></i></button>
          <button type="button" className="btn btn-light clr-gray" onClick={() => deleteExpression(treenode.exprnid)} ><i className="fa fa-trash-o"></i></button>
          <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExpression(treenode.exprnid, 'U')} ><i className="fa fa-arrow-up"></i></button>
          <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExpression(treenode.exprnid, 'D')}><i className="fa fa-arrow-down"></i></button>
        </li>
      );

    }
  };


  const resetExpression = () => {
    reset({
      txtParentExprnId: "", txtSeExprTypeId: "", txtExprnId: "", txtExpression: "",
      cmbDbConnId: "0", MapType1: "", MapType2: "", cmbGrpElementId: "-1", txtIndexName: "",
      uniqueField:""
    });

    setExprnId('');
    setPrntExprnId('');
    setExprnTypeId('');

    setChileElements([]);
    setModalVisible(false);
    setElementGroupId(-1);
    setDbConnId(0);
    setElementMap([]);
    setUniqueField('');
  };


  const clearParentExprnId = () => {
    setValue('txtParentExprnId', '');
    setValue('txtSeExprTypeId', '');
  };


  const setParentExprnId = (id) => {
    setValue('txtParentExprnId', id);
    setPrntExprnId(id);
  }

  const onChangeDbConn = (e) => {
    setDbConnId(e.target.value)
  };

  const onChangeMapType = (e) => {
    setMapType(e.target.value)
  };


  const onChangeElmGroup = (e) => {
    setElementMap([]);
    setElementGroupId(e.target.value);
    FetchScreenChildElements(e.target.value, ScrId);
    loadMapTable();
  };

  const FetchScreenChildElements = async (grpelmid) => {
    let opt = "|CHELM|";
    let optw = {
      CHELM: "ScreenId=" + ScrId + " and ParentElementId=" + grpelmid,
    };
    const Response = await FetchCombodata(opt, optw);
    setChileElements(Response.body.chelm);
  };


  const onSubmitExprGroup = async (data) => {

    if (data.txtExpGroupName == undefined)
      return;

    let frmData = { cmbScrId: ScrId, txtExprGroupId: data.txtExprGroupId, txtSeExpGroupName: data.txtExpGroupName };
    callServer(frmData, "Update Expression Group", apiendpoints.UpdExpressionGroup, 1);
  };


  const onSubmitExpression = () => {

    let expression = getValues("txtExpression");
    let dbConnectiond = getValues("cmbDbConnId");
    let grpElmId = getValues("cmbGrpElementId");
    let exprGrpId = getValues("txtExprGrpId");
    let uniqueCol = (exprnTypeId==17) ? getValues("txtUniqueCol") : null;
    let maptype  = (exprnTypeId==5) ? getValues("cmbMapType") : 2;

    let frmData = {
      cmbScrId: ScrId, txtSeExprnId: exprnId, txtExprGroupId: exprGrpId, txtSeExprTypeId: exprnTypeId,
      txtParentSeExprnId: parentExprnId, txtExpression: expression, cmbCompDbId: dbConnectiond, txtUniqueCol:uniqueCol,
      cmbElmGrpId: grpElmId, cmbBindTy:maptype, map : elementMap
    };

    callServer(frmData, "Update Expression", apiendpoints.UpdateExpression, 2);

  };


  const editExpression = (treenode) => {

    // setValue('txtExprnId', treenode.exprnid);
    // setValue('txtParentExprnId', treenode.prexprnid);
    // setValue('txtSeExprTypeId', treenode.exprntyid);

    setExprnId(treenode.exprnid);
    setPrntExprnId(treenode.prexprnid);
    setExprnTypeId(treenode.exprntyid);

    setValue('txtExprnId', treenode.exprnid);
    setValue('txtParentExprnId', treenode.prexprnid);
    setValue('txtSeExprTypeId', treenode.exprntyid);

    setValue('txtExpression', treenode.expression);
    let exprnName = getExprnTypeName(treenode.exprntyid);
    setSelectedExprn(exprnName);

    if (treenode.exprntyid == 5 && treenode.dbqry) {
      setDbConnId(treenode.dbqry.dbconn);
      setMapType(treenode.dbqry.bt);
      setElementGroupId(treenode.dbqry.elmgrpid);
      FetchScreenChildElements(treenode.dbqry.elmgrpid);

      if (treenode.dbqry.colmap) {
        var map = [...treenode.dbqry.colmap];
        setElementMap(map);
      }

    }

    if (treenode.exprntyid == 17 && treenode.msrcqry) {
      setDbConnId(treenode.msrcqry.dbconn);
      setMapType(treenode.msrcqry.bt);
      setElementGroupId(treenode.msrcqry.elmgrpid);
      setUniqueField(treenode.msrcqry.ucol);
      FetchScreenChildElements(treenode.msrcqry.elmgrpid);
      var map = [...treenode.msrcqry.colmap];
      setElementMap(map);
    }

    setModalVisible(true);

  };


  const onEnterdModel = () => {
    reset({ cmbDbConnId: dbConnId, cmbGrpElementId: elementGroupId });
  }

  const deleteExpression = (id) => {
    if (window.confirm("Are you sure, do you want delete ?")) {
      let exprGrpId = getValues("txtExprGrpId");
      let frmData = { cmbScrId: ScrId, txtExprGroupId: exprGrpId, txtSeExprnId: id };
      callServer(frmData, "Delete Expression", apiendpoints.Delexprn, 2);
    }
  };


  const reorderExpression = (id, dir) => {
    let exprGrpId = getValues("txtExprGrpId");
    let frmData = { cmbScrId: ScrId, txtExprGroupId: exprGrpId, txtSeExprnId: id, txtDirection: dir };
    callServer(frmData, "ReOrder Expression", apiendpoints.Reord, 2);
  };


  const selectExprnType = (id) => {

    setValue('txtSeExprTypeId', id);

    let exprnid = getValues('txtExprnId');
    let prexprnid = getValues('txtParentExprnId');
    
    setExprnTypeId(id);
    setExprnId(exprnid);
    setPrntExprnId(prexprnid);

    setElementMap([]);

    let exprnName = getExprnTypeName(id);
    setSelectedExprn(exprnName);

    if (id == 3 || id == 9) {
      onSubmitExpression();
    }
    else{
      setModalVisible(true);
    }

  };


  const getExprnTypeName = (id) => {

    let exprnName;
    switch (id) {

      case 1:
        exprnName = 'Assign value';
        break;

      case 2:
        exprnName = 'IF';
        break;

      case 3:
        exprnName = 'Else';
        break;

      case 4:
        exprnName = 'Loop';
        break;

      case 5:
        exprnName = 'DB Query';
        break;

      case 6:
        exprnName = 'Else If';
        break;

      case 7:
        exprnName = 'Set Property';
        break;

      case 8:
        exprnName = 'Domain Data';
        break;

      case 9:
        exprnName = 'Stop';
        break;

      case 10:
        exprnName = 'Message';
        break;

      case 11:
        exprnName = 'Count(condition)';
        break;

      case 12:
        exprnName = 'Count(group)';
        break;

      case 13:
        exprnName = 'Sum(condition)';
        break;

      case 14:
        exprnName = 'Sum(group)';
        break;

      case 15:
        exprnName = 'Re-Load Combo';
        break;

      case 16:
        exprnName = 'External Link';
        break;

      case 17:
        exprnName = 'Multi Search';
        break;

      case 21:
        exprnName = 'Move Stage';
        break;

      case 101:
        exprnName = 'Expression Group';
        break;

      case 102:
        exprnName = 'Custome Code';
        break;

      default:
        break;

    }

    return exprnName;

  };


  const updateElmMapp = () => {
    let mapElmId = getValues('cmbMapElementId')
    let mapIdxName = getValues('txtIndexName');
    let maps = elementMap;
    let va = maps.find(x => x.elmid == mapElmId);
    if (va) {
      va["idxname"] = mapIdxName
    }
    else {
      maps.push({ elmid: mapElmId, idxname: mapIdxName });
    }
    setElementMap(maps);
    loadMapTable();
  };


  const deleteMap = (elmid) =>{
    let maps = elementMap;
    let nLoc = maps.indexOf(maps.find(x => x.elmid == elmid));
    maps.splice(nLoc, 1);
    setElementMap(maps);
    loadMapTable();
  };

  const loadMapTable = () => {

    let mappedElm = document.getElementById("divMappedElm");

    mappedElm.innerHTML = '';

    var tbl = document.createElement("table");

    tbl.className = "lst-grid";

    var tbh = document.createElement("thead");
    tbl.appendChild(tbh);

    var htr = document.createElement("tr");
    tbh.appendChild(htr);

    var th = document.createElement("th");
    htr.append(th);
    th.append("Element");

    var th = document.createElement("th");
    htr.append(th);
    th.append("Index / Name");

    var th = document.createElement("th");
    htr.append(th);
    th.append("Manage");

    mappedElm.appendChild(tbl);

    elementMap.map((node) => {

      let elm = chileElements.find(x => x.k == node.elmid);

      var tr = document.createElement("tr");
      tbl.appendChild(tr);

      var td = document.createElement("td");
      tr.append(td);

      var lbl = document.createElement("label");
      lbl.append(elm["v"]);
      td.append(lbl);

      var td = document.createElement("td");
      td.style = "text-align:center";
      tr.append(td);
      var lbl = document.createElement("label");
      lbl.append(node.idxname);
      td.append(lbl);

      var td = document.createElement("td");
      tr.append(td);

      var btnDel = document.createElement("button");
      btnDel.append('delete');
      btnDel.className = "btn btn-link";
      btnDel.onclick = () => { deleteMap(node.elmid) };
      td.append(btnDel);

    });

  };


  useEffect(() => {
    LoadCombo();
    FetchElementGroups();
    FetchExpGrpList(ScrId);
  }, []);

  return (

    <>

      <div className="row">

        <div className="col-md-4">

          <form onSubmit={handleSubmit(onSubmitExprGroup)} autoComplete="off">

            <div className="row">
              <div className="col-md-10">
                <label htmlFor="txtExpGroupName" className="form-label">Expression Group</label>
                <input {...register("txtExprGroupId")} type="text" readOnly="readonly" className="dispNone" />
                <input {...register("txtExpGroupName")} type="text" className="form-control" />
                <p className="err-msg" >{errors.txtExpGroupName?.message}</p>
              </div>

              <div className="col-md-2">
                <button type="button" className="btn-link pad-bottom-0-5em" onClick={resetExprGroup}>Reset</button>
                <button type="submit" className="btn btn-primary" >Save</button>
              </div>
            </div>

          </form>

          <div>

            <table className="lst-grid">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Expression Group</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                <ExprGroupList />
              </tbody>
            </table>

          </div>

        </div>

        <div className="col-md-8">

          <div className="pad-bottom-0-5em">
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(1)} >Assign value</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(2)} >IF</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(3)} >Else</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(6)} >Else If</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(7)} >Set Property</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(5)} >DB Qry & Bind</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(17)} >Multi Search</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(15)} >Re-Load Combo</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(10)} >Message</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(9)} >Stop</button>
          </div>

          <div className="pad-bottom-0-5em">
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(4)} >Loop</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(11)} >Count(condition)</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(12)} >Count(group)</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(13)} >Sum(condi)</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(14)} >Sum(group)</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(8)} >Domain Data</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(21)} >Move Stage</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(102)} >Custome Code</button>
          </div>

          {/* <div className="pad-bottom-0-5em">
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(16)} >External Link</button>
            &nbsp;&nbsp;
            <button type="button" className="btn-link btn-link-bg-border" onClick={() => selectExprnType(101)} >Expression Group</button>
          </div> */}

          <div className="border-bottom-1px" >

            <input {...register("txtParentExprnId")} type="text" className="wd-80" disabled="disabled" readOnly="readonly" />
            <button type="button" className="btn-link" onClick={() => clearParentExprnId()} >Clear</button>
            &nbsp;
            Expresion Group : <b><label id="lblExprGroup"></label></b>
            <input {...register("txtExprGrpId")} type="text" readOnly="readonly" className="dispNone" />
            <input {...register("txtExprnId")} type="text" className="dispNone" disabled="disabled" readOnly="readonly" />
            <input {...register("txtSeExprTypeId")} type="text" className="dispNone" disabled="disabled" readOnly="readonly" />
          </div>

          <div className="tree">
            {<ExpTree expTreeLst={expressionTree} />}
          </div>

        </div>

      </div>


      <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" top show={modalVisible}
        // onEnter={function () { console.log("onEnter   ") }}
        // onEntering={function () { console.log("onEntering") }}
        onEntered={() => onEnterdModel()} >

        <Modal.Header>
          <ModalTitle><h5>{selectedexprn}</h5></ModalTitle>
        </Modal.Header>
        <ModalBody>

          <div className="pad-bottom-0-5em" >
            <label htmlFor="txtExpression" className="form-label">Expression</label>
            <textarea {...register("txtExpression")} type="textarea" height={20} className="form-control" />
          </div>


          {((exprnTypeId == 5) || (exprnTypeId == 17)) ?
            <>

              <div className="row">

                <div className="col-md-4">
                  <label className="form-label">DB Connection</label>
                  <select {...register("cmbDbConnId")} value={dbConnId} className="form-control"
                    onChange={onChangeDbConn} >
                    {<option value="0">-select-</option>}
                    {
                      dbConn.map((res) => (
                        <option key={res.k} value={res.k}>
                          {res.v}
                        </option>
                      ))
                    }
                  </select>
                </div>

                { (exprnTypeId == 5)?
                  <div className="col-md-4">
                    <label className="form-label">Map Type</label>
                    <select {...register("cmbMapType")} value={mapType} className="form-control"
                      onChange={onChangeMapType} >
                      {<option value="1">Index</option>}
                      {<option value="2">Name</option>}
                    </select>
                  </div>
                  : <></> 
                }

                <div className="col-md-4">
                  <label className="form-label">Element Group</label>
                  <select className="form-control" {...register("cmbGrpElementId")} value={elementGroupId}
                    onChange={onChangeElmGroup} >
                    {<option value="999">-select-</option>}
                    {elementGroups && elementGroups.map((res) => (
                      <option key={res.elna} value={res.elid}>
                        {res.elna}
                      </option>
                    ))}
                  </select>
                </div>


                { (exprnTypeId == 17)?
                  <div className="col-md-4">
                    <label className="form-label">Unique Field</label>
                    <input {...register("txtUniqueCol")} value={uniqueField} type="text" className="form-control" />
                  </div>
                  : <></> 
                }

              </div>

              <div className="row">

                <div className="col-md-4">
                  <label className="form-label">Elements</label>
                  <select className="form-control" {...register("cmbMapElementId")} >
                    {<option value="-1">-select-</option>}
                    {chileElements && chileElements.map((elm) => (
                      <option key={elm.k} value={elm.k}>{elm.v}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Index / Name</label>
                  <input {...register("txtIndexName")} type="text" className="form-control" />
                </div>

                <div className="col-md-4">
                  <div className="pad-top-2-5em">
                    <button type="button" className="btn btn-link" onClick={() => updateElmMapp()} >Update</button>
                    &nbsp;
                    <button type="button" className="btn btn-link" onClick={() => loadMapTable()} >Refresh</button>
                  </div>
                </div>

              </div>

              <div className="row">
                <div id="divMappedElm" className="pad-top-0-5em"></div>
              </div>

            </>

            : <></>
          }

          <div className="pad-top-0-5em" >
            <button type="button" onClick={() => onSubmitExpression()} className="btn btn-primary" >Submit</button>
            &nbsp;
            <button type="button" onClick={() => resetExpression()} className="btn btn-warning" >Cancel</button>
          </div>

        </ModalBody>

      </Modal>

    </>

  )

}

export default EvntExprGroup;
