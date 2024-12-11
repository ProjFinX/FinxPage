import React, { useState, useEffect, useMemo, useRef } from "react";
import api from "./api/Webcall";
import appsettings from "../appsettings.json";
import {
  generateUUID,
  compressLZW,
  decompressLZW,
  compressBase64,
  decompressBase64,
  getPostData,
} from "./utilities/utils";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { RowClickedEvent } from "ag-grid-community";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Link,
} from "react-router-dom";

const DashBoard = () => {
  const apiendpoints = appsettings.ApiEndpoints;

  const [active, setActive] = useState(null);

  const [columnDefs, setcolumnDefs] = useState(null);

  const gridRef = useRef();

  const navigate = useNavigate();

  const [steTaskListCountdata, setTaskListCountdata] = useState(null);

  const [rowData, setRowData] = useState([]);

  const [stageDetails, setstagedetails] = useState(null);

  const randomcolors = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
  ];

  useEffect(() => {
    Getinbox();
  }, []);

  // never changes, so we can use useMemo
  // const columnDefs = useMemo(() => [
  //     {
  //         field: 'QId', headerName: 'QId', filter: 'agTextColumnFilter',
  //         filterParams: {
  //             buttons: ['reset', 'apply'],
  //         },
  //     },
  //     {
  //         field: 'txt_FirstName', headerName: 'First Name', filter: 'agTextColumnFilter',
  //         filterParams: {
  //             buttons: ['reset', 'apply'],
  //         },
  //     },
  //     {
  //         field: 'txt_NRCId', headerName: 'NRC Id', filter: 'agTextColumnFilter',
  //         filterParams: {
  //             buttons: ['reset', 'apply'],
  //         },
  //     },
  //     {
  //         field: 'UpdatedBy', headerName: 'Last Updated by', filter: 'agTextColumnFilter',
  //         filterParams: {
  //             buttons: ['reset', 'apply'],
  //         },
  //     },
  //     {
  //         field: 'UpdatedOn', headerName: 'Last Updated On', filter: 'agDateColumnFilter',
  //         filterParams: {
  //             buttons: ['reset', 'apply'],
  //         },
  //     }
  // ], []);

  const Getinbox = async () => {
    const TaskListConsturl = apiendpoints.TaskListCount;

    let frmData = {};

    var data = getPostData("TaskListCount", frmData);

    const TaskListCount = await api.post(
      TaskListConsturl,
      compressBase64(data)
    );

    const TaskListCountdata = JSON.parse(decompressBase64(TaskListCount.data));

    debugger;

    console.log(TaskListCountdata);

    setTaskListCountdata(TaskListCountdata.body.TaskCnt);

    console.log(steTaskListCountdata);
  };

  const loadInboxdetails = (scrid, stgid, pg, rpp) => {
    GetinboxDetails(scrid, stgid, 1, 999999);

    setActive(stgid);

    setstagedetails({ scrid: scrid, stgid: stgid });
  };

  const GetinboxDetails = async (scrid, stgid, pg, rpp) => {
    let frmData = {};
    frmData["scrid"] = scrid;
    frmData["stgid"] = stgid;
    frmData["pg"] = pg;
    frmData["rpp"] = rpp;

    const TaskListurl = apiendpoints.TaskList;

    const data = getPostData("TaskList", frmData);

    const TaskList = await api.post(TaskListurl, compressBase64(data));

    let TaskListdata = JSON.parse(decompressBase64(TaskList.data));

    debugger;

    let coldef = [];

    /* Default headers */
    coldef = [
      {
        field: "QId",
        headerName: "QId",
        filter: "agTextColumnFilter",
        filterParams: {
          buttons: ["reset", "apply"],
        },
      },
    ];

    TaskListdata.body.colhdr.map((item) => {
      coldef.push({
        field: item.ElmName,
        headerName: item.Header,
        filter: "agTextColumnFilter",
        filterParams: {
          buttons: ["reset", "apply"],
        },
      });
    });

    /* Default headers */
    coldef.push(
      ...[
        {
          field: "UpdatedBy",
          headerName: "Last Updated by",
          filter: "agTextColumnFilter",
          filterParams: {
            buttons: ["reset", "apply"],
          },
        },
        {
          field: "UpdatedOn",
          headerName: "Last Updated On",
          filter: "agDateColumnFilter",
          filterParams: {
            buttons: ["reset", "apply"],
          },
        },
      ]
    );

    setRowData(TaskListdata.body.data);

    setcolumnDefs(coldef);

    console.log(TaskListdata);
  };

  const onRowClicked = (RowClickedEvent) => {
    const oncescreeurl =
      "../OneScreen?scrid=" +
      stageDetails.scrid +
      "&stgid=" +
      stageDetails.stgid +
      "&qid=" +
      RowClickedEvent.data.QId;

    navigate(oncescreeurl);

    console.log(RowClickedEvent);
  };

  const defaultcoldefs = useMemo(
    () => ({
      flex: 2,
      alwaysShowHorizontalScroll: true,
      resizable: true,
    }),
    []
  );

  const random_item = (items) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  console.log(steTaskListCountdata);

  return (
    <>
      <div className="row">
        <div className={`${active ? "col-3" : "row"}`}>
          {steTaskListCountdata
            ? steTaskListCountdata.length
              ? steTaskListCountdata.map((item) => {
                  return (
                    <div className={`${active ? "col-12" : "col-4"}`}>
                      <div
                        className={`card border-${random_item(
                          randomcolors
                        )} border-start border-5`}
                      >
                        <div className="card-body ">
                          <h5 className="mt-2">{item.ScrName}</h5>

                          <div
                            id={item.ScrId}
                            className="text-secondary list-group  "
                          >
                            {item.Stage.map((childitem) => {
                              return (
                                <a
                                  key={childitem.StgId}
                                  className={` d-flex justify-content-between list-group-item list-group-item-action ${
                                    active == childitem.StgId && "active"
                                  }  align-items-center`}
                                  style={{ cursor: "pointer" }}
                                  onClick={(e) =>
                                    loadInboxdetails(
                                      item.ScrId,
                                      childitem.StgId
                                    )
                                  }
                                >
                                  {" "}
                                  {childitem.StgName}
                                  <span className="badge bg-success rounded-pill">
                                    {childitem.Cnt}
                                  </span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""
            : ""}
        </div>
        {active ? (
          <div className="col-9">
            <div className="ag-theme-alpine">
              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultcoldefs}
                domLayout={"autoHeight"}
                stopEditingWhenCellsLoseFocus
                onRowClicked={onRowClicked}
                pagination
                paginationPageSize={20}
              ></AgGridReact>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

const openbutton = () => {
  return <></>;
};

export default DashBoard;
