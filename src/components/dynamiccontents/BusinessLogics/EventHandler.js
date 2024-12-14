import { FetchCombodata } from "../../utilities/combodata";
import { getPostData } from "../../utilities/apidataformatter";
import appsettings from "../../../appsettings.json";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../../utilities/utils";
import api from "../../api/Webcall";
import FormDataHelper from "./FormDataHelper";
import { toast } from "react-toastify";

var context = {};

const reloadCombo = async (
  srcElementname,
  setValuepar,
  getValues,
  setValue,
  setConmddata,
  elements
) => {
  try {
    // setValuepar = "cmb_Province";

    debugger;

    const cmbelementdata = elements.find(
      (e) => e.fieldname == setValuepar
    ).elementdata;

    const opt = "|" + cmbelementdata.cod + "|";

    const regex = /\$\#\w+\#\$/gi;

    const found = cmbelementdata.con.match(regex);

    const val = cmbelementdata.con.replace(
      found[0],
      getValues(found[0].replace("$#", "").replace("#$", ""))
    );
    const cod = cmbelementdata.cod.toLocaleUpperCase();
    const ctr = cmbelementdata.cstr;
    let optw = {};

    optw = { [cod]: val };

    const comcombres = await FetchCombodata(opt, optw, ctr);

    const finalcmbData = {};

    if (comcombres.body[cmbelementdata.cod].length > 0) {
      finalcmbData[setValuepar] = comcombres.body[cmbelementdata.cod];
      const cmddata = { ...setValue, ...finalcmbData };
      setConmddata(cmddata);
    } else {
      comcombres.body[cmbelementdata.cod] = [];

      finalcmbData[setValuepar] = comcombres.body[cmbelementdata.cod];

      const cmddata = { ...setValue, ...finalcmbData };

      setConmddata(cmddata);
    }
  } catch {
    console.log("Error in loading combo data ");
  }
};

const extractFilename = (fileText) => {
  const [fileId, fileName] = fileText.split("|");

  return { fileId, fileName };
};
/* Initialize the Functions */
export const Setup = () => {
  context["reloadCombo"] = reloadCombo;
};

// this is the method performing execution of functions
function execFn(fnName, ctx /*, args */) {
  // get passed arguments except first two (fnName, ctx)
  var args = Array.prototype.slice.call(arguments, 2);
  // execute the function with passed parameters and return result
  return ctx[fnName].apply(ctx, args);
}

// Date Conversion 

const convertDate = (dateObj) => {

  // Extract year, month, and day
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Months are zero-indexed
  const day = ('0' + dateObj.getDate()).slice(-2);

  // Format to 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate

}

export const EventCaller = (
  funcname,
  srcElementname,
  setValuepar,
  getValues,
  setValue,
  setConmddata,
  elements
) => {
  execFn(
    funcname,
    context,
    srcElementname,
    setValuepar,
    getValues,
    setValue,
    setConmddata,
    elements
  );
};

