import React, {
    memo,
    forwardRef,
    useState,
    useRef,
    useImperativeHandle,
    useCallback,
    useEffect,
    useContext
} from "react";
import { FormContext } from "../../Contexts/FormContext";

const GrCheckbox = memo(
    forwardRef((props, ref) => {

        const [value, setValue] = useState(props.value);

        const { eDefHldr} = useContext(FormContext);
        const refInput = useRef(null);

        useEffect(() => {
            setValue(props.value);
        }, [props.value]);






        //   // Cell Editor interface, that the grid calls
        //   useImperativeHandle(ref, () => {

        //     debugger
        //     return {
        //       // the final value to send to the grid, on completion of editing
        //       getValue() {
        //         // this simple editor doubles any value entered into the input
        //         return value;
        //       },
        //     };
        //   });

        //   const onChangeListener = useCallback(
        //     (event) => {
        //         debugger;
        //         setValue(event.target.checked)},
        //     []
        //   );

        const onChangeListener = useCallback(
            (event) => {
                props.onChange({ event, node: props.node });
            },
            [props]
        );


        //useEffect(() => refInput.current.focus(), []);

        return (
            <input
                type="checkbox"
                id="fdf"
                ref={refInput}
                checked={value}
                onChange={onChangeListener}
                disabled = {eDefHldr.stg.prp[props.column.colId].ro}
            />
        );
    })
);

export default GrCheckbox;
