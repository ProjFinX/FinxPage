
function NewTreeNode({ uiTreeLst }) {

    let htmlTree = '';

    function buildUiTree() {
        htmlTree += "<ul>";
        if (uiTreeLst) {

            let root = uiTreeLst.filter((x) => x.pruidsgnid == null);
            root.forEach(node => {

                let nCnt = uiTreeLst.filter(x => x.pruidsgnid == node.uidsgnid).length;

                if (nCnt > 0) {
                    htmlTree += "<li>";
                }
                updChildNodes(node);
                if (nCnt > 0) {
                    htmlTree += "</li>";
                }
            });
        }
        htmlTree += "</ul>";
    }

    function updChildNodes(treenode) {

        let lstNode = uiTreeLst.filter(x => x.pruidsgnid == treenode.uidsgnid);

        if (lstNode.length > 0) {
            htmlTree += "<details open>";
            htmlTree += "<summary>" + treenode.uiexprn;

            htmlTree += '<button type="button" onclick="eval(\'(function (){selectParent('+treenode.uidsgnid+');});\')" class="btn btn-light clr-gray"><i class="fa fa-plus"></i></button>';

            htmlTree += "</summary>";
            htmlTree += "<ul>";

            lstNode.forEach(node => {

                let nCnt = uiTreeLst.filter(x => x.pruidsgnid == node.uidsgnid).length;
                if (nCnt > 0) {
                    htmlTree += "<li>";
                }
                updChildNodes(node);
                if (nCnt > 0) {
                    htmlTree += "</li>";
                }

            });
            htmlTree += "</ul>";
            htmlTree += "</details>";
        }
        else {
            htmlTree += "<li>" + treenode.uiexprn + "</li>";
        }
    };


    buildUiTree();
    return (
        <div className="tree" dangerouslySetInnerHTML={{ __html : htmlTree }}></div>
    )
}

export default NewTreeNode;