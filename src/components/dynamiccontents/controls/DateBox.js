import React, { useContext, useState } from "react";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller } from "../BusinessLogics/EventHandler";

export const DateBox = ({
  eid,
  fieldname,
  cap,
  col,
  mn,
  ev,
  val,
  mxLen,
  rid,
  seteDefHldr
}) => {
  const {
    register,
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
    setComboData,
    combodata,
    setEventLoading,
    modalVisible, 
    setModalVisible,
    multiSearchData,
    setMultiSearchData
  } = useContext(FormContext);

  const FormContextdata =  {
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
  let clientevent = null;
  if (eDefHldr.stg.cev[fieldname]) {
    clientevent = eDefHldr.stg.cev[fieldname].ev.change;
  }

  /* store previous value to avoid event fire when tabout */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };


  const initialDateValue = val ? val.length > 0 ? val.substring(0, 10) : "" : "";


  return (
    <div className={`${col} mb-3 ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}>
      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-label`}
      >
        {cap}
      </label>
      <input
        name={fieldname}
        id={fieldname}
        type="date"
        className="form-control"
        disabled = {eDefHldr.stg.prp[fieldname].ro}
        style={{
          color: eDefHldr.stg.prp[fieldname]?.flcr,
          backgroundColor: eDefHldr.stg.prp[fieldname]?.bclr,
        }}
        {...register(fieldname, {
          required: mn,
          maxLength: { mxLen, message: " is required" },
          value: val ,
          onBlur: (e) => {
            // if (clientevent.fn) {
            //   EventCaller(
            //     clientevent.fn,
            //     fieldname,
            //     clientevent.outel,
            //     getValues,
            //     setValue
            //   )
            // }
            if (clientevent) {
              eval(clientevent);
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
                  FormContextdata,seteDefHldr
                );
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

export default DateBox;
