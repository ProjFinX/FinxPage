
function ElementMasterList({ elmList, setElementValue, delElement }) {

    return (

        elmList.map((data, index) => {

            const {
                ElmName, ControlType, DataType, Caption, ParentElmName, MaxLength,
                RangeFrom, RangeTo, SizeInKB, FileExt, IsFrmGrid, ElementId, ControlId, DataTypeId,
                ParentElementId, ParentControlId, CmbCod, CmbCon, ConStr, 
            } = data;

            let Prop = "";
            if (ControlId == 3) {
                Prop = CmbCod + ' | ' + (ConStr != null ? ConStr : '') + ' | ' + (CmbCon != null ? CmbCon : '');
            } 
            else if (ControlId == 2) {
                Prop = (RangeFrom != null ? RangeFrom : '') + ' - ' + (RangeTo != null ? RangeTo : '');
            }
            else if (ControlId == 9) {
                Prop = (SizeInKB != null ? SizeInKB+'kb' : '') + ' - ' + (FileExt != null ? FileExt : '');
            }
            else if (ControlId == 10) {
                Prop = (IsFrmGrid ? 'From Grid' : '') ;
            }


            return (
                <tr key={index}>
                    <td>{ElementId}</td>
                    <td> <button onClick={() => (setElementValue(data))} class="btn btn-link">{ElmName}</button>  </td>
                    <td>{ParentElmName}</td>
                    <td>{ControlType}/{DataType}</td>
                    <td>{MaxLength}</td>
                    <td>{Prop}</td>
                    <td>
                        <button onClick={() => (delElement(ElementId))} class="btn btn-light clr-gray"><i class="fa fa-trash-o"></i></button>
                    </td>
                </tr>

            )
        })

    )

}

export default ElementMasterList;