import React, { useContext, useState } from "react";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller } from "../BusinessLogics/EventHandler";

const CheckBox = ({ eid, fieldname, cap, col, mn, ev, val, mxLen }) => {

  const { register, formState: { errors } } = useContext(FormContext);
  const { setValue, getValues, eDefHldr, stageGridRefs, watch, trigger, stageElements, cntrData, combodata, setComboData, setEventLoading, seteDefHldr, modalVisible,
    setModalVisible ,     multiSearchData,
    setMultiSearchData } = useContext(FormContext);


  const FormContextdata = {
    getValues: getValues,
    stageGridRefs: stageGridRefs,
    stageElements: stageElements,
    cntrData: cntrData,
    combodata,
    setComboData,
    setEventLoading, modalVisible,
    setModalVisible,
    multiSearchData,
    setMultiSearchData,
    eDefHldr
  };



  const [formData, setFormData] = useState({});

  let clientevent = {}
  if (ev & ev != "") {
    clientevent = JSON.parse(ev.change);
  }


  /* store previous value to avoid event fire when tabout */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };


  return (
    <div className={`${col} mb-3 form-check`}>

      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-check-label ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}
      >
        {cap}
      </label>



      <input
        type="checkbox"
        aria-invalid={errors[fieldname] ? "true" : "false"}
        className="form-check-input"
        id={fieldname}
        disabled={eDefHldr.stg.prp[fieldname].ro}
        style={{
          color: eDefHldr.stg.prp[fieldname]?.flcr,
          backgroundColor: eDefHldr.stg.prp[fieldname]?.bclr,
        }}
        {...register(fieldname, {
          required: mn,
          maxLength: { mxLen, message: " is required" },
          value: val,
          onChange: (e) => {

            debugger;

            if (clientevent.fn) {
              EventCaller(
                clientevent.fn,
                fieldname,
                clientevent.outel,
                getValues,
                setValue
              )
            }
            if (eDefHldr.stg.sev[fieldname]) {

              const currentValues = watch(fieldname);

              const previousValue = formData[fieldname];

              if (previousValue !== currentValues) {

                ServerEventCaller(
                  eDefHldr,
                  getValues(),
                  eDefHldr.stg.sev[fieldname].ev.change,
                  stageGridRefs,
                  setValue,
                  FormContextdata, seteDefHldr
                )
                handleChange(e)
              }
            }
          }
        })}

      />


      {/* use role="alert" to announce the error message */}

      {errors[fieldname] && errors[fieldname].type == "required" && (

        <span role="alert" style={{
          color: "red",
          fontSize: "12px"
        }}>This field is required</span>
      )}
      {errors[fieldname] && errors[fieldname].type == "maxLength" && (
        <span role="alert" style={{
          color: "red",
          fontSize: "12px"
        }}>Max length exceeded</span>
      )}

    </div>
  );
};

export default CheckBox;

