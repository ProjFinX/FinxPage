import React, { useContext, useState } from "react";
import { FormContext } from "../Contexts/FormContext";
import { EventCaller, ServerEventCaller } from "../BusinessLogics/EventHandler";

const Button = ({ eid, fieldname, cap, col, mn, ev, val, mxLen }) => {
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
    setMultiSearchData
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

  const handleonClick = () => {
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
      debugger;
      ServerEventCaller(
        eDefHldr,
        getValues(),
        eDefHldr.stg.sev[fieldname].ev.click,
        stageGridRefs,
        setValue,
        FormContextdata, seteDefHldr
      );

    }
  };

  {
    return (
      <div className={`${col} mb-3 form-check`}>
        <button
          name={fieldname}
          id={fieldname}
          type="button"
          className="form-control btn btn-primary"
          disabled={eDefHldr.stg.prp[fieldname].ro}
          onClick={handleonClick}
        >
          {cap}
        </button>
      </div>
    );
  }
};

export default Button;
