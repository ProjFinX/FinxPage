import React, {
    memo,
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useCallback,
    useEffect,
  } from "react";
  
  const GrNumericBox = memo(
    forwardRef((props, ref) => {
       
      const { value ,  values , onValueChange} = props;

    //  const [value, setValue] = useState(props.value);
      const refInput = useRef(null);
  
      // // Cell Editor interface, that the grid calls
      // useImperativeHandle(ref, () => {
      //   console.log("useImperativeHandle");

      //   debugger;
      //   return {

      //     // the final value to send to the grid, on completion of editing
      //     getValue() {
      //       // this simple editor doubles any value entered into the input

      //       console.log("ag grid cell valuue is" , value);
      //       return value;
      //     },
      //   };
      // });

      debugger;
  
      const onChangeListener = useCallback(
        (event) => {
          //  setValue(event.target.value) 
          debugger;
            onValueChange(parseFloat(event.target.value));
          },
        []
      );
      useEffect(() => refInput.current.focus(), []);
  
      return (
        <input
          type="Number"
          key={props.data._rid +'_' + props.colDef.field}
          className="form-control"
          ref={refInput}
          value={value}
          onChange={onChangeListener}
        />
      );
    })
  );
  

  export default GrNumericBox;
  