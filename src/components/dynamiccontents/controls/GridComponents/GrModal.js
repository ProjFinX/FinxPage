import React, {
  memo,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";

const GrModal = memo(
  forwardRef((props, ref) => {


    
  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
    debugger;
    console.log(props);

    const modaldata = {cap : props.colDef.cellRendererParams.cap, 
      fieldname : props.colDef.cellRendererParams.fieldname , 
      elementdefs : props.colDef.cellRendererParams.elementdefs,
      stagelementdata : props.colDef.cellRendererParams.stagelementdata  }
  


    const [value, setValue] = useState(props.value);
    const refInput = useRef(null);

    // Cell Editor interface, that the grid calls
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          // this simple editor doubles any value entered into the input
          return value;
        },
      };
    });

    const onChangeListener = useCallback(
      (event) => setValue(event.target.value),
      []
    );

    function btnClickedHandler() {
     
        const field = modaldata.fieldname;
        props.clicked({...props.data, field});
        
       }

    //   useEffect(() => refInput.current.focus(), []);

    // let val = props.getValue();

    return (
      <>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={"#" + modaldata.fieldname}
          onClick={btnClickedHandler}
          key={uuidv4()}
          name={modaldata.fieldname}
        > 
         {modaldata.cap ? modaldata.cap : modaldata.fieldname}
        </button>
      </>
    );
  })
);

export default GrModal;
