

import React , {useCallback , useState , useEffect} from 'react';

  function DMelemDropdown(props) {

    

    const [value, setValue] = useState(props.value);

    const onChangeListener = useCallback(
        (event , props) => {
            
            
        props.ontblcolChange(event , props.id)
            setValue(event.target.value)

    },


        []
      );
      useEffect(() => {
        setValue(props.value);
    }, []);

        
    return (
      <select  className="form-control" value={value} onChange={event => onChangeListener(event , props)}>
         <option value="0">- Select -</option>
        {props.options?.map && props.options.map((option) => (
          <option key={option.v} value={option.k}>{option.v}</option>
        ))}
      </select>
    );
  }

  export default DMelemDropdown;