export const ServerEventCaller = async (
  eDefHldr,
  frmData,
  v,
  stageGridRefs,
  setValue,
  FormContext,
  seteDefHldr
) => {
  let setEventLoading = FormContext.setEventLoading;

  try {
    debugger;

    var evntDet = {};

    let griddata = {};

    griddata = FormDataHelper.ProcessStageGridData(FormContext);

    // for (var key in stageGridRefs) {
    //   let rowData = {};
    //   stageGridRefs[key].current.api.forEachNode(node => Object.assign(rowData, { [node.data.rowid]: node.data }));
    //   griddata = { [key]: rowData }
    // };

    /*Setting Event Loading Animation */
    setEventLoading(true);

    griddata = { ["_gridData"]: JSON.stringify(griddata) };

    frmData = FormDataHelper.ProcessStageelementsData(
      FormContext.stageElements.elms,
      "",
      FormContext
    );

    /* Update form data with document id  */
    for (var key in eDefHldr.fil) {
      if (eDefHldr.fil.hasOwnProperty(key)) {
        // qdata[key] = eDefHldr.fil[key]["docid"];
        frmData[key] = {};
        frmData[key]["id"] = eDefHldr.fil[key]["docid"];
        frmData[key]["name"] = FormContext.getValues(key)[0].name;
      }
    }

    frmData = { ...frmData, ...griddata };

    evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
    evntDet["scrid"] = eDefHldr.qdet["scrid"];
    evntDet["stgid"] = eDefHldr.qdet["stgid"];
    evntDet["method"] = v;
    evntDet["qid"] = eDefHldr.qdet["qid"];
    evntDet["_rid"] = "";
    evntDet["_pgr_rid"] = "";

    var data = getPostData("Call:" + v, frmData, "_sev", evntDet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.ServerEvent, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    if (result.status == 200 && strResponse.hdr.rst == "SUCCESS") {
      /* Reload Combo */

      let neweDefHldr = { ...eDefHldr }

      if (strResponse.body["_reloadcmb"]) {
        let data = {};

        let key = "_reloadcmb";

        strResponse.body[key].forEach((element) => {
          let finalcmbData = {};

          //  let cod = FormContext.cntrData[element.elm].cod;

          finalcmbData[element.elm] = element.data;

          //finalcmbData[element.elm] = cod;

          //data = { ...data ,  [cod] : element.data }

          data = { ...data, ...finalcmbData };
        });

        const cmddata = { ...FormContext.combodata, ...data };

        console.log(cmddata);
        await FormContext.setComboData(cmddata);
      }

      if (strResponse.body["_mltsrch"]) {

        
        FormContext.setMultiSearchData(strResponse.body["_mltsrch"]);

        FormContext.setModalVisible(true);


      }
      // Wait for the next render cycle before setting values
      requestAnimationFrame(() => {
        for (let key in strResponse.body) {
          if (key == "_prp") {

            strResponse.body._prp.forEach((item , index) => {
              const fieldKey = Object.keys(item)[0];

              neweDefHldr.stg.prp[fieldKey] = strResponse.body._prp[index][fieldKey]
            });


          }
          if (key == "gridData") {
            for (let gridKey in strResponse.body.gridData) {
              let newdata = Object.keys(strResponse.body.gridData[gridKey]).map(
                (item) => {
                  return {
                    ...strResponse.body.gridData[gridKey][item],
                    _IsDel: false, // Set _IsDel to false
                  };
                }
              );

              // stageGridRefs[gridKey].current.api.setRowdata(newdata); // This has bee removed in new ag grid version
              const allRowNodes = [];
              stageGridRefs[gridKey].current.api.forEachNode((node) => allRowNodes.push(node.data));
              stageGridRefs[gridKey].current.api.applyTransaction({ remove: allRowNodes });
              stageGridRefs[gridKey].current.api.applyTransaction({ add: newdata });

              stageGridRefs[gridKey].current.api.autoSizeAllColumns();
              // stageGridRefs[gridKey].current.api.redrawRows();
            }
          }
          //set Combo values
          if (FormContext.cntrData[key]?.ty == 4) {
            const dateValue = new Date(strResponse.body[key]);

            //const formattedDate = dateValue.toISOString().split("T")[0];

            const formattedDate = convertDate(dateValue)

            eDefHldr.stg.elms[key] && setValue(key, formattedDate);

            if (eDefHldr.stg.elms[key]) {

              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = formattedDate;
            }


          } else if (FormContext.cntrData[key]?.ty == 9) {
            let filedetails = [];
            filedetails.push({
              id: strResponse.body[key] && extractFilename(strResponse.body[key])?.fileId,
              name: strResponse.body[key] && extractFilename(strResponse.body[key])?.fileName,
              mode: "Qdata",
            });
            if (eDefHldr.stg.elms[key]) {

              setValue(key, filedetails ,  { shouldValidate: true });

            }
            else if(eDefHldr.elms[key]) {
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = filedetails;
            }

          } else if (FormContext.cntrData[key]?.ty == 3) {

            if (eDefHldr.stg.elms[key]) {

              setValue(key, strResponse.body[key], true);
            }
            else if(eDefHldr.elms[key]) {
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = strResponse.body[key];
            }

          }
          else {
            //Set Other data
            if (eDefHldr.stg.elms[key]) {

              setValue(key, strResponse.body[key] , { shouldValidate: true });
            }

            else if(eDefHldr.elms[key]) {
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = strResponse.body[key];
            }


          }
        }

        
      //Update State to referesh the properties
      seteDefHldr(neweDefHldr);

      });


    }

    //This will trigger stop event
    if (result.status == 200 && strResponse.hdr.rst == "STOP") {
      for (let key in strResponse.body) {
        if (key == "gridData") {
          for (let gridKey in strResponse.body.gridData) {
            let newdata = Object.keys(strResponse.body.gridData[gridKey]).map(
              (item) => {
                return {
                  ...strResponse.body.gridData[gridKey][item],
                  _IsDel: false, // Set _IsDel to false
                };
              }
            );

            stageGridRefs[gridKey].current.api.applyTransaction({ add: newdata });

            stageGridRefs[gridKey].current.api.autoSizeAllColumns();
            // stageGridRefs[gridKey].current.api.redrawRows();
          }
        }
        //set Combo values
        if (key == "_reloadcmb") {
          let data = {};

          strResponse.body[key].forEach((element) => {
            let finalcmbData = {};

            //  let cod = FormContext.cntrData[element.elm].cod;

            finalcmbData[element.elm] = element.data;

            //finalcmbData[element.elm] = cod;

            //data = { ...data ,  [cod] : element.data }

            data = { ...data, ...finalcmbData };
          });

          const cmddata = { ...FormContext.combodata, ...data };

          console.log(cmddata);
          FormContext.setComboData(cmddata);
        }
        //Set Data value
        if (FormContext.cntrData[key]?.ty == 4) {
          const dateValue = new Date(strResponse.body[key]);

          // const formattedDate = dateValue.toISOString().split("T")[0];

          const formattedDate = convertDate(dateValue)

          eDefHldr.stg.elms[key] && setValue(key, formattedDate);
        } else if (FormContext.cntrData[key]?.ty == 9) {
          let filedetails = [];
          filedetails.push({
            id: extractFilename(strResponse.body[key])?.fileId,
            name: extractFilename(strResponse.body[key])?.fileName,
            mode: "Qdata",
          });
          eDefHldr.stg.elms[key] && setValue(key, filedetails);
        } else {
          //Set Other data
          eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);
        }
      }

      strResponse.fdr.forEach((item) => {
        setEventLoading(false);

        toast.error(item.rstmsg, "Error!", 2000);
      });
    }


    setEventLoading(false);
  } catch (ex) {
    setEventLoading(false);
  }
};

