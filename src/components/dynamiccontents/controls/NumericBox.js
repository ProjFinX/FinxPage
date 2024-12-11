import React, { useContext, useState, useRef, useEffect } from "react";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller, GridEventCaller } from "../BusinessLogics/EventHandler";
import { pushAll } from "@amcharts/amcharts5/.internal/core/util/Array";


const NumericBox = ({ eid, fieldname, cap, col, mn, ev, val, mxLen, rid }) => {

  const { register, formState: { errors }, seteDefHldr } = useContext(FormContext);
  const { setValue, getValues, eDefHldr, stageGridRefs, watch, trigger, stageElements, cntrData, combodata,
    setComboData, setEventLoading, modalVisible,
    setModalVisible, multiSearchData,
    setMultiSearchData, currentGridRowData } = useContext(FormContext);
  const eDefHldrRef = useRef(eDefHldr);
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
    eDefHldr: eDefHldrRef.current
  };

  const handleWheel = (event) => {
    event.preventDefault();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
  };


  const [formData, setFormData] = useState({});

  let clientevent = {}
  if (ev) {
    clientevent = eDefHldr.stg.cev[fieldname].ev.change;
  }
  useEffect(() => {
    eDefHldrRef.current = eDefHldr; // Keep ref updated with latest state
  }, [eDefHldr]);
  useEffect(() => {
    if (clientevent) {
      eval(clientevent);
    }
  }, [watch(fieldname)]);
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
  /* store previous value to avoid event fire when tabout */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };
  return (
    <div className={`${col} mb-3`}>
      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-label`}
      >
        {cap}
      </label>
      <input
        name={fieldname}
        type="number"
        step="any"
        className="form-control"
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        disabled={eDefHldr.stg.prp[fieldname].ro}
        {...register(fieldname, {
          required: mn,
          maxLength: { mxLen, message: " is required" },
          value: val == "" ? 0 : val,
          onBlur: async (e) => {
            if (eDefHldr.stg.sev[fieldname]) {
              const currentValues = watch(fieldname);
              const previousValue = formData[fieldname];
              if (previousValue !== currentValues) {
                let gridname = findParent(fieldname, eDefHldr.stg.elms)
                if (gridname) {
                  let _rid = currentGridRowData[gridname]._rid
                  await GridEventCaller(
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
                  await ServerEventCaller(
                    eDefHldr,
                    getValues(),
                    eDefHldr.stg.sev[fieldname].ev.change,
                    stageGridRefs,
                    setValue,
                    FormContextdata, seteDefHldr
                  )

                }
              }
            }




            handleChange(e)

          }
        })}
      />
    </div>
  );
};

export default NumericBox;
