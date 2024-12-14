

function TableRows({rowsData, deleteTableRows, handleChange,combodata}) {        
 
    return(
        

       
        rowsData.map((data, index)=>{
            const {cmbElmId, txtColIdx}= data;
            return(

                <tr key={index}>
                <td>  

                <select
                        
                      
                        className="form-control"
                        value={cmbElmId} onChange={(evnt)=>(handleChange(index, evnt))} name="cmbElmId" 
                      >
                        {<option value="0">-select-</option>}
                        {
                          //Combo Data binding
                          combodata &&
                          combodata.map((res) => (
                            <option key={res.v} value={res.k}>
                              {res.v}
                            </option>
                          ))
                        }
                      </select>
                </td>
                <td><input type="text" value={txtColIdx}  onChange={(evnt)=>(handleChange(index, evnt))} name="txtColIdx" className="form-control"/> </td>

                <td><button className="btn btn-outline-danger" onClick={()=>(deleteTableRows(index))}>x</button></td>
            </tr>

            )
        })
   
    )
    
}

export default TableRows;