export const MultiSearchServerEventCaller = async (
  eDefHldr,
  frmData,
  v,
  stageGridRefs,
  setValue,
  FormContext,
  seteDefHldr,
  selectedRowData
) => {
  let setEventLoading = FormContext.setEventLoading;

  try {
    debugger;

    var evntDet = {};

    let griddata = {};

    // griddata = FormDataHelper.ProcessStageGridData(FormContext);

    // for (var key in stageGridRefs) {
    //   let rowData = {};
    //   stageGridRefs[key].current.api.forEachNode(node => Object.assign(rowData, { [node.data.rowid]: node.data }));
    //   griddata = { [key]: rowData }
    // };

    /*Setting Event Loading Animation */
    setEventLoading(true);

    // griddata = { ["_gridData"]: JSON.stringify(griddata) };

    // frmData = FormDataHelper.ProcessStageelementsData(
    //   FormContext.stageElements.elms,
    //   "",
    //   FormContext
    // );

    /* Update form data with document id  */
    // for (var key in eDefHldr.fil) {
    //   if (eDefHldr.fil.hasOwnProperty(key)) {
    //     // qdata[key] = eDefHldr.fil[key]["docid"];
    //     frmData[key] = {};
    //     frmData[key]["id"] = eDefHldr.fil[key]["docid"];
    //     frmData[key]["name"] = FormContext.getValues(key)[0].name;
    //   }
    // }

    var othParam = { ...selectedRowData };
    frmData = { "_othParams": othParam };

    evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
    evntDet["scrid"] = eDefHldr.qdet["scrid"];
    evntDet["stgid"] = eDefHldr.qdet["stgid"];
    evntDet["method"] = v;
    evntDet["qid"] = eDefHldr.qdet["qid"];
    evntDet["_rid"] = "";
    evntDet["_pgr_rid"] = "";

    var data = getPostData("Call:" + v, frmData, "_sev", evntDet);

    const endpoints = appsettings.ApiEndpoints;

    let result = await api.post(endpoints.ServerEvent, compressBase64(data));

    let strResponse = JSON.parse(decompressBase64(result.data));

    if (result.status == 200 && strResponse.hdr.rst == "SUCCESS") {
      /* Reload Combo */

      let neweDefHldr = { ...eDefHldr }

      if (strResponse.body["_reloadcmb"]) {
        let data = {};

        let key = "_reloadcmb";

        strResponse.body[key].forEach((element) => {
          let finalcmbData = {};

          //  let cod = FormContext.cntrData[element.elm].cod;

          finalcmbData[element.elm] = element.data;

          //finalcmbData[element.elm] = cod;

          //data = { ...data ,  [cod] : element.data }

          data = { ...data, ...finalcmbData };
        });

        const cmddata = { ...FormContext.combodata, ...data };

        console.log(cmddata);
        await FormContext.setComboData(cmddata);
      }

      if (strResponse.body["_mltsrch"]) {

        FormContext.setModalVisible(true);

        FormContext.setMultiSearchData(strResponse.body["_mltsrch"]);

      }
      // Wait for the next render cycle before setting values
      requestAnimationFrame(() => {
        for (let key in strResponse.body) {
          if (key == "_prp") {
            strResponse.body._prp.forEach((item , index)=> {
              const fieldKey = Object.keys(item)[0];

              neweDefHldr.stg.prp[fieldKey] = strResponse.body._prp[index][fieldKey]
            });

          }
          if (key == "gridData") {
            for (let gridKey in strResponse.body.gridData) {
              let newdata = Object.keys(strResponse.body.gridData[gridKey]).map(
                (item) => {
                  return {
                    ...strResponse.body.gridData[gridKey][item],
                    _IsDel: false, // Set _IsDel to false
                  };
                }
              );

              stageGridRefs[gridKey].current.api.applyTransaction({ add: newdata });

              stageGridRefs[gridKey].current.api.autoSizeAllColumns();
              // stageGridRefs[gridKey].current.api.redrawRows();
            }
          }
          //set Combo values
          if (FormContext.cntrData[key]?.ty == 4) {
            const dateValue = new Date(strResponse.body[key]);

            //const formattedDate = dateValue.toISOString().split("T")[0];

            const formattedDate = convertDate(dateValue)

            if (eDefHldr.stg.elms[key]) {
              setValue(key, formattedDate);
            }
            else if(eDefHldr.elms[key]){
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = formattedDate;
            }
          } else if (FormContext.cntrData[key]?.ty == 9) {
            let filedetails = [];
            filedetails.push({
              id: strResponse.body[key] && extractFilename(strResponse.body[key])?.fileId,
              name: strResponse.body[key] && extractFilename(strResponse.body[key])?.fileName,
              mode: "Qdata",
            });
            if (eDefHldr.stg.elms[key]) {

              setValue(key, filedetails);
            }
            else if(eDefHldr.elms[key]){
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = filedetails;
            }

          } else if (FormContext.cntrData[key]?.ty == 3) {

            if (eDefHldr.stg.elms[key]) {

              setValue(key, strResponse.body[key], true);
            }

            else if(eDefHldr.elms[key]) {
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = strResponse.body[key];
            }

          }
          else {
            //Set Other data
            if (eDefHldr.stg.elms[key]) {
              setValue(key, strResponse.body[key]);
            }
            else if(eDefHldr.elms[key]) {
              neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
              neweDefHldr['elmsData'][key] = strResponse.body[key];
            }


          }
        }

        //Update State to referesh the properties
        seteDefHldr(neweDefHldr);
      });


    }

    //This will trigger stop event
    if (result.status == 200 && strResponse.hdr.rst == "STOP") {
      for (let key in strResponse.body) {
        if (key == "gridData") {
          for (let gridKey in strResponse.body.gridData) {
            let newdata = Object.keys(strResponse.body.gridData[gridKey]).map(
              (item) => {
                return {
                  ...strResponse.body.gridData[gridKey][item],
                  _IsDel: false, // Set _IsDel to false
                };
              }
            );

            stageGridRefs[gridKey].current.api.applyTransaction({ add: newdata });

            stageGridRefs[gridKey].current.api.autoSizeAllColumns();
            // stageGridRefs[gridKey].current.api.redrawRows();
          }
        }
        //set Combo values
        if (key == "_reloadcmb") {
          let data = {};

          strResponse.body[key].forEach((element) => {
            let finalcmbData = {};

            //  let cod = FormContext.cntrData[element.elm].cod;

            finalcmbData[element.elm] = element.data;

            //finalcmbData[element.elm] = cod;

            //data = { ...data ,  [cod] : element.data }

            data = { ...data, ...finalcmbData };
          });

          const cmddata = { ...FormContext.combodata, ...data };

          console.log(cmddata);
          FormContext.setComboData(cmddata);
        }
        //Set Data value
        if (FormContext.cntrData[key]?.ty == 4) {
          const dateValue = new Date(strResponse.body[key]);

          // const formattedDate = dateValue.toISOString().split("T")[0];

          const formattedDate = convertDate(dateValue)

          eDefHldr.stg.elms[key] && setValue(key, formattedDate);
        } else if (FormContext.cntrData[key]?.ty == 9) {
          let filedetails = [];
          filedetails.push({
            id: extractFilename(strResponse.body[key])?.fileId,
            name: extractFilename(strResponse.body[key])?.fileName,
            mode: "Qdata",
          });
          eDefHldr.stg.elms[key] && setValue(key, filedetails);
        } else {
          //Set Other data
          eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);
        }
      }

      strResponse.fdr.forEach((item) => {
        setEventLoading(false);

        toast.error(item.rstmsg, "Error!", 2000);
      });
    }

    setEventLoading(false);
  } catch (ex) {
    setEventLoading(false);
  }
};

