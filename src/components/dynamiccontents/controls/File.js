import React, { useState, useContext } from "react";
import { FormContext } from "../Contexts/FormContext";
import appsettings from "../../../appsettings.json";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../../utilities/utils";
import api from "../../api/Webcall";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import ConfirmationModal from "../../htmlcomponents/ConfimationModal";

const File = ({ eid, fieldname, cap, col, mn, ev, val, mxLen, rid }) => {
  const apiendpoints = appsettings.ApiEndpoints;
  const { eDefHldr, watch, setdocField, getValues, setValue, trigger, setEventLoading, seteDefHldr } =
    useContext(FormContext);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onchagefile = async (event) => {
    debugger;
    if (event.target.files[0]) {
      let docID = -1;

      eDefHldr.qdet["eid"] = eDefHldr.elms[fieldname].eid;

      const formData = new FormData();

      formData.append("_qdet", JSON.stringify(eDefHldr.qdet));

      formData.append("file", event.target.files[0]);

      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }

      //formData["_qdet"] = JSON.stringify(eDefHldr.qdet);
      //formData["file"] =  event.target.files[0];

      /* Header */
      const convID = generateUUID();

      const data = formData;
      const url = apiendpoints.FileUpload;

      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "SUCCESS") {
        docID = strResponse["body"]["docid"];

        eDefHldr.fil = !eDefHldr.fil ? {} : eDefHldr.fil;
        eDefHldr.fil[fieldname] = new Array();
        eDefHldr.fil[fieldname]["docid"] = docID;
      }

      delete eDefHldr.qdet["eid"];
    }
  };

  const deletedoc = (fieldname) => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    setShowConfirmation(false);

    if (confirmed) {
      if (eDefHldr?.fil?.[fieldname]) {
        delete eDefHldr.fil[fieldname];
      }
      setValue(fieldname, [{ id: "-1" }]);

      trigger(fieldname);
    }
    // If the user clicks "Cancel", nothing happens.
  };

  const { register } = useContext(FormContext);

  const Setdocfield = (fieldname) => {
    debugger;

    setdocField(fieldname);
  };

  return (
    <>
      <div className={`${col} mb-3 ${eDefHldr.stg.prp[fieldname]?.disp == false ? "d-none" : ""}`}>
        <label
          htmlFor={fieldname}
          className={`${mn ? "required" : ""} form-label`}
        >
          {cap}
        </label>

        <div className={`col-12 input-group mb-3 `}>
          <input
            name={fieldname}
            type="file"
            id={fieldname}
            key={fieldname}
            className="form-control d-none"
            disabled={eDefHldr.stg.prp[fieldname].ro}
            data-browse-on-zone-click="true"
            accept="image/*,.pdf"
            style={{
              color: eDefHldr.stg.prp[fieldname]?.flcr,
              backgroundColor: eDefHldr.stg.prp[fieldname]?.bclr,
            }}
            {...register(fieldname, {
              required: { mn, message: " is required" },
              value: val,
              onChange: onchagefile,
            })}
          ></input>
          {!eDefHldr.stg.prp[fieldname].ro && (
            <button
              className="browse btn btn-primary px-2"
              style={{ backgroundColor: "#4154f1" }}
              type="button"
              onClick={() => document.getElementById(fieldname).click()}
            >
              <i className="bi bi-upload"></i>
            </button>
          )}
          <input
            type="text"
            className="form-control form-control"
            placeholder="Upload file"
            disabled={eDefHldr.stg.prp[fieldname].ro}
            value={
              getValues(fieldname)?.[0]?.name
                ? getValues(fieldname)?.[0]?.name
                : ""
            }
            readOnly
          ></input>
          {getValues(fieldname)?.[0]?.name && (
            <>
              <button
                type="button"
                style={{ backgroundColor: "#4154f1" }}
                className="browse btn btn-primary px-2"
                data-bs-toggle="modal"
                onClick={() => Setdocfield(fieldname)}
                data-bs-target="#exampleModalScrollable"
              >
                <i className="bi bi-eye"></i>
              </button>
              {!eDefHldr.stg.prp[fieldname].ro && (
                <button
                  type="button"
                  className="browse btn btn-danger px-2"
                  onClick={() => deletedoc(fieldname)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </>
          )}
        </div>
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
};

export default File;
