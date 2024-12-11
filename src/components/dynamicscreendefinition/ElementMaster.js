import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import Alerts from "../htmlcomponents/Alerts";
import Spinner from "../htmlcomponents/Spinner";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import api from "../api/Webcall";
import appsettings from "../../appsettings.json"
import { GetElementList, GetElementDefValue } from "../utilities/getelementlist";
import ElementMasterList from "./ElementMasterList";
const apiendpoints = appsettings.ApiEndpoints;

const schema = yup.object().shape({
  txtElementName: yup.string().required("Pls provide element name"),
  txtCaption: yup.string().required("Pls provide caption "),
  cmbControlType: yup.string().required("Pls select control type"),
  cmbDataType: yup.string().required("Pls select data type")
});


/* Main method */
function ElementMaster({ ScrId }) {

  const [ctlTypes, setCtlRes] = useState([]);
  const [dataTypes, setDtTyRes] = useState([]);
  const [cmbConnStrs, setCmbConStrRes] = useState([]);
  const [elementList, setElementList] = useState([]);
  const [elementDefaultValue, setElementDefaultValue] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm({ resolver: yupResolver(schema) });

  const LoadCombo = async () => {
    const opt = "|CTL|DTTY|CTBL|";
    const optw = "";
    const Response = await FetchCombodata(opt, optw);
    setCtlRes(Response.body.ctl);
    setDtTyRes(Response.body.dtty);
    setCmbConStrRes(Response.body.ctbl);
  };


  const FetchElementList = async (ScrId) => {
    const ElementLis = await GetElementList(ScrId);
    setElementList(ElementLis.body.elements);
  };

  const FetchElementDefaultValue = async (ScrId, ElmId) => {
    const response = await GetElementDefValue(ScrId, ElmId);
    setElementDefaultValue(response.body.defaultvalue);
  };

  useEffect(() => { LoadCombo(); }, []);
  useEffect(() => { FetchElementList(ScrId); }, []);

  const onChngCtlType = (e) => {
    let ctrlId = e.target.value;
    //  setVisisble(ctrlId);

    if (ctrlId != 'File') {
      reset({ txtSizeInKB: "", txtFileExt: "" })
    }

    if (ctrlId != 'ComboBox') {
      reset({ txtCmbCode: "", txtCmbCon: "", cmbDbShortName: "0" })
    }

    if (ctrlId != 'NumericBox') {
      reset({ txtRangeFrom: "", txtRangeTo: "" })
    }

  }

  const setVisisble = (ctrlId) => {

    var divCmbConfig = document.getElementById("divCmbConfig");
    var divRange = document.getElementById("divRange");
    var divFile = document.getElementById("divFile");

    if (ctrlId == 'ComboBox') {
      divCmbConfig.style.display = "block";
    } else {
      divCmbConfig.style.display = "none";
    }

    if (ctrlId == 'NumericBox') {
      divRange.style.display = "block";
    } else {
      divRange.style.display = "none";
    }

    if (ctrlId == 'File') {
      divFile.style.display = "block";
    } else {
      divFile.style.display = "none";
    }

  };

  const resetValue = () => {
    reset({
      txtElementId: "", txtElementName: "", cmbControlType: "0", cmbDataType: "0",
      txtCaption: "", txtParentElement: "0", txtMaxLength: "", txtRangeFrom: "", cbIsFrmGrid:false,
      txtSizeInKB: "", txtFileExt: "", txtRangeTo: "", txtCmbCode: "", txtCmbCon: "", cmbDbShortName: "0",
      txtDefaultValue: ""
    });

  }

  function setElementValue(data) {

    FetchElementDefaultValue(ScrId, data.ElementId);

    reset({
      txtElementId: data.ElementId, txtElementName: data.ElmName, cmbControlType: data.ControlType,
      cmbDataType: data.DataType, txtCaption: data.Caption, txtParentElement: data.ParentElmName,
      txtMaxLength: data.MaxLength, txtRangeFrom: data.RangeFrom, txtRangeTo: data.RangeTo, cbIsFrmGrid: data.IsFrmGrid,
      txtSizeInKB: data.SizeInKB, txtFileExt: data.FileExt, txtCmbCode: data.CmbCod, txtCmbCon: data.CmbCon,
      cmbDbShortName: data.ConStr, txtDefaultValue: elementDefaultValue
    });



    // setTimeout(() => {
    // setVisisble(data.ControlType);}, 100);
  }

  /* Calling Use Effect to wait set the default value immediately */ 
  useEffect(() => {
    reset({
      txtDefaultValue: elementDefaultValue
    });

  }, [elementDefaultValue])


  const delElement = async (ElementId) => {

    if (window.confirm("Are you sure, do you want delete this element ?")) {

      let frmData = {
        scrid: ScrId,
        txtElementId: ElementId
      };

      const DelElmMaster = apiendpoints.DeleteElement;

      /* Header */
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "Delete Element",
        orgid: "",
        vendid: "0",
      };

      const reqHdr = {};
      const reqdata = { hdr: frmHdr, body: frmData };

      try {

        const response = await api.post(
          DelElmMaster,
          compressBase64(reqdata),
          reqHdr
        );

        const strResponse = JSON.parse(decompressBase64(response.data));

        if (strResponse.hdr.rst == "SUCCESS") {
          setTimeout(() => {
            setAlert({ AlertType: "Success", message: "Successfully updated" });
            toast.success("Successfully updated");
            setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
            resetValue();
            FetchElementList(ScrId);
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


    var Caption = data.txtCaption;
    if (data.txtCaption == null) {
      Caption = "";
    }

    var ElementId = data.txtElementId;
    if (data.txtElementId == null) {
      ElementId = "";
    }

    var FileExt = data.txtFileExt;
    if (data.txtFileExt == null) {
      FileExt = "";
    }

    var MaxLength = data.txtMaxLength;
    if (data.txtMaxLength == null) {
      MaxLength = "";
    }

    var ParentElement = data.txtParentElement;
    if (data.txtParentElement == null || data.txtParentElement == "0") {
      ParentElement = "";
    }

    var RangeFrom = data.txtRangeFrom;
    if (data.txtRangeFrom == null) {
      RangeFrom = "";
    }

    var RangeTo = data.txtRangeTo;
    if (data.txtRangeTo == null) {
      RangeTo = "";
    }

    var SizeInKB = data.txtSizeInKB;
    if (data.txtSizeInKB == null) {
      SizeInKB = "";
    }
 
    var IsFrmGrid  = data.cbIsFrmGrid;
    if (data.cbIsFrmGrid == null) {
      IsFrmGrid = false;
    }

    let frmData = {
      cmbControlType: data.cmbControlType,
      cmbDataType: data.cmbDataType,
      scrid: ScrId,
      txtCaption: Caption,
      txtElementId: getValues('txtElementId'), // ElementId,
      txtElementName: data.txtElementName,
      txtFileExt: FileExt,
      txtMaxLength: MaxLength,
      txtParentElement: ParentElement,
      txtRangeFrom: RangeFrom,
      txtRangeTo: RangeTo,
      cbIsFrmGrid: IsFrmGrid,
      txtSizeInKB: SizeInKB,
      txtCmbCode: data.txtCmbCode,
      txtCmbCon: data.txtCmbCon,
      cmbDbShotName: data.cmbDbShortName,
      txtDefaultValue: data.txtDefaultValue
    };


    

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Update Element",
      orgid: "",
      vendid: "0",
    };

    const reqHdr = {};
    const reqdata = { hdr: frmHdr, body: frmData };
    const UpdateElement = apiendpoints.UpdateElement;

    try {
      //
      const response = await api.post(
        UpdateElement,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "SUCCESS") {
        setTimeout(() => {
          setAlert({ AlertType: "Success", message: "Successfully updated" });
          toast.success("Successfully updated");
          setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
          resetValue();
          FetchElementList(ScrId);
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

  try {
    return (
      <>

        <div>
          {isLoading ? <Spinner></Spinner> : ""}
          <Alerts alert={alert} />
        </div>


        <div className="row">

          <div className="col-md-4">

            <form onSubmit={handleSubmit(onSubmitHandler)} autoComplete="off" >

              <div className="row">

                <div className="col-md-6">
                  <label htmlFor="txtElementName" className="form-label">Element Name</label>
                  <input {...register("txtElementName")} type="text" className="form-control" />
                  <p>{errors.txtElementName?.message}</p>
                </div>

                <div className="col-md-6">
                  <label htmlFor="txtCaption" className="form-label">Caption</label>
                  <input {...register("txtCaption")} type="text" className="form-control" />
                  <p>{errors.txtCaption?.message}</p>
                </div>

                <div className="col-md-6">
                  <label htmlFor="cmbControlType" className="form-label">Control Type</label>
                  <select {...register("cmbControlType")} className="form-control" onChange={onChngCtlType} >
                    <option value="0">- Select -</option>
                    {
                      ctlTypes.map((res) => (<option key={res.k} value={res.v}>{res.v}</option>))
                    }
                  </select>
                  <p>{errors.cmbControlType?.message}</p>
                </div>

                <div className="col-md-6">
                  <label htmlFor="cmbDataType" className="form-label">Data Type</label>
                  <select {...register("cmbDataType")} className="form-control" >
                    <option value="0">- Select -</option>
                    {
                      dataTypes.map((res) => (<option key={res.k} value={res.v}>{res.v}</option>))
                    }
                  </select>
                  <p>{errors.cmbDataType?.message}</p>
                </div>

                <div className="col-md-3">
                  <label htmlFor="txtMaxLength" className="form-label">Max Length</label>
                  <input {...register("txtMaxLength")} type="text" className="form-control" />
                  <p>{errors.txtMaxLength?.message}</p>
                </div>

                <div className="col-md-3 pad-top-2-5em">
                  <input {...register("cbIsFrmGrid")} type="checkbox" />
                  &nbsp;&nbsp;<label htmlFor="cbIsFrmGrid" className="form-label">Form Grid</label>
                </div>

                <div className="col-md-6">
                  <label htmlFor="txtParentElement" className="form-label">Parent Element</label>
                  <select {...register("txtParentElement")} type="text" className="form-control" >
                    <option value="0">- Select -</option>
                    {
                      elementList.map((res) => (<option key={res.ElementId} value={res.ElmName}>{res.ElmName}</option>))
                    }
                  </select>
                </div>

                <div id="divRange" className="dispNone1">
                  <div className="row">

                    <div className="col-md-6">
                      <label htmlFor="txtRangeFrom" className="form-label">Range From</label>
                      <input {...register("txtRangeFrom")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="txtRangeTo" className="form-label">Range To</label>
                      <input {...register("txtRangeTo")} type="text" className="form-control" />
                    </div>
                  </div>
                </div>

                <div id="divFile" className="dispNone1">

                  <div className="row">
                    
                    <div className="col-md-6">
                      <label htmlFor="txtSizeInKB" className="form-label">Size(KB)</label>
                      <input {...register("txtSizeInKB")} type="text" className="form-control" />
                    </div>

                   <div className="col-md-6">
                      <label htmlFor="txtFileExt" className="form-label">File Ext.</label>
                      <input {...register("txtFileExt")} type="text" className="form-control" />
                    </div>
                  </div>
                </div>

                <div id="divCmbConfig" className="dispNone1">
                  <div className="row">
                    
                    <div className="col-md-6">
                      <label htmlFor="txtCmbCode" className="form-label">Combo Code</label>
                      <input {...register("txtCmbCode")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cmbDbShortName" className="form-label">Combo Db Connection</label>
                      <select {...register("cmbDbShortName")} className="form-control" >
                        <option value="0">-select-</option>
                        {
                          cmbConnStrs.map((res) => (<option key={res.v} value={res.k}>{res.k}</option>))
                        }
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="txtCmbCon" className="form-label">Combo condition / Query</label>
                      <input {...register("txtCmbCon")} type="text" className="form-control" />
                    </div>

                    <div className="col-md-12">
                      <label htmlFor="txtDefaultValue" className="form-label">Default Value</label>
                      <input {...register("txtDefaultValue")} type="text" className="form-control" />
                    </div>

                  </div>
                </div>

                <div className="row pad-top-15">

                  <div className="col-md-3">
                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                  </div>

                  <div className="col-md-3">
                    <button type="button" className="btn btn-warning" onClick={resetValue}>
                      Reset
                    </button>
                  </div>

                  <div className="col-md-6">
                    <input {...register("txtElementId")} type="text" className="form-control"  readonly="readonly" />
                  </div>


                </div>

              </div>

            </form>

          </div>

          <div className="col-md-8">

            <table className="lst-grid">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name / Caption</th>
                  <th>Parent</th>
                  <th>Ctl / Data</th>
                  <th>Length</th>
                  <th>Property</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                <ElementMasterList elmList={elementList} setElementValue={setElementValue} delElement={delElement} />
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

export default ElementMaster;