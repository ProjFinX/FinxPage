import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import GrComboBox from "./GridComponents/GrComboBox";
import GrFile from "./GridComponents/GrFile";
import GrMultilineBox from "./GridComponents/GrMultilineBox";
import GrNumericBox from "./GridComponents/GrNumericBox";
import GrCheckbox from "./GridComponents/GrCheckbox";
import GrButton from "./GridComponents/GrButton";
import GrHeader from "./GridComponents/GrHeader";
import GrModal from "./GridComponents/GrModal";
import GrDateBox from "./GridComponents/GrDateBox";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import GrGrid from "./GridComponents/GrGrid";
import gridcoldefs from "./gridcoldefs.json";
import PopupForm from "./PopupForm";
import { useContext } from "react";
import { FormContext } from "../Contexts/FormContext";
import GrPopupForm from "./GridComponents/GrPopupForm";
import {
  Setup,
  ServerEventCaller,
  GridEventCaller,
  GridChildEventCaller,
  GridChildEventCallerOnSave,
} from "../BusinessLogics/EventHandler";
import { array, type } from "@amcharts/amcharts5";
import CustomDropdownEditor from "./GridComponents/CustomDropdownEditor";

const Grid = (defs) => {

  const {
    setStageGridRefs,
    stageGridRefs,
    combodata,
    setstageGridList,
    gridList,
    eDefHldr,
    setValue,
    getValues,
    stageElements,
    cntrData,
    setEventLoading,
    modalVisible,
    setModalVisible,
    seteDefHldr,
    setComboData
  } = useContext(FormContext);

  const FormContextdata = {
    getValues: getValues,
    stageGridRefs: stageGridRefs,
    stageElements: stageElements,
    cntrData: cntrData,
    setEventLoading,
    modalVisible,
    setModalVisible,
    eDefHldr,
    seteDefHldr,
    setComboData,
    combodata
  };

  const eDefHldrRef = useRef(eDefHldr);


  const FormContextdataRef = useRef(FormContextdata);

  useEffect(() => {
    eDefHldrRef.current = eDefHldr; // Keep ref updated with latest state
  }, [eDefHldr]);

  useEffect(() => {
    FormContextdataRef.current = FormContextdata; // Keep ref updated with latest state
  }, [FormContextdata]);





  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);

  stageGridRefs[defs.fieldname] = useRef();
  const gridRef = useRef();
  const [modaldata, setModalData] = useState(null);

  let ChildGridElements = [];

  let modaldefs = null;

  const [rowData, setRowData] = useState(
    defs.coldef.val == "" ? [] : defs.coldef.val
  );

  /* Load Custom components based on column control type */
  const gridComponents = {
    2: GrNumericBox,
    //3: GrComboBox,
    3 : GrComboBox,
    4: GrDateBox,
    9: GrFile,
    12: "agLargeTextCellEditor",
    13: GrButton,
    14: GrModal,
    7: GrCheckbox,
  };

  const colDef = [];

  // // supporting reference data
  // const carMappings = [
  //   {
  //     k: "tyt",
  //     v: "Toyota",
  //   },
  //   {
  //     k: "frd",
  //     v: "Ford",
  //   },
  //   { k: "prs", v: "Porsche" },
  //   { k: "nss", v: "Nissan" },
  // ];


  
  // Convert child object to array


  function getChildElements(elementName) {

    let data = eDefHldr.elms;
    const parentElement = data[elementName];
    if (!parentElement) {
        return [];
    }

    const parentEid = parentElement.eid;
    const childElements = [];

    // Loop through the data and find elements where pid matches the parentEid
    for (const key in data) {
        if (data[key].pid === parentEid) {
            childElements.push({ key, element: data[key] });
        }
    }

    return childElements;
}

