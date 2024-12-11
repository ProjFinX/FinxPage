import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "../api/Webcall";
import { GetAllStageList } from "../utilities/getallstage";
import { GetStgEvents } from "../utilities/GetStgEvents";
import { GetExpGrpLst } from "../utilities/geteventexpression";

import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;


function EvntExprGroupMap({ ScrId }) {

  const [stageList, setStageList] = useState([]);
  const [stageEvents, setStgEvents] = useState([]);
  const [expGroups, setExpGroups] = useState([]);
  const { register, getValues, setValue, formState: { errors }, reset, } = useForm();


  const FetchAllStageList = async (ScrId) => {
    const StgList = await GetAllStageList(ScrId);
    setStageList(StgList.body.Stages.filter((x) => x.StageTypeId !== 9));
  };



  const callServer = async (frmData, tag, endPoint, refreshFlag) => {

    const frmHdr = { convid: generateUUID(), tag: tag, orgid: "", vendid: "0", };

    const reqHdr = {};
    const reqdata = { hdr: frmHdr, body: frmData };

    let StgId = getValues("cmbStgId");

    try {

      const response = await api.post(endPoint, compressBase64(reqdata), reqHdr);
      const resData = JSON.parse(decompressBase64(response.data));

      if (resData.hdr.rst == "SUCCESS") {
        setTimeout(() => {
          toast.success("Successfully updated");

          if (refreshFlag == 1) {
            //resetExprGroup();
            FetchStgEventTree(ScrId, StgId);
          }

          // resetFormData();
          // FetchElementList(ScrId, StgId);
          // FetchUITree(ScrId, StgId);

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


  const addExprGroup = (treenode) => {

    let StgId = getValues("cmbStgId");
    let exprGroupIds = getValues("txtSelectedExpGroupId");

    let StgElmDesignId = treenode.stgelmdsgid;
    let EventId = treenode.evntid;

    if (exprGroupIds != '[]') {

      let arrayExpGrps = [];
      let arrayVal = JSON.parse(exprGroupIds)
      let nOrd = 0;
      arrayVal.forEach(egrid => {
        var obj = { exgrpid: egrid, ord: ++nOrd };
        arrayExpGrps.push(obj);
      });

      let frmData = {
        cmbScrId: ScrId, cmbStgId: StgId, cmbStgElmDsigId: StgElmDesignId, cmbEvntId: EventId,
        expgrps: arrayExpGrps
      };

      callServer(frmData, "Update Event ExpGroup Map", apiendpoints.Updexgrpmap, 1);

    }


  };

  const resetExpGrpSelection = (treenode, e) => {

    // console.log(e.target.value);

    // let lstNode = stageEvents.filter(x => x.parentid == treenode.id);
    // lstNode.forEach(element => {

    //   console.log( 'expgrp' + element.id );

    //   setValue( 'expgrp' + element.id, true);

    // });


  };

  const handleOnCheck = (ExprGrpMapId) => {

  };

  const deleteExprGroupMap = (treenode) => {

    if (window.confirm("Are you sure, do you want delete this expression mapping ?")) {

      let StgId = getValues("cmbStgId");
      let exprgrpmapids = [];
      exprgrpmapids.push(treenode.exprgrpmapid)

      let frmData = {
        cmbScrId: ScrId, cmbStgId: StgId, cmbStgElmDsigId: treenode.stgelmdsgid,
        cmbEvntId: treenode.evntid, exprGrpMapIds: exprgrpmapids
      };

      callServer(frmData, "Delete Event ExpGroup Map", apiendpoints.Delexgrpmap, 1);
    }
  };

  const deleteEventExprGroupMap = (treenode) => {

    if (window.confirm("Are you sure, do you want delete this event mapping ?")) {

      let StgId = getValues("cmbStgId");
      let exprgrpmapids = [];
      let lstNode = stageEvents.filter(x => x.parentid == treenode.id);
      lstNode.forEach(element => {
        exprgrpmapids.push(element.exprgrpmapid)
      });

      let frmData = {
        cmbScrId: ScrId, cmbStgId: StgId, cmbStgElmDsigId: treenode.stgelmdsgid,
        cmbEvntId: treenode.evntid, exprGrpMapIds: exprgrpmapids
      };

      callServer(frmData, "Delete Event ExpGroup Map", apiendpoints.Delexgrpmap, 1);
    }
  };


  const reorderExprGroupMap = (treenode, dir) => {

    let StgId = getValues("cmbStgId");
    
    let frmData = {
      cmbScrId: ScrId, cmbStgId: StgId, exprGrpMapId: treenode.exprgrpmapid, txtDirection: dir
    };
  
    callServer(frmData, "Reorder Event ExpGroup Map", apiendpoints.Reordexgrpmap, 1);

  };


  const StgEventTree = () => {

    if (stageEvents) {
      let root = stageEvents.filter((x) => x.parentid == null);
      return (
        <>
          {(root.length > 0) ?
            <ul>
              {(root.map((node) => {
                return (
                  <>
                    <StgEventNode treenode={node} />
                  </>
                )
              }))}
            </ul>
            : <></>}
        </>
      )

    }
  };

  const StgEventNode = ({ treenode }) => {
    let lstNode = stageEvents.filter(x => x.parentid == treenode.id);
    lstNode.sort((a, b) => a.ord < b.ord ? -1 : 1)
    if (lstNode.length > 0) {

      return (
        <li>
          <details open>
            <summary id={'id' + treenode.id}>

              {treenode.ty == 'EVNT' ?
                <>
                  <input type="checkbox" onChange={(e) => resetExpGrpSelection(treenode, e)} />
                  <button type="button" id={'expgrp' + treenode.id} className="btn btn-light" onClick={() => addExprGroup(treenode)} >
                    <span dangerouslySetInnerHTML={{ __html: treenode.elmname }}></span>
                  </button>
                  <button type="button" className="btn btn-light clr-gray" onClick={() => deleteEventExprGroupMap(treenode)}  ><i className="fa fa-trash-o"></i></button>
                </>
                : <span dangerouslySetInnerHTML={{ __html: treenode.elmname }}></span>
              }

            </summary>
            <ul>
              {lstNode.map((node) => {
                return (
                  <StgEventNode treenode={node} />
                )
              })}
            </ul>
          </details>
        </li>
      );

    }
    else {

      return (
        <li id={'id' + treenode.id}>

          {treenode.ty == 'EXPGR' ?
            <input type="checkbox" id={'expgrp' + treenode.id} />
            : <></>
          }

          <span>&nbsp;</span>

          {treenode.ty == 'EVNT' ?
            <button type="button" id={'expgrp' + treenode.id} className="btn btn-light" onClick={() => addExprGroup(treenode)} >
              <span dangerouslySetInnerHTML={{ __html: treenode.elmname }}></span>
            </button>
            : <span dangerouslySetInnerHTML={{ __html: treenode.ord + ' ' + treenode.elmname }}></span>
          }

          {treenode.ty == 'EXPGR' ?
            <>
              <button type="button" className="btn btn-light clr-gray" onClick={() => deleteExprGroupMap(treenode)} ><i className="fa fa-trash-o"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExprGroupMap(treenode, 'U')} ><i className="fa fa-arrow-up"></i></button>
              <button type="button" className="btn btn-light clr-gray" onClick={() => reorderExprGroupMap(treenode, 'D')} ><i className="fa fa-arrow-down"></i></button>
            </>
            : <></>
          }

        </li>
      );

    }
  };



  const mbgElmArray = (tf, Id) => {

    let arrayVal;
    if (getValues('txtSelectedExpGroupId') == '[]') {
      arrayVal = [];
    }
    else {
      arrayVal = JSON.parse(getValues('txtSelectedExpGroupId'));
    }

    if (tf) {
      const index = arrayVal.indexOf(Id);
      if (index == -1) {
        arrayVal.push(Id);
      }
    }
    else {
      const index = arrayVal.indexOf(Id);
      if (index > -1) {
        arrayVal.splice(index, 1);
      }
    }

    setValue('txtSelectedExpGroupId', JSON.stringify(arrayVal));

  };

  const ExpGroupLst = () => {

    let expGrpIds = new Array();
    let nCnt = -1;

    const onChangeSelect = (e, ExprGroupId) => {
      mbgElmArray(e.target.checked, ExprGroupId);
    }

    if (expGroups) {

      return (
        <>
          {(expGroups.length > 0) ? expGroups.map((data, index) => {

            ++nCnt;
            expGrpIds[nCnt] = data.egid;

            return (
              <tr key={index}>
                <td align="center"><input {...register('S_' + expGrpIds[nCnt])} type="checkbox" onClick={(e) => onChangeSelect(e, data.egid)} /></td>
                <td>{data.egname}</td>
              </tr>
            )

          }) : <></>}

        </>
      )
    }
    else {
      return (<></>);
    }

  };

  const resetExpGrpoupSelect = () => {
    setValue('txtSelectedExpGroupId', '[]');
    expGroups.map((expgr) => {
      setValue('S_' + expgr.egid, false);
    });
  };


  const stageOnChange = (e) => {
    var StgId = e.target.value;
    FetchStgEventTree(ScrId, StgId);
  };

  const FetchStgEventTree = async (ScrId, StgId) => {
    const evntTree = await GetStgEvents(ScrId, StgId);
    setStgEvents(evntTree.body.evnts);
    reset({ txtSelectedExpGroupId: "[]" });
  };

  const FetchExpGroups = async () => {
    const Response = await GetExpGrpLst(ScrId);
    setExpGroups(Response.body.expressions);
  };

  useEffect(() => { FetchAllStageList(ScrId); }, []);
  useEffect(() => { FetchExpGroups(ScrId); }, []);

  return (

    <>

      <form autoComplete="off" >
        <div className="row">
          <div className="col-md-5">

            <div className="row">
              <div className="col-md-12">
                <label htmlFor="cmbStgId" className="form-label">Stage</label>
                <select {...register("cmbStgId")} className="form-select" onChange={stageOnChange} >
                  <option value="0">- Select -</option>
                  {
                    stageList.map((x) => (<option key={x.StageId} value={x.StageId}>{x.StageName}</option>))
                  }
                </select>
              </div>
            </div>

            <div className="tree">
              <StgEventTree />
            </div>

          </div>

          <div className="col-md-7">


            <div className="row">
              Expression Group List
              <input {...register("txtSelectedExpGroupId")} type="text" readonly="readonly" disabled="disabled" className="dispNone1" />
              <table className="lst-grid">
                <thead>
                  <tr>
                    <th className="col-md-1" >
                      <button type="button" className="btn-link" onClick={() => resetExpGrpoupSelect()} >Clear</button>
                    </th>
                    <th className="col-md-11">Expression Group</th>
                  </tr>
                </thead>
                <tbody>
                  <ExpGroupLst />
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </form>
    </>

  )

}

export default EvntExprGroupMap;
