import React, {
  memo,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
  useContext
} from "react";
import appsettings from "../../../../appsettings.json";
import { FormContext } from "../../Contexts/FormContext";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../../../utilities/utils";

import api from "../../../api/Webcall";
import ConfirmationModal from "../../../htmlcomponents/ConfimationModal";

const GrFile = memo(
  forwardRef((props, ref) => {
    debugger;

    const { value, values, onValueChange } = props;
    const { eDefHldr, watch, setdocField, getValues, setValue, trigger, setEventLoading, seteDefHldr , register } =
      useContext(FormContext);

    const apiendpoints = appsettings.ApiEndpoints;
    
  const [showConfirmation, setShowConfirmation] = useState(false);

    const refInput = useRef(null);

    // Cell Editor interface, that the grid calls
    // useImperativeHandle(ref, () => {

    //   return {


    //     // the final value to send to the grid, on completion of editing
    //     getValue() {
    //       // this simple editor doubles any value entered into the input
    //       return value;
    //     },
    //   };
    // });


    // const onchangefile = useCallback(
    //     (event) => {
    //   prp.setValue(event.target.value)
    // });

    const onchagefile = async (event) => {
      debugger;
      if (event.target.files[0]) {
        let docID = -1;

        eDefHldr.qdet["eid"] = eDefHldr.elms[props.colDef.field.replace("_v_", "")].eid;

        const formData = new FormData();

        formData.append("_qdet", JSON.stringify(eDefHldr.qdet));

        formData.append("file", event.target.files[0]);

        for (var key of formData.entries()) {
          console.log(key[0] + ", " + key[1]);
        }

        //formData["_qdet"] = JSON.stringify(eDefHldr.qdet);
        //formData["file"] =  event.target.files[0];


        const data = formData;
        const url = apiendpoints.FileUpload;

        let response = await api.post(url, formData);

        let strResponse = JSON.parse(decompressBase64(response.data));

        if (strResponse.hdr.rst == "SUCCESS") {
          docID = strResponse["body"]["docid"];

          // eDefHldr.fil = !eDefHldr.fil ? {} : eDefHldr.fil;
          // eDefHldr.fil[fieldname] = new Array();
          // eDefHldr.fil[fieldname]["docid"] = docID;

          let docField = props.colDef.field.replace("_v_", "")

          let docdata = {};

          // docdata[docField] = {};
          docdata["id"] = docID;
          docdata["name"] = event.target.files[0].name;
          




          return docdata;
        }

        //delete eDefHldr.qdet["eid"];
      }
    };

    const Setdocfield = (fieldname) => { 
      setdocField(fieldname);
    };
  


    const onChangeListener = useCallback(
      async (event) => {
        //  setValue(event.target.value) 
        debugger;
        // props.node.setDataValue(props.colDef.field , parseFloat(onchagefile(event)));
        // props.setValue(parseFloat(onchagefile(event)));

        let filedata = await onchagefile(event)

        props.setValue(event.target.files);
        
        props.node.setDataValue(props.colDef.field.replace("_v_", ""), filedata);


      },
      []
    );

    const deletedoc = (fieldname) => {
      setShowConfirmation(true);
    };
  
    const handleConfirmation = (confirmed) => {
      setShowConfirmation(false);
  
      if (confirmed) {
        props.node.setDataValue(props.colDef.field.replace("_v_", ""), null);
        props.setValue(null);
        setValue(props.data._rid + '_' + props.colDef.field , null)
      }
      // If the user clicks "Cancel", nothing happens.
    };

    // useEffect(() => refInput.current.focus(), []);




    // useEffect(() => refInput.current.focus(), []);
    return (
      <>
        {/* <input
        type="file"
        key={props.data._rid +'_' + props.colDef.field}
        name={props.data._rid +'_' + props.colDef.field}
        className="form-control"
        ref={refInput}
       value={value}
       onChange={onChangeListener}
      /> */}


        <div className={`col-12 input-group mb-3 `}>

          <input
            name={props.data._rid + '_' + props.colDef.field}
            type="file"
            id={props.data._rid + '_' + props.colDef.field}
            key={props.data._rid + '_' + props.colDef.field}
            className="form-control d-none"
            // disabled={eDefHldr.stg.prp[fieldname].ro}
            data-browse-on-zone-click="true"
            accept="image/*,.pdf"
            // style={{
            //   color: eDefHldr.stg.prp[fieldname]?.flcr,
            //   backgroundColor: eDefHldr.stg.prp[fieldname]?.bclr,
            // }}
            onChange={onChangeListener}
            {...register(props.data._rid + '_' + props.colDef.field, {
              value: value,
              onChange: onChangeListener,
            })}
          ></input>

          <button
            className="browse btn btn-primary px-2"
            style={{ backgroundColor: "#4154f1" }}
            type="button"
            onClick={() => document.getElementById(props.data._rid + '_' + props.colDef.field).click()}
          >
            <i className="bi bi-upload"></i>
          </button>

          <input
            type="text"
            className="form-control form-control"
            placeholder="Upload file"
            //  disabled={eDefHldr.stg.prp[fieldname].ro}
            value={
              value?.[0]?.name
                ? value?.[0]?.name
                : ""
            }
            readOnly
          ></input>
          {value?.[0]?.name && (
            <>
              <button
                type="button"
                style={{ backgroundColor: "#4154f1" }}
                className="browse btn btn-primary px-2"
                data-bs-toggle="modal"
                onClick={() => Setdocfield(props.data._rid + '_' + props.colDef.field)}
                data-bs-target="#exampleModalScrollable"
              >
                <i className="bi bi-eye"></i>
              </button>
              <button
                type="button"
                className="browse btn btn-danger px-2"
              onClick={() => deletedoc(props.data._rid + '_' + props.colDef.field)}
              >
                <i className="bi bi-trash"></i>
              </button>

              

            </>
          )}
        </div>


      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        show={showConfirmation}
        onHide={() => handleConfirmation(false)}
        onConfirm={() => handleConfirmation(true)}
        message="Are you sure you want to delete the document?"
      />

      </>
    );
  })
);

export default GrFile;