// Example usage
let childArray  = getChildElements(defs.fieldname);



  childArray.map(item => {

    if (!defs.childUI.find(k => k.id == item.key)) {
      defs.childUI.push({
        "cap": item.key,
        "id": item.key,
        "typ": "hidden"
      })
    }
  })

  






  defs.childUI.forEach((item) => {
    const field = item.id;
    const element = {
      ...defs.cntrlsdata[field],
      ...defs.stagelementdata.prp[field],
    };

    // if (element.ty == "10" || element.ty == "14" && defs.fieldname) {
    if (element.ty == "10" || (element.ty == "14" && defs.fieldname)) {
      element.child = {};
      element.child[field] = {};
      element.fieldname = field;
      element.parentfieldanme = defs.fieldname;
      element.UI = findElementById(defs.stagelementdata.ui, field);
      ChildGridElements.push(element);
      //ChildGridElements.push(defs.stagelementdata.elms[defs.fieldname].child[field])
    }

    /* Defining Grid Column */
    if (gridComponents[element.ty]) {
      if (element.ty == "12") {
        element.internal = true;
        element.cellEditorPopup = true;
        // element.flex = 2
      } else if (element.ty == "9" || element.ty == "10") {
        element.renderer = true;
        // element.flex = 2
      } else if (element.ty == "14") {
        element.renderer = true;
        element.cellRendererParams = {};
        element.cellRendererParams.clicked = "clicked";
        element.cap = defs.cntrlsdata[element.fieldname].cap;
      } else if (element.ty == "3") {
        element.editor = true;
        element.valueFormatter = "makeValueFormatter";
        element.valueParser = "makeValueParser";

        //  element.flex = 2
      } else if (element.ty == "7") {
        // element.flex = 2
      } else {
        element.editor = true;

        // element.flex = 2
      }
    }



    if(element.ty != "9"){
      colDef.push({
        field: field,
        hide : item.typ == "hidden" ? true : false,
        //flex : 2,
        headerName: element.cap,
        ...(element.editor &&
          !element.internal && {
            cellEditor: gridComponents[element.ty],
        }),
        ...( element.renderer && { editable: false }),
        ...(!element.renderer && { editable: !element.ro ? true : false }),
        ...(element.ty == "3" && {
          cellEditorParams: {
            values: combodata[field]
              ? combodata[field]
              : [],
          },
          valueFormatter: eval(element.valueFormatter),
          valueParser: eval(element.valueParser),
        }),
        ...(element.ty == "7" && {
          cellRenderer: gridComponents[element.ty],
          editable: false,
          cellRendererParams: {
            onChange: (params) => {
              params.node.setDataValue(field, params.event.target.checked);
            },
          },
        }),
        ...(element.editor &&
          element.internal && {
          cellEditor: element.ty,
          cellEditorPopup: element.cellEditorPopup,
        }),
        ...(element.renderer ||
          (element.ty == "10" && {
            cellRenderer:
              gridComponents[element.ty == "10" ? "14" : element.ty],
            cellRendererParams: {
              fieldname: field,
              cap: element.cap,
              elementdefs: defs.cntrlsdata,
              stagelementdata: defs.stagelementdata,
            },
          })),
  
        ...(element.renderer &&
          element.ty != "10" && {
          cellRenderer: gridComponents[element.ty],
          ...(element.cellRendererParams && {
            cellRendererParams: {
              clicked: eval(element.cellRendererParams.clicked),
              fieldname: field,
              cap: element.cap,
              defs,
              elementdefs: defs.cntrlsdata,
              stagelementdata: defs.stagelementdata,
            },
          }),
        }),
        
      });

    }


    if (element.ty == "9") {
      // Create a column for the key
      colDef.push({
          field: `_v_${field}`,  // key column as is
          headerName: element.cap,  // Header name remains as is.
          cellRenderer: gridComponents[element.ty],
          hide : item.typ == "hidden" ? true : false,
      });

      // Create a column for the value (add "val" suffix)
      colDef.push({
          field: field,  // value column with "val" suffix
          headerName: element.cap,  // Append "val" to the header name
          hide : true
      });
  }


  });


  function customIsDelFilter(params) {
    const filteredRows = params.rowData.filter((row) => !row._IsDel);
    params.successCallback(filteredRows);
  }

  colDef.push({
    field: "_IsDel",
    filter: "agTextColumnFilter",
    cellDataType : "text",
    hide: true,
  });


  const columnDefs = colDef;



  function lookupValue(mappings, key) {
    let obj = mappings.find((o) => o.k == key);

    return !obj ? "" : obj.v;
  }

  function lookupKey(mappings, key) {
    let obj = mappings.find((o) => o.k == key);
    return !obj ? "" : obj.k;
  }
  // convert code to value
  function makeValueFormatter(params) {
    /* if(lookupValue(carMappings, params.value) ==""){
   
         var rowNode = gridRef.current.api.getRowNode(params.data.id);
         rowNode.setDataValue(params.colDef.field, ""newPrice"");
   
       } */
    return lookupValue(params.colDef.cellEditorParams.values, params.value);
  }

  // convert value to code
  function makeValueParser(params) {
    return lookupKey(params.colDef.cellEditorParams.values, params.value);
  }

  async function clicked(field) {
    const popupFormOnLoadEv =
      defs.stagelementdata?.sev?.[field.field]?.ev?.pupfload;

    setModalData(field);
    if (popupFormOnLoadEv) {
      await GridChildEventCaller(
        eDefHldr,
        "",
        popupFormOnLoadEv,
        stageGridRefs,
        setValue,
        defs.fieldname,
        FormContextdata,
        field._rid,
        field.field
      );
    }
  }

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function createNewRowData() {
    /* Check if server event configured */

    const newData = {
      _rid: uuidv4(),
      _IsDel: false, // Set _IsDel to false
    };
    return newData;
  }

  const onGridReady = (params) => {


   // setGridApi(params.api);

    // params.columnApi.autoSizeAllColumns();


    setColumnApi(stageGridRefs[defs.fieldname].current.api);
    hidecolumns(stageGridRefs[defs.fieldname].current.api);

    // Apply the filter programmatically
   applyIsDelFilter(params.api);

    setstageGridList((prevGridList) => {
      const updatedGridList = { ...prevGridList };

      if (updatedGridList && defs.fieldname) {
        updatedGridList[defs.fieldname].isReady = true;
      }
      return updatedGridList;
    });
  };

  const applyIsDelFilter = useCallback((api) => {
    const filterModel = {
      _IsDel: {
        filterType: 'text',
        type: 'equals',
        filter: "false", // Use "True" or "False" based on the display mapping
      },
    };
  
    api.setFilterModel(filterModel);
  
    // Debugging filter application
  }, []);
  


  // Function to find the element with id "pop_OthLoanDet"
  function findElementById(arr, id) {
    for (const item of arr) {
      if (item.id === id) {
        return item;
      }

      if (item.child && Array.isArray(item.child)) {
        const foundChild = findElementById(item.child, id);
        if (foundChild) {
          return foundChild;
        }
      }
    }
    return null;
  }

  /* Hide Grid Column based on the configuration given */
  const hidecolumns = (clmapi) => {

    clmapi.getColumnDefs().map((item) => {
      const cls =
        defs.stagelementdata.prp[item.field] &&
        defs.stagelementdata.prp[item.field].cls;

      if (cls == "d-none") {
        clmapi.setColumnVisible(item.field, false);
      }
    });
  };

  const addItems = useCallback((addIndex) => {

    const rowAddEvent =
      defs.stagelementdata?.sev?.[defs.fieldname]?.ev?.rowadd;

    if (rowAddEvent) {
      GridEventCaller(
        eDefHldr,
        "",
        rowAddEvent,
        stageGridRefs,
        setValue,
        defs.fieldname,
        FormContextdata,
        null,
        null,
        null,
        seteDefHldr
      );


    } else {
      stageGridRefs[defs.fieldname].current.api.applyTransaction({
        add: [createNewRowData()],
        addIndex: addIndex,
      });
    }
    // const result = await res.add[0].data
  }, []);

  const onRemoveSelected = useCallback(() => {
    
    const selectedData =
      stageGridRefs[defs.fieldname].current.api.getSelectedRows();
    // Modify the selected rows by adding "_IsDel" as true
    const updatedRows = selectedData.map((row) => ({ ...row, _IsDel: true }));

    // Apply transaction to update the rows
    stageGridRefs[defs.fieldname].current.api.applyTransaction({
      update: updatedRows,
    });

    applyIsDelFilter(stageGridRefs[defs.fieldname].current.api);
  }, []);

  const handleCellValueChanged = async (e) => {

    let t = defs.stagelementdata?.sev?.[e.column.colId]?.ev.change;
    if (t) {
      let r = stageGridRefs[defs.fieldname].current.api.getRowNode(e.data._rid);
      await GridEventCaller(
        eDefHldrRef.current, // Use the ref to get the latest value
        "",
        t,
        stageGridRefs,
        setValue,
        defs.fieldname,
        FormContextdataRef.current,
        e.data._rid,
        null,
        r,
        seteDefHldr
      );
    }
  };

  const gridOptions = {
    // suppressColumnVirtualisation: true,
    //autoSizePadding: 20,
   // paginationPageSize: 10,
    onCellValueChanged: handleCellValueChanged,
    // autoSizeColumns:true

    onGridReady: (params) => {
      params.api.sizeColumnsToFit();
    },
    onFirstDataRendered: (params) => {
      params.api.sizeColumnsToFit();
    }
  };

  const defaultcoldefs = useMemo(
    () => ({
      singleClickEdit: true,
      editable: false,
      //alwaysShowHorizontalScroll : true,
      resizable: true,
      //suppressColumnVirtualisation: true,
      //filter:true,
      // autoSizePadding: 20,
      minWidth: 200,
      //maxWidth: 300
    }),
    []
  );

  const getRowId = useMemo(() => {
    return (params) => params.data._rid;
  }, []);


  // Function to be called on blur (when cell editing stops)
  const onCellEditingStopped = useCallback((params) => {
    // Your custom logic here
    const updatedData = params.data;
  }, []);

  const rowSelection = useMemo(() => { 
    return {
          mode: 'singleRow',
          checkboxes: false,
          enableClickSelection: true
      };
  }, []);

  // // Function to fit columns
  // useEffect(() => {
  //   if (stageGridRefs[defs.fieldname].current && stageGridRefs[defs.fieldname].current.api) {
  //     stageGridRefs[defs.fieldname].current.api.sizeColumnsToFit();
  //   }
  // }, []);

  // // Function to fit columns
  // useEffect(() => {
  //   if (stageGridRefs[defs.fieldname].current && stageGridRefs[defs.fieldname].current.api) {
  //     stageGridRefs[defs.fieldname].current.api.sizeColumnsToFit();
  //   }
  // }, [colDef]);




  return (
    <>
      <div className={`"row g-0 mb-3  ${eDefHldr.stg.prp[defs.fieldname]?.disp == false ? "d-none" : ""} `}>
        <GrHeader
          add={addItems}
          remove={onRemoveSelected}
          header={defs.coldef.cap}
          ar={defs.stagelementdata.prp[defs.fieldname]}
          key={defs.fieldname + "_header"}
        ></GrHeader>

        <div className="ag-theme-alpine">
          <AgGridReact
            key={defs.fieldname}
            onGridReady={onGridReady}
            ref={stageGridRefs[defs.fieldname]}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultcoldefs}
            domLayout={"autoHeight"}
            stopEditingWhenCellsLoseFocus
            rowSelection={rowSelection} 
            getRowId={getRowId}
            pagination
            gridOptions={gridOptions}
          //  paginationPageSizeSelector={true}
          // onCellEditingStopped={onCellEditingStopped}
          ></AgGridReact>
        </div>

        {ChildGridElements.length > 0 &&
          ChildGridElements.map((item) => (
            <GrPopupForm
              eid={""}
              fieldname={item.fieldname}
              cap={item.cap}
              col={item.col}
              mn={item.mn}
              val={item.val}
              mxLen={item.mxLen}
              ev="undefined"
              defs={item}
              elementdefs={defs.cntrlsdata}
              stagelementdata={defs.stagelementdata}
              parentfieldanme={defs.fieldname}
              childUI={item.UI.child}
              modaldata={modaldata}
              setModalData={setModalData}
              eDefHldr={eDefHldr}
              cntrData={cntrData}
            />
          ))}
      </div>
    </>
  );


};

export default Grid;