export const GridEventCaller = async (
  eDefHldr,
  frmData,
  v,
  stageGridRefs,
  setValue,
  gridName,
  FormContext,
  rowId,
  popupField,
  rownode,
  seteDefHldr
) => {
  debugger;

  var evntDet = {};

  let griddata = {};

  griddata = FormDataHelper.ProcessStageGridData(FormContext);

  griddata = { ["_gridData"]: JSON.stringify(griddata) };

  frmData = FormDataHelper.ProcessStageelementsData(
    FormContext.stageElements.elms,
    "",
    FormContext
  );

  frmData = { ...frmData, ...griddata };

  evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
  evntDet["scrid"] = eDefHldr.qdet["scrid"];
  evntDet["stgid"] = eDefHldr.qdet["stgid"];
  evntDet["method"] = v;
  evntDet["qid"] = eDefHldr.qdet["qid"];
  evntDet["_rid"] = rowId;
  evntDet["_pgr_rid"] = "";

  var data = getPostData("Call:" + v, frmData, "_sev", evntDet);

  const endpoints = appsettings.ApiEndpoints;

  let result = await api.post(endpoints.ServerEvent, compressBase64(data));

  let strResponse = JSON.parse(decompressBase64(result.data));
  
  let neweDefHldr = { ...eDefHldr }


  if (result.status == 200 && strResponse.hdr.rst == "SUCCESS") {

    if (strResponse.body["_reloadcmb"]) {
      let data = {};

      let key = "_reloadcmb";

      strResponse.body[key].forEach((element) => {
        let finalcmbData = {};

        //  let cod = FormContext.cntrData[element.elm].cod;

        finalcmbData[element.elm] = element.data;

        //finalcmbData[element.elm] = cod;

        //data = { ...data ,  [cod] : element.data }

        data = { ...data, ...finalcmbData };
      });

      const cmddata = { ...FormContext.combodata, ...data };

      console.log(cmddata);
      await FormContext.setComboData(cmddata);
    }


    
    for (let key in strResponse.body) {

  

      if (key === "gridData") {
        for (let gridKey in strResponse.body.gridData) {
          let rowData = [];
      
          stageGridRefs[gridKey].current.api.forEachNode((node) =>
            rowData.push(node.data)
          );
      
          Object.keys(strResponse.body.gridData).forEach((item) => {
            for (let rowid in strResponse.body.gridData[item]) {
              rowData = rowData.map(row => {
                if (row._rid === rowid) {
                  return { ...row, ...strResponse.body.gridData[item][rowid] };
                }
                return row;
              });
            }
          });
      
          stageGridRefs[gridKey].current.api.applyTransaction({ update: rowData });

          //stageGridRefs[gridKey].current.api.setRowData(rowData);
          stageGridRefs[gridKey].current.columnApi.autoSizeAllColumns();
        }
      }

      if (eDefHldr.stg.elms[key]) {

        eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);

      }

      else if(eDefHldr.elms[key]) {
        neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
        neweDefHldr['elmsData'][key] = strResponse.body[key];
      }
    }
  }

  if (result.status == 200 && strResponse.hdr.rst == "STOP") {
    for (let key in strResponse.body) {
      if (key == "gridData") {
        for (let gridKey in strResponse.body.gridData) {
          let rowData = [];

          stageGridRefs[gridKey].current.api.forEachNode((node) =>
            rowData.push(node.data)
          );

          let newdata = Object.keys(strResponse.body.gridData).map((item) => {
            // return { ...strResponse.body.gridData[item] };

            const key = Object.keys(strResponse.body.gridData[item])[0];
            const transformedData = strResponse.body.gridData[item][key];

            rowData.push(transformedData);
          });

          stageGridRefs[gridKey].current.api.setRowData(rowData);

          stageGridRefs[gridKey].current.columnApi.autoSizeAllColumns();
          // stageGridRefs[gridKey].current.api.redrawRows();
        }
      }
      if (eDefHldr.stg.elms[key]) {

        eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);

      }

      else if(eDefHldr.elms[key]) {
        neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
        neweDefHldr['elmsData'][key] = strResponse.body[key];
      }


    }

    strResponse.fdr.forEach((item) => {
      toast.error(item.rstmsg, "Error!", 2000);
    });
  }

  seteDefHldr(neweDefHldr);
};

