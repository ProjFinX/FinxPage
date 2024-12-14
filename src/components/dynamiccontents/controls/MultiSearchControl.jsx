import React, { useState } from 'react'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useContext, useEffect } from "react";
import { FormContext } from "../Contexts/FormContext";
import { Modal, Button } from 'react-bootstrap';
import { EventCaller, MultiSearchServerEventCaller } from "../BusinessLogics/EventHandler";



const MultiSearchControl = props => {

   

    const {
        setValue,
        getValues,
        eDefHldr,
        stageGridRefs,
        watch,
        trigger,
        stageElements,
        cntrData,
        combodata,
        setComboData,
        setEventLoading,
        modalVisible,
        setModalVisible,
        multiSearchData,
        setMultiSearchData,
        seteDefHldr
      } = useContext(FormContext);

    const FormContextdata = {
        getValues: getValues,
        stageGridRefs: stageGridRefs,
        stageElements: stageElements,
        cntrData: cntrData,
        combodata,
        setComboData,
        setEventLoading,
        modalVisible,
        setModalVisible,
        multiSearchData,
        setMultiSearchData
      };
    

    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setrowData] = useState([]);
    const [columnDefs, setcolumnDefs] = useState([]);

    const handleClose = () => setModalVisible(false);



    useEffect(() => {

        debugger;
        if (modalVisible && multiSearchData) {
            debugger;

            let colDefs = []

            // multiSearchData.map.root.map((item) => {
            //     colDefs.push({
            //         field: item.colidx,
            //         headerName: item.colidx,
            //         filter: "agTextColumnFilter",
            //         filterParams: {
            //             buttons: ["reset", "apply"],
            //         },
            //     });
            // });

            multiSearchData.data.map((item) => {

                const keys = Object.keys(item); // Get the key names

                keys.forEach(key => {
                    colDefs.push({
                        field: key,
                        headerName: key,
                        filter: "agTextColumnFilter",
                        filterParams: {
                            buttons: ["reset", "apply"],
                        },
                    });

                  });

      
            });


            setcolumnDefs(colDefs);
            setrowData(multiSearchData.data);



        }

    }, [modalVisible, multiSearchData])

    const handleSelect = () => {
        if (gridApi) {

            const selectedRow = gridApi.getSelectedRows()[0]; // Get the first selected row
            if (selectedRow) {
                let neweDefHldr= {...eDefHldr}
                console.log('Selected Row Data:', selectedRow);

                // multiSearchData.map.root.map((item) => {

                //     let data = selectedRow[item.colidx]
                //     setValue(item.elmna , data)

                //     neweDefHldr['elmsData'] = neweDefHldr['elmsData'] || {};
                //     neweDefHldr['elmsData'][item.elmna] = data;

                // })

                debugger



              //  seteDefHldr(neweDefHldr);

                debugger;

                MultiSearchServerEventCaller(
                    eDefHldr,
                    getValues(),
                    multiSearchData.selectmethod,
                    stageGridRefs,
                    setValue,
                    FormContextdata, seteDefHldr,
                    selectedRow
                  );



                // Here you can bind the data to the screen or pass it to another function/component
                
            }
        }
        handleClose(); // Close the modal after selecting
    };
    

    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
    };


    return (
        <>

            <Modal show={modalVisible} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Multi Search</Modal.Title>
                </Modal.Header>
                <Modal.Body> <div
                    className="ag-theme-alpine"
                    style={{ height: 400, width: '100%' }}
                >
                    {modalVisible && (
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            rowSelection={"single"}
                            onGridReady={onGridReady}
                            pagination={true}
                            paginationPageSize= {5}
                        />
                    )}
                </div></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSelect}>
                        Select
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

}



export default MultiSearchControl