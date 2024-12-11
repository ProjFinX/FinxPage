import React from "react";
import { useState, useEffect, useRef } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";

import { GetAllScreenList } from "../utilities/getallscreen";
import { GetAllStageList } from "../utilities/getallstage";

//import { GetStgEleCmb,GetEvntExGrpMap } from "../utilities/GetStgScrElements";

import { GetEvntExGrpMap } from "../utilities/GetStgScrElements";
import { GetScrElementsForCmb } from "../utilities/GetScrElementsForCmb";

import { GetExpGrpLst } from "../utilities/geteventexpression";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";
import { GetUIDesignTree } from "../utilities/getScrexpresiontree";
import { GetStgElmEvntCmb } from "../utilities/GetStgElmEvntCmb";



import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json";
import { getValue } from "@testing-library/user-event/dist/utils";

const apiendpoints = appsettings.ApiEndpoints;

const CompanyId = localStorage.getItem("CompanyId");

const schema = yup.object().shape({
  cmbScrId: yup.string().required("Pls Select  Secreen "),
});

//rfce - command
function UIDesignOld() {
  // Const & Var

  const [stageresbody, setstagelistresbody] = useState([]);
  const [StageElementresbody, setStageElementlistresbody] = useState([]);
  const [Stageid, setStageid] = useState(0);
  const [stagefilterlist, setstagefilterlist] = useState([]);
  const [ExpGrpresbody, setExpGrpresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);

  const [Screenid, setScreenid] = useState(0);
  const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [uiTypeList, setUITypes] = useState([]);
  const [treedata, settreedata] = useState([]);
  const [actualtreedata, setactualtreedata] = useState([]);
  const [GroupExpid, setGroupExpid] = useState(0);

  const [selectedGrpExp, setselectedGrpExp] = useState([]);
  const [EvntList, setEvntList] = useState([]);
  const [Elementid, setElementid] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);




  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });


  const ref = useRef();

  // General Function

  const FetchScreenElementList = async () => {
    const ElementListResponse = await GetScrElementsForCmb(Screenid);
    setstagefilterlist(ElementListResponse.body.screlm);
  };

  const FetchStageElmEvntCmb = async (ElementId) => {
    const ElementListResponse = await GetStgElmEvntCmb(Screenid, Stageid, ElementId);

    const obj = ElementListResponse.body.elmevnt;

    setEvntList(Array.isArray(obj) ? obj : null);
  };



  const FetchEvntExGrpMap = async (EventId) => {

    const ElementListResponse = await GetEvntExGrpMap(Screenid, Stageid, Elementid, EventId);

    const obj = ElementListResponse.body.expgrps;


    console.log(ElementListResponse.body.expgrps);

    console.log(obj);

    var mapgrp = [];
    let i;



    for (i = 0; i < obj.length; i += 1) {

      var value = [];
      value = ExpGrpresbody.filter(function (item) {
        return item.egid == obj[i].exgrpid
      })

      mapgrp.push(value[0]);

    }
    console.log(mapgrp);

    setselectedGrpExp(mapgrp)

    console.log(selectedGrpExp);

    // setEvntList( Array.isArray(obj)?obj:null);
  };




  const FetchAllStageList = async (screenid) => {
    const StageListResponse = await GetAllStageList(screenid);
    setstagelistresbody(StageListResponse.body.Stages);
    console.log(JSON.stringify(StageListResponse.body.Stages));
  };

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenfilterlist(
      ScreenListResponse.body.Screens.filter((res) => res.IsActive == true)
    );
  };

  const FetchExpGrpList = async (screenid) => {
    const ExpGrpListResponse = await GetExpGrpLst(screenid);
    setExpGrpresbody(ExpGrpListResponse.body.expressions);
  };

  const FetchEventtree = async (screenid, StageId) => {
    const FetchExpGrpListtree = await GetUIDesignTree(screenid, StageId);

    const expreres = FetchExpGrpListtree.data;
    settreedata(expreres.menutree);
    setactualtreedata(expreres.expresponse);
  };

  //   fetch combo values

  const [resbody, setresbody] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|SETM|";
    const optw = "";
    // 

    const Response = await FetchCombodata(opt, optw);

    setresbody(Response.body.setm);
    console.log(Response.body);
  };

  const FetchUITypes = async () => {
    const opt = "|UIT|";
    const optw = "";
    const Response = await FetchCombodata(opt, optw);
    console.log(Response.body.uit);
    setUITypes(Response.body.uit);
  };

  // Useeffect

  useEffect(() => {
    //LoadCombo();
    FetchUITypes();
    FetchAllScreenList();
  }, []);

  // Event function start

  const ScreenOnChange = (e) => {
    setScreenid(e.target.value);
    FetchAllStageList(e.target.value);
    // FetchExpGrpList(e.target.value);
    // FetchEventtree(e.target.value)
    //settreedata([]);
  };

  const StageOnChange = (e) => {
    let id = "";
    id = e.target.value;

    setStageid(e.target.value);
    FetchScreenElementList(Screenid);

    FetchEventtree(Screenid, e.target.value)

  };

  const ElementOnChange = (e) => {
    let id = "";
    id = e.target.value;

    setElementid(e.target.value);
    FetchStageElmEvntCmb(id);

  };

  const getEvntExGrpMap = (e) => {
    let id = "";
    id = e.target.value;

    setElementid(e.target.value);
    FetchEvntExGrpMap(id);

  };


  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };


  // onResetHandler Start --------------------------------------------------------------------------------------------------------


  const onResetHandler = () => {

    reset({ txtStgUiDesignId: "", txtParentStgUiId: "", cmbUItype: "", txtTag: "", txtClass: "", txtTagVal: "", cmbStgElmDesignId: "", cbIsMandatory: "", cbIsReadOnly: "" });

  };

  // onResetHandler End --------------------------------------------------------------------------------------------------------



  //--------------------------------------------------------------------------------------------------------


  const onCopySubmitHandler = async (data) => {
    console.log(data);

    let frmData = {
      cmbScrId: data.cmbScrId,
      cmbStgId: data.cmbStgId,
      cmbCpyFrStgId: data.cmbcpyStgId,
      Overwrite: data.cbOverwrite,

    };
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "cpyuidsgn",
      orgid: "",
      vendid: "0",
    };

    const Cpyuidsgn = apiendpoints.Cpyuidsgn;

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        Cpyuidsgn,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully UI design Copied");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);

          //  setScreenid(data.cmbScreenId);
          FetchEventtree(Screenid, Stageid)

          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }

  }

  const onSubmitHandler = async (data) => {
    console.log(data);

    var Expgrps = [];
    let i, ord;

    for (i = 0; i < selectedGrpExp.length; i += 1) {
      ord = i + 1;
      var objgroup = { exgrpid: selectedGrpExp[i].egid, ord: ord };
      Expgrps.push(objgroup);
    }


    let frmData = {
      cmbScrId: data.cmbScrId,
      cmbStgId: data.cmbStgId,
      txtStgUiDesignId: data.txtStgUiDesignId,
      txtParentStgUiId: data.txtParentStgUiId,
      cmbUItype: data.cmbUItype,
      txtTag: data.txtTag,
      txtClass: data.txtClass,
      txtTagVal: data.txtTagVal,
      cmbElmId: data.cmbStgElmDesignId,
      cbIsMandatory: data.cbIsMandatory,
      cbIsReadOnly: data.cbIsReadOnly
    };



    const Upduidsgn = apiendpoints.Upduidsgn;

    console.log(frmData);


    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Upduidsgn",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        Upduidsgn,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully expression updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          ResetScreenValue();

          //  setScreenid(data.cmbScreenId);
          FetchEventtree(Screenid, Stageid)

          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
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

    var scrdet = {};
    scrdet["scrid"] = Screenid;
    scrdet["stgid"] = Stageid;
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
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        toast.success("Successfully updated");
        setTimeout(() => { }, 600);
        FetchEventtree(Screenid, Stageid)
        // FetchStageElementList(Screenid);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };


  //---------------onSubmitHandler end------

  // const CopyUIDesign = async () => {

  //   console.log('Yes');

  //   var va = getValues('cmbCopyFrStgId');
  //   console.log(va);

  //    // {cmbCopyFrStgId}

  //   // try{

  //   //   var scrdet = {};
  //   //   scrdet["cmdScrId"] = Screenid;
  //   //   scrdet["stgid"] = Stageid;
  //   //   const formData = new FormData();

  //   //   console.log(fileSizeKiloBytes);

  //   //   formData.append("_scrdet", JSON.stringify(scrdet));
  //   //   formData.append("file", selectedFile);
  //   //   const token = localStorage.getItem("token");


  //   //   const url = apiendpoints.Uplduihtml;
  //   //   let response = await api.post(url, formData);
  //   //   let strResponse = JSON.parse(decompressBase64(response.data));

  //   //   console.log(strResponse);

  //   // }
  //   // catch(err){

  //   // }

  // };

  function AddParentExpression(rowval) {
    reset({
      txtSeExprnId: "",
      txtParentSeExprnId: "0",
      cmbSeExprType: 0,
      txtExpression: "",
    });
  }

  function Assigngrouplist(rowval) {
    console.log(rowval);
    // FetchExpGrpListtree(Screenid, rowval.egid);


    var objgroup = { egid: rowval.egid, egname: rowval.egname };

    selectedGrpExp.push(objgroup);

    console.log(selectedGrpExp);


  }

  const DeleteGroup = async (rowval) => {
    let frmData = { cmbScrId: Screenid, txtExprGroupId: rowval.egid };

    const idToRemove = rowval.egid;

    setselectedGrpExp(
      selectedGrpExp.filter((item) => item.egid !== idToRemove)
    );
  };

  //https://codepen.io/itwasmattgregg/pen/OJXXaKR

  const handleMoveUp = (index) => {
    if (index === 0) return; // Row is already at the top

    setselectedGrpExp(prevRows => {
      const newRows = [...prevRows];
      const temp = newRows[index];
      newRows[index] = newRows[index - 1];
      newRows[index - 1] = temp;
      return newRows;
    });
  };

  const handleMoveDown = (index) => {
    if (index === selectedGrpExp.length - 1) return; // Row is already at the bottom

    setselectedGrpExp(prevRows => {
      const newRows = [...prevRows];
      const temp = newRows[index];
      newRows[index] = newRows[index + 1];
      newRows[index + 1] = temp;
      return newRows;
    });
  };

  function ResetScreenValue() {
    reset({
      // cmbScrId: "0",
      // cmbStgId: "",
      // cmbStgElmDsigId: "",
      // cmbEvntId: "",

    });
    settreedata([]);
  }

  // Event Function End

  // Main Function

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };



  //--------------------------------------------------------------------------------------------------------

  const ReorderExpression = async (SeExprnId, dir) => {
    console.log(SeExprnId);

    let frmData = { cmbScrId: Screenid, cmbStgId: Stageid, txtStgUiDesignId: SeExprnId, txtDirection: dir };

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Reord",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const Reordui = apiendpoints.Reordui;


    try {
      //
      const response = await api.post(
        Reordui,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
      } else {
        toast.success("Reorder Successfully");
        // reset({cmbScreenId:"0", txtSeExprnId: "", txtParentSeExprnId: "0",cmbSeExprType:0,txtExpression:""})  

        FetchEventtree(Screenid, Stageid)
      }
    } catch (err) {
      toast.error("Unable to process request");
    }
  };



  const DeleteUiTreeLeaf = async (StgUiDesignId) => {
    console.log(StgUiDesignId);

    let frmData = { cmbScrId: Screenid, cmbStgId: Stageid, txtStgUiDesignId: StgUiDesignId };

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Delete UI Design",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const Deluidsgn = apiendpoints.Deluidsgn;


    try {
      //
      const response = await api.post(
        Deluidsgn,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
      } else {
        toast.success("Deleted Successfully");
        reset({ cmbScreenId: "0", txtSeExprnId: "", txtParentSeExprnId: "0", cmbSeExprType: 0, txtExpression: "" })
        FetchEventtree(Screenid, Stageid)
      }
    } catch (err) {
      toast.error("Unable to process request");
    }
  };



  const TreeNode = ({ node }) => {

    const hasChildren = node.children.length > 0;

    const handleAdd = () => {
      // Add logic here for handling add button click
      console.log(`Add clicked for node ${node.id}`);

      var value = actualtreedata.filter(function (item) {
        return item.uidsgnid == node.id
      })


      console.log(value);
      var aryval = value[0]

      // reset({ txtParentStgUiId: aryval.pruidsgnid }) 

      reset({
        txtStgUiDesignId: "", txtParentStgUiId: aryval.uidsgnid, cmbUItype: "", txtTag: "",
        txtClass: "", txtTagVal: "", cmbStgElmDesignId: "", cbIsReadOnly: false, cbIsMandatory: false
      })

    };

    const handleEdit = () => {
      // Add logic here for handling edit button click
      console.log(`Edit clicked for node ${node.id}`);


      var value = actualtreedata.filter(function (item) {
        return item.uidsgnid == node.id
      })

      console.log(value);
      var aryval = value[0]

      reset({
        txtStgUiDesignId: aryval.uidsgnid, txtParentStgUiId: aryval.pruidsgnid, cmbUItype: aryval.uityp, txtTag: aryval.tag,
        txtClass: aryval.cls, txtTagVal: aryval.tagval, cmbStgElmDesignId: aryval.elmid,
        cbIsMandatory: aryval.mn, cbIsReadOnly: aryval.ro
      })

    };

    const handleDelete = () => {

      var value = actualtreedata.filter(function (item) {
        return item.uidsgnid == node.id
      })

      console.log(value);
      var aryval = value[0]
      DeleteUiTreeLeaf(aryval.uidsgnid)

    };

    const handleUp = () => {

      var value = actualtreedata.filter(function (item) {
        return item.uidsgnid == node.id
      })

      console.log(value);
      var aryval = value[0];
      var dir = "U";
      ReorderExpression(aryval.uidsgnid, dir)

    };

    const handleDown = () => {

      var value = actualtreedata.filter(function (item) {
        return item.uidsgnid == node.id
      })

      console.log(value);
      var aryval = value[0]
      var dir = "D";
      ReorderExpression(aryval.uidsgnid, dir)

    };


    return (

      <div>
        <div className="col-sm">
          <div className="mb-3">
            <span>
              <span className="content" dangerouslySetInnerHTML={{ __html: node.name }}></span>

              <span>
                <button onClick={handleAdd} class="btn btn-light clr-gray"><i class="fa fa-plus"></i></button>
                <button onClick={handleEdit} class="btn btn-light clr-gray"><i class="fa fa-edit"></i></button>
                <button onClick={handleDelete} class="btn btn-light clr-gray"><i class="fa fa-trash-o"></i></button>
                <button onClick={handleUp} class="btn btn-light clr-gray"><i class="fa fa-arrow-up"></i></button>
                <button onClick={handleDown} class="btn btn-light clr-gray"><i class="fa fa-arrow-down"></i></button>
              </span>

            </span>
          </div>
        </div>


        {hasChildren && (
          <ul>
            {node.children.map(childNode => (
              <li key={childNode.id}>
                <TreeNode node={childNode} />
              </li>
            ))}
          </ul>
        )}

      </div>
    );
  };



  try {
    return (
      <>
        <section className="vh-100">
          <div>
            {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">
                  UI Desing{" "}
                </strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <div className="row">
                  <div className="col-sm-4">
                    <div className="mb-3">

                      <form autocomplete="off" >

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">

                              <label htmlFor="cmbScrId" className="form-label">
                                Screen
                              </label>
                              <select
                                {...register("cmbScrId")}
                                className="form-select"
                                onChange={ScreenOnChange}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding

                                  screenfilterlist.map((res) => (
                                    <option key={res.ScreenId} value={res.ScreenId}>
                                      {res.ScrName}
                                    </option>
                                  ))
                                }
                              </select>
                              <p>{errors.cmbScrId?.message}</p>
                            </div>
                          </div>
                          <div className="col-sm">
                            <div className="mb-3">
                              <label htmlFor="cmbStgId" className="form-label">
                                Stage
                              </label>
                              <select
                                {...register("cmbStgId")}
                                className="form-select"
                                onChange={StageOnChange}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding
                                  stageresbody &&
                                  stageresbody.map((x) => (
                                    <option key={x.StageId} value={x.StageId}>
                                      {x.StageName}
                                    </option>
                                  ))
                                }
                              </select>
                              <p>{errors.cmbStgId?.message}</p>
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">

                              <label htmlFor="filElements" className="form-label">
                                UI Html File
                              </label>
                              <input
                                type="file"
                                name="filElements"
                                onChange={handleFileChange}
                                ref={ref}
                                className="form-control"
                              />

                            </div>
                          </div>
                          <div className="col-sm">
                            <div className="mb-3">
                              <button type="button"
                                onClick={OnFileUpladHandler}
                                className="btn btn-primary mar-top-2em">
                                <span className="bi bi-upload"></span> upload
                              </button>
                            </div>
                          </div>
                        </div>


                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtStgUiDesignId"
                                className="form-label"
                              >
                                UI DesignId
                              </label>
                              <input
                                {...register("txtStgUiDesignId")}
                                type="text"
                                className="form-control"
                                disabled="disabled"
                                readonly="readonly"
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtParentStgUiId"
                                className="form-label"
                              >
                                Parent
                              </label>
                              <input
                                {...register("txtParentStgUiId")}
                                type="text"
                                className="form-control"
                              />

                            </div>
                          </div>
                        </div>



                        <div className="row">
                          <div className="col-sm">


                            <div className="mb-3">
                              <label
                                htmlFor="txtUItype"
                                className="form-label"
                              >
                                UI type
                              </label>
                              {/* <input
                                    {...register("txtUItype")}
                                    type="text"
                                    className="form-control"                                    
                                    /> */}
                              <select
                                {...register("cmbUItype")}
                                className="form-select"
                                onChange={ElementOnChange}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding
                                  uiTypeList.map((x) => (
                                    <option key={x.k} value={x.v} >
                                      {x.v}
                                    </option>
                                  ))
                                }
                              </select>

                            </div>

                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtTag"
                                className="form-label"
                              >
                                Tag
                              </label>
                              <input
                                {...register("txtTag")}
                                type="text"
                                className="form-control"
                              />

                            </div>
                          </div>
                        </div>


                        <div className="row">
                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtClass"
                                className="form-label"
                              >
                                Class
                              </label>
                              <input
                                {...register("txtClass")}
                                type="text"
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-sm">
                            <div className="mb-3">
                              <label
                                htmlFor="txtTagVal"
                                className="form-label"
                              >
                                TagVal/Caption
                              </label>
                              <input
                                {...register("txtTagVal")}
                                type="text"
                                className="form-control"
                              />

                            </div>
                          </div>
                        </div>


                        <div className="row">
                          <div className="col-sm">

                            <div className="mb-3">
                              <label
                                htmlFor="cmbStgElmDesignId"
                                className="form-label"
                              >
                                Screen Element
                              </label>
                              <select
                                {...register("cmbStgElmDesignId")}
                                className="form-select"
                                onChange={ElementOnChange}
                              >
                                <option value="0">- Select -</option>
                                {
                                  //Combo Data binding
                                  stagefilterlist &&
                                  stagefilterlist.map((x) => (
                                    <option
                                      key={x.k}
                                      value={x.k}
                                    >
                                      {x.v}
                                    </option>
                                  ))
                                }
                              </select>

                            </div>

                            <div className="row">
                              <div className="col-sm">
                                <div className="mb-3">
                                  <input {...register("cbIsMandatory")} type="checkbox" />{" "}
                                  &nbsp;
                                  <label htmlFor="cbIsMandatory" className="form-label">
                                    Is Mandatory
                                  </label>
                                  <p>{errors.cbIsMandatory?.message}</p>
                                </div>
                              </div>

                              <div className="col-sm">
                                <div className="mb-3">
                                  <input {...register("cbIsReadOnly")} type="checkbox" />{" "}
                                  &nbsp;
                                  <label htmlFor="cbIsReadOnly" className="form-label">
                                    Is ReadOnly
                                  </label>
                                  <p>{errors.cbIsReadOnly?.message}</p>
                                </div>
                              </div>
                            </div>

                            <div className="row">

                              <div className="col-md-4">
                                <button
                                  type="button"
                                  class="btn btn-primary"
                                  onClick={handleSubmit(onSubmitHandler)}
                                >
                                  Save
                                </button>
                              </div>

                              <div className="col-md-4">
                                <button
                                  type="button"
                                  class="btn btn-primary"
                                  onClick={handleSubmit(onResetHandler)}
                                >
                                  Reset
                                </button>
                              </div>

                            </div>

                          </div>

                        </div>
                      </form>

                    </div>
                  </div>

                  <div className="col-sm-8">
                    <div className="mb-3">

                      <div className="row">

                        {/* <button
                          className="btn btn-success col-md-2"
                          onClick={() => {
                            AddParentExpression();
                          }}
                        >
                          {" "}
                          <i className="bi bi-table"></i> Tree Root
                        </button> */}
                        
                        <div className="col-sm-7">
                        <label
                                htmlFor="cmbcpyStgId"
                                className="form-label"
                              >
                                Import From
                              </label>
                          <select
                            {...register("cmbcpyStgId")}
                            className="form-control"

                          >
                            <option value="0">- Select -</option>
                            {
                              //Combo Data binding
                              stageresbody &&
                              stageresbody.map((x) => (
                                <option key={x.StageId} value={x.StageId}>
                                  {x.StageName}
                                </option>
                              ))
                            }
                          </select>
                        </div>

                        <div className="col-sm">
                          <div className="mb-3 mar-top-2em">
                            <input {...register("cbOverwrite")} type="checkbox" />{" "}
                            &nbsp;
                            <label htmlFor="cbOverwrite" className="form-label">
                              Overwrite
                            </label>
                            <p>{errors.cbOverwrite?.message}</p>
                          </div>
                        </div>

                        <div className="col-sm-3">

                          <button
                            type="button"
                            class="btn btn-primary mar-top-2em "
                            onClick={handleSubmit(onCopySubmitHandler)}
                          >
                            Import
                          </button>
                        </div>
                      </div>

                      <br />

                      {/* <div>.</div> */}
                      <div>
                        <Scrollbar style={{ height: 700 }}>
                          {treedata.map((node) => (
                            <TreeNode key={node.id} node={node} />
                          ))}
                        </Scrollbar>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <div className="row"></div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default UIDesignOld;
