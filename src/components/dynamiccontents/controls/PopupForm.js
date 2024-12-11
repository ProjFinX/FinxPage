import React, { useContext, useState } from "react";
import { FormContext } from "../Contexts/FormContext";
import OneScreen from "../OneScreen";
import OneScreenGridModal from "../OneScreenGridModal";
import RenderUI from "../RenderUI";
 

const PopupForm = ({ eid, fieldname, cap, col, mn, ev, val, mxLen, defs , elementdefs, stagelementdata , parentfieldanme, childUI}) => {
  debugger;
  const { register , elements } = useContext(FormContext);
  const { setValue } = useContext(FormContext);

 // const [Childelements, setChildElements] = useState([]);


  let controlsdata = elementdefs;

  let popelementsdata = defs 

    let stageElements = stagelementdata

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
      (item) =>
      
        ( stgelts =  !{...elementarraydata.find((e) => e.fieldname == item.fieldname)} ? {} : {...elementarraydata.find((e) => e.fieldname == item.fieldname)} , 
          
          item.elementdata = {
            ...stgelts.elementdata,
          ...item.elementdata,
        })

    );

   const  Childelements = [...stageElementarraydata] ;


   
    /* Check if child is direct Grid Control */
    if(popelementsdata.ty == "10"){


      delete Childelements[0].elementdata.child


      Childelements[0].elementdata["child"] = stagelementdata.elms[parentfieldanme].child[fieldname].child



    }




  return (
    <>
      {Childelements ? 
      <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={"#" + fieldname}
      >
        {cap}
      </button>

      <div
        className="modal fade"
        id={fieldname}
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
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
                    key={"POPup_1"}
                  />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button type="button" className="btn btn-primary">
                Save
              </button> */}
            </div>
          </div>
        </div>
      </div> 
      </div>: <> </> }
    </>
  );
};

export default PopupForm;
