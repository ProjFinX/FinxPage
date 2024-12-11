import React, { useContext, useState, useEffect } from "react";
import { FormContext } from "../../Contexts/FormContext";
import RenderUI from "../../RenderUI";
import {
  Setup,
  ServerEventCaller,
  GridEventCaller,
  GridChildEventCaller,
  GridChildEventCallerOnSave,
} from "../../BusinessLogics/EventHandler";

const GrPopupForm = ({
  eid,
  fieldname,
  cap,
  col,
  mn,
  ev,
  val,
  mxLen,
  defs,
  elementdefs,
  stagelementdata,
  parentfieldanme,
  childUI,
  modaldata,
  setModalData,
  eDefHldr,
  cntrData
}) => {
  const { register, elements, stageGridRefs } = useContext(FormContext);
  const { setValue, getValues } = useContext(FormContext);

  const FormContextdata = {
    getValues: getValues,
    stageGridRefs: stageGridRefs,
    stageElements: stagelementdata,
    cntrData: cntrData,
  };

  // const [Childelements, setChildElements] = useState([]);

  const  SaveFormData = async () => {
    debugger;
    const rowNode = stageGridRefs[parentfieldanme].current.api.getRowNode(
      modaldata._rid
    );

    const data = {};

    // Iterate through the object
    for (const key in stagelementdata.elms[parentfieldanme].child[fieldname]
      .child) {
      if (stagelementdata.elms[parentfieldanme].child[fieldname]) {
        data[key] = getValues(key);
      }
    }

    await rowNode.setDataValue(fieldname, data);

    const popupFormOnSaveEv = stagelementdata?.sev?.[modaldata.field]?.ev?.pupfsave;

    if (popupFormOnSaveEv) {
     await GridChildEventCallerOnSave(
        eDefHldr,
        "",
        popupFormOnSaveEv,
        stageGridRefs,
        setValue,
        parentfieldanme,
        FormContextdata,
        modaldata._rid,
        modaldata.field,
        rowNode
      );
    }
  };

  useEffect(() => {
    debugger;

    if (modaldata && modaldata._rid) {
      const rowNode = stageGridRefs[parentfieldanme].current.api.getRowNode(
        modaldata._rid
      );

      // Iterate through the object
      for (const key in stagelementdata.elms[parentfieldanme].child[fieldname]
        .child) {
        if (rowNode.data[fieldname]) {
          rowNode.data[fieldname][key] &&
            setValue(key, rowNode.data[fieldname][key]);
        } else {
          setValue(key, null);
        }
      }
    }
  }, [modaldata]);

  const ResetData = () => {
    for (const key in stagelementdata.elms[parentfieldanme].child[fieldname]
      .child) {
      setValue(key, null);
      setModalData(null);
    }
  };

  let controlsdata = elementdefs;

  let popelementsdata = defs;

  let stageElements = stagelementdata;

  const elementarraydata = [];

  for (var element in popelementsdata.child) {
    controlsdata[element]["val"] = controlsdata[element]["val"]
      ? controlsdata[element]["val"]
      : "";
    elementarraydata.push({
      fieldname: element,
      elementdata: controlsdata[element],
    });
  }

  const stageElementarraydata = [];

  for (var element in popelementsdata.child) {
    stageElementarraydata.push({
      fieldname: element,
      elementdata: popelementsdata.child[element],
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

  const Childelements = [...stageElementarraydata];

  /* Check if child is direct Grid Control */
  if (popelementsdata.ty == "10") {
    delete Childelements[0].elementdata.child;

    Childelements[0].elementdata["child"] =
      stagelementdata.elms[parentfieldanme].child[fieldname].child;
  }

  return (
    <>
      {Childelements ? (
        <div>
          <div
            className="modal fade"
            id={fieldname}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    {cap}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {/* {Childelements.map((item) => (
               
                <OneScreenGridModal
                  dataprops={item.elementdata}
                  key={item.fieldname}
                  fieldname={item.fieldname}
                  stagelementdata={stageElements}
                  elementdefs={controlsdata}               
                />))
              
              
              }  */}

                  <RenderUI
                    data={childUI}
                    elements={elements}
                    stageElements={stageElements}
                    cntrData={controlsdata}
                    rid={modaldata && modaldata._rid}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={ResetData}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={SaveFormData}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <> </>
      )}
    </>
  );
};

export default GrPopupForm;
