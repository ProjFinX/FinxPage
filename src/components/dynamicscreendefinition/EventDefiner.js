import React from "react";
import { useState, useEffect } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { GetScreenGroupElms } from "../utilities/getscrengrpelms";
import { GetAllScreenList } from "../utilities/getallscreen";
import { GetExpGrpLst } from "../utilities/geteventexpression";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from 'react-toastify';
import { GetExpressiontree} from "../utilities/getScrexpresiontree";
import { Getqxmap} from "../utilities/getqxmap";
import Modal from "react-bootstrap/Modal";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import appsettings from "../../appsettings.json"
import Button from "react-bootstrap/Button";
import TableRows from "./TableRowsEd";

const apiendpoints = appsettings.ApiEndpoints;

const CompanyId = localStorage.getItem("CompanyId")


const schema = yup.object().shape({
  txtExpGroupName: yup.string().required("Pls provide Group Name"),
});

//rfce - command
function EventDefiner() {
  // Const & Var

  const [ExpGrpresbody, setExpGrpresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);
  
  const [Screenid, setScreenid] = useState(0);
   const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [treedata, settreedata] = useState([]);
  const [actualtreedata, setactualtreedata] = useState([]);
  const [GroupExpid, setGroupExpid] = useState(0);

  const [gridshow, setgridShow] = useState(false);
  const gridhandleClose = () => setgridShow(false);
  const gridhandleShow = () => setgridShow(true);

  const [gridname, setgridname] = useState("");

  const [DBid, setDBid] = useState(0);
  const [cmbctlres, setctlres] = useState([]);
  const [ParentElementId, setParentElementId] = useState(100);
  const [GroupElements, setGroupElements] = useState([]);
  const [childelms, setscrchildelms] = useState([]);
  const [ScExprnId, setScExprnId] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });



  
  


  // General Function

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList(); 
    setscreenfilterlist(ScreenListResponse.body.Screens.filter((res) => res.IsActive==true));
  };


  const FetchExpGrpList = async (screenid) => {   
    const ExpGrpListResponse = await GetExpGrpLst(screenid);   
     setExpGrpresbody(ExpGrpListResponse.body.expressions);
   
  };


  const FetchExpGrpListtree = async (screenid,Groupid) => { 
    
   //

    const FetchExpGrpListtree = await GetExpressiontree(screenid,Groupid);   

     const expreres =   FetchExpGrpListtree.data;   
     settreedata(expreres.menutree);
     setactualtreedata(expreres.expresponse);
   
  };





  //   fetch combo values

  
  const[resbody,setresbody]= useState([]);
  const LoadCombo = async () => {
      // Update state with incremented value

      const opt = '|CTBL|SETM|';
      const optw = '';
  // 

  const Response = await FetchCombodata(opt,optw);

      setctlres(Response.body.ctbl);
      setresbody(Response.body.setm)
      console.log(Response.body)
  }; 



  
  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();   
  }, []);


  

  // Event function start


  const ScreenOnChange = (e) => {   

       reset({txtSeExprnId: "", txtParentSeExprnId: "",cmbSeExprType:0,txtExpression:"",txtExprGroupId:""})          
       setScreenid(e.target.value);
       FetchExpGrpList(e.target.value);
       settreedata([]);
       FetchGroupElements(e.target.value);
      
       
  };

  const OnGroupIdChange = (e) => {
    setParentElementId(e.target.value);
    FetchScreenChildElements(e.target.value, Screenid);

  };


  const FetchScreenChildElements = async (parentelmid, scrid) => {
    // Update state with incremented value
     const opt = "|DUELM|";

    const optw = {
      DUELM: "ScreenId=" + scrid + " and ParentElementId=" + parentelmid,
    };

    const Response = await FetchCombodata(opt, optw);

    console.log(Response);

    setscrchildelms(Response.body.duelm);
  };
  //--------

  const onDBChange = (e) => {   
    setDBid(e.target.value);    
  };


  const FetchGroupElements = async (srid) => {
    const GroupElmsResponse = await GetScreenGroupElms(srid);
    console.log(GroupElmsResponse.body.elements);
    setGroupElements(GroupElmsResponse.body.elements);
  };

    //--------------------------------------------------------------------------------------------------------

    const ReorderExpression = async (SeExprnId,dir) => {
      console.log(SeExprnId);
  
      let frmData = {cmbScrId:Screenid, txtExprGroupId:GroupExpid,txtSeExprnId:SeExprnId,txtDirection:dir};
  
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "Reord",
        orgid: "",
        vendid: "0",
      };
  
      const token = localStorage.getItem("token");
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
      const reqdata = { hdr: frmHdr, body: frmData };
      const Reord = apiendpoints.Reord;
  
  
      try {
        //
        const response = await api.post(
          Reord,
          compressBase64(reqdata),
          reqHdr
        );
  
        const strResponse = JSON.parse(decompressBase64(response.data));
  
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        } else {
          toast.success("Reorder Successfully");
          reset({cmbScreenId:"0", txtSeExprnId: "", txtParentSeExprnId: "0",cmbSeExprType:0,txtExpression:""})  
          setExpGrpresbody([]);
        }
      } catch (err) {
        toast.error("Unable to process request");
      }
    };



    const DeleteExpression = async (SeExprnId) => {
      console.log(SeExprnId);
  
      let frmData = { cmbScrId:Screenid, txtExprGroupId:GroupExpid,txtSeExprnId:SeExprnId};
  
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "DeleteExp",
        orgid: "",
        vendid: "0",
      };
  
      const token = localStorage.getItem("token");
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
      const reqdata = { hdr: frmHdr, body: frmData };
      const Delexprn = apiendpoints.Delexprn;
  
  
      try {
        //
        const response = await api.post(
          Delexprn,
          compressBase64(reqdata),
          reqHdr
        );
  
        const strResponse = JSON.parse(decompressBase64(response.data));
  
        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        } else {
          toast.success("Deleted Successfully"); 
          reset({cmbSeExprType:0,txtExpression:""})  
          FetchExpGrpListtree(Screenid,GroupExpid)
         // setExpGrpresbody([]);
        }
      } catch (err) {
        toast.error("Unable to process request");
      }
    };

    
  // - Delete element

  const DeleteGroup = async (rowval) => {
    console.log(rowval);

    let frmData = { cmbScrId:Screenid, txtExprGroupId:rowval.egid};

    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "DeleteExpGroup",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const Delexprngrp = apiendpoints.Delexprngrp;


    try {
      //
      const response = await api.post(
        Delexprngrp,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
      } else {
        toast.success("Deleted Successfully");
        setExpGrpresbody([]);
        reset({ txtSeExprnId: "", txtParentSeExprnId: "0",cmbSeExprType:0,txtExpression:""}) 
      }
    } catch (err) {
      toast.error("Unable to process request");
    }
  };

  

  const SaveExpressionValue = async (data) => {
    

    console.log(data);

    
    let frmData = { cmbScrId:data.cmbScreenId,txtExprGroupId:GroupExpid,txtSeExprTypeId:data.cmbSeExprType,
                txtSeExprnId:data.txtSeExprnId,txtParentSeExprnId:data.txtParentSeExprnId,
                txtExpression:data.txtExpression};

         
    const UpdateExpression = apiendpoints.UpdateExpression;


    console.log(frmData);

    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "UpdateExpression",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        UpdateExpression,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully expression updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);

          // ResetScreenValue();
           FetchExpGrpListtree(data.cmbScreenId,GroupExpid)
         // setScreenid(data.cmbScreenId);
         // FetchExpGrpList(data.txtExprGroupId);
         
          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }       



  }

  const onSubmitHandler = async (data) => {
    
    
       if(data.txtExpGroupName==undefined)
          return;

    let frmData = { cmbScrId:data.cmbScreenId, txtExprGroupId:data.txtExprGroupId,txtSeExpGroupName:data.txtExpGroupName};

    const updExpressionGroup = apiendpoints.UpdExpressionGroup;





    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "updExpressionGroup",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        updExpressionGroup,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          // ResetScreenValue();


       
          setScreenid(data.cmbScreenId);
          FetchExpGrpList(data.txtExpGroupId);
          FetchExpGrpListtree(data.cmbScreenId,data.txtExpGroupId)

          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  }


  //---------------onSubmitHandler end------

  
  function AddParentExpression(rowval)  
  {
    reset({ txtSeExprnId: "", txtParentSeExprnId: "0",cmbSeExprType:0,txtExpression:""})  
  }
  
  function SetScreenValue(rowval)  
  {
    console.log(rowval);
    FetchExpGrpListtree(Screenid,rowval.egid)
   
    reset({ txtExprGroupId: rowval.egid, txtExpGroupName: rowval.egname,txtSeExprnId: "", txtParentSeExprnId: "",cmbSeExprType:0,txtExpression:""}) 
    setGroupExpid(rowval.egid)
  }

  function ResetScreenValue()  
  {
    
    reset({cmbScreenId:"0" , txtExprGroupId: "", txtExpGroupName: "",txtSeExprnId: "", txtParentSeExprnId: "",cmbSeExprType:0,txtExpression:""})    
    settreedata([]);



  }

  
  // Event Function End

  // Main Function

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };


  // popup table methods

  const [rowsData, setRowsData] = useState([]);

  const addTableRows = () => {
    const rowsInput = {
      cmbElmId: "",
      txtColIdx: "",
     
    };
    setRowsData([...rowsData, rowsInput]);     

   

  };


  const deleteTableRows = (index) => {
    const rows = [...rowsData];
    rows.splice(index, 1);
    setRowsData(rows);
  };

  const handleChange = (index, evnt) => {
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  };

  

  // Popup submit

  const onGridModalSubmitHandler = async (data) => {
   
    let frmData = { cmbScrId:data.cmbScreenId,txtSeExprnId:data.txtpopupScexpnId, cmbCompDbId:data.cmbDbShortName,cmbElmGrpId:data.CmbGrpElementId,
          cmbBindTy:data.txtBindingType, map:rowsData};

    const UpdateQxMap = apiendpoints.UpdateQxMap;

    console.log(frmData);


    
    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "UpdateQxMap",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //
      const response = await api.post(
        UpdateQxMap,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
          setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          toast.success("Successfully updated");
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          // ResetScreenValue();
       
           setRowsData([]) 
           reset({txtpopupScexpnId:"", cmbDbShortName: "", CmbGrpElementId: "",txtBindingType: ""})                    
           setLoanding(false);
           setgridShow(false)
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }



  }
  //--Grid submit -end

  function tableToJson(table) {
    try {
      var data = []; // first row needs to be headers
      var headers = [];
      for (var i = 0; i < table.rows[0].cells.length; i++) {
        if (
          table.rows[0].cells[i].innerHTML.toLowerCase().indexOf("button") == "-1"
        ) {
          headers[i] = table.rows[0].cells[i].innerHTML.replace(/ /gi, "");
        }
      }
      // go through cells
      for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = {};
        for (var j = 0; j < tableRow.cells.length - 1; j++) {
          rowData[headers[j]] = fetchstringinputboxvalue(
            tableRow.cells[j].innerHTML
          );
        }
        data.push(rowData);
      }
      return data;
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
    }
  }

    function fetchstringinputboxvalue(str)
    {
      var val ;   
      val = (str.substr(str.indexOf('value'),500).replace("value=","")).replace(">","")                    

      return val.replace('"',"").replace('"',"").trimEnd(); ;
    }


  

  const TreeNode = ({ node }) => {

    const hasChildren = node.children.length > 0;

    const handleAdd = () => {
      // Add logic here for handling add button click
      console.log(`Add clicked for node ${node.id}`);

      var value = actualtreedata.filter(function(item) {
        return item.exprnid == node.id
      })
  
      console.log(value);
      var aryval = value[0]

      reset({ txtParentSeExprnId: aryval.exprnid })   
    };
  
    const handleEdit = () => {
      // Add logic here for handling edit button click
      console.log(`Edit clicked for node ${node.id}`);
    

        var value = actualtreedata.filter(function(item) {
          return item.exprnid == node.id
        })
    
        console.log(value);
        var aryval = value[0]

        reset({ txtSeExprnId: aryval.exprnid, txtParentSeExprnId: aryval.prexprnid,cmbSeExprType:aryval.exprntyid,txtExpression:aryval.exprn })    

    };

    const handleDelete = () => {
      
      var value = actualtreedata.filter(function(item) {
        return item.exprnid == node.id
      })
  
      console.log(value);
      var aryval = value[0]
      DeleteExpression(aryval.exprnid)
      
    };

    const handleUp = () => {
      
      var value = actualtreedata.filter(function(item) {
        return item.exprnid == node.id
      })
  
      console.log(value);
      var aryval = value[0];
      var dir = "U";
      ReorderExpression(aryval.exprnid,dir)
      
    };

    const handleDown = () => {
      
      var value = actualtreedata.filter(function(item) {
        return item.exprnid == node.id
      })
  
      console.log(value);
      var aryval = value[0]
      var dir = "D";
      ReorderExpression(aryval.exprnid,dir)
      
    };
  

    // Popup  window event

    const handlepopup =async() => {
      
        FetchScreenChildElements(0, Screenid);

      var value = actualtreedata.filter(function(item) {
        return item.exprnid == node.id
       })
      var aryval = value[0]
      setScExprnId(aryval.exprnid)   
      reset({ txtpopupScexpnId: aryval.exprnid})   
      console.log(aryval.exprnid);

     
          
     
      if (ScExprnId!=aryval.exprnid)
      {
         setRowsData([])        
      
        const qxmpresponse= await Getqxmap(Screenid,aryval.exprnid);
      
        console.log(qxmpresponse);
        if (qxmpresponse.body.expdet !=undefined)
        {      
           
          reset({cmbDbShortName: qxmpresponse.body.expdet.compdbid, txtBindingType: qxmpresponse.body.expdet.bindty,
                                                                   CmbGrpElementId:qxmpresponse.body.expdet.elmgrpid})           

        }
        
       

        if (qxmpresponse.body.expmap !=undefined)
        {  
         
            qxmpresponse.body.expmap.forEach(function (itm) {    
            const rowsInput = {
              cmbElmId: itm.elmid,
              txtColIdx: itm.colnaidx,             
            };
            addTableRows() 
            setRowsData([...rowsData, rowsInput]);
          }
          )
        }
  
       
      }
     
      gridhandleShow();

    };



      


  
  
    return (

      <div>

  
         <div className="row">
         <div className="col-sm">
         <div className="mb-3">
         <span >  <span className="content" dangerouslySetInnerHTML={{__html: node.name}}></span> 
       
                           
        <button  onClick={handleAdd} class="btn btn-light"><i class="fa fa-plus"></i></button>
        <button onClick={handleEdit} class="btn btn-light"><i class="fa fa-edit"></i></button>
        <button onClick={handleDelete} class="btn btn-light"><i class="fa fa-trash-o"></i></button> 
        <button onClick={handleUp} class="btn btn-light"><i class="fa fa-arrow-up"></i></button>
        <button onClick={handleDown} class="btn btn-light"><i class="fa fa-arrow-down"></i></button>  
        <button onClick={handlepopup} class="btn btn-light"><i className="bi bi-grid"></i></button>
       

         </span>
        </div>
        </div>
       
        </div>
        

        {hasChildren && (
          <ul>
            {node.children.map(childNode => (
              <li key={childNode.id}>
                <TreeNode node={childNode} />
              </li>
            ))}
          </ul>
        )}
       
      </div>
    );
  };
  

  try {
    return (
      <>
        <section className="vh-100">
          <div className="container h-100">
            {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">Event Definer </strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <form
                        onSubmit={handleSubmit(onSubmitHandler)}
                        autocomplete="off"
                      >
                        <label htmlFor="cmbScreenId" className="form-label">
                          Screen
                        </label>
                        <select
                          {...register("cmbScreenId")}
                          className="form-control"
                          onChange={ScreenOnChange}
                        >
                          <option value="0">- Select -</option>
                          {
                            //Combo Data binding

                            screenfilterlist.map((res) => (
                              <option key={res.ScreenId} value={res.ScreenId}>
                                {res.ScrName}
                              </option>
                            ))
                          }
                        </select>
                        <p>{errors.cmbScreenId?.message}</p>
                        
                        <label htmlFor="txtExpGroupName" className="form-label">
                          {" "}
                          Expression Group Name
                        </label>
                        <input
                          {...register("txtExpGroupName")}
                          type="text"
                          className="form-control"
                        />
                        <p>{errors.txtExpGroupName?.message}</p>
                        <button type="submit" className="btn btn-primary">
                          Save Group
                        </button>
                      
                   <div className="row">

                   <div className="col-sm">
                          <div className="mb-3">
                            <label
                              htmlFor="txtExprGroupId"
                              className="form-label"
                            >
                              {" "}
                              Exp. Group Id
                            </label>
                            <input
                              {...register("txtExprGroupId")}
                              type="text"
                              className="form-control"
                              disabled="disabled"
                              readonly="readonly"
                            />
                            <p>{errors.txtExprGroupId?.message}</p>
                          </div>
                        </div>

              
                  <div className="col-sm">
                          <div className="mb-3">
                            <label
                              htmlFor="txtParentSeExprnId"
                              className="form-label"
                            >
                              {" "}
                              Parent Exp Id
                            </label>
                            <input
                              {...register("txtParentSeExprnId")}
                              type="text"
                              className="form-control"
                              disabled="disabled"
                              readonly="readonly"
                            />
                            <p>{errors.txtParentSeExprnId?.message}</p>
                          </div>
                        </div>

                        <div className="col-sm">
                          <div className="mb-3">
                            <label
                              htmlFor="txtSeExprnId"
                              className="form-label"
                            >
                              {" "}
                              Expression Id
                            </label>
                            <input
                              {...register("txtSeExprnId")}
                              type="text"
                              className="form-control"
                              disabled="disabled"
                              readonly="readonly"
                            />
                            <p>{errors.txtSeExprnId?.message}</p>
                          </div>
                        </div>
                       

                </div>
                        <label htmlFor="scrid" className="form-label">
                        Expression Type
                      </label>

                      <select
                        {...register("cmbSeExprType")}
                        //value={DBid}
                        className="form-control"
                         onChange={onDBChange}
                      >
                        {<option value="0">-select-</option>}
                        {
                          //Combo Data binding

                          resbody.map((res) => (
                            <option key={res.v} value={res.k}>
                              {res.v}
                            </option>
                          ))
                        }
                      </select>

                      <p>{errors.cmbSeExprType?.message}</p>

                      <label htmlFor="txtExpression" className="form-label">
                        {" "}
                        Expression
                      </label>
                      <textarea
                        {...register("txtExpression")}
                        type="textarea"
                        height={20}
                        className="form-control"
                      />

                      <p>{errors.txtExpression?.message}</p>

                      <button
                        type="submit"
                        onClick={handleSubmit(SaveExpressionValue)}
                        class="btn btn-primary"
                      >
                        Save Expression
                      </button>

                       
                </form>


                      <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Exp Group Id</th>
                    <th>Group Name</th>
                    <th>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          ResetScreenValue();
                        }}
                      >
                        {" "}
                        <i className="bi bi-table"></i> Add{" "}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ExpGrpresbody &&
                    ExpGrpresbody.map((x) => {
                      return (
                        <tr>
                          <td>{x.egid}</td>
                          <td>{x.egname}</td>

                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SetScreenValue(x);
                              }}
                            >
                              {" "}
                              <i className="bi bi-pen"></i>
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() => {
                                DeleteGroup(x);
                              }}
                            >
                              {" "}
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                    
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          AddParentExpression();
                        }}
                      >
                        {" "}
                        <i className="bi bi-table"></i> Tree Root
                      </button>
                      <div>.</div>
                      <div>
                      
                        <Scrollbar style={{ height: 700 }}>
                  
                        
                          {treedata.map((node) => (
                        
                         <TreeNode key={node.id} node={node} />
                         
                          ))}
                         
                        
                          
                        </Scrollbar>
                      </div>

                    </div>
                  </div>
                </div>

              
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3"></div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <div className="row">
                       
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                     
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3">
                     
                    </div>
                  </div>
                </div>
              </div>

          
            </div>
          </div>
        </section>


        <Modal
          show={gridshow}
          onHide={gridhandleClose}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{gridname} Grid Property</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              
              autocomplete="off"
            >
              <div className="row">

                <div className="col-sm">
                <div className="mb-3">
                <label htmlFor="txtpopupScexpnId" className="form-label">
                      
                         Expression Id
                      </label>
                      <input
                        value={ScExprnId}
                        {...register("txtpopupScexpnId")}
                        type="text"
                        className="form-control"
                      />
                  <p>{errors.txtpopupScexpnId?.message}</p>
                </div>
              </div>

                <div className="col-sm">
                  <div className="mb-3">
                  <label htmlFor="scrid" className="form-label">
                          DB short Name
                        </label>

                        <select
                          {...register("cmbDbShortName")}
                          value={DBid}
                          className="form-control"  
                          onChange={onDBChange}                      
                        >
                          {<option value="0">-select-</option>}
                          {                           
                            cmbctlres.map((res) => (
                              <option key={res.v} value={res.k}>
                                {res.k}
                              </option>
                            ))
                          }
                        </select>
                  </div>
                </div>
               

                <div className="col-sm">
                  <div className="mb-3">
                  <label
                            htmlFor="CmbGrpElementId"
                            className="form-label"
                          >
                            Group Element
                          </label>

                          <select
                            value={ParentElementId}
                            {...register("CmbGrpElementId")}
                            className="form-control"  
                            onChange={OnGroupIdChange}                          
                          >
                            {<option value="100">-select-</option>}
                            {GroupElements &&
                              GroupElements.map((res) => (
                                <option key={res.elna} value={res.elid}>
                                  {res.elna}
                                </option>
                              ))}
                          </select>

                  </div>
                </div>

                <div className="col-sm">
                  <div className="mb-3">
                  <label htmlFor="txtBindingType" className="form-label">
                          {" "}
                           Binding Type
                        </label>
                        <input
                          {...register("txtBindingType")}
                          type="text"
                          className="form-control"
                        />
                    <p>{errors.txtBindingType?.message}</p>
                  </div>
                </div>
               
              </div>

              <div className="row">
                <table  id="tblgridprop" className="table">
                  <thead>
                    <tr>
                      <th>Element</th>
                      <th>Index/column Name</th>
                      
                      <th>
                        <button type="button"
                          className="btn btn-outline-success"
                          onClick={() => addTableRows()}
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <TableRows
                      rowsData={rowsData}
                      deleteTableRows={deleteTableRows}
                      handleChange={handleChange}   
                      combodata={childelms}                   
                    />
                  </tbody>
                </table>
              </div>
              <div className="col-sm-4"></div>

              <Modal.Footer>
                <Button variant="secondary" onClick={gridhandleClose}>
                  Close
                </Button>
                <Button type="submit"  onClick= {handleSubmit(onGridModalSubmitHandler)} variant="secondary">
                  Update 
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default EventDefiner;