import React from 'react'

const RadioButton = ({ eid , fieldname , cap}) => {
  return (
    <div className="mb-3">
    <label htmlFor={fieldname} className="form-label">{cap}</label>
    <input name={fieldname}  type="radio"  className="form-control" id={eid} />
  </div>
  )
}

export default RadioButton