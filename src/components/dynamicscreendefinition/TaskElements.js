import React from "react";
import { useState, useEffect, useRef} from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "../api/Webcall";
import { GetAllStageList } from "../utilities/getallstage";
import { GetStgClientEvents } from "../utilities/GetStgEvents";
import { GetExpGrpLst } from "../utilities/geteventexpression";

import { generateUUID, compressBase64, decompressBase64, } from "../utilities/utils";
import appsettings from "../../appsettings.json"

const apiendpoints = appsettings.ApiEndpoints;


function TaskElements({ ScrId }) {

  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setLoanding] = useState(false);
  const { register, getValues, setValue, formState: { errors }, reset, } = useForm();
  const ref = useRef();
  const [alert, setAlert] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const OnMainSubmitHandler = async (e) => {

    e.preventDefault(); // prevent page refresh
    
    var fileCtrl = ref.current.value;
    var filePath = ref.current.value;

    var fExt = ".pdf,.doc,.txt,.csv,.xls,.xlsx,.jpg";
    var allowedExtns = fExt.replace(/\,/g, "|");
    allowedExtns = allowedExtns.replace(/\./g, "\\.");
    allowedExtns = "/(" + allowedExtns.replace(/ /g, "") + ")$/i;";
    allowedExtns = eval(allowedExtns);
    if (!allowedExtns.exec(filePath)) {
      toast.error("Invalid file type");
      ref.current.value = "";
      return false;
    }

    const MAX_FILE_SIZE = 2048; // 2MB

    if (!selectedFile) {
      toast.error("Please choose a file");
      return false;
    }

    const fileSizeKiloBytes = selectedFile.size / 1024;

    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      toast.error("File size is greater than maximum limit");
      return false;
    }

    const tmpltDet = {};
    tmpltDet["cmbMailTemplateId"] = getValues("cmbMailTemplateId");
    
    const formData = new FormData();
    formData.append("tmpltdet", JSON.stringify(tmpltDet));
    formData.append("file", selectedFile);

    try {
      const url = apiendpoints.MailTmpltAttachment;
      let response = await api.post(url, formData);

      let strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);


      if (strResponse.hdr.rst == "SUCCESS") {
        setTimeout(() => {
          setAlert({ AlertType: "Success", message: "Successfully updated" });
          toast.success("Successfully updated");
          setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
          setLoanding(false);
        }, 300);
      }
      else {
        let msg = JSON.stringify(strResponse.fdr[0].rstmsg)
        setTimeout(() => {
          setAlert({ AlertType: "Error", message: msg });
          toast.error(msg);
          setTimeout(() => { setAlert({ AlertType: "null", message: "null", }); }, 600);
          setLoanding(false);
        }, 300);
      }



       
    } catch (err) {
      console.log(err.message);
      toast.error("Unable to process request");
      setAlert({ AlertType: "Error", message: "Unable to process request" });
      setLoanding(false);
    }

  };



  return (

    <>

      <form onSubmit={OnMainSubmitHandler} autocomplete="off">

        <div className="row">

          <div className="col-md-4">
            <label htmlFor="cmbMailTemplateId" className="form-label">Mail Template</label>
            <input {...register("cmbMailTemplateId")} type="text" className="form-control" />
          </div>

          <div className="col-md-6">
            <label htmlFor="filAttachment" className="form-label">Attachment</label>
            <input type="file" name="filElements" onChange={handleFileChange} ref={ref} className="form-control" />
          </div>

        </div>

        <br/>

        <div className="row">
          
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary">
              <span className="bi bi-upload"></span> upload
            </button>
          </div>
        </div>

      </form>
    </>

  )

}

export default TaskElements;
