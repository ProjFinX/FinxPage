import React, {
    memo,
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useCallback,
    useEffect,
  } from "react";
  
  const GrModalGrid = memo(
    forwardRef((props, ref) => {
       
      console.log(props);

      const modaldata = {cap : props.colDef.cellRendererParams.cap, 
                        fieldname : props.colDef.cellRendererParams.fieldname , 
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
          props.clicked(props.data);
         }
  
      //   useEffect(() => refInput.current.focus(), []);
  
      // let val = props.getValue();
  
      return (
        <>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={btnClickedHandler}
          >
            Launch static backdrop modal
          </button>
        </>
      );
    })
  );
  
  export default GrModalGrid;
  