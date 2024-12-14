import React, { useContext, useCallback } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import dynamicdata from "./dynamicdata.json";
import OneScreen from "./OneScreen";
import { FormContext } from "./Contexts/FormContext";
import { useForm } from "react-hook-form";
import { Setup, ServerEventCaller } from "./BusinessLogics/EventHandler";
import { getPostData } from "../utilities/apidataformatter";
import Spinner from "../htmlcomponents/Spinner";
import appsettings from "../../appsettings.json";
import { ErrorBoundary } from "react-error-boundary";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import api from "../api/Webcall";
import { FetchCombodata, FetchQryCombodata } from "../utilities/combodata";
import { useNavigate } from "react-router-dom";
import DocViewer from "../utilities/DocViewer/DocViewer";
// React Notification
import { toast } from "react-toastify";
import AccessDenied from "../htmlcomponents/AccessDenied";
import { Sidepanel } from "./components/Sidepanel";
import Timeline from "../htmlcomponents/Timeline";
import RenderUI from "./RenderUI";
import FormDataHelper from "./BusinessLogics/FormDataHelper";
import LoadinLine from "../htmlcomponents/LoadingLine";
import MultiSearchControl from "./controls/MultiSearchControl";

const RenderScreen = (props) => {
  const { scrid, stgid, formKey, qid } = props;
  const navigate = useNavigate();
  const [actionHighlight, setactionHighlight] = useState(null);
  const [formkey, setFormKey] = useState(formKey);
  const [isLoading, setLoanding] = useState(false);
  const [loadsuccess, setLoadStatus] = useState(true);
  const formmethods = useForm({ mode: "onSubmit" });
  const [stageElements, setstageElements] = useState(null);
  const [eDefHldr, seteDefHldr] = useState(null);
  const [stageGridRefs, setStageGridRefs] = useState();
  const [combodata, setComboData] = useState({});
  const [elements, setElements] = useState([]);
  const [cntrData, setControlsdata] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [docField, setdocField] = useState(null);
  const [gridList, setstageGridList] = useState({});
  const [isFormValid, setFormValid] = useState(true);
  const [docURL, setDocURL] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [formLoad, setIsFormLoad] = useState(false);
  const [isEventLoading, setEventLoading] = useState(false);
  const [multiSearchData, setMultiSearchData] = useState([]);
  const [currentGridRowData, setcurrentGridRowData] = useState([]);
  const [qdets, setqdet] = useState([]);

  // const scrid = searchParams.get("scrid");
  // const stgid = searchParams.get("stgid");
  const ver = searchParams.get("ver");
  //  const qid = searchParams.get("qid");

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    reset,
    formState,
    formState: {
      errors,
      isValid,
      isDirty,
      isSubmitting,
      isSubmitted,
      submitCount,
    },
  } = formmethods;



  /* Form Load */
  const loadScreen = async () => {
    /* Header */
    console.log("Load Screen Initiated");
    const convID = generateUUID();
    const frmHdr = { convid: convID, tag: "CreateQ", orgid: "", vendid: "0" };
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

    let qDet = strResponse.body.qdet;

    const elementarraydata = [];

    debugger;

    if (strResponse.body.elmsData) {
      for (var element in controlsdata) {
        if (
          controlsdata[element].ty == 10 &&
          strResponse.body.elmsData._gridData
        ) {

          let griddata = []
          if (strResponse.body.elmsData._gridData[element]) {

            griddata = Object.values(strResponse.body.elmsData._gridData[element])

            griddata.map(grdrow => {

              // Loop through the properties of the JSON object
              for (let key in grdrow) {
                if (grdrow.hasOwnProperty(key)) {
                  if (controlsdata[key]?.ty == 9) {
                    let docvalue = strResponse.body.elmsData?._gridData[element]?.[grdrow._rid]?.[key];
                    if (docvalue) {
                      let filedetails = [];
                      filedetails.push({
                        id: docvalue.id,
                        name: docvalue.name,
                        mode: "Qdata",
                      });
                    //  grdrow[key] = filedetails;

                      grdrow[`_v_${key}`] = filedetails
                    }
                  }
                }
              }

            })

          }
          // Check Grid element
          controlsdata[element]["val"] = strResponse.body.elmsData._gridData[
            element
          ]
            ? griddata//Object.values(strResponse.body.elmsData._gridData[element])
            : [];
        }
        else if (
          controlsdata[element].ty == 4 //Check date data and convert the date
        ) {
          controlsdata[element]["val"] = strResponse.body.elmsData[element]
            ? convertDate(new Date(strResponse.body.elmsData[element]))
            : "";

        }
        // Check if its pop up form and its not a child of grid
        else if (
          controlsdata[element].ty == 14 &&
          !controlsdata[element].pid &&
          strResponse.body.elmsData[element]
        ) {
          // Find the child elements of the pop up form using the parent element id
          let eid = controlsdata[element].eid;
          let childelement = findChildElementByPid(controlsdata, eid);
          childelement.forEach((item) => {
            item = Object.keys(item)[0];
            controlsdata[item]["val"] = strResponse.body.elmsData[element][item]
              ? strResponse.body.elmsData[element][item]
              : "";
          });
        } else if (
          !controlsdata[element].pid &&
          controlsdata[element].ty != 9
        ) {
          controlsdata[element]["val"] = strResponse.body.elmsData[element]
            ? strResponse.body.elmsData[element]
            : "";
        } else if (controlsdata[element].ty == 9) {
          let docvalue = strResponse.body.elmsData[element];
          if (docvalue) {
            // let docurl = endpoints.dwnld + "?qid=" + qid + "&docid=" + docid;
            // let response = await api.get(docurl);
            // let docdetails =decompressBase64(response.data);

            let filedetails = [];
            filedetails.push({
              id: docvalue.id,
              name: docvalue.name,
              mode: "Qdata",
            });
            controlsdata[element]["val"] = filedetails;
          }
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

    const stageElementarraydata = [...elementarraydata];

    function findChildElementByPid(json, pid) {
      const result = [];

      for (const prop in json) {
        const obj = json[prop];
        if (obj.pid === pid) {
          result.push({ [prop]: obj });
        }
      }

      return result;
    }

    /* Commenting it as stage elements participents are handle through UI design */

    // for (var element in stageElements.elms) {
    //   stageElementarraydata.push({
    //     fieldname: element,
    //     elementdata: stageElements.elms[element],
    //   });
    // }

    // let stgelts = {};

    // stageElementarraydata.map(
    //   (item) => (
    //     (stgelts = !{
    //       ...elementarraydata.find((e) => e.fieldname == item.fieldname),
    //     }
    //       ? {}
    //       : { ...elementarraydata.find((e) => e.fieldname == item.fieldname) }),
    //     (item.elementdata = {
    //       ...stgelts.elementdata,
    //       ...item.elementdata,
    //     })
    //   )
    // );

    /* Loading combo data on formLoad */
    let generalComb = "";
    let compComb = "";
    let dmdComb = "";
    //let ctr = "";
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


    /* remvoed General Combo */
    // comboelementdata.map((item) => {
    //   if (
    //     item.elementdata.ty === 3 &&
    //     !item.elementdata.con &&
    //     item.elementdata.cod &&
    //     !item.elementdata.cstr||item.elementdata.cstr==0
    //   ) {
    //     generalComb += "|" + item.elementdata.cod + "|";
    //   }
    // });


    comboelementdata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        !item.elementdata.con &&
        item.elementdata.cod &&
        item.elementdata.cstr
      ) {
        compComb += "|" + item.elementdata.cod + "," + item.fieldname + "," + item.elementdata.cstr;
        // ctr = item.elementdata.cstr;
      }
    });
    compComb += "|";

    debugger;

    /* Start Query Combo list item */

    let cmbReq = {
      cmb: []
    }

    comboelementdata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        item.elementdata.con &&
        !item.elementdata.cod &&
        item.elementdata.cstr
      ) {

        const found = item.elementdata.con.match(regex);
        if (!found) {
          cmbReq["cmb"].push({
            elm: item.fieldname, con: item.elementdata.cstr,
            qry: item.elementdata.con
          });
        }

      }
    });

    let qryCmbList = await FetchQryCombodata(cmbReq);


    /* End Query Combo list item */



    /* Start dependent Query Combo list item */

    let depQryCmbList = {};

    let depCmbReq = {
      cmb: []
    }

    comboelementdata.map(async (item) => {
      if (
        item.elementdata.ty === 3 &&
        item.elementdata.con &&
        !item.elementdata.cod &&
        item.elementdata.cstr
      ) {

        const found = item.elementdata.con.match(regex);
        if (found) {



          depCmbReq["cmb"].push({
            elm: item.fieldname, con: item.elementdata.cstr,
            qry: item.elementdata.con
          });


        }

      }
    });

    let depQryCmbLstItems = await FetchQryCombodata(depCmbReq, qDet);
    depQryCmbList = { ...depQryCmbList, ...depQryCmbLstItems };


    /* End dependent uery Combo list item */

    /*Check if there is existing data */
    //  if (strResponse.body.elmsData) {
    stageElementarraydata.map((item) => {
      if (
        item.elementdata.ty === 3 &&
        item.elementdata.cod &&
        item.elementdata.con &&
        item.elementdata.cstr
      ) {

        //dmdComb += "|" + item.elementdata.cod + "|";
        dmdComb = "|" + item.elementdata.cod + "," + item.fieldname + "," + item.elementdata.cstr + "|";
        //dmdctr = item.elementdata.cstr;

        const found = item.elementdata.con.match(regex);
        let val = item.elementdata.con;
        if (found) {
          found.forEach((pattern) => {
            const key = pattern.replace("$#", "").replace("#$", "");
            if (strResponse.body?.elmsData?.hasOwnProperty(key)) {
              val = val.replace(pattern, strResponse.body.elmsData[key]);
            }
          });
          // Now 'val' contains the updated string with all occurrences replaced
        }

        const cod = item.elementdata.cod.toLocaleUpperCase();
        // const ctr = item.elementdata.cstr;
        let optw = {};

        optw = { [cod]: val };

        dmdCombobj.push({
          opt: dmdComb,
          optw: optw,
          // ctr: dmdctr,
          fieldname: item.fieldname,
        });

        //const comcombres = await FetchCombodata(opt, optw, ctr);
      }
    });
    // }



    /* Loading Dependend combo list */
    let dmdcomcombres = {};
    for (const item of dmdCombobj) {
      const dmdresponse = await FetchCombodata(item.opt, item.optw, "Yes");

      const finaldmdCmbData = {};

      // finaldmdCmbData[item.fieldname] =
      //   dmdresponse?.body[strResponse.body.elms[item.fieldname].cod]?.length > 0
      //     ? dmdresponse?.body[strResponse.body.elms[item.fieldname].cod]
      //     : [];

      finaldmdCmbData[item.fieldname] =
        dmdresponse?.body.data[item.fieldname]?.length > 0
          ? dmdresponse?.body.data[item.fieldname]
          : [];

      dmdcomcombres = { ...dmdcomcombres, ...finaldmdCmbData };

    }


    /* remvoed General Combo */
    // let genres = {};
    // if (generalComb) {
    //   genres = await FetchCombodata(generalComb, optw);
    // }


    let comcombres = {};
    debugger;
    optw = { ["STA"]: "stageid=" + stgid };
    if (compComb) {
      comcombres = await FetchCombodata(compComb, optw, "Yes"); // ctr);
    }


    const finalcmbData = { ...comcombres.body.data };

    // /* Load Combo Data against each element */
    // const finalcmbData = {};
    // for (const cmbdata in comcombres.body) {
    //   const cmbelements = comboelementdata.filter(
    //     (item) =>
    //       item.elementdata.ty == 3 &&
    //       !item.elementdata.con &&
    //       item.elementdata.cod == cmbdata
    //   );
    //   cmbelements.forEach((element) => {
    //     finalcmbData[element.fieldname] = comcombres.body[cmbdata];
    //   });
    // }


    /* remvoed General Combo */
    // const finalgencmbData = {};
    // for (const genrescmb in genres.body) {
    //   const cmbelements = comboelementdata.filter(
    //     (item) =>
    //       item.elementdata.ty == 3 &&
    //       !item.elementdata.con &&
    //       item.elementdata.cod == genrescmb
    //   );
    //   cmbelements.forEach((element) => {
    //     finalgencmbData[element.fieldname] = genres.body[genrescmb];
    //   });
    // }
    // const cmddata = { ...finalgencmbData, ...finalcmbData, ...dmdcomcombres, ...qryCmbList };


    const cmddata = { ...finalcmbData, ...dmdcomcombres, ...qryCmbList, ...depQryCmbList };


    //const cmddata = { ...genres.body, ...comcombres.body, ...dmdcomcombres };

    /* storing grid refs */
    let stagegridrefs = {};

    /* storing grid List */
    let stageGridList = {};



    // const stagefields = Object.keys(stageElements.elms);

    // stagefields.map((item) => {
    //   if (strResponse.body.elms[item].ty === 10) {
    //     stagegridrefs[item] = {};
    //     stageGridList[item] = { isReady: false };
    //   }
    // });

    const checkAndInitialize = (elements, parentKey = '') => {
      Object.keys(elements).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key; // Create a full key path
        const element = elements[key];

        if (key == "FacilityComponentDetails") {


        }

        if (strResponse.body.elms[key].ty === 10) {
          stagegridrefs[key] = {};
          stageGridList[key] = { isReady: false };
        }

        // Check if the element has child elements and recursively process them
        if (element.child) {
          checkAndInitialize(element.child, fullKey);
        }
      });
    };

    // Start the recursive check from the root of stageElements.elms
    checkAndInitialize(stageElements.elms);

    // console.log(stageElementarraydata);
    // elementarraydata.map((item) => {
    //   if (item.elementdata.ty === 10) {
    //     stagegridrefs[item.fieldname] = {};

    //     stageGridList[item.fieldname] = { isReady: false };
    //   }
    // });

    setComboData(cmddata);
    setElements([...stageElementarraydata]);
    setstageElements(stageElements);
    setControlsdata(controlsdata);
    setStageGridRefs(stagegridrefs);
    seteDefHldr(strResponse.body);
    setstageGridList(stageGridList);
    setqdet(qdets);

    console.log("Load Screen Completed");
  };



  const convertDate = (dateObj) => {


    // Extract year, month, and day
    const year = dateObj.getFullYear();
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Months are zero-indexed
    const day = ('0' + dateObj.getDate()).slice(-2);

    // Format to 'YYYY-MM-DD'
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate

  }

  /* Toggle Actions */
  const toggleActions = (key) => {
    document.getElementById("sidePanel").classList.toggle("show");
    document.getElementById(key).classList.toggle("hide");
  };

  /* This is to prevent form from submission on press of enter key */
  const checkKeyDown = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  /* Form Submit */
  const onSubmit = useCallback(async (edata, event) => {
    try {
      console.log("submit called");

      debugger;


      // let data = getValues();
      event.preventDefault();

      //Call Onbefore submit event
      //  const beforeSubmit = await onBeforeSubmit();

      const FormContext = {
        getValues: getValues,
        stageGridRefs: stageGridRefs,
        stageElements: stageElements,
        cntrData: cntrData,
      };

      let qdata = FormDataHelper.ProcessStageelementsData(
        stageElements.elms,
        "",
        FormContext
      );

      setLoanding(false);

      let griddata = {};

      if (combodata["_cmbAction"] && combodata["_cmbAction"].length > 0) {
        const action = getValues("_cmbAction");

        if (!action) {
          toast.error("Action needs to be selected!", "Error!", 2000);

          toggleActions(formkey);

          setactionHighlight("glow-border");

          setLoanding(true);

          return;
        }
      }

      /* for (var key in stageGridRefs) {
      let rows = {};
      stageGridRefs[key].current.api.forEachNode((node) => {
        node.data._rid = node.id;
        rows[node.id] = node.data;
      });
      griddata = { [key]: rows };
    } */

      griddata = FormDataHelper.ProcessStageGridData(FormContext);

      /* Update form data with document id  */
      for (var key in eDefHldr.fil) {
        if (eDefHldr.fil.hasOwnProperty(key)) {
          // qdata[key] = eDefHldr.fil[key]["docid"];
          qdata[key] = {};
          qdata[key]["id"] = eDefHldr.fil[key]["docid"];
          qdata[key]["name"] = watch(key)[0].name;
        }
      }

      //

      //stageGridRefs.gr_CustomerDocuments.current.api.forEachNode(node => rowData.push(node.data));

      griddata = { ["_gridData"]: JSON.stringify(griddata) };
      qdata = { ...qdata, ...griddata };

      //Get Qmovement Data

      let starttime = new Date()

      const Qmovement = {
        _cmbAction: getValues("_cmbAction"),
        _txtComment: getValues("_txtComment"),
        _StartTime: starttime.toISOString()
      };

      qdata["_QMovement"] = Qmovement;
      let evntDet = {};
      evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
      evntDet["scrid"] = eDefHldr.qdet["scrid"];
      evntDet["qid"] = eDefHldr.qdet["qid"];
      evntDet["stgid"] = eDefHldr.qdet["stgid"];
      evntDet["befsubmitmethod"] =
        eDefHldr.stg.sev && eDefHldr.stg.sev?.Screen?.ev?.beforesubmit;
      evntDet["aftsubmitmethod"] =
        eDefHldr.stg.sev && eDefHldr.stg.sev?.Screen?.ev?.aftersubmit;
      evntDet["stagemovemethod"] =
        eDefHldr.stg.sev && eDefHldr.stg.sev?.Screen?.ev?.stagemove;

      let data = getPostData("SubmitQ", qdata, "_sev", evntDet);

      const endpoints = appsettings.ApiEndpoints;

      let result = await api.post(endpoints.SubmitQ, compressBase64(data));

      let strResponse = JSON.parse(decompressBase64(result.data));

      if (strResponse.hdr.rst == "SUCCESS") {
        // Calling after submit event

        setLoanding(true);

        toast.success("Data Submitted!", "Successful!", 2000);

        navigate("/Home");
        // ShowAlert("Success", "Submitted successfully");
      } else {
        setLoanding(true);

        if (strResponse.fdr.length > 0) {
          strResponse.fdr.map((data) => {
            toast.error(data.rstmsg, "Error!", 4000);
          });
        } else {
          toast.error("Something went wrong!", "Error!", 2000);
          //  ShowAlert("Error", "Something went wrong");
        }
      }
    } catch (error) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        console.log("Validation errors:", error.errors);
      } else {
        console.error("An error occurred during form submission:", error);
      }
    }
  });

  /*Form Cancel */
  const onCancel = async () => {
    const result = window.confirm(
      "Are you sure ? , Unsaved data will be lost!"
    );

    if (result) {


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

  /*Form Save */
  const onSave = async () => {


    const FormContext = {
      getValues: getValues,
      stageGridRefs: stageGridRefs,
      stageElements: stageElements,
      cntrData: cntrData,
    };

    let qdata = FormDataHelper.ProcessStageelementsData(
      stageElements.elms,
      "",
      FormContext
    );

    setLoanding(false);

    //  let qdata = getValues();

    let griddata = {};

    // for (var key in stageGridRefs) {
    //   let rowData = {};
    //   stageGridRefs[key].current.api.forEachNode((node) =>
    //     Object.assign(rowData, { [node.data._rid]: node.data })
    //   );
    //   griddata = { [key]: rowData };
    // }

    griddata = FormDataHelper.ProcessStageGridData(FormContext);

    /* Update form data with document id  */


    for (var key in eDefHldr.fil) {
      if (eDefHldr.fil.hasOwnProperty(key)) {
        // qdata[key] = eDefHldr.fil[key]["docid"];
        qdata[key] = {};
        qdata[key]["id"] = eDefHldr.fil[key]["docid"];
        qdata[key]["name"] = watch(key)[0].name;
      }
    }

    griddata = { ["_gridData"]: JSON.stringify(griddata) };

    qdata = { ...qdata, ...griddata };

    var data = getPostData("SaveQ", qdata, "_qdet", eDefHldr.qdet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.SaveQ, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    if (strResponse.hdr.rst == "SUCCESS") {
      setLoanding(true);

      toast.success("Data Saved!", "Successful!", 2000);
    } else {
      setLoanding(true);

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

  /*Form Save Xit */
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

  const docurl = async (fieldname) => {


    let file = watch(fieldname)?.[0];

    if (file?.type == "") {
      file = new Blob([file], { type: "application/octet-stream" });
    }

    if (file?.mode) {
      let docdetails = await getFileDetails(file.id);
      docdetails = new Blob([docdetails], { type: "application/octet-stream" });
      return URL.createObjectURL(docdetails);
    }

    if (file) {
      return URL.createObjectURL(file);
    }
  };

  const Fetchdocurl = async (fieldname) => {


    let file = watch(fieldname)?.[0];

    if (!file) {

      file = eDefHldr?.elmsData?.[fieldname]?.[0];

    }
    if (file?.type == "") {
      file = new Blob([file], { type: "application/octet-stream" });
    }

    if (file?.mode) {
      let docdetails = await getFileDetails(file.id);
      docdetails = new Blob([docdetails], { type: "application/octet-stream" });
      return URL.createObjectURL(docdetails);
    }

    if (file) {
      return URL.createObjectURL(file);
    }
  };

  const getFileDetails = async (docId) => {
    const endpoints = appsettings.ApiEndpoints;
    let docurl = null;
    if (qid) {
      docurl = endpoints.dwnld + "?qid=" + qid + "&docid=" + docId;
    }
    if (!qid) {
      docurl = endpoints.dwnld + "?docid=" + docId;
    }

    let response = await api.get(docurl, {
      responseType: "blob", // Set responseType to 'blob'
    });
    let docdetails = response.data;
    return docdetails;
  };

  const Setdocfield = (fieldname) => {
    setdocField(null);
  };

  useEffect(() => {

    if (docField) {

      fetchDocURL();

    }
  }, [watch(docField)?.[0]]);

  const fetchDocURL = async () => {
    debugger;
    const docURL = await docurl(docField);
    setDocURL(docURL);
  };

  useEffect(() => {
    console.log("Starting Rendering Screen", Date(Date.now()));
    reset({});
    loadScreen();
    Setup();
    //loadCombodata();
    console.log("Completed Rendering Screen", Date(Date.now()));
    return;
  }, [scrid]);

  useEffect(() => {
    // Check if all required variables are defined before calling onFormLoad



    if (!formLoad && eDefHldr && getValues && stageGridRefs && setValue) {

      const isAllGridReady = Object.values(gridList).every(
        (obj) => obj.isReady === true
      );

      if (isAllGridReady) {
        debugger;
        console.log("formload called")

        onFormLoad();
      }
    }
  }, [eDefHldr, getValues, stageGridRefs, setValue, () => gridList]);

  const onFormLoad = async () => {


    setIsFormLoad(true);

    let method = "Screen_" + eDefHldr.qdet["stgid"] + "_OnLoad";

    const FormContextdata = {
      getValues: getValues,
      stageGridRefs: stageGridRefs,
      stageElements: stageElements,
      cntrData: cntrData,
      combodata,
      setComboData,
      setEventLoading,
      modalVisible,
      setModalVisible,
      multiSearchData,
      setMultiSearchData,
      eDefHldr
    };


    await ServerEventCaller(
      eDefHldr,
      getValues(),
      method,
      stageGridRefs,
      setValue,
      FormContextdata,
      seteDefHldr
    );

    setLoanding(true);
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    // Trigger toast notification only once
    React.useEffect(() => {
      toast.error("Error in Rendering Form!", "Error!", { autoClose: 2000 });
    }, []);
  };

  /* Checking If form has is valid to submit */
  useEffect(() => {
    if (!isValid && isSubmitting) {

      console.log(errors);
      toast.error("mandatory fields required", "Error!", 2000);
    }
  }, [isSubmitting]);

  const onBeforeSubmit = async () => {


    const beforesubmit = eDefHldr.stg.sev["Screen"]?.ev?.beforesubmit;

    if (beforesubmit) {
      let method = beforesubmit;

      const FormContext = {
        getValues: getValues,
        stageGridRefs: stageGridRefs,
        stageElements: stageElements,
        cntrData: cntrData,
      };

      try {
        await ServerEventCaller(
          eDefHldr,
          getValues(),
          method,
          stageGridRefs,
          setValue,
          FormContext,
          seteDefHldr
        );
      } catch (error) {
        console.error("Error in onBeforeSubmit:", error);
        throw error;
      }
    } else {
      // If beforesubmit is falsy, you might want to return a resolved promise
      return Promise.resolve();
    }

    return true;
  };

  const onAfterSubmit = async () => {


    const aftersubmit = eDefHldr.stg.sev["Screen"]?.ev?.aftersubmit;

    if (aftersubmit) {
      let method = aftersubmit;

      const FormContext = {
        getValues: getValues,
        stageGridRefs: stageGridRefs,
        stageElements: stageElements,
        cntrData: cntrData,
      };

      try {
        await ServerEventCaller(
          eDefHldr,
          getValues(),
          method,
          stageGridRefs,
          setValue,
          FormContext,
          seteDefHldr
        );
      } catch (error) {
        console.error("Error in onBeforeSubmit:", error);
        return false;
      }
    } else {
      // If beforesubmit is falsy, you might want to return a resolved promise
      return true;
    }
    return true;
  };

  try {
    return (
      <>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {!isLoading ? <Spinner></Spinner> : ""}
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
                gridList,
                setstageGridList,
                eDefHldr,
                setdocField,
                actionHighlight,
                setEventLoading,
                Fetchdocurl,
                seteDefHldr,
                modalVisible,
                setModalVisible,
                multiSearchData,
                setMultiSearchData,
                currentGridRowData,
                setcurrentGridRowData,
                qdets
              }}
            >
              {isEventLoading && <LoadinLine />}

              <form
                onSubmit={handleSubmit(onSubmit)} onKeyDown={(e) => checkKeyDown(e)}
                id={formKey}
                className="form-container form-control-sm"
                key={formKey}
              >



                <nav id="onescreenmainNav" className="navbar navbar-expand-lg navbar-light bg-light mb-4" style={{ position: "sticky", top: "60px", zIndex: 1020 }}>
                  <div className="container-fluid">
                    <div className="navbar-brand">

                      {" "}
                      {eDefHldr &&
                        eDefHldr.qdet.scrname +
                        " (" +
                        eDefHldr.qdet.stgname +
                        ")"}{" "}

                    </div>


                    <div className="d-flex">
                      <button
                        className="btn btn-hover color-5 btn-sm  m-2"
                        type="submit"
                      // onClick={(e) => onSubmit(e)}
                      >
                        Submit
                      </button>
                      <button
                        className="btn btn-hover color-3 btn-sm m-2"
                        type="button"
                        onClick={() => onSave()}
                      >
                        Save
                      </button>
                      {/* <button
                      className="btn btn btn-hover color-10 btn-sm m-2"
                      type="button"
                      onClick={() => onSaveXit()}
                    >
                      Save & X-it
                    </button> */}
                      <button
                        className="btn btn btn-hover color-10 btn-sm  m-2"
                        type="button"
                        onClick={() => onCancel()}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-hover color-9 btn-sm  m-2"
                        type="button"
                        onClick={() => toggleActions(formkey)}
                      >
                        Actions
                      </button>
                    </div>
                  </div>
                </nav>
                <div className="form-content">
                  {/* {elements.map((item) => (
                    <OneScreen
                      dataprops={item.elementdata}
                      key={item.fieldname}
                      fieldname={item.fieldname}
                      stagelementdata={stageElements}
                      elementdefs={cntrData}
                    />
                  ))} */}

                  {/* <RenderUI data={dynamicdata.body.stg.ui} /> */}
                  <RenderUI
                    data={stageElements.ui}
                    elements={elements}
                    stageElements={stageElements}
                    cntrData={cntrData}
                  />
                  <MultiSearchControl></MultiSearchControl>
                </div>
                <div
                  className="side-panel  shadow  justify-content-center"
                  id="sidePanel"
                >
                  <Sidepanel scrid={scrid} qid={qid} />
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
                  {watch(docField)[0] && docURL && (
                    <DocViewer
                      //localUrl={docurl(docField)}
                      localUrl={docURL}
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
        </ErrorBoundary>
      </>
    );
  } catch (ex) {
    console.log("error occured ", ex);
    toast.error("Error in Rendering Form!", "Error!", 2000);
  }
};



export default RenderScreen;


