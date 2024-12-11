import React, { useContext, useState } from "react";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller , GridEventCaller } from "../BusinessLogics/EventHandler";

const TextBox = ({ eid, fieldname, cap, col, mn, ev, val, mxLen, rid }) => {
  const {
    register,
    seteDefHldr,
    formState: { errors },
  } = useContext(FormContext);
  const {
    setValue,
    getValues,
    eDefHldr,
    stageGridRefs,
    watch,
    trigger,
    stageElements,
    cntrData,
    combodata,
    setComboData,
    setEventLoading,
    modalVisible,
    setModalVisible,
    multiSearchData,
    setMultiSearchData,
    currentGridRowData
  } = useContext(FormContext);

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

  const [formData, setFormData] = useState({});

  let clientevent = {};
  if (ev & (ev != "")) {
    clientevent = JSON.parse(ev.change);
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


  /* store previous value to avoid event fire when tabout */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className={`${col}  ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}>
      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-label`}
      >
        {cap}
      </label>
      <input
        type="text"
        aria-invalid={errors[fieldname] ? "true" : "false"}
        id={fieldname}
        disabled={eDefHldr.stg.prp[fieldname].ro}
        className="form-control"
        style={{
          color: eDefHldr.stg.prp[fieldname]?.flcr,
          backgroundColor: eDefHldr.stg.prp[fieldname]?.bclr,
        }}
        {...register(fieldname, {
          required: mn,
          maxLength: { mxLen, message: " is required" },
          value: val,

          onBlur: (e) => {
            if (clientevent.fn) {
              EventCaller(
                clientevent.fn,
                fieldname,
                clientevent.outel,
                getValues,
                setValue
              );
            }
            if (eDefHldr.stg.sev[fieldname]) {
              const currentValues = watch(fieldname);

              const previousValue = formData[fieldname];

              if (previousValue !== currentValues) {


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
                    eDefHldr,
                    getValues(),
                    eDefHldr.stg.sev[fieldname].ev.change,
                    stageGridRefs,
                    setValue,
                    FormContextdata, seteDefHldr
                  );

                }


                handleChange(e);
              }
            }
          },
        })}
      />

      {/* use role="alert" to announce the error message */}

      {errors[fieldname] && errors[fieldname].type == "required" && (
        <span role="alert" style={{ color: "red", fontSize: "12px" }}>
          This field is required
        </span>
      )}
      {errors[fieldname] && errors[fieldname].type == "maxLength" && (
        <span role="alert" style={{ color: "red", fontSize: "12px" }}>
          Max length exceeded
        </span>
      )}
    </div>
  );
};


export default TextBox;
