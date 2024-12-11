import React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "../api/Webcall";
import { GetAllStageList } from "../utilities/getallstage";
import { GetStgClientEvents } from "../utilities/GetStgEvents";
import { GetExpGrpLst } from "../utilities/geteventexpression";

import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;


function ClientEvents({ ScrId }) {

  const [stageList, setStageList] = useState([]);
  const [stageEvents, setStgEvents] = useState([]);
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
        if (refreshFlag == 2) {
          
          setValue("txtScrCEventId", "");
          setValue("txtStgElmDesignId", "");
          setValue("txtEventId", "");
          setValue("txtScript", "");

          if (resData.body.evnts)
          {
            if (resData.body.evnts.length>0)
            {
              var obj = resData.body.evnts[0];
              document.getElementById("lblClientScript").innerHTML = obj.elmna +" - "+ obj.evnt;
              setValue("txtScrCEventId", obj.scrcevntid);
              setValue("txtStgElmDesignId", obj.stgemldsnid);
              setValue("txtEventId", obj.evntid);
              setValue("txtScript", obj.script);
            }
          }
         
        }
        else {
          setTimeout(() => {
            toast.success("Successfully updated");

            setValue("txtScrCEventId", "");
            setValue("txtStgElmDesignId", "");
            setValue("txtEventId", "");
            setValue("txtScript", "");
            FetchStgEventTree(ScrId, StgId);

          }, 300);
        }
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


  const getClientScript = (treenode) => {

    let StgId = getValues("cmbStgId");

    let StgElmDesignId = treenode.stgelmdsgid;
    let EventId = treenode.evntid;

    let frmData = {
      cmbScrId: ScrId, cmbStgId: StgId, cmbStgElmDsigId: StgElmDesignId, cmbEvntId: EventId
    };

    callServer(frmData, "Get client Event script", apiendpoints.Getclntsrpt, 2);

  };

  
  const updateClientScript = () => {
  
    let StgId = getValues("cmbStgId");

    let frmData = {
      cmbScrId: ScrId, cmbStgId: StgId,
      txtScrCEventId: getValues("txtScrCEventId"),
      txtStgElmDsigId : getValues("txtStgElmDesignId"),
      txtEvntId : getValues("txtEventId"),
      txtScript : getValues("txtScript")
    };

    callServer(frmData, "Update client Event script", apiendpoints.Updclntsrpt, 3);

  };



  const deleteClientScript = (treenode) => {

    if (window.confirm("Are you sure, do you want delete this script ?")) {
      let StgId = getValues("cmbStgId");
      let frmData = {
        cmbScrId: ScrId, cmbStgId: StgId, txtScrCEventId: treenode.scrceventid
      };
      callServer(frmData, "Delete client Script", apiendpoints.Delclntsrpt, 1);
    }
  };
 

  const StgEventTree = () => {

    if (stageEvents) {

      console.log(stageEvents);

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
          <details>
            <summary id={'id' + treenode.id}>
              <span dangerouslySetInnerHTML={{ __html: treenode.elmname }}></span>
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
          <button type="button" id={'expgrp' + treenode.id} className="btn btn-light" onClick={() => getClientScript(treenode)} >
            <span dangerouslySetInnerHTML={{ __html: treenode.elmname }}></span>
          </button>
          {(treenode.scrceventid) ?
            <button type="button" className="btn btn-light clr-gray" onClick={() => deleteClientScript(treenode)}>
              <i className="fa fa-trash-o"></i>
            </button>
            : <></>}
        </li>
      );

    }
  };


  const stageOnChange = (e) => {
    var StgId = e.target.value;

    setValue("txtScrCEventId", "");
    setValue("txtStgElmDesignId", "");
    setValue("txtEventId", "");
    setValue("txtScript", "");

    FetchStgEventTree(ScrId, StgId);
  };

  const FetchStgEventTree = async (ScrId, StgId) => {
    const evntTree = await GetStgClientEvents(ScrId, StgId);
    setStgEvents(evntTree.body.evnts);
  
  };

  useEffect(() => { FetchAllStageList(ScrId); }, []);

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
              <div className="col-md-12">
                <span><b>Client Script :</b></span><label id="lblClientScript" className="form-label"></label>
              </div>
              
              <div className="col-md-12">
                <input {...register("txtScrCEventId")} type="text" readonly="readonly" disabled="disabled" />
                <input {...register("txtStgElmDesignId")} type="text" readonly="readonly" disabled="disabled" />
                <input {...register("txtEventId")} type="text" readonly="readonly" disabled="disabled" />

                <span>&nbsp;&nbsp;</span>
                <button type="button" className="btn-link btn-link-bg-border" onClick={updateClientScript} >Update</button>

              </div>
              
              <div className="col-md-12">
              <textarea {...register("txtScript")} type="textarea" rows={20} className="form-control" />
              </div>
            </div>

          </div>

        </div>

      </form>
    </>

  )

}

export default ClientEvents;
