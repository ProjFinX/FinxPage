import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Alerts from "../htmlcomponents/Alerts";
import Spinner from "../htmlcomponents/Spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import { GetAllStageList } from "../utilities/getallstage";
import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"
import StageMasterList from "./StageMasterList";
const apiendpoints = appsettings.ApiEndpoints;

const schema = yup.object().shape({
  txtStageName: yup.string().required("Pls provide stage name"),
  cmbStageTypeId: yup.string().required("Pls select stage type"),
  ntxtOrd: yup.string().required("Pls provide order")
});

/* Main method */
function StageMaster({ ScrId }) {

  const [stgTypes, setStgTypes] = useState([]);
  const [stgList, setStgList] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, } = useForm({ resolver: yupResolver(schema) });

  const LoadCombo = async () => {
    const opt = '|STGTY|';
    const optw = '';
    const Response = await FetchCombodata(opt, optw);
    setStgTypes(Response.body.stgty)
  };

  const FetchAllStageList = async (ScrId) => {
    const StageList = await GetAllStageList(ScrId);
    setStgList(StageList.body.Stages);
  };

  useEffect(() => { LoadCombo(); }, []);
  useEffect(() => { FetchAllStageList(ScrId); }, []);

  const ResetValue = () => {
    reset({ txtStageId: "", txtStageName: "",ntxtOrd:"",cmbStageTypeId:"",txtStageFile:""})
  }

  function setStageValue(data)
  {
    reset({ txtStageId: data.StageId, txtStageName: data.StageName, ntxtOrd : data.Ord,
      cmbStageTypeId : data.StageTypeId  , txtStageFile: data.StageFile })  
  }

  const delStage = async (StageId) => {

    if (window.confirm("Are you sure, do you want delete this stage ?")) {

      let frmData = {
        txtStageId: StageId
      };

      const DelStageMaster = apiendpoints.DelStageMaster;

      /* Header */
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "Delete Stage",
        orgid: "",
        vendid: "0",
      };

      const reqHdr = {};
      const reqdata = { hdr: frmHdr, body: frmData };

      try {

        const response = await api.post(
          DelStageMaster,
          compressBase64(reqdata),
          reqHdr
        );

        const strResponse = JSON.parse(decompressBase64(response.data));

        if (strResponse.hdr.rst == "SUCCESS") {
          setTimeout(() => {

            setAlert({ AlertType: "Success", message: "Successfully updated" });
            toast.success("Successfully updated");

            setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
            ResetValue();
            FetchAllStageList(ScrId);
            setLoanding(false);
          }, 300);
        }
        else {
          let msg = JSON.stringify(strResponse.fdr[0].rstmsg)
          setTimeout(() => {
            setAlert({ AlertType: "Error", message: msg });
            toast.error(msg);
            setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
            setLoanding(false);
          }, 300);
        }
      } catch (err) {
        console.log(err.message);
        toast.error("Unable to process request");
        setAlert({ AlertType: "Error", message: "Unable to process request" });
        setLoanding(false);
      }
    }

  };

  const onSubmitHandler = async (data) => {

    let StageId = data.txtStageId;
    if (data.txtStageId == undefined)
      StageId = "0";

    let frmData = {
      txtStageId: StageId,
      txtScreenId: ScrId,
      txtStageName: data.txtStageName,
      ntxtOrd: data.ntxtOrd,
      cmbStageTypeId: data.cmbStageTypeId,
      txtStageFile: data.txtStageFile
    };

    const UpdStageMaster = apiendpoints.UpdStageMaster;

    // console.log(frmData);

    //e.preventDefault();

    setLoanding(true);

    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Stage Update",
      orgid: "",
      vendid: "0",
    };

    const reqHdr = {};
    const reqdata = { hdr: frmHdr, body: frmData };

    try {

      const response = await api.post(
        UpdStageMaster,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "SUCCESS")
      {
        setTimeout(() => {
          
          setAlert({ AlertType: "Success", message: "Successfully updated" });
          toast.success("Successfully updated");

          setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
          ResetValue();
          FetchAllStageList(ScrId);
          setLoanding(false);
        }, 300);
      }
      else {
        setAlert({ AlertType: "Error", message: JSON.stringify(strResponse.fdr[0].rstmsg) });
        setLoanding(false);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      setAlert({ AlertType: "Error", message: "Unable to process request" });
      setLoanding(false);
    }
  }

  try {
    return (
      <>

        <div className="">
          {isLoading ? <Spinner></Spinner> : ""}
          <Alerts alert={alert} />
        </div>

        <div className="row">

          <div className="col-md-4">

            <form onSubmit={handleSubmit(onSubmitHandler)} autoComplete="off" >

              <div className="col-md-12">
                <label htmlFor="txtStageName" className="form-label">Stage Name</label>
                <input
                  {...register("txtStageName")}
                  type="text"
                  className="form-control"
                />
                <p className="err-msg">{errors.txtStageName?.message}</p>
              </div>

              <div className="col-md-12">
                <label htmlFor="cmbStageTypeId" className="form-label">Stage Type Id (1-Normal 2 - Auto Run )</label>
                <select {...register("cmbStageTypeId")} className="form-control" onChange={""}>
                  <option value="">- Select -</option>
                  {
                    stgTypes.map((res) =>
                      (<option key={res.k} value={res.k}>{res.v}</option>))
                  }
                </select>
                <p className="err-msg">{errors.cmbStageTypeId?.message}</p>
              </div>

              <div className="col-md-12">
                <label htmlFor="txtStageFile" className="form-label">Stage File</label>
                <input
                  {...register("txtStageFile")}
                  type="text"
                  className="form-control"
                />
              </div>

              <div className="row pad-top-15">

                <div className="col-md-6">
                  <label htmlFor="ntxtOrd" className="form-label">
                    Stage Order
                  </label>
                  <input
                    {...register("ntxtOrd")}
                    type="text"
                    className="form-control"
                  />
                   <p className="err-msg">{errors.ntxtOrd?.message}</p>
                </div>

                <div className="col-md-6">
                  <label htmlFor="txtStageId" className="form-label">Stage Id</label>
                  <input
                    {...register("txtStageId")}
                    type="text"
                    className="form-control"
                    disabled="disabled"
                    readonly="readonly"
                  />
                </div>

              </div>

              <div className="row pad-top-15">

                <div className="col-md-3">
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>

                <div className="col-md-3">
                  <button type="button" className="btn btn-warning" onClick={ResetValue}>
                    Reset
                  </button>
                </div>

              </div>

            </form>

          </div>

          <div className="col-md-8">

            <table className="lst-grid">
              <thead>
                <tr>
                  <th>Ord</th>
                  <th>Id</th>
                  <th>Stage</th>
                  <th>Type</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                <StageMasterList stageList={stgList} setStageValue={setStageValue} delStage={delStage} />
              </tbody>
            </table>

          </div>


        </div>

      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default StageMaster;