/* Grid Child Event Caller - This will be used for the event occuring inside the grid elements*/
export const GridChildEventCaller = async (
  eDefHldr,
  frmData,
  v,
  stageGridRefs,
  setValue,
  gridName,
  FormContext,
  rowId,
  popupField
) => {
  debugger;

  var evntDet = {};

  let griddata = {};

  griddata = FormDataHelper.ProcessStageGridData(FormContext);

  griddata = { ["_gridData"]: JSON.stringify(griddata) };

  frmData = FormDataHelper.ProcessStageelementsData(
    FormContext.stageElements.elms,
    "",
    FormContext
  );

  frmData = { ...frmData, ...griddata };

  evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
  evntDet["scrid"] = eDefHldr.qdet["scrid"];
  evntDet["stgid"] = eDefHldr.qdet["stgid"];
  evntDet["method"] = v;
  evntDet["qid"] = eDefHldr.qdet["qid"];
  evntDet["_rid"] = rowId;
  evntDet["_pgr_rid"] = "";

  var data = getPostData("Call:" + v, frmData, "_sev", evntDet);

  const endpoints = appsettings.ApiEndpoints;

  let result = await api.post(endpoints.ServerEvent, compressBase64(data));

  let strResponse = JSON.parse(decompressBase64(result.data));

  if (result.status == 200 && strResponse.hdr.rst == "SUCCESS") {
    for (let key in strResponse.body) {
      if (key == "gridData") {
        for (let gridKey in strResponse.body.gridData) {
          let rowData = [];

          stageGridRefs[gridKey].current.api.forEachNode((node) =>
            rowData.push(node.data)
          );

          let newdata = Object.keys(strResponse.body.gridData).map((item) => {
            // return { ...strResponse.body.gridData[item] };

            const key = Object.keys(strResponse.body.gridData[item])[0];
            const transformedData = {
              ...strResponse.body.gridData[item][key],
              _IsDel: false,
            };

            rowData.push(transformedData);
          });

          stageGridRefs[gridKey].current.api.setRowData(rowData);

          stageGridRefs[gridKey].current.columnApi.autoSizeAllColumns();
          // stageGridRefs[gridKey].current.api.redrawRows();
        }
      }
      //eDefHldr.stg.elms[gridName].child[popupField].child[key] = strResponse.body[key]
      eDefHldr.stg.elms[gridName].child[popupField].child[key] &&
        setValue(key, strResponse.body[key]);
    }
  }

  if (result.status == 200 && strResponse.hdr.rst == "STOP") {
    for (let key in strResponse.body) {
      if (key == "gridData") {
        for (let gridKey in strResponse.body.gridData) {
          let rowData = [];

          stageGridRefs[gridKey].current.api.forEachNode((node) =>
            rowData.push(node.data)
          );

          let newdata = Object.keys(strResponse.body.gridData).map((item) => {
            // return { ...strResponse.body.gridData[item] };

            const key = Object.keys(strResponse.body.gridData[item])[0];
            const transformedData = strResponse.body.gridData[item][key];

            rowData.push(transformedData);
          });

          stageGridRefs[gridKey].current.api.setRowData(rowData);

          stageGridRefs[gridKey].current.columnApi.autoSizeAllColumns();
          // stageGridRefs[gridKey].current.api.redrawRows();
        }
      }

      eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);
    }

    strResponse.fdr.forEach((item) => {
      toast.error(item.rstmsg, "Error!", 2000);
    });
  }
};

