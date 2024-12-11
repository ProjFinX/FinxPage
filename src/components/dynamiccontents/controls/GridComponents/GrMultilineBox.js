import React, {
    memo,
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useCallback,
    useEffect,
  } from "react";
  
  const GrMultilineBox = memo(
    forwardRef((props, ref) => {
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
        (event) => props.setValue(event.target.value),
        []
      );
      useEffect(() => refInput.current.focus(), []);

  
      return (
        <textarea
          className="form-control"
          ref={refInput}
          value={value}
          onChange={onChangeListener}
        />
      );
    })
  );
  
  export default GrMultilineBox;
  