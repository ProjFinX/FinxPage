import React from 'react'

const DateTimeBox = ({ eid , fieldname , cap}) => {

  return (
   
    <div className="col-sm-4 mb-3">
  <label htmlFor={fieldname} className="form-label">{cap}</label>
  <input name={fieldname}  type="datetime-local"  className="form-control" id={eid} />
</div>

  )
}

export default DateTimeBox