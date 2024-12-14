// CustomDropdownEditor.js
import React, { useState, useEffect } from 'react';

const CustomDropdownEditor = (props) => {
  const { value, values , onValueChange} = props;
  const [selectedValue, setSelectedValue] = useState(value);

  debugger;

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
   // setSelectedValue(newValue);
    props.onValueChange(newValue)
  };

    // AG Grid will call this method to get the value after editing is finished
    const getValue = () => {
        debugger;
        return selectedValue;
      };
    
      // Return a boolean to let AG Grid know if the editor is a popup (in this case, it's not)
      const isPopup = () => {
        return false;
      };

  return (
    <select className="form-select"  value={value} onChange={handleChange}>
           <option key='' value=''>
         'select'
        </option>
      {values.map((option) => (
        
        <option key={option.v} value={option.k}>
          {option.v}
        </option>
      ))}
         
    </select>
  );
};

export default CustomDropdownEditor;
