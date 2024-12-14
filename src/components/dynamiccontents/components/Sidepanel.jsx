import React from "react";
import Timeline from "../../htmlcomponents/Timeline";
import { FormContext } from "../Contexts/FormContext";
import { useContext, useState, useEffect } from "react";
import api from "../../api/Webcall";
import appsettings from "../../../appsettings.json";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../../utilities/utils";

export const Sidepanel = (props) => {
  const { scrid, qid } = props;
  const fieldname = "_cmbAction";
  const commentsBox = "_txtComment";

  const {
    register,
    getValues,
    setValue,
    combodata,
    setComboData,
    elements,
    eDefHldr,
    actionHighlight,
    formState: { errors },
  } = useContext(FormContext);

  const [TimelineData, setTimeLineData] = useState(null);

  const getTimelineData = async () => {
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "ReadTimeline",
      orgid: "",
      vendid: "0",
    };
    const frmData = { scrid: scrid, qid: qid };
    const data = { hdr: frmHdr, body: frmData };
    const endpoints = appsettings.ApiEndpoints;
    const url = endpoints.Qmvhist;
    let response = await api.post(url, compressBase64(data));
    let strResponse = JSON.parse(decompressBase64(response.data));
    console.log("time line data", strResponse);
    if (strResponse.hdr.rst == "SUCCESS") {
      setTimeLineData(strResponse?.body?.qremark);
    }
  };

  useEffect(() => {
    getTimelineData();
  }, [scrid]);

  const options =
    combodata[fieldname] && Object.keys(combodata[fieldname]).length > 0
      ? combodata[fieldname]
      : [];

  return (
    <>
      <ul
        className="nav nav-pills mb-3 shadow-sm"
        id="pills-tab"
        role="tablist"
      >
        <li className="nav-item">
          <a
            className="nav-link active"
            id="pills-home-tab"
            data-bs-toggle="tab"
            data-bs-target="#pills-home"
            href="#pills-home"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Action
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            id="pills-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#pills-profile"
            href="#pills-profile"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Timeline
          </a>
        </li>
        {/* <li className="nav-item">
          <a
            className="nav-link"
            id="pills-contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#pills-contact"
            href="#pills-contact"
            role="tab"
            aria-controls="pills-contact"
            aria-selected="false"
          >
            Comments
          </a>
        </li> */}
      </ul>

      <div className="tab-content container" id="pills-tabContent p-3">
        <div
          className="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <select
            className={`${actionHighlight} form-select mb-2`}
            aria-label="Default select example"
            style={{ cursor: "pointer" }}
            disabled={false} //{eDefHldr.stg.prp[fieldname].ro}
            {...register(fieldname, {
              // onChange: () => showDescription(),
            })}
          >
            <option key="0" value="">
              --Select Action--
            </option>
            {options.map((item) => (
              <option key={item.k} value={item.k}>
                {item.v}
              </option>
            ))}
          </select>

          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            {...register(commentsBox, {
              // onChange: () => showDescription(),
            })}
          ></textarea>
        </div>
        <div
          className="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <Timeline TimelineData = {TimelineData}></Timeline>
        </div>
        <div
          className="tab-pane fade third"
          id="pills-contact"
          role="tabpanel"
          aria-labelledby="pills-contact-tab"
        >
          <div className="form-group addinfo"></div>
        </div>
      </div>
    </>
  );
};
