function TableRows({rowsData, deleteTableRows, handleChange}) {


    return(
        
        rowsData.map((data, index)=>{
            const {Method, ToolTip, Icon,CSS,Style,Condition}= data;
            return(

                <tr key={index}>
                <td>  <input type="text" value={Method} onChange={(evnt)=>(handleChange(index, evnt))} name="Method" className="form-control"/> </td>
                <td><input type="text" value={ToolTip}  onChange={(evnt)=>(handleChange(index, evnt))} name="ToolTip" className="form-control"/> </td>
                <td><input type="text" value={Icon}  onChange={(evnt)=>(handleChange(index, evnt))} name="Icon" className="form-control" /> </td>
                <td>  <input type="text" value={CSS} onChange={(evnt)=>(handleChange(index, evnt))} name="CSS" className="form-control"/> </td>
                <td><input type="text" value={Style}  onChange={(evnt)=>(handleChange(index, evnt))} name="Style" className="form-control"/> </td>
                <td><input type="text" value={Condition}  onChange={(evnt)=>(handleChange(index, evnt))} name="Condition" className="form-control" /> </td>
                <td><button className="btn btn-outline-danger" onClick={()=>(deleteTableRows(index))}>x</button></td>
            </tr>

            )
        })
   
    )
    
}

export default TableRows;