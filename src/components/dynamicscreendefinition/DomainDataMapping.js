import React from "react";
import { useState, useEffect, useRef } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";

import { GetAllScreenList } from "../utilities/getallscreen";
import { GetDBTableList } from "../utilities/getdbtablelist";
import { GetScreenGroupElms } from "../utilities/getscrengrpelms";
import { GetTableColumn } from "../utilities/gettablecolumn";

import { GetDomainDataMap } from "../utilities/getdomaindatamap";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import appsettings from "../../appsettings.json";
import DMelemDropdown from "./DMelemDropdown";
const apiendpoints = appsettings.ApiEndpoints;

const schema = yup.object().shape({
  txtDDName: yup.string().required("Pls Provide the Domain Data mappe Name"),
});

// cmbScrid: Screenid,
// txtDDMapId:data.txtDDMapId,
// txtDDName: data.txtDDName,
// cmbDbShotName:data.cmbDbShotName ,
// cmbTblName:data.cmbTblName ,
// txtPrKey:data.txtPrKey,
// cmbGrpElementId:data.cmbGrpElementId,

// function tableToJson(table) {
//   var data = [];
//   for (var i = 1; i < table.rows.length; i++) {
//     var tableRow = table.rows[i];
//     var rec = {};
//     var rowData = [];

//     for (var j = 0; j < tableRow.cells.length; j++) {
//       rowData.push(tableRow.cells[j].innerHTML);
//     }

//     var res = fetchstringcombovalue(rowData[3]);
//     rec = { tc: res, eid: rowData[0] };

//     data.push(rec);
//   }
//   return data;
// }

// function fetchstringcombovalue(str) {
//   var val;
//   val = str
//     .substr(str.indexOf("value"), 500)
//     .replace("value=", "")
//     .replace(">", "");

//   return val.replace('"', "").replace('"', "").trimEnd();
// }

