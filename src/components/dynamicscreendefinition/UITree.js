import UINode from "./UINode";

export default function UITree({ uiTreeLst, selectParent }) {
  if (uiTreeLst) {
    let root = uiTreeLst.filter((x) => x.pruidsgnid == null);
    return (
      <ul>
        {(root.map((node) => {
          return (
            <UINode uiTreeLst={uiTreeLst} treenode={node} />
          )
        }))}
      </ul>
    )
  }
}

