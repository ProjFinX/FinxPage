import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from "react";

import GrHeader from "./GridComponents/GrHeader";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useContext } from "react";
import { FormContext } from "../Contexts/FormContext";
import {
    Setup,
    ServerEventCaller,
    GridEventCaller,
    GridChildEventCaller,
    GridChildEventCallerOnSave,
} from "../BusinessLogics/EventHandler";
import RenderUI from "../RenderUI";
import { Modal } from "bootstrap"; // Import Bootstrap
import GrComboBox from "./GridComponents/GrComboBox";
import GrFile from "./GridComponents/GrFile";
import GrMultilineBox from "./GridComponents/GrMultilineBox";
import GrNumericBox from "./GridComponents/GrNumericBox";
import GrCheckbox from "./GridComponents/GrCheckbox";
import GrButton from "./GridComponents/GrButton";
import GrModal from "./GridComponents/GrModal";
import GrDateBox from "./GridComponents/GrDateBox";

const FormGrid = (defs) => {

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
        setComboData,
        elements,
        currentGridRowData,
        setcurrentGridRowData,
        watch
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
    const combodataref = useRef(combodata);

    const modalRef = useRef(null);


    const FormContextdataRef = useRef(FormContextdata);

    useEffect(() => {
        eDefHldrRef.current = eDefHldr; // Keep ref updated with latest state
    }, [eDefHldr]);

    useEffect(() => {
        combodataref.current = combodata; // Keep ref updated with latest state
    }, [combodata]);


    useEffect(() => {
        FormContextdataRef.current = FormContextdata; // Keep ref updated with latest state
    }, [FormContextdata]);


    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setColumnApi] = useState(null);

    stageGridRefs[defs.fieldname] = useRef();
    const gridRef = useRef();
    const [formgriddata, setformgriddata] = useState(null);

    let ChildGridElements = [];

    let modaldefs = null;

    const [rowData, setRowData] = useState(
        defs.coldef.val == "" ? [] : defs.coldef.val
    );



    const element = {
        ...defs.cntrlsdata[defs.fieldname],
        ...defs.stagelementdata.prp[defs.fieldname],
    };

    element.child = {};
    element.child[defs.fieldname] = {};
    element.fieldname = defs.fieldname;
    element.parentfieldanme = defs.fieldname;
    element.UI = findElementById(defs.stagelementdata.ui, defs.fieldname);
    ChildGridElements.push(element);

    /* Load Custom components based on column control type */
    const gridComponents = {
        2: GrNumericBox,
        3: GrComboBox,
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

    defs.childUI.forEach((item) => {
        if (defs.cntrlsdata[item.id]) {
            const field = item.id;
            const element = {
                ...defs.cntrlsdata[field],
                ...defs.stagelementdata.prp[field],
            };
            if (element.ty == "3") {
                // Create a column for the key
                colDef.push({
                    field: field,  // key column as is
                    headerName: element.cap,  // Header name remains as is.
                    hide: true
                });

                // Create a column for the value (add "val" suffix)
                colDef.push({
                    field: `_v_${field}`,  // value column with "val" suffix
                    headerName: element.cap,  // Append "val" to the header name
                });
            }
            else {

                colDef.push({
                    field: field,
                    //flex : 2,
                    headerName: element.cap,

                })


            }

        }


    });


    function customIsDelFilter(params) {
        const filteredRows = params.rowData.filter((row) => !row._IsDel);
        params.successCallback(filteredRows);
    }

    colDef.push({
        field: "_IsDel",
        filter: "agTextColumnFilter",
        filterParams: { apply: customIsDelFilter },
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

    async function onRowDoubleClicked(event) {


        defs.childUI.forEach((item) => {
            if (event.data[item.id]) {
                setValue(item.id, event.data[item.id])
            }
        })


        let currentgridRow = {
            [defs.fieldname]: event.data
        }

        
        /* Call on Form Grid Load Event */
        let t = defs.stagelementdata?.sev?.[defs.fieldname]?.ev.frmgrload;
        if (t) {
            let r = stageGridRefs[defs.fieldname].current.api.getRowNode(event.data._rid);
            await GridEventCaller(
                eDefHldrRef.current, // Use the ref to get the latest value
                "",
                t,
                stageGridRefs,
                setValue,
                defs.fieldname,
                FormContextdataRef.current,
                event.data._rid,
                null,
                r,
                seteDefHldr
            );
        }


        setcurrentGridRowData(currentgridRow); //Set Current row data , to identify grid element on change in formgrids , it will be referd in other controls.

        setformgriddata(event.data);

        openModal();

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


        //setGridApi(params.api);

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

    const applyIsDelFilter = (api) => {
        // Define the filter model to be applied
        const filterModel = {
            _IsDel: {
                // Column field name
                filterType: "text",
                type: "equals",
                filter: "false", // Filter for true values
            },
        };

        // Apply the filter model
        api.setFilterModel(filterModel);
    };

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
            if (item.tabcontent && Array.isArray(item.tabcontent)) {
                const foundChild = findElementById(item.tabcontent, id);
                if (foundChild) {
                    return foundChild;
                }
            }
        }
        return null;
    }

    /* Hide Grid Column based on the configuration given */
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
    // Function to show modal programmatically
    const openModal = () => {

        const modalElement = modalRef.current;
        const bsModal = new Modal(modalElement, {
            backdrop: "static",
            keyboard: false,
        });
        bsModal.show();
    };

    /*Updating Ag grid row based on the form grid values */

    let gridcolumns = []

    defs.childUI.forEach((item) => {
        gridcolumns.push(item.id)
    })

    const watchedFields = watch(gridcolumns);

    // Update AG Grid row when form values change
    useEffect(() => {
        
        if (formgriddata) {
            const rowNode = stageGridRefs[defs.fieldname].current.api.getRowNode(
                formgriddata._rid
            );

            const data = {};

            // Iterate through the object
            for (const key in defs.stagelementdata.elms[defs.fieldname].child) {
                if (defs.cntrlsdata[key].ty == "3") {
                    let cmdgridcol = "_v_" + key 
                    data[cmdgridcol] = combodataref?.current[key]?.find(item => item.k == getValues(key))?.v;
                }
                data[key] = getValues(key);
            }

            const updatedRow = { ...rowNode.data, ...data };

            //setformgriddata(updatedRow);

            // Update AG Grid data
            if (stageGridRefs[defs.fieldname].current) {
                stageGridRefs[defs.fieldname].current.api.applyTransaction({ update: [updatedRow] });
            }
            
        }
    }, [watchedFields]);

    // Function to handle modal close
    const handleCloseModal = () => {
        setformgriddata(null);
        // Logic to close modal
    };


    const addItems = useCallback(async (addIndex) => {


        const transactionResult = stageGridRefs[defs.fieldname].current.api.applyTransaction({
            add: [createNewRowData()],
            addIndex: addIndex,
        });

        // The added rows will be in the `add` property of the result
        if (transactionResult && transactionResult.add) {
            for (const rowNode of transactionResult.add) {
                const rowId = rowNode.id;  // This is the ID of the newly added row

                const rowAddEvent =
                    defs.stagelementdata?.sev?.[defs.fieldname]?.ev?.rowadd;

                let r = stageGridRefs[defs.fieldname].current.api.getRowNode(rowId);

                if (rowAddEvent) {

                    await GridEventCaller(
                        eDefHldrRef.current, // Use the ref to get the latest value
                        "",
                        rowAddEvent,
                        stageGridRefs,
                        setValue,
                        defs.fieldname,
                        FormContextdataRef.current,
                        rowId,
                        null,
                        r,
                        seteDefHldr
                    );


                }
                let currentgridRow = {
                    [defs.fieldname]: r.data
                }

                let rowdata = r.data
                setcurrentGridRowData(currentgridRow); //Set Current row data , to identify grid element on change in formgrids , it will referd in other controls.
                setformgriddata(r.data);
                /*Set Values to control */
                defs.childUI.forEach((item) => {
                    if (rowdata[item.id]) {
                        setValue(item.id, rowdata[item.id])

                    }

                })
            };


            openModal();
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
        paginationPageSize: 10,
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
            singleClickEdit: false,
            editable: false,
            //alwaysShowHorizontalScroll : true,
            resizable: true,
            suppressColumnVirtualisation: true,
            // autoSizePadding: 20,
            minWidth: 200,
            //maxWidth: 300
        }),
        []
    );

    const ResetData = () => {
        for (const key in defs.stagelementdata.elms[defs.fieldname].child) {
            setValue(key, null);
            setformgriddata(null);
            setcurrentGridRowData(null);
        }
    };

    const getRowId = useMemo(() => {
        return (params) => params.data._rid;
    }, []);


    // Function to be called on blur (when cell editing stops)
    const onCellEditingStopped = useCallback((params) => {
        // Your custom logic here
        const updatedData = params.data;
    }, []);



    const SaveFormData = async () => {
        
        const rowNode = stageGridRefs[defs.fieldname].current.api.getRowNode(
            formgriddata._rid
        );

        const data = {};

        // Iterate through the object
        for (const key in defs.stagelementdata.elms[defs.fieldname].child) {
            data[key] = getValues(key);

        }

        await rowNode.setData({ ...rowNode.data, ...data });


    };



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
                        rowSelection={"single"}
                        getRowId={getRowId}
                        pagination
                        gridOptions={gridOptions}
                        onRowDoubleClicked={onRowDoubleClicked}
                    // onCellEditingStopped={onCellEditingStopped}
                    ></AgGridReact>
                </div>

                <div>


                    <div
                        className="modal fade"
                        id={defs.fieldname}
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                        ref={modalRef}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">
                                        {defs.coldef.cap}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <RenderUI
                                        data={element.UI.child}
                                        elements={elements}
                                        stageElements={stageElements}
                                        cntrData={cntrData}
                                        rid={formgriddata && formgriddata._rid}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                        onClick={ResetData}
                                    >
                                        Close
                                    </button>
                                    {/* <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-bs-dismiss="modal"
                                        onClick={SaveFormData}
                                    >
                                        Save
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );


};

export default FormGrid;
