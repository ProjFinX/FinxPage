import React, {
  memo,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";

const GrComboBox = memo(
  forwardRef((props, ref) => {
    let options = props.colDef.cellEditorParams.values
    const { value ,  values , onValueChange} = props;
    debugger;
    //const [value, setValue] = useState(props.value);
    const refInput = useRef(null);

    // // Cell Editor interface, that the grid calls
    // useImperativeHandle(ref, () => {
    //   return {
    //     // the final value to send to the grid, on completion of editing
    //     getValue() {
    //       // this simple editor doubles any value entered into the input
    //       return value;
    //     },
    //   };
    // });

    const onChangeListener = useCallback(
      (event) => {
      //  setValue(event.target.value) 
        onValueChange(event.target.value);
      },
      []
    );
    
   useEffect(() => refInput.current.focus(), []);

       // let val = props.getValue();

    return (
      <select className="form-select"
        ref={refInput}
        value={value}
        onChange={onChangeListener}
      >

    <option key="0" value="">
            --Select--
          </option>
        {
        
        options.map((item) => (
          <option key={item.k} value={item.k}>
            {item.v}
          </option>
        ))}

      </select>
    );
  })
);

export default GrComboBox;
