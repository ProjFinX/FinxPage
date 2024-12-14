
export default function UINode({ uiTreeLst, treenode }) {
  
  let lstNode = uiTreeLst.filter(x => x.pruidsgnid == treenode.uidsgnid)
  if (lstNode.length > 0) {
    return (
      <li>
        <details open>
          <summary>
            <span dangerouslySetInnerHTML={{ __html: treenode.uiexprn }} ></span>
            <button type="button" onClick={AddParent} class="btn btn-light clr-gray">
              <i class="fa fa-plus"></i>
            </button>
          </summary>
          <ul>
            {lstNode.map((node) => {
              return (
                <UINode uiTreeLst={uiTreeLst} treenode={node} />
              )
            })}
          </ul>
        </details>
      </li>
    );
  }
  else {
    return (<li><div dangerouslySetInnerHTML={{ __html: treenode.uiexprn }}></div></li>)
  }
}

