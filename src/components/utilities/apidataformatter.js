import { generateUUID } from "./utils";

export function getPostData(tag, frmData, adTag, adData){

    var frmHdr = {};
    frmHdr["convid"] = generateUUID();
    frmHdr["tag"] = tag;
    frmHdr["orgid"] = ""
    frmHdr["vendid"] = "0"

    var data = {};
    data["hdr"] = frmHdr;
    data["body"] = frmData;
    if (adData) {
        data[adTag] = adData;
    }

    return data;

}