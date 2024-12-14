import React, { useContext, useState, useEffect , useRef } from "react";
//import safeEval from "safe-eval";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller, GridEventCaller } from "../BusinessLogics/EventHandler";
import { compressBase64 } from "../../utilities/utils";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { FetchCombodata, FetchQryCombodata } from "../../utilities/combodata";
const ComboBox = ({ eid, fieldname, cap, col, mn, ev, val, cod, rid }) => {
  const {
    register,
    getValues,
    setValue,
    combodata,
    setComboData,
    elements,
    eDefHldr,
    stageGridRefs,
    watch,
    trigger,
    stageElements,
    cntrData,
    setEventLoading,
    control,
    seteDefHldr,
    formState: { errors },
    modalVisible,
    setModalVisible,
    multiSearchData,
    setMultiSearchData,
    currentGridRowData,
    qdets
  } = useContext(FormContext);

  const eDefHldrRef = useRef(eDefHldr);

  useEffect(() => {
    eDefHldrRef.current = eDefHldr; // Keep ref updated with latest state
}, [eDefHldr]);

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
    eDefHldr : eDefHldrRef.current
  };

  // setValue(fieldname, val);
  //useEffect(() => {}, [val]);

  // useEffect(() => {
  //   val = watch(fieldname);

  //   console.log("wathc called");
  // }, [watch(fieldname)]);

  function loadCombo(elementName) {
    EventCaller(
      "reloadCombo",
      fieldname,
      elementName,
      getValues,
      combodata,
      setComboData,
      elements
    );
  }

  /* This function will return if the grid name based on the grid child control , so based on this it will decided whether to call grid event */
  function findParent(elementName, elements) {
    // Loop through each element in the given structure
    for (let [key, value] of Object.entries(elements)) {
      // If the current key matches the element name, return null (no parent)
      if (key === elementName) {
        return null; // root element, no parent
      }

      // If the current element has a "child" object, recurse into it
      if (value.child) {
        // Check if the element is found within the children
        if (elementName in value.child) {
          return key; // Return the parent key
        }

        // Recurse into the child object to keep searching for the element
        const parent = findParent(elementName, value.child);
        if (parent) {
          return parent; // If found in recursion, return the parent
        }
      }
    }

    return null; // If no parent is found
  }

  useEffect(() => {
    setValue(fieldname, val);
  }, [val]);

  useEffect(() => {
    // Reset the form value when new options are loaded


    if (Array.isArray(combodata)) {
      if (
        !val &&
        !combodata[fieldname].find((option) => option.k == watch(fieldname))
      ) {
        setValue(fieldname, ""); // Reset the value to empty string
      } else if (
        val &&
        watch(fieldname) &&
        !combodata[fieldname].find((option) => option.k == watch(fieldname))
      ) {
        setValue(fieldname, ""); // Reset the value to empty string
      }
    }
  }, [combodata[fieldname]]); // Trigger when options are loaded


  const options =
    combodata[fieldname] && Object.keys(combodata[fieldname]).length > 0
      ? combodata[fieldname]
      : [];

  const newoptionsFormat = [];

  options.map((item) => {
    newoptionsFormat.push({
      value: item.k,
      label: item.v,
    });
  });

  const [formData, setFormData] = useState({});

  let clientevent = {};

  if (eDefHldr.stg.cev[fieldname]) {
    //clientevent = JSON.parse(ev.change);

    clientevent = eDefHldr.stg.cev[fieldname].ev.change;
  }

  const handleChange = async (selectedOption, onChange) => {


    if (clientevent) {
      eval(clientevent);
    }

    if (eDefHldr.stg.sev[fieldname]) {
      const currentValues = watch(fieldname);

      const previousValue = formData[fieldname];

      //  if (previousValue !== currentValues) {


      let gridname = findParent(fieldname, eDefHldr.stg.elms)

      if (gridname) {
        let _rid = currentGridRowData[gridname]._rid
        GridEventCaller(
          eDefHldr, // Use the ref to get the latest value
          "",
          eDefHldr.stg.sev[fieldname].ev.change,
          stageGridRefs,
          setValue,
          gridname,
          FormContextdata,
          _rid,
          null,
          null,
          seteDefHldr
        );

      }

      else {

        ServerEventCaller(
          eDefHldrRef.current,
          getValues(),
          eDefHldr.stg.sev[fieldname].ev.change,
          stageGridRefs,
          setValue,
          FormContextdata,
          seteDefHldr
        );
      }


      //handleChange(e);
      //  }
    }
  };

  const storevalue = async (selectedOption, onChange) => {

    await onChange(selectedOption.value); // this will store the value in form
    let neweDefHldr = { ...eDefHldr }
    neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
    let field = "_v_" + fieldname;
    neweDefHldr['elmsData'][field] = selectedOption.label;
    seteDefHldr(neweDefHldr);
  }
  const customclass = eDefHldr.stg.prp[fieldname].cls;

  return (
    <div className={`${col}  ${customclass}  ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}>
      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-label`}
      >
        {cap}
      </label>
      <Controller
        name={fieldname}
        control={control}
        register={fieldname}
        rules={{
          required: mn,
        }}
        render={({ field: { onChange, value, onBlur } }) => (
          <Select
            aria-label="Default select example"
            isDisabled={eDefHldr.stg.prp[fieldname].ro}
            onChange={(e) => storevalue(e, onChange)}
            onBlur={(e) => handleChange(e, onChange)}
            options={newoptionsFormat}
            name={fieldname}
            value={
              newoptionsFormat.find((option) => option.value == value)
                ? newoptionsFormat.find((option) => option.value == value)
                : null
            }
          >
          </Select>
        )}
      ></Controller>

      {/* use role="alert" to announce the error message */}

      {errors[fieldname] && errors[fieldname].type == "required" && (
        <span role="alert" style={{ color: "red", fontSize: "12px" }}>
          This field is required
        </span>
      )}
      {errors[fieldname] && errors[fieldname].type == "maxLength" && (
        <span role="alert">Max length exceeded</span>
      )}
    </div>
  );
};

export default ComboBox;
