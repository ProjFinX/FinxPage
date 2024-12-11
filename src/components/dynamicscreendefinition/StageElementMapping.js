import React from "react";
import { useState, useEffect, useRef } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { PostCall, PostCallHeader } from "../api/Webcall";

import { GetAllScreenList } from "../utilities/getallscreen";
import { GetStgScrElements } from "../utilities/GetStgScrElements";
import { GetElementList } from "../utilities/getelementlist";
import { GetAllStageList } from "../utilities/getallstage";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { PreConstruct } from "ag-grid-community";

import TableRows from "./TableRows";

const apiendpoints = appsettings.ApiEndpoints;
const schema = yup.object().shape({});

//rfce - command
function StageElementMapping() {
  // Const & Var

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [gridshow, setgridShow] = useState(false);

  const gridhandleClose = () => setgridShow(false);
  const gridhandleShow = () => setgridShow(true);

  const [gridname, setgridname] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [Elementresbody, setElementlistresbody] = useState([]);
  const [StageElementresbody, setStageElementlistresbody] = useState([]);
  const [stageresbody, setstagelistresbody] = useState([]);
  const [isLoading, setLoanding] = useState(false);
  const [Screenid, setScreenid] = useState(0);
  const [Stageid, setStageid] = useState(0);
  const [IsCustomScr, setIsCustomScr] = useState(false);
  const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [stagefilterlist, setstagefilterlist] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const ref = useRef();

  // General Function

  const filereset = () => {
    ref.current.value = "";
  };

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenfilterlist(
      ScreenListResponse.body.Screens.filter((res) => res.IsActive == true)
    );
  };

  const FetchStageElementList = async (screenid) => {
    const ElementListResponse = await GetStgScrElements(screenid);
    setStageElementlistresbody(ElementListResponse.body.elements);
  };

  const FetchElementList = async (screenid) => {
    const ElementListResponse = await GetElementList(screenid);
    setElementlistresbody(ElementListResponse.body.elements);
  };

  const FetchAllStageList = async (screenid) => {
    const StageListResponse = await GetAllStageList(screenid);
    setstagelistresbody(StageListResponse.body.Screens);
  };

  //   fetch combo values

  const [cmbctlres, setctlres] = useState([]);
  const [cmbdttyres, setdttyres] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|CTL|DTTY|";
    const optw = "";
    // 

    const Response = await FetchCombodata(opt, optw);

    setctlres(Response.body.ctl);
    setdttyres(Response.body.dtty);
    //console.log("rerendering method");
  };

  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();
  }, []);

  useEffect(() => {
    Stagereset();
    
  }, [StageElementresbody]);

  // Event function start

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const ScreenOnChange = (e) => {
    setScreenid(e.target.value);
    FetchAllStageList(e.target.value);
    FetchStageElementList(e.target.value);
    FetchElementList(e.target.value);
  };

  const StageOnChange = (e) => {
    let id = "";
    id = e.target.value;

    setStageid(e.target.value);

    const filteredElement = StageElementresbody.filter((res) => {
      return res.StageId == id;
    }).sort();

    console.log(filteredElement);

    setstagefilterlist(filteredElement);
  };

  const Stagereset = () => {
    const filteredElement = StageElementresbody.filter((res) => {
      return res.StageId == Stageid;
    }).sort();

    setstagefilterlist(filteredElement);
  };

  //  Main Form Submit

  const OnMainSubmitHandler = async (e) => {
    e.preventDefault(); // 👈️ prevent page refresh

    var fileCtrl = ref.current.value;
    var filePath = ref.current.value;

    var fExt = ".csv";
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
    const formData = new FormData();
    formData.append("_scrdet", JSON.stringify(scrdet));
    formData.append("file", selectedFile);
    const token = localStorage.getItem("token");

    try {
      const url = apiendpoints.UpldStageElements;

      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        toast.success("Successfully updated");
        setTimeout(() => {}, 600);
        FetchStageElementList(Screenid);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };

  const onModalSubmitHandler = async (data) => {
    console.log(data);

    let frmData = {
      txtStgElmDesignId: data.txtStgElmDesignId,
      scrid: Screenid,
      txtStageId: Stageid,
      txtElementName: data.txtElementName,
      txtOrdNo: data.txtOrdNo,
      txtWrap: data.txtWrap,
      txtCssClass: data.txtCssClass,
      cbIsMandatory: data.cbIsMandatory,
      cbIsReadOnly: data.cbIsReadOnly,
    };

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "UpdStageElements",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const UpdStageElements = apiendpoints.UpdStageElements;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        UpdStageElements,
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
          toast.success("Successfully updated");
          handleClose();
          FetchStageElementList(Screenid);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };

  //---------------onSubmitHandler end------
  
  
  //--------Grid prop submit-----------

  const onGridModalSubmitHandler = async (data) => {
   
    var tablevar = document.getElementById('tblgridprop');
    var tbljson = tableToJson(tablevar)

    

    let frmData = {
      txtElementId: data.txtElementId,
      scrid: Screenid,
      txtStageId: Stageid,
      cbAddRow: data.cbAddRow,
      cbCheckBox: data.cbCheckBox,
      cbFilters: data.cbFilters,
      cbMngBtn: data.cbMngBtn,
      txtMngLinks: tbljson,     
    };

    console.log(frmData);
   
    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Updgrdprop",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const UpdStageElements = apiendpoints.Updgrdprop;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        UpdStageElements,
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
          toast.success("Grid porp Successfully updated");          
          gridhandleClose();
          FetchStageElementList(Screenid);
          ReSetGridProperty();
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
      
    }



  }
  //--Grid submit -end

  function tableToJson(table) {
    try {
      var data = []; // first row needs to be headers
      var headers = [];
      for (var i = 0; i < table.rows[0].cells.length; i++) {
        if (
          table.rows[0].cells[i].innerHTML.toLowerCase().indexOf("button") == "-1"
        ) {
          headers[i] = table.rows[0].cells[i].innerHTML.replace(/ /gi, "");
        }
      }
      // go through cells
      for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (var j = 0; j < tableRow.cells.length - 1; j++) {
          rowData[headers[j]] = fetchstringinputboxvalue(
            tableRow.cells[j].innerHTML
          );
        }
        data.push(rowData);
      }
      return data;
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  }

    function fetchstringinputboxvalue(str)
    {
      var val ;   
      val = (str.substr(str.indexOf('value'),500).replace("value=","")).replace(">","")                    

      return val.replace('"',"").replace('"',"").trimEnd(); ;
    }

  function SetScreenValue(rowval) {
    handleShow();
    console.log(rowval);

    reset({
      txtElementName: rowval.ElmName,
      txtOrdNo: rowval.OrdNo,
      txtWrap: rowval.Wrap,
      txtCssClass: rowval.CssClass,
      cbIsMandatory: rowval.IsMandatory,
      cbIsReadOnly: rowval.IsReadOnly,
      txtStgElmDesignId: rowval.StgElmDesignId,
    });
  }


  function SetGridProperty(rowval) {

    

    setgridname(rowval.ElmName)
    
    gridhandleShow();
    console.log(rowval);       


    reset({
      txtElementId:rowval.ElementId,
      cbAddRow: rowval.GrdProp && rowval.GrdProp.addrow,
      cbCheckBox:rowval.GrdProp &&  rowval.GrdProp.ckbx,
      cbFilters:rowval.GrdProp &&  rowval.GrdProp.fltrs,
      cbMngBtn:rowval.GrdProp &&   rowval.GrdProp.mngbtn      
    });

    setRowsData( rowval.GrdProp ? rowval.GrdProp.mnglnk : []);

  }


  
  function ReSetGridProperty() {

   

    reset({
      txtElementId:'',
      cbAddRow: false,
      cbCheckBox: false,
      cbFilters: false,
      cbMngBtn: false     
    });

    setRowsData([]);

  }



  function AddNewElement() {
    handleShow();

    reset({
      txtElementName: "",
      txtOrdNo: "",
      txtWrap: "",
      txtCssClass: "",
      cbIsMandatory: false,
      cbIsReadOnly: false,
      txtStgElmDesignId: "",
    });
  }

  //--------------------------------------------------------------------------------------------------------
  // - Delete element

  const DeleteScreenValue = async (rowval) => {
    console.log(rowval);

    var frmData = { scrid: Screenid, stgelmids: [rowval.StgElmDesignId] };

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "Deleteelement",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const DeleteStageElement = apiendpoints.DeleteStageElement;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        DeleteStageElement,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
      } else {
        toast.success("Deleted Successfully");
        FetchStageElementList(Screenid);
      }
    } catch (err) {
      toast.error("Unable to process request");
    }
  };

  //---------------------------------------------------------------------------------------------------------------

  function ResetScreenValue() {
    ref.current.value = "";
  }

  const CheckboxhandleChange = (e) => {
    if (e.target.value == true) {
      setIsCustomScr(true);
    } else {
      setIsCustomScr(false);
    }
  };
  // Event Function End

  // Main Function

  // table methods

  const [rowsData, setRowsData] = useState([]);

  const addTableRows = () => {
    const rowsInput = {
      Method: "",
      ToolTip: "",
      Icon: "",
      CSS: "",
      Style: "",
      Condition: "",
    };
    setRowsData([...rowsData, rowsInput]);     

    

  };


  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  };

  //table method end

  const ShowAlert = (alertType, message) => {};

  try {
    return (
      <>
        <section className="vh-100">
          <div className="container h-100">
            {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">
                  Screen Stage Element Mapping
                </strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <form onSubmit={OnMainSubmitHandler} autocomplete="off">
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="scrid" className="form-label">
                          Screen
                        </label>

                        <select
                          {...register("scrid")}
                          className="form-control"
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
                        <p>{errors.scrid?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <div className="row">
                          <label htmlFor="filElements" className="form-label">
                            {" "}
                            Element File
                          </label>
                          <div className="col-md-8">
                            <input
                              type="file"
                              name="filElements"
                              onChange={handleFileChange}
                              ref={ref}
                              className="form-control"
                            />
                          </div>
                          <div className="col-md-4 padTop25">
                            <button type="submit" className="btn btn-primary">
                              <span className="bi bi-upload"></span> upload
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="cmb" className="form-label">
                        Stage
                      </label>

                      <select
                        {...register("cmbStageStageId")}
                        className="form-control"
                        onChange={StageOnChange}
                      >
                        <option value="0">- Select -</option>
                        {
                          //Combo Data binding

                          stageresbody.map((res) => (
                            <option key={res.StageId} value={res.StageId}>
                              {res.StageName}
                            </option>
                          ))
                        }
                      </select>
                      <p>{errors.scrid?.message}</p>
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                </div>
              </div>

              <Scrollbar style={{ height: 550 }}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Element Name </th>
                      <th>Ord No </th>
                      <th>Wrap </th>
                      <th>Css Class</th>
                      <th>IsMandatory </th>
                      <th>IsReadOnly</th>
                      <th>
                        <button
                          className="btn btn-success"
                          onClick={AddNewElement}
                        >
                          {" "}
                          <i className="bi bi-table"></i> Add{" "}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stagefilterlist &&
                      stagefilterlist.map((x) => {
                        return (
                          <tr>
                            <td>{x.ElementId}</td>
                            <td>{x.ElmName}</td>
                            <td>{x.OrdNo}</td>
                            <td>{x.Wrap}</td>
                            <td>{x.CssClass}</td>
                            <td>{x.IsMandatory ? "YES" : "NO"}</td>
                            <td>{x.IsReadOnly ? "YES" : "NO"}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  SetScreenValue(x);
                                }}
                              >
                                {" "}
                                <i className="bi bi-pen"></i>
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  DeleteScreenValue(x);
                                }}
                              >
                                {" "}
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                            {/* <td>{ x.ControlType=="Grid"? (<button className="btn btn-success"
                                onClick={() => {
                                  SetGridProperty(x);
                                }}
                            
                            > <i className="bi bi-grid"></i>  </button>):"" }</td> */}

                                <button className="btn btn-success"
                                onClick={() => {
                                  SetGridProperty(x);
                                }}
                            
                            > <i className="bi bi-grid"></i>  </button>

                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </Scrollbar>
            </div>
          </div>
        </section>

        <Modal
          show={show}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Stage Element Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              onSubmit={handleSubmit(onModalSubmitHandler)}
              autocomplete="off"
            >
              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtElementName " className="form-label">
                      {" "}
                      Element Name
                    </label>
                    <select
                      {...register("txtElementName")}
                      className="form-control"
                    >
                      <option value="0">- Select -</option>
                      {
                        //Combo Data binding

                        Elementresbody.map((res) => (
                          <option key={res.ElementId} value={res.ElmName}>
                            {res.ElmName}
                          </option>
                        ))
                      }
                    </select>

                    <p>{errors.cmbControlType?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtOrdNo" className="form-label">
                      {" "}
                      Order No.
                    </label>
                    <input
                      {...register("txtOrdNo")}
                      type="text"
                      className="form-control"
                    />
                    <input
                      {...register("txtStgElmDesignId")}
                      type="text"
                      className="form-control"
                      hidden="true"
                    />
                    <p>{errors.txtOrdNo?.message}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtWrap  " className="form-label">
                      {" "}
                      txtWrap
                    </label>

                    <input
                      {...register("txtWrap")}
                      type="text"
                      className="form-control"
                    />

                    <p>{errors.txtWrap?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtCssClass  " className="form-label">
                      {" "}
                      Css Class
                    </label>

                    <input
                      {...register("txtCssClass")}
                      type="text"
                      className="form-control"
                    />
                    <p>{errors.txtCssClass?.message}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <input {...register("cbIsMandatory")} type="checkbox" />{" "}
                    &nbsp;
                    <label htmlFor="cbIsMandatory" className="form-label">
                      IsMandatory
                    </label>
                    <p>{errors.cbIsMandatory?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <input
                      {...register("cbIsReadOnly")}
                      type="checkbox"

                      //   onChange={(e) => {
                      //     CheckboxhandleChange(
                      //       {
                      //         target: {
                      //           value: e.target.checked,
                      //         },
                      //       },

                      //     );
                      //   }
                      // }
                    />{" "}
                    &nbsp;
                    <label htmlFor="cbIsReadOnly" className="form-label">
                      IsReadOnly
                    </label>
                    <p>{errors.cbIsReadOnly?.message}</p>
                  </div>
                </div>
              </div>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="secondary">
                  Update
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/*   Gird Property Model popup start */}

        <Modal
          show={gridshow}
          onHide={gridhandleClose}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{gridname} Grid Property</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              
              autocomplete="off"
            >
              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <input {...register("cbAddRow")} type="checkbox" /> &nbsp;
                    <label htmlFor="cbAddRow" className="form-label">
                      Add Row
                    </label>
                    <p>{errors.cbAddRow?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <input {...register("cbCheckBox")} type="checkbox" /> &nbsp;
                    <label htmlFor="cbCheckBox" className="form-label">
                      Check Box
                    </label>
                    <p>{errors.cbCheckBox?.message}</p>
                  </div>
                </div>

                <div className="col-sm">
                  <div className="mb-3">
                    <input {...register("cbFilters")} type="checkbox" /> &nbsp;
                    <label htmlFor="cbFilters" className="form-label">
                      Filters
                    </label>
                    <p>{errors.cbFilters?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <input {...register("cbMngBtn")} type="checkbox" /> &nbsp;
                    <label htmlFor="cbMngBtn" className="form-label">
                      Mng Button
                    </label>
                    <p>{errors.cbMngBtn?.message}</p>
                  </div>
                </div>
              </div>

              <div className="row">
                <table  id="tblgridprop" className="table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>ToolTip</th>
                      <th>Icon</th>
                      <th>CSS</th>
                      <th>Style</th>
                      <th>Condition</th>
                      <th>
                        <button type="button"
                          className="btn btn-outline-success"
                          onClick={() => addTableRows()}
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRows
                      rowsData={rowsData}
                      deleteTableRows={deleteTableRows}
                      handleChange={handleChange}
                    />
                  </tbody>
                </table>
              </div>
              <div className="col-sm-4"></div>

              <Modal.Footer>
                <Button variant="secondary" onClick={gridhandleClose}>
                  Close
                </Button>
                <Button type="submit"  onClick= {handleSubmit(onGridModalSubmitHandler)} variant="secondary">
                  Update 
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default StageElementMapping;
