import React from "react";
import { useState, useEffect } from "react";

// import "font-awesome/css/font-awesome.min.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";
import { GetAllUserList } from "../utilities/getuserlist";
import { FetchCombodata } from "../utilities/combodata";
import Table from "react-bootstrap/Table";
import { Scrollbar } from "react-scrollbars-custom";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

const schema = yup.object().shape({
  cmbStatus: yup.string().required("Pls select the role status"),
});

//rfce - command
function UserstatusChange() {
  // Const & Var

  const [userresbody, setuserlistresbody] = useState([]);
  const [alert, setAlert] = useState("");
  const [isLoading, setLoanding] = useState(false);
  const [UserStatusMaster, setUserStatusMaster] = useState([]);
  const [UserStatus, setUserStatus] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // General Function

  const FetchUserList = async () => {
    const UserListResponse = await GetAllUserList();
    setuserlistresbody(UserListResponse.body.Users);

    console.log(JSON.stringify(UserListResponse.body.Users));
  };

  //   fetch combo values

  const LoadCombo = async () => {
    const opt = "|USRS|";
    const optw = "";
    const ComboResponse = await FetchCombodata(opt, optw);

    console.log(JSON.stringify(ComboResponse.body.usrs));

    setUserStatusMaster(ComboResponse.body.usrs);  
    
   

  };

  // Useeffect

  useEffect(() => {
    FetchUserList();
    LoadCombo();
  }, []);

  // Event function start

  const onSubmitHandler = async (data) => {


    let frmData = { txtNewStatusId:data.cmbStatus,txtUserIds:UserStatus};

    let createmenuurl = "/cmpstp/cngusrstus";
    console.log(frmData);


    setLoanding(true);

    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "cngusrstus",
      orgid: "",
      vendid: "0",
    };

    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const reqdata = { hdr: frmHdr, body: frmData };

    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

    console.log(reqdata);

    try {
      //debugger;
      const response = await api.post(
        createmenuurl,
        compressBase64(reqdata),
        reqHdr
      );

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr[0].rstmsg));
        setLoanding(false);
      } else {
        setTimeout(() => {
          console.log(strResponse.fdr);
          ShowAlert("Success", JSON.stringify(strResponse.fdr[0].rstmsg));
          setTimeout(() => {
            setAlert({
              AlertType: "null",
              message: "null",
            });
          }, 600);
          FetchUserList();          
          setLoanding(false);
        }, 300);
      }
    } catch (err) {
      console.log(err.message);
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  }


  //---------------onSubmitHandler end------

  const CheckboxhandleChange = (e, x) => {
    console.log(e);
    console.log(x);

    let ustatus = UserStatus;

    if (e.target.value == true) ustatus.push(x.UserId);
    else {
      const index = ustatus.indexOf(x.UserId);
      if (index > -1) {
        ustatus.splice(index, 1);
      }
    }

    setUserStatus(ustatus);

    console.log(UserStatus);
  };

  // Event Function End

  // Main Function

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };

  try {
    return (
      <>
        <section className="vh-100">
          <div className="container h-100">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-header">
                <strong className="card-title">User Status Change</strong>
              </div>
     
              <Scrollbar style={{ width: 1200, height: 550 }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-center">Select</th>
                    <th className="text-center">Id</th>
                    <th className="text-center">User Id</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userresbody.map((x) => {
                    return (
                      <tr>
                        <td align="center">
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              CheckboxhandleChange(
                                {
                                  target: {
                                    value: e.target.checked,
                                  },
                                },
                                x
                              );
                            }}
                          ></input>
                        </td>
                        <td>{x.UserId}</td>
                        <td>{x.Username}</td>
                        <td>{x.FName + " " + x.LName}</td>
                        <td>
                            
                           {
                            UserStatusMaster.find((res) => (res.k == x.StatusId))
                              .v
                          } 


                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              </Scrollbar>

              <div className="card-body p-md-5">
                {isLoading ? <Spinner></Spinner> : ""}
                <Alerts alert={alert} />

                <form
                  onSubmit={handleSubmit(onSubmitHandler)}
                  autocomplete="off"
                >
                  <div className="row">
                    <div className="col-sm">
                      <div className="mb-3">
                        <label htmlFor="cmbStatus" className="form-label">
                          Status
                        </label>
                        <select
                          {...register("cmbStatus")}
                          className="form-control"
                          id="cmbStatus"
                        >
                          <option value="">- Select -</option>
                          {
                            //Combo Data binding

                            UserStatusMaster.map((res) => (
                              <option key={res.k} value={res.k}>
                                {res.v}
                              </option>
                            ))
                          }
                        </select>
                        <p>{errors.cmbStatus?.message}</p>
                      </div>
                    </div>
                    <div className="col-sm">
                      <div className="mb-3"><br></br> 
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

            </div>
            {/* </div>
              </div> */}
          </div>
        </section>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default UserstatusChange;
