import React, { useContext } from "react";
import { FormContext } from "../Contexts/FormContext";
import { GetAge } from "../BusinessLogics/EventHandler";

const MultiLineTextBox = ({ eid, fieldname, cap, col, mn, ev, val, mxLen }) => {
  const { handleOnChange } = useContext(FormContext);
  const { register , formState: { errors } } = useContext(FormContext);
  const { setValue, getValues, eDefHldr, stageGridRefs, watch, trigger , setEventLoading } = useContext(FormContext);

  return (
    <div className={`${col} mb-3`}>
      <label
        htmlFor={fieldname}
        className={`${mn ? "required" : ""} form-label`}
      >
        {cap}
      </label>
      <textarea
        aria-invalid={errors[fieldname] ? "true" : "false"}
        className="form-control"
        disabled = {eDefHldr.stg.prp[fieldname].ro}
        {...register(fieldname, {
          required: mn,
          maxLength: { mxLen, message: " is required" },
          value: val          
        })}
        // {...register(fieldname, { required: true })}

        // id={fieldname}
        // value={val}
        // onChange={event=> handleOnChange(eid, event)}
        //onChange={setValue("ntxt_Age", "30")}
      />

         {/* use role="alert" to announce the error message */}
        
         {errors[fieldname] && errors[fieldname].type == "required" && (
          
        <span role="alert">This is required</span>
      )}
      {errors[fieldname] && errors[fieldname].type == "maxLength" && (
        <span role="alert">Max length exceeded</span>
      )}

    </div>
  );
};

export default MultiLineTextBox;



