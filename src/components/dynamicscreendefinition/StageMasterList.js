
function StageMasterList({ stageList, setStageValue, delStage }) {



    if (stageList !== undefined) {
        return (


            stageList.map((data, index) => {
                const { StageId, ScreenId, StageName, Ord, StageTypeId, StageFile, StageType } = data;

                return (

                    // <div>{Ord} - {StageId} - {StageName} - {StageType} </div>

                    <tr key={index}>
                        <td>{Ord}</td>
                        <td>{StageId}</td>
                        <td> <button onClick={() => (setStageValue(data))} class="btn btn-link">{StageName}</button>  </td>
                        <td>{StageType}</td>
                        <td>
                            <button onClick={() => (delStage(StageId))} class="btn btn-light clr-gray"><i class="fa fa-trash-o"></i></button>
                        </td>
                    </tr>

                    //     <tr key={index}>
                    //     <td>  <input type="text" value={Method} onChange={(evnt)=>(handleChange(index, evnt))} name="Method" className="form-control"/> </td>
                    //     <td><input type="text" value={ToolTip}  onChange={(evnt)=>(handleChange(index, evnt))} name="ToolTip" className="form-control"/> </td>
                    //     <td><input type="text" value={Icon}  onChange={(evnt)=>(handleChange(index, evnt))} name="Icon" className="form-control" /> </td>
                    //     <td>  <input type="text" value={CSS} onChange={(evnt)=>(handleChange(index, evnt))} name="CSS" className="form-control"/> </td>
                    //     <td><input type="text" value={Style}  onChange={(evnt)=>(handleChange(index, evnt))} name="Style" className="form-control"/> </td>
                    //     <td><input type="text" value={Condition}  onChange={(evnt)=>(handleChange(index, evnt))} name="Condition" className="form-control" /> </td>
                    //     <td><button className="btn btn-outline-danger" onClick={()=>(deleteTableRows(index))}>x</button></td>
                    // </tr>

                )
            })

        );
    }
    else {
        return (
            <></>
        );
    }

}

export default StageMasterList;