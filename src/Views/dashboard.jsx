import React, { useState, useEffect, useMemo, useRef } from "react";

import { FetchCombodata } from "../components/utilities/combodata";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useCallback, memo, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import GrDateBox from "../components/dynamiccontents/controls/GridComponents/GrDateBox";
import GrComboBox from "../components/dynamiccontents/controls/GridComponents/GrComboBox";
import GrFile from "../components/dynamiccontents/controls/GridComponents/GrFile";
import GrMultilineBox from "../components/dynamiccontents/controls/GridComponents/GrMultilineBox";
import GrNumericBox from "../components/dynamiccontents/controls/GridComponents/GrNumericBox";
import GrButton from "../components/dynamiccontents/controls/GridComponents/GrButton";
import GrHeader from "../components/dynamiccontents/controls/GridComponents/GrHeader";
import GrModal from "../components/dynamiccontents/controls/GridComponents/GrModal";
import GrGrid from "../components/dynamiccontents/controls/GridComponents/GrGrid";


const DashBoard = () => {
  const gridRef = useRef();
  const formmethods = useForm();

  const[modaldata , setModalData] = useState(null)
  var griddata = {}

  const onSubmit = (data) => {
    let rowData = [];
    gridRef.current.api.forEachNode((node) => rowData.push(node.data));

    console.log(data);
    console.log(rowData);
    return rowData;
  };

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    watch,
    formState: { errors },
  } = formmethods;

  const [rowData, setRowData] = useState([
    {
      id: 1,
      Institution: "MFL",
      LoanRef: "MF85216",
      LoanAmount: 50000,
      EMI: 2500,
      BalanceDue: 60000,
    },
    {
      id: 2,
      Institution: "tyt",
      LoanRef: "lN9434343",
      LoanAmount: 80000,
      EMI: 2500,
      BalanceDue: 60000,
    },
    {
      id: 3,
      Institution: "frd",
      LoanRef: "FACBV434",
      LoanAmount: 9000,
      EMI: 2500,
      BalanceDue: 60000,
    },
    {
      id: 4,
      Institution: "Lion",
      LoanRef: "LNKFDH434343",
      LoanAmount: 350000,
      EMI: 2500,
      BalanceDue: 60000,
    },
    {
      id: 5,
      Institution: "Atlasmara",
      LoanRef: "AT4343343",
      LoanAmount: 90000,
      EMI: 2500,
      BalanceDue: 60000,
    },
    {
      id: 6,
      Institution: "FNB",
      LoanRef: "454330001034898",
      LoanAmount: 40000,
      EMI: 2500,
      BalanceDue: 60000,
    },
  ]);

  // supporting reference data
  const carMappings = [
    {
      k: "tyt",
      v: "Toyota",
    },
    {
      k: "frd",
      v: "Ford",
    },
    { k: "prs", v: "Porsche" },
    { k: "nss", v: "Nissan" },
  ];

  var carBrands = extractValues(carMappings);

  function lookupValue(mappings, key) {
    let obj = mappings.find((o) => o.k === key);

    return !obj ? "" : obj.v;
  }
  function lookupKey(mappings, key) {
    let obj = mappings.find((o) => o.k === key);
    return !obj ? "" : obj.k;
  }

  function extractValues(mappings) {
    return Object.keys(mappings);
  }

  

  const passdatatoModal =  (params) =>{
    debugger;
   alert(params.node.data.id)
  };

  // convert code to value
  function makeValueFormatter(params) {
   /* if(lookupValue(carMappings, params.value) ==""){

      var rowNode = gridRef.current.api.getRowNode(params.data.id);
      rowNode.setDataValue(params.colDef.field, ""newPrice"");

    } */
    return lookupValue(carMappings, params.value);
  }

  // convert value to code
  function makeValueParser(params) {
    return lookupKey(carMappings, params.value);
  }

  const [columnDefs, setColumndefs] = useState([
    { headerName: "Row ID", valueGetter: "node.id" },
    {
      field: "Institution",
      cellEditor: GrComboBox,
      editable: true,
      cellEditorParams: { values: carMappings },
      valueFormatter: makeValueFormatter,
      valueParser: makeValueParser ,
    },
    { field: "LoanRef", headerName: "Loan No", editable: true },
    { field: "LoanAmount", editable: true, cellEditor: GrNumericBox },
    { field: "EMI", editable: true, cellEditor: GrNumericBox },
    { field: "LoanDate", editable: true, cellEditor: GrDateBox },
    {
      field: "LoanDetails",
      editable: true,
      cellEditor: "agLargeTextCellEditor",
      cellEditorPopup: true,
    },
    { field: "LoanDocument", cellRenderer: GrFile },
    { field: "ScheduleDetails", cellRenderer: GrModal , cellRendererParams:{
      clicked: function(field) {
        alert(`${field} was clicked`);
        setModalData(field)
        
      },
    },
  }
  ]);

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);





  // render the data grid

  // Function to increment count by 1
  const incrementCount = async () => {
    // Update state with incremented value

    const opt = "|psm|";
    const optw = "";
    debugger;
    const response = await FetchCombodata(opt, optw);

    console.log(JSON.stringify(response));
  };

  const defaultcoldefs = useMemo(
    () => ({
      resizable: true,
      flex: 1,
    }),
    []
  );

  const addItems = useCallback((addIndex) => {
    const res = gridRef.current.api.applyTransaction({
      add: [{}],
      addIndex: addIndex,
    });
  }, []);

  const onRemoveSelected = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const res = gridRef.current.api.applyTransaction({ remove: selectedData });
  }, []);

  return (
    <>

    
<button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          
        >
          Launch static backdrop modal
        </button>


  <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      {modaldata?modaldata.LoanRef : ""}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row ">
        <div className="d-flex">

        <button type="submit" className="btn btn-primary justify-content-end">Submit</button>

        </div>
        </div>
        <GrHeader add={addItems} remove ={onRemoveSelected} header="Loan Details" ></GrHeader>

        <div className="ag-theme-alpine" style={{ height: 500 }}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultcoldefs}
            singleClickEdit
            stopEditingWhenCellsLoseFocus
            rowSelection="multiple"
            pagination
          ></AgGridReact>
        </div>
      </form>

      
<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Modal title</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      {modaldata?modaldata.LoanRef : ""}
      {GrGrid}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>





    </>
  );
};

export default DashBoard;
