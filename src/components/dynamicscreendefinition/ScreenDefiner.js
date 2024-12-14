import React from "react";
import { useState, useEffect } from "react";

import ReactDOM from "react-dom";
import { toast } from "react-toastify";
import { createRoot } from 'react-dom/client';

/* Imports */
import { useForm } from "react-hook-form";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import StageMaster from './StageMaster';
import ElementMaster from './ElementMaster';
import UIDesign from "./UIDesign";
import EvntExprGroup from "./EvntExprGroup";
import EvntExprGroupMap from "./EvntExprGroupMap";
import ClientEvents from "./ClientEvents";
import TaskElements  from "./TaskElements";
import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import appsettings from "../../appsettings.json"
import { GetAllScreenList } from "../utilities/getallscreen";
import api from "../api/Webcall";



// import api from "../api/Webcall";
// import { GetAllStageList } from "../utilities/getallstage";
// import { FetchCombodata } from "../utilities/combodata";
// import { Scrollbar } from "react-scrollbars-custom";
// import { toast } from 'react-toastify';
// import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";



/* Constant values */
const apiendpoints = appsettings.ApiEndpoints;



/*

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";



import Table from "react-bootstrap/Table";

import Spinner from "../htmlcomponents/Spinner";


*/

const schema = yup.object().shape({
  txtStageName: yup.string().required("Pls provide stage Name"),
});



function ScreenDefiner() {

  const [scrId, setScreenId] = useState([]);
  const [screenList, setScreenList] = useState([]);

  const { register, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  /* Fetch data from Api */
  const FetchAllActiveScreenList = async () => {
    const scrlstRes = await GetAllScreenList();
    setScreenList(scrlstRes.body.Screens.filter((res) => res.IsActive == true));
  };


  /*  Use Effect */
  useEffect(() => { FetchAllActiveScreenList(); }, []);


  /* Events */

  const screenOnChange = (e) => {
    setScreenId(e.target.value);

    const stgContainer = document.getElementById('divStageMaster');
    const stgRoot = createRoot(stgContainer);
    stgRoot.render(<></>);

    const elmContainer = document.getElementById('divElementMaster');
    const elmRoot = createRoot(elmContainer);
    elmRoot.render(<></>);

    const uiContainer = document.getElementById('divUIDesign');
    const uiRoot = createRoot(uiContainer);
    uiRoot.render(<></>);

    const expGrpContainer = document.getElementById('divEvntExprGroup');
    const expGrpRoot = createRoot(expGrpContainer);
    expGrpRoot.render(<></>);

    const expGrpMapContainer = document.getElementById('divEvntExprGroupMap');
    const expGrpMapRoot = createRoot(expGrpMapContainer);
    expGrpMapRoot.render(<></>);
    
    const clientEventContainer = document.getElementById('divClientEvent');
    const clientEventRoot = createRoot(clientEventContainer);
    clientEventRoot.render(<></>);

  };

  const handleSelect = (key) => {

    switch (key) {

      case 'stage':
        loadStageTab();
        break;

      case 'element':
        loadElementTab();
        break;

      case 'uidesign':
        loadUiDesignTab();
        break;

      case 'expression':
        loadEvntExprGroupTab();
        break;

      case 'expevntmap':
        loadEvntExprGroupMapTab();
        break;

      case 'clientevent':
        loadClientEventTab();
        break;

      case 'taskelement':
        loadTaskElementsTab();
        break;

      default:
        break;
    };

  };

  const loadStageTab = () =>{
    const container = document.getElementById('divStageMaster');
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(<StageMaster ScrId={scrId} />);
  };

  const loadElementTab = () =>{
    const container = document.getElementById('divElementMaster');
    const root = createRoot(container);
    root.render(<ElementMaster ScrId={scrId} />);
  };
  
  const loadUiDesignTab = () =>{
    const container = document.getElementById('divUIDesign');
    const root = createRoot(container);
    root.render(<UIDesign ScrId={scrId} />);
  };

  const loadEvntExprGroupTab = () =>{
    const container = document.getElementById('divEvntExprGroup');
    const root = createRoot(container);
    root.render(<EvntExprGroup ScrId={scrId} />);
  };

  const loadEvntExprGroupMapTab = () =>{
    const container = document.getElementById('divEvntExprGroupMap');
    const root = createRoot(container);
    root.render(<EvntExprGroupMap ScrId={scrId} />);
  };

  const loadClientEventTab = () =>{
    const container = document.getElementById('divClientEvent');
    const root = createRoot(container);
    root.render(<ClientEvents ScrId={scrId} />);
  };

  const loadTaskElementsTab = () =>{
    const container = document.getElementById('divTaskElements');
    const root = createRoot(container);
    root.render(<TaskElements ScrId={scrId} />);
  };


  const publishScreen = async () => {

    let frmData = {};
    frmData["scrid"] = scrId;
    frmData["scrname"] = "";

    const frmHdr = { convid: generateUUID(), tag: "Pubish Screen", orgid: "", vendid: "0", };

    const reqHdr = { };
    const reqdata = { hdr: frmHdr, body: frmData };

    try {
      const response = await api.post( apiendpoints.BuildScrn, compressBase64(reqdata), reqHdr );
      const resData  = JSON.parse(decompressBase64(response.data));

      if (resData.hdr.rst == "SUCCESS")
      {
        setTimeout(() => {
          toast.success("Screen Published");
        }, 300);
      }
      else {
        setTimeout(() => {
          toast.error("Failed to Publish");
        }, 300);
      }

    } catch (err) {
      setTimeout(() => {
        toast.error("Unable to process request");
      }, 300);
    }

  };


  /* HTML Screen Desgin Starts */
  try {
    return (
      <>
        
        <div className="row">
          
          <div className="card-header">
            <strong className="card-title">Screen Definer </strong>
          </div>

          <div className="col-md-4">
            <select {...register("cmbScrId")} className="form-control" onChange={screenOnChange}>
              <option value="0">- Select -</option>
              {
                screenList.map((res) => (<option key={res.ScreenId} value={res.ScreenId}>{res.ScrName}</option>))
              }

            </select>
            <p>{errors.cmbScreenId?.message}</p>
          </div>

          <div className="col-md-3">
            <button className="btn btn-primary" onClick={() => publishScreen()}>Publish</button>
          </div>

        </div>

        <div className="row">

          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
            onSelect={handleSelect}>

            <Tab eventKey="stage" title="Stage" >
              <div id="divStageMaster"></div>
            </Tab>

            <Tab eventKey="element" title="Elements">
            <div id="divElementMaster"></div>
            </Tab>

            <Tab eventKey="uidesign" title="UI Design">
            <div id="divUIDesign"></div>
            </Tab>

            <Tab eventKey="expression" title="Expression Group">
            <div id="divEvntExprGroup"></div>
            </Tab>

            <Tab eventKey="expevntmap" title="Expression & Event Map">
              <div id="divEvntExprGroupMap"></div>
            </Tab>

            <Tab eventKey="clientevent" title="Client Event">
              <div id="divClientEvent"></div>
            </Tab>

            <Tab eventKey="taskelement" title="Task Element">
              <div id="divTaskElements"></div>
            </Tab>

          </Tabs>

        </div>

      </>
    );
  } catch (error) {
    console.log(error.message);
    throw(error);
  }
}

export default ScreenDefiner;