/* Grid Child Event Caller - This will be used for the event occuring inside the grid elements*/
export const GridChildEventCallerOnSave = async (
  eDefHldr,
  frmData,
  v,
  stageGridRefs,
  setValue,
  gridName,
  FormContext,
  rowId,
  popupField,
  rownode
) => {
  debugger;

  var evntDet = {};

  let griddata = {};

  griddata = FormDataHelper.ProcessStageGridData(FormContext);

  griddata = { ["_gridData"]: JSON.stringify(griddata) };

  frmData = FormDataHelper.ProcessStageelementsData(
    FormContext.stageElements.elms,
    "",
    FormContext
  );

  frmData = { ...frmData, ...griddata };

  evntDet["scrverid"] = eDefHldr.qdet["scrverid"];
  evntDet["scrid"] = eDefHldr.qdet["scrid"];
  evntDet["stgid"] = eDefHldr.qdet["stgid"];
  evntDet["method"] = v;
  evntDet["qid"] = eDefHldr.qdet["qid"];
  evntDet["_rid"] = rowId;
  evntDet["_pgr_rid"] = "";

  var data = getPostData("Call:" + v, frmData, "_sev", evntDet);

  const endpoints = appsettings.ApiEndpoints;

  let result = await api.post(endpoints.ServerEvent, compressBase64(data));

  let strResponse = JSON.parse(decompressBase64(result.data));

  if (result.status == 200 && strResponse.hdr.rst == "SUCCESS") {
    for (let key in strResponse.body) {
      //eDefHldr.stg.elms[gridName].child[popupField].child[key] = strResponse.body[key]
      eDefHldr.stg.elms[gridName].child[key] &&
        rownode.setDataValue(key, strResponse.body[key]);
    }
  }

  if (result.status == 200 && strResponse.hdr.rst == "STOP") {
    for (let key in strResponse.body) {
      if (key == "gridData") {
        for (let gridKey in strResponse.body.gridData) {
          let rowData = [];

          stageGridRefs[gridKey].current.api.forEachNode((node) =>
            rowData.push(node.data)
          );

          let newdata = Object.keys(strResponse.body.gridData).map((item) => {
            // return { ...strResponse.body.gridData[item] };

            const key = Object.keys(strResponse.body.gridData[item])[0];
            const transformedData = strResponse.body.gridData[item][key];

            rowData.push(transformedData);
          });

          stageGridRefs[gridKey].current.api.setRowData(rowData);

          stageGridRefs[gridKey].current.columnApi.autoSizeAllColumns();
          // stageGridRefs[gridKey].current.api.redrawRows();
        }
      }

      eDefHldr.stg.elms[key] && setValue(key, strResponse.body[key]);
    }

    strResponse.fdr.forEach((item) => {
      toast.error(item.rstmsg, "Error!", 2000);
    });
  }
};

export default Setup;
