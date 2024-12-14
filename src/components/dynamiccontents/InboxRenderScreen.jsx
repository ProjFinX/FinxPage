import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dynamicdata from "../dynamicdata.json";
import OneScreen from "./OneScreen";
import { FormContext } from "../Contexts/FormContext";
import { useForm } from "react-hook-form";
import { Setup } from "../BusinessLogics/EventHandler";
import { getPostData } from "../../utilities/apidataformatter";
import Spinner from "../../htmlcomponents/Spinner";
import appsettings from "../../../appsettings.json";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../../utilities/utils";
import api from "../../api/Webcall";
import { FetchCombodata } from "../../utilities/combodata";
import { useNavigate } from "react-router-dom";
import DocViewer from "../../utilities/DocViewer/DocViewer";
// React Notification
import { toast } from "react-toastify";
import AccessDenied from "../../htmlcomponents/AccessDenied";
import { Sidepanel } from "../components/Sidepanel";
import Timeline from "../../htmlcomponents/Timeline";
import RenderUI from "./RenderUI";
const InboxRenderScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setLoanding] = useState(false);
  const [actionHighlight , setactionHighlight] = useState(null);
  const [loadsuccess, setLoadStatus] = useState(true);
  const formmethods = useForm();
  const [stageElements, setstageElements] = useState(null);
  const [eDefHldr, seteDefHldr] = useState(null);
  const [stageGridRefs, setStageGridRefs] = useState();
  const [combodata, setComboData] = useState({});
  const [elements, setElements] = useState([]);
  const [cntrData, setControlsdata] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [docField, setdocField] = useState(null);
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = formmethods;

  // let controlsdata = dynamicdata.body.elms;

  // let stageElements = dynamicdata.body.stg;

  /* Form Load */
  const formatdata = async () => {
    /* Header */
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "CreateQ", orgid: "", vendid: "0" };

    const scrid = searchParams.get("scrid");
    const stgid = searchParams.get("stgid");
    const ver = searchParams.get("ver");
    const qid = searchParams.get("qid");

    debugger;

    const frmData = { scrid: scrid, stgid: stgid, ver: ver, qid: qid };
    const data = { hdr: frmHdr, body: frmData };

    const endpoints = appsettings.ApiEndpoints;

    const url = !qid ? endpoints.CreateQ : endpoints.OpenQ;

    let response = await api.post(url, compressBase64(data));

    if (response.status == 401) {
      navigate("/Login");
    }
    let strResponse = JSON.parse(decompressBase64(response.data));

    if (strResponse.hdr.rst == "FAILED") {
      if (strResponse.fdr[0].rstcode == 1508) {
        setLoadStatus(false);
      }
    }

    let controlsdata = strResponse.body.elms;

    let stageElements = strResponse.body.stg;

    const elementarraydata = [];

    if (strResponse.body.elmsData) {
      for (var element in controlsdata) {
        if (
          controlsdata[element].ty == 10 &&
          strResponse.body.elmsData._gridData
        ) {
          // Check Grid element
          controlsdata[element]["val"] = strResponse.body.elmsData._gridData[
            element
          ]
            ? Object.values(strResponse.body.elmsData._gridData[element])
            : [];
        } else {
          controlsdata[element]["val"] = strResponse.body.elmsData[element]
            ? strResponse.body.elmsData[element]
            : "";
        }
        elementarraydata.push({
          fieldname: element,
          elementdata: controlsdata[element],
        });
      }
    } else {
      for (var element in controlsdata) {
        controlsdata[element]["val"] = "";
        elementarraydata.push({
          fieldname: element,
          elementdata: controlsdata[element],
        });
      }
    }

    const stageElementarraydata = [];

    for (var element in stageElements.elms) {
      stageElementarraydata.push({
        fieldname: element,
        elementdata: stageElements.elms[element],
      });
    }

    let stgelts = {};

    stageElementarraydata.map(
      (item) => (
        (stgelts = !{
          ...elementarraydata.find((e) => e.fieldname == item.fieldname),
        }
          ? {}
          : { ...elementarraydata.find((e) => e.fieldname == item.fieldname) }),
        (item.elementdata = {
          ...stgelts.elementdata,
          ...item.elementdata,
        })
      )
    );

    /* Loading combo data on formLoad */
    let generalComb = "";
    let compComb = "";
    let dmdComb = "";
    let ctr = "";
    let dmdctr = "";
    let optw = "";
    const regex = /\$\#\w+\#\$/gi;
    const dmdCombobj = [];
    let comboelementdata = [...stageElementarraydata];

    // Define a recursive function to update empty child objects
    function updateEmptyChildObjects(obj) {
      // Check if the object has a "child" property
      if (obj.hasOwnProperty("child")) {
        // Loop over each key-value pair in the "child" object
        for (let [key, value] of Object.entries(obj.child)) {
          // Check if the value is an empty object
          if (Object.keys(value).length === 0) {
            // Update the object with a new value
            //  obj.child[key] = {elementdata : controlsdata[key]};
            comboelementdata.push({
              elementdata: controlsdata[key],
              fieldname: key,
            });
          } else {
            // Recursively call the function on non-empty child objects
            updateEmptyChildObjects(value);
          }
        }
      }
    }

    // Loop over each object in the array
    for (let obj of comboelementdata) {
      // Call the recursive function to update empty child objects
      updateEmptyChildObjects(obj.elementdata);
    }

    comboelementdata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        !item.elementdata.con &&
        item.elementdata.cod &&
        !item.elementdata.cstr
      ) {
        generalComb += "|" + item.elementdata.cod + "|";
      }
    });

    comboelementdata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        !item.elementdata.con &&
        item.elementdata.cod &&
        item.elementdata.cstr
      ) {
        compComb += "|" + item.elementdata.cod + "|";
        ctr = item.elementdata.cstr;
      }
    });

    debugger;

    stageElementarraydata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        item.elementdata.con &&
        item.elementdata.cstr
      ) {
        dmdComb += "|" + item.elementdata.cod + "|";
        dmdctr = item.elementdata.cstr;
        const found = item.elementdata.con.match(regex);

        const val = item.elementdata.con.replace(
          found[0],
          strResponse.body.elmsData[
            found[0].replace("$#", "").replace("#$", "")
          ]
        );
        const cod = item.elementdata.cod.toLocaleUpperCase();
        const ctr = item.elementdata.cstr;
        let optw = {};

        optw = { [cod]: val };

        dmdCombobj.push({
          opt: dmdComb,
          optw: optw,
          ctr: dmdctr,
          fieldname: item.fieldname,
        });

        //const comcombres = await FetchCombodata(opt, optw, ctr);
      }
    });

    /* Loading Dependend combo list */
    let dmdcomcombres = {};
    for (const item of dmdCombobj) {
      const dmdresponse = await FetchCombodata(item.opt, item.optw, item.ctr);

      dmdresponse.body =
        dmdresponse.body[strResponse.body.elms[item.fieldname].cod].length > 0
          ? dmdresponse.body
          : [];

      dmdcomcombres = { ...dmdcomcombres, ...dmdresponse.body };
    }

    debugger;
    let genres = {};
    let comcombres = {};

    if (generalComb) {
      genres = await FetchCombodata(generalComb, optw);
    }

    optw = { ["STA"]: "stageid=" + stgid };

    if (compComb) {
      comcombres = await FetchCombodata(compComb, optw, ctr);
    }
    const cmddata = { ...genres.body, ...comcombres.body, ...dmdcomcombres };

    /* storing grid refs */
    let stagegridrefs = {};

    [...stageElementarraydata].map((item) => {
      if (item.elementdata.ty === 10) {
        stagegridrefs[item.fieldname] = {};
      }
    });

    setComboData(cmddata);
    setElements([...stageElementarraydata]);
    setstageElements(stageElements);
    setControlsdata(controlsdata);
    setStageGridRefs(stagegridrefs);
    seteDefHldr(strResponse.body);
  };

  /* Toggle Actions */
  const toggleActions = () => {
    document.getElementById("sidePanel").classList.toggle("show");
    document.getElementById("oneScreenForm").classList.toggle("hide");
  };
  /* Form Submit */
  const onSubmit = async (edata, event) => {
    debugger;
    let data = getValues();
    event.preventDefault();

    setLoanding(true);

    let griddata = {};

    if(combodata["sta"].length > 0 ){

      const action =  getValues("cmbAction") 

      if(!action){

        toast.error("Action needs to be selected!", "Error!", 2000);

         toggleActions();

        setactionHighlight("glow-border mandatory");

        setLoanding(false);

        return;

      }

      setactionHighlight("");


    }

    for (var key in stageGridRefs) {
      let rowData = {};
      stageGridRefs[key].current.api.forEachNode((node) =>
        Object.assign(rowData, { [node.data._rid]: node.data })
      );
      griddata = { [key]: rowData };
    }

    /* Update form data with document id  */
    for (var key in eDefHldr.fil) {
      if (eDefHldr.fil.hasOwnProperty(key)) {
        data[key] = eDefHldr.fil[key]["docid"];
      }
    }

    //stageGridRefs.gr_CustomerDocuments.current.api.forEachNode(node => rowData.push(node.data));

    griddata = { ["_gridData"]: JSON.stringify(griddata) };

    let qdata = { ...data, ...griddata };

    let evntDet = {};

    debugger;
    evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
    evntDet["scrid"] = eDefHldr.qdet["scrid"];
    evntDet["qid"] = eDefHldr.qdet["qid"];
    evntDet["stgid"] = eDefHldr.qdet["stgid"];
    evntDet["befsubmitmethod"] =
      Object.keys(eDefHldr.stg.sev).length > 0 &&
      eDefHldr.stg.sev.Screen.ev.beforesubmit;
    evntDet["aftsubmitmethod"] =
      Object.keys(eDefHldr.stg.sev).length > 0 &&
      eDefHldr.stg.sev.Screen.ev.aftersubmit;
    evntDet["stagemovemethod"] =
      Object.keys(eDefHldr.stg.sev).length > 0 &&
      eDefHldr.stg.sev.Screen.ev.stagemove;

    data = getPostData("SubmitQ", qdata, "_sev", evntDet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.SubmitQ, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    console.log(strResponse);

    if (strResponse.hdr.rst == "SUCCESS") {
      setLoanding(false);

      toast.success("Data Submitted!", "Successful!", 2000);

      navigate("/Home");
      // ShowAlert("Success", "Submitted successfully");
    } else {
      setLoanding(false);

      if (strResponse.fdr.length > 0) {
        strResponse.fdr.map((data) => {
          toast.error(data.rstmsg, "Error!", 4000);
        });
      } else {
        toast.error("Something went wrong!", "Error!", 2000);
        //  ShowAlert("Error", "Something went wrong");
      }
    }
  };

  /*Form Cancel */

  const onCancel = async () => {
    const result = window.confirm(
      "Are you sure ? , Unsaved data will be lost!"
    );

    if (result) {
      debugger;

      let qdata = {};
      let evntDet = {};
      evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
      evntDet["scrid"] = eDefHldr.qdet["scrid"];
      evntDet["qid"] = eDefHldr.qdet["qid"];
      evntDet["stgid"] = eDefHldr.qdet["stgid"];

      var data = getPostData("CancelQ", qdata, "_qdet", eDefHldr.qdet);

      const endpoints = appsettings.ApiEndpoints;

      let result = await api.post(endpoints.CancelQ, compressBase64(data));

      let strResponse = JSON.parse(decompressBase64(result.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "SUCCESS") {
        setLoanding(false);

        toast.success("form cancelled!", "Successful!", 2000);

        navigate("/Home");
        // ShowAlert("Success", "Submitted successfully");
      } else {
        setLoanding(false);

        if (strResponse.fdr.length > 0) {
          strResponse.fdr.map((data) => {
            toast.error(data.rstmsg, "Error!", 4000);
          });
        } else {
          toast.error("Something went wrong!", "Error!", 2000);
          //  ShowAlert("Error", "Something went wrong");
        }
      }
    }
  };

  const onSave = async () => {
    debugger;

    let qdata = getValues();

    let griddata = {};

    for (var key in stageGridRefs) {
      let rowData = {};
      stageGridRefs[key].current.api.forEachNode((node) =>
        Object.assign(rowData, { [node.data._rid]: node.data })
      );
      griddata = { [key]: rowData };
    }

    /* Update form data with document id  */
    for (var key in eDefHldr.fil) {
      if (eDefHldr.fil.hasOwnProperty(key)) {
        qdata[key] = eDefHldr.fil[key]["docid"];
      }
    }

    griddata = { ["_gridData"]: JSON.stringify(griddata) };

    qdata = { ...qdata, ...griddata };

    var data = getPostData("SaveQ", qdata, "_qdet", eDefHldr.qdet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.SaveQ, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    console.log(strResponse);

    if (strResponse.hdr.rst == "SUCCESS") {
      setLoanding(false);

      toast.success("Data Saved!", "Successful!", 2000);
    } else {
      setLoanding(false);

      if (strResponse.fdr.length > 0) {
        strResponse.fdr.map((data) => {
          toast.error(data.rstmsg, "Error!", 4000);
        });
      } else {
        toast.error("Something went wrong!", "Error!", 2000);
        //  ShowAlert("Error", "Something went wrong");
      }
    }
  };

  const onSaveXit = async () => {
    let qdata = getValues();

    let griddata = {};

    for (var key in stageGridRefs) {
      let rowData = {};
      stageGridRefs[key].current.api.forEachNode((node) =>
        Object.assign(rowData, { [node.data._rid]: node.data })
      );
      griddata = { [key]: rowData };
    }

    /* Update form data with document id  */
    for (var key in eDefHldr.fil) {
      if (eDefHldr.fil.hasOwnProperty(key)) {
        qdata[key] = eDefHldr.fil[key]["docid"];
      }
    }

    griddata = { ["_gridData"]: JSON.stringify(griddata) };

    qdata = { ...data, ...griddata };

    var data = getPostData("SaveAndXitQ", qdata, "_qdet", eDefHldr.qdet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.SaveXit, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    console.log(strResponse);

    if (strResponse.hdr.rst == "SUCCESS") {
      setLoanding(false);

      toast.success("Data Saved!", "Successful!", 2000);
      navigate("/Home");
      // ShowAlert("Success", "Submitted successfully");
    } else {
      setLoanding(false);

      if (strResponse.fdr.length > 0) {
        strResponse.fdr.map((data) => {
          toast.error(data.rstmsg, "Error!", 4000);
        });
      } else {
        toast.error("Something went wrong!", "Error!", 2000);
        //  ShowAlert("Error", "Something went wrong");
      }
    }
  };

  const docurl = (fieldname) => {
    debugger;

    let file = watch(fieldname)[0];

    if (file.type == "") {
      file = new Blob([file], { type: "application/octet-stream" });
    }

    return URL.createObjectURL(file);
  };

  const Setdocfield = (fieldname) => {
    setdocField(null);
  };

  useEffect(() => {
    formatdata();
    Setup();
    //loadCombodata();
    return;
  }, []);



  try {
    return (
      <>
        {isLoading ? <Spinner></Spinner> : ""}
        {!loadsuccess ? <AccessDenied></AccessDenied> : ""}
        {elements.length > 0 ? (
          <FormContext.Provider
            value={{
              ...formmethods,
              combodata,
              setComboData,
              elements,
              stageElements,
              cntrData,
              setStageGridRefs,
              stageGridRefs,
              eDefHldr,
              setdocField,
              actionHighlight
            }}
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="oneScreenForm"
              className="form-container"
            >
              <nav id="onescreenmainNav" className="navbar navbar-expand-lg">
                <div className="pagetitle col-7">
                  <h1>
                    {" "}
                    {eDefHldr &&
                      eDefHldr.qdet.scrname +
                        " (" +
                        eDefHldr.qdet.stgname +
                        ")"}{" "}
                  </h1>
                </div>

                <div className="col-5 d-flex justify-content-end">
                  <button
                    className="btn btn-success btn-sm  m-2"
                    type="submit"
                    // onClick={(e) => onSubmit(e)}
                  >
                    Submit
                  </button>
                  <button
                    className="btn btn-warning btn-sm m-2"
                    type="button"
                    onClick={() => onSave()}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-warning btn-sm m-2"
                    type="button"
                    onClick={() => onSaveXit()}
                  >
                    Save & X-it
                  </button>
                  <button
                    className="btn btn-danger btn-sm  m-2"
                    type="button"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-sm  m-2"
                    type="button"
                    onClick={() => toggleActions()}
                  >
                    Actions
                  </button>
                </div>
              </nav>
              <div className="form-content">
                <div className="row">
                  {/* {elements.map((item) => (
                    <OneScreen
                      dataprops={item.elementdata}
                      key={item.fieldname}
                      fieldname={item.fieldname}
                      stagelementdata={stageElements}
                      elementdefs={cntrData}
                    />
                  ))} */}
                <RenderUI
                    data={stageElements.ui}
                    elements={elements}
                    stageElements={stageElements}
                    cntrData={cntrData}
                  />
                </div>
              </div>
              <div
                className="side-panel  shadow  justify-content-center"
                id="sidePanel"
              >
                <Sidepanel />
              </div>
            </form>
          </FormContext.Provider>
        ) : (
          <></>
        )}
        <div
          className="modal fade"
          id="exampleModalScrollable"
          tabIndex="-1"
          aria-labelledby="exampleModalScrollableTitle"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-hidden="true"
          style={{ display: "none" }}
        >
          <div className="modal-dialog modal-dialog-scrollabl modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h6 className="modal-title" id="exampleModalScrollableTitle">
                  FinX Doc Viewer
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {/* {docField  && ( 
               <DocViewer
                documents={Array.from(watch(docField)).map((file) => (
                  {
                  uri: window.URL.createObjectURL(file),
                  fileName: file.name,
                }))} 
                pluginRenderers={DocViewerRenderers}
              />  ) } */}
                {watch(docField)[0] && (
                  <DocViewer
                    localUrl={docurl(docField)}
                    filename={watch(docField)[0].name}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => Setdocfield(null)}
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (ex) {
    console.log("error occured ", ex);
  }
};

export default InboxRenderScreen;