//rfce - command
function DomainDataMapping() {
  const [isLoading, setLoanding] = useState(false);
  const [Screenid, setScreenid] = useState("");
  const [DBid, setDBid] = useState(0);
  const [screenfilterlist, setscreenfilterlist] = useState([]);
  const [tablelist, settablelist] = useState([]);
  const [Tableid, setTableid] = useState([]);
  const [GroupElements, setGroupElements] = useState([]);
  const [TableColumn, setTableColumn] = useState([]);
  const [PrkeyColumn, setPrkeyColumn] = useState("");
  const [childelms, setscrchildelms] = useState([]);
  const [ParentElementId, setParentElementId] = useState(100);
  const [ColName, SetColName] = useState("");
  const [ddmres, setddmres] = useState([]);
  const [Tablename, setTablename] = useState("");
  const [DDMapId, setDDMapId] = useState("");
  const [cmbctlres, setctlres] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const FetchAllScreenList = async () => {
    const ScreenListResponse = await GetAllScreenList();
    setscreenfilterlist(
      ScreenListResponse.body.Screens.filter((res) => res.IsActive == true)
    );
  };

  const ontblcolChange = (e, id) => {
    
    const updatedTableColumn = TableColumn.map((key) => {
      if (key.id === id) {
        //key.tblelm = e.target.value;

        return { ...key, tblelm: e.target.value };
      } else {
        return key;
      }
    });
    return setTableColumn(updatedTableColumn);
  };

  // Const & Var

  //   fetch combo values

  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|CTBL|DDM|";
    const optw = "";

    const Response = await FetchCombodata(opt, optw);

    setctlres(Response.body.ctbl);

    setddmres(Response.body.ddm);
    
  };

  //Event   methoth

  //-------------1 ---- Domain Data Main combo ------------------------------

  const DDMapperOnChange = (e) => {
    FetchDDMapper(e.target.value);
    setDDMapId(e.target.value);
  };

  const FetchDDMapper = async (DDMapId) => {
    reset({
      cmbScrid: 0,
      txtDDName: "",
      cmbDbShortName: "",
      cmbTblName: "",
      txtPrKey: "",
      CmbGrpElementId: 100,
    });

    setPrkeyColumn("");
    setTableColumn([]);

    const GroupElmsResponse = await GetDomainDataMap(DDMapId);
    
    var ddmres = GroupElmsResponse.body;

    reset({
      cmbScrid: ddmres.scrid,
      txtDDName: ddmres.ddname,
      cmbDbShortName: ddmres.shorname,
      cmbTblName: ddmres.tblname,
      txtPrKey: ddmres.prkey,
      CmbGrpElementId: ddmres.grpeid,
    });

    setScreenid(ddmres.scrid);
    setDBid(ddmres.shorname);
    FetchGroupElements(ddmres.scrid);
    setTablename(ddmres.tblname);
    setPrkeyColumn(ddmres.prkey);
    setParentElementId(ddmres.grpeid);
    var tl = await FetchTableList(ddmres.scrid, ddmres.shorname);

    
    var value = tl.filter(function (item) {
      return item.na == ddmres.tblname;
    });
    var aryval = value[0];
    FetchScreenChildElements(ddmres.grpeid, ddmres.scrid);
    const tablecl = await FetchTableColumn(
      ddmres.scrid,
      ddmres.shorname,
      aryval.id
    );

    
    let updatedTableColumn = [...tablecl];

console.log(updatedTableColumn);

    ddmres.colmap.forEach((parentkey) => {
      updatedTableColumn.forEach((childkey) => {
        if (childkey.na === parentkey.tc) {
          childkey.tblelm = parentkey.eid;
        }
      });
    });
    setTableColumn(updatedTableColumn);
    setTableid(aryval.id);


  };

  //---------------------1 combo event end--------------------------------

  //--------------------2 screen combo-----------------------------------

  const ScreenOnChange = (e) => {
    setScreenid(e.target.value);
    FetchGroupElements(e.target.value);
  };

  const FetchGroupElements = async (srid) => {
    const GroupElmsResponse = await GetScreenGroupElms(srid);
    setGroupElements(GroupElmsResponse.body.elements);
  };

  //------------------------2 screen combo end-------------------------

  // -----------------------3 DB Name combo -------------------------------

  const onDBChange = (e) => {
    
    setDBid(e.target.value);
    FetchTableList(Screenid, e.target.value);
  };

  const FetchTableList = async (Screenid, idbid) => {
    const TableListResponse = await GetDBTableList(Screenid, idbid);
    settablelist(TableListResponse.body.tbls);

    return TableListResponse.body.tbls;
  };

  //-----------------------3-DB combo end ------------------

  //-----------------------4- Table combo ---------------------

  const OnTableListChange = (e) => {
    
    var value = tablelist.filter(function (item) {
      return item.na == e.target.value;
    });

    var aryval = value[0];

    FetchTableColumn(Screenid, DBid, aryval.id);

    setTablename(e.target.value);
    setTableid(aryval.id);
  };

  const FetchTableColumn = async (srid, dbid, tblid) => {
    const TableColumnResponse = await GetTableColumn(srid, dbid, tblid);

    TableColumnResponse.body.cols.forEach(function (itm) {
      itm.tblelm = "";
    });

    setTableColumn(TableColumnResponse.body.cols);
    setPrkeyColumn(TableColumnResponse.body.prkey);

    return TableColumnResponse.body.cols;
  };

  //-----------------------4 - Table column end-------------

  //------------------------5-  Group element Combo ----------
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
  //------------------------5-- Group combo element end--------

  //----Main submit method-------------------------------

  const onSubmitHandler = async (data) => {
    var tbldata = [];
    var rec = {};

    TableColumn.forEach((key) => {
      if (key.tblelm != "") {
        rec = { tc: key.na, eid: key.tblelm };
        tbldata.push(rec);
      }
    });

    var DDMapId = data.txtDDMapid;
    if (DDMapId === "undefined") {
      DDMapId = "0";
    }

    

    let frmData = {
      cmbScrid: Screenid,
      txtDDMapId: DDMapId,
      txtDDName: data.txtDDName,
      cmbDbShotName: data.cmbDbShortName,
      txtTblName: Tablename,
      cmbTblName: Tableid,
      txtPrKey: PrkeyColumn,
      cmbGrpElementId: data.CmbGrpElementId,
      colmap: tbldata,
    };

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "updateelement",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };
    const Updatedomaindatamapping = apiendpoints.UpdtDomainDataMapping;

    try {
      //
      const response = await api.post(
        Updatedomaindatamapping,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        toast.error(JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          toast.success("Successfully updated");
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      setLoanding(false);
    }
  };

  //-------------Main submit method end----------------------------

  // Useeffect

  useEffect(() => {
    LoadCombo();
    FetchAllScreenList();
  }, []);

  // Useeffect

  useEffect(() => {}, [childelms, DDMapId, tablelist, TableColumn]);

  useEffect(() => {}, [TableColumn]);

  try {
    return (
      <>
        <section className="vh-100">
          <div className="container h-100">
            {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">Domain Data Mapping</strong>
              </div>
              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <form
                  onSubmit={handleSubmit(onSubmitHandler)}
                  autocomplete="off"
                >
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtDDMapid" className="form-label">
                          Edit Domain Data
                        </label>

                        <select
                          {...register("txtDDMapid")}
                          className="form-control"
                          onChange={DDMapperOnChange}
                        >
                          <option value="0">- Select -</option>
                          {
                            //Combo Data binding

                            ddmres.length > 0 &&
                              ddmres.map((res) => (
                                <option key={res.k} value={res.k}>
                                  {res.v}
                                </option>
                              ))
                          }
                        </select>
                        <p>{errors.txtDDMapid?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtDDName" className="form-label">
                          Domain Data Name
                        </label>
                        <input
                          {...register("txtDDName")}
                          type="text"
                          className="form-control"
                          id="txtDDName"
                        />
                        <p>{errors.txtDDName?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <div>
                          <label htmlFor="cmbScrid" className="form-label">
                            Screen
                          </label>

                          <select
                            {...register("cmbScrid")}
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
                          <p>{errors.cmbScrid?.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
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
                            //Combo Data binding

                            cmbctlres.map((res) => (
                              <option key={res.v} value={res.k}>
                                {res.k}
                              </option>
                            ))
                          }
                        </select>

                        <p>{errors.cmbDbShortName?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <div>
                          <label htmlFor="cmbTblName" className="form-label">
                            Table List
                          </label>

                          <select
                            value={Tablename}
                            {...register("cmbTblName")}
                            className="form-control"
                            onChange={OnTableListChange}
                          >
                            {<option value="0">-select-</option>}
                            {
                              //Combo Data binding

                              tablelist &&
                                tablelist.map((res) => (
                                  <option key={res.id} value={res.na}>
                                    {res.na}
                                  </option>
                                ))
                            }
                          </select>
                          <p>{errors.cmbTblName?.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="txtPrkey" className="form-label">
                          primary Key
                        </label>

                        <input
                          {...register("txtPrkey")}
                          type="text"
                          className="form-control"
                          value={PrkeyColumn}
                        />

                        <p>{errors.txtPrkey?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3">
                        <div>
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
                          <p>{errors.CmbGrpElementId?.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="form-label">
                    Screen and Table Element Mapping
                  </label>
                  <Scrollbar style={{ width: 1200, height: 550 }}>
                    <Table striped bordered hover id="tblgridprop">
                      <thead>
                        <tr>
                          <th className="text-center">Id</th>
                          <th className="text-center">Column</th>
                          <th className="text-center">Element</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        
                          TableColumn &&
                          TableColumn.map((x) => {
                            return (
                              <tr>
                                <td>{x.id}</td>
                                <td>{x.na}</td>
                                <td>
                                  <DMelemDropdown
                                    options={childelms}
                                    value={x.tblelm}
                                    ontblcolChange={ontblcolChange}
                                    id={x.id}
                                  />
                                </td>

                                <td>{x.tblelm}</td>
                              </tr>
                            );
                          })
                          
                        }
                      </tbody>
                    </Table>
                  </Scrollbar>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default DomainDataMapping;
