import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FetchCombodata } from "../utilities/combodata";
import api from "../api/Webcall";
import {
  generateUUID,
  compressLZW,
  decompressLZW,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import Spinner from "../htmlcomponents/Spinner";
import Alerts from "../htmlcomponents/Alerts";
import { useNavigate } from "react-router-dom";
import { GetUserList } from "../utilities/getuserlist";
import { Scrollbar } from "react-scrollbars-custom";
import Table from "react-bootstrap/Table";

// Yup validation schema

const schema = yup.object().shape({
  txtUsername: yup
    .string()
    .required("User Email  can not be empty")
    .email("Pls provide Valid  Email id"),
  txtFirstname: yup
    .string()
    .required("First Name can not be empty")
    .max(50, "First name  Max lenght is 50 "),
  txtLastname: yup
    .string()
    .required("Last name not be empty")
    .max(50, "Last name  Max lenght is 50 "),
  txtPhone: yup
    .string()
    .required("Phone no. can not be empty")
    .max(15, "Phone no. Max lenght is 15 "),
  cmbCountryId: yup.string().required("Please select the Country"),
  txtPassword: yup
    .string()
    .required("Password can not be empty")
    .min(3, "Password Min length is 3")
    .max(20, "Password. Max lenght is 20 "),
  txtConformPassword: yup
    .string()
    .oneOf([yup.ref("txtPassword"), null], "Not matched with password"),
});

// Function Component Branch

const User = () => {
  // Combo Data fetching------------------------------

  const [userresbody, setuserlistresbody] = useState([]);
  const [resbody, setresbody] = useState([]);
  const LoadCombo = async () => {
    // Update state with incremented value

    const opt = "|CUN|";
    const optw = "";
    // debugger;

    const Response = await FetchCombodata(opt, optw); // JSON.stringify(await FetchCombodata(opt,optw));

    setresbody(Response.body.cun);
    console.log("rerendering method");
  };

  useEffect(() => {
    LoadCombo();
    FetchUserList();
  }, []);

  // Useeffect

  //-----------------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [alert, setAlert] = useState("");

  const [isLoading, setLoanding] = useState(false);

  function SetScreenValue(rowval) {
    console.log(rowval);

    reset({   
      txtUserId: rowval.UserId,  
      txtUsername: rowval.Username,
      txtFirstname: rowval.FName,
      txtLastname: rowval.LName,
      txtPhone: rowval.tleid,
      cmbCountryId: rowval.tleid,
      txtPassword: rowval.tleid,
      txtConformPassword: rowval.tleid,
    });
  }


  function ResetScreenValue() {
    reset({
      txtUserId: "",  
      txtUsername: "",  
      txtFirstname: "",  
      txtLastname: "",  
      txtPhone: "",  
      cmbCountryId: "",  
      txtPassword: "",  
      txtConformPassword: ""
    });
  }

  const navigate = useNavigate();

  const FetchUserList = async () => {
    const UserListResponse = await GetUserList();
    console.log(JSON.stringify(UserListResponse));
    setuserlistresbody(UserListResponse.body.Users);

    console.log(JSON.stringify(UserListResponse.body.Users));
  };

  const onSubmitHandler = async (data) => {
    setLoanding(true);
    console.log("Enter Create new branch api call");
    console.log(data);
    //e.preventDefault();
    /* Header */
    const convID = generateUUID();
    const frmHdr = {
      convid: convID,
      tag: "NewUser",
      orgid: "",
      vendid: "0",
    };
    const frmData = data;
    const reqdata = { hdr: frmHdr, body: frmData };
    const token = localStorage.getItem("token");
    const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
    const CoreUrl = process.env.REACT_APP_FinXCoreUrl;
    const createusernurl = "/cmpstp/newusr";
    console.log(reqHdr);
    try {
      //debugger;
      const response = await api.post(
        createusernurl,
        compressBase64(reqdata),
        reqHdr
      );
      // const response = await PostCallHeader(createbranchnurl, compressBase64(reqdata),reqHdr);

      const strResponse = JSON.parse(decompressBase64(response.data));

      console.log(strResponse);
      debugger;

      if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
        ShowAlert("Error", JSON.stringify(strResponse.fdr));
        setLoanding(false);
      } else {
        ShowAlert("Success", JSON.stringify(strResponse.fdr[0]));

        setLoanding(false);
        navigate("/Home");
      }
    } catch (err) {
      console.log(err.message);
      ShowAlert("Error", "Unable to process request");
      setLoanding(false);
    }
  };

  const ShowAlert = (alertType, message) => {
    setAlert({
      AlertType: alertType,
      message: message,
    });
  };

  return (
    <>
      <section className="vh-100">
        <div className="container h-100">
          {/* <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col-lg-12 col-xl-11"> */}
          <div className="card text-black" style={{ borderRadius: "25px" }}>
            <div className="card-header">
              <strong className="card-title">Create New User</strong>
            </div>
            <div className="card-body p-md-5">
              {isLoading ? <Spinner></Spinner> : ""}
              <Alerts alert={alert} />

              <form onSubmit={handleSubmit(onSubmitHandler)} autocomplete="off">
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtUsername" className="form-label">
                        {" "}
                        User Email
                      </label>
                      <input
                        {...register("txtUsername")}
                        type="email"
                        className="form-control"
                        placeholder="User Email"
                      />
                      <p>{errors.txtUsername?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                    <label htmlFor="txtUserId" className="form-label">
                        {" "}
                        User Id
                      </label>
                      <input
                        {...register("txtUserId")}
                        disabled="disabled"
                        readonly="readonly"
                        className="form-control"
                       
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtFirstname" className="form-label">
                        {" "}
                        First name
                      </label>
                      <input
                        {...register("txtFirstname")}
                        type="text"
                        className="form-control"
                        placeholder="User Email"
                      />
                      <p>{errors.txtFirstname?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtLastname" className="form-label">
                        Last Name
                      </label>
                      <input
                        {...register("txtLastname")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtLastname?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtPhone" className="form-label">
                        {" "}
                        Phone No.
                      </label>
                      <input
                        {...register("txtPhone")}
                        type="text"
                        className="form-control"
                      />
                      <p>{errors.txtPhone?.message}</p>
                    </div>
                  </div>
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="cmbCountryId" className="form-label">
                        Country
                      </label>
                      <select
                        {...register("cmbCountryId")}
                        className="form-control"
                      >
                        <option value="">- Select -</option>
                        {
                          //Combo Data binding
                          resbody.map((res) => (
                            <option key={res.k} value={res.k}>
                              {res.v}
                            </option>
                          ))
                        }
                      </select>
                      <p>{errors.cmbCountryId?.message}</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm">
                    <div className="mb-3">
                      <label htmlFor="txtPassword" className="form-label">
                        {" "}
                        Password
                      </label>
                      <input
                        {...register("txtPassword")}
                        type="password"
                        className="form-control"
                      />
                      <p>{errors.txtPassword?.message}</p>
                    </div>
                  </div>

                  <div className="col-sm">
                    <div className="mb-3">
                      <label
                        htmlFor="txtConformPassword"
                        className="form-label"
                      >
                        {" "}
                        Confirm Password
                      </label>
                      <input
                        {...register("txtConformPassword")}
                        type="password"
                        className="form-control"
                      />
                      <p>{errors.txtConformPassword?.message}</p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <Scrollbar style={{ width: 1200, height: 550 }}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="text-center">Id</th>
                    <th className="text-center">User Id</th>
                    <th className="text-center">First name</th>
                    <th className="text-center">Phone No.</th>
                    <th className="text-center">Country</th>
                   
                    <th>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          ResetScreenValue();
                        }}
                      >
                        {" "}
                        <i className="bi bi-table"></i> Add{" "}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userresbody &&
                    userresbody.map((x) => {
                      return (
                        <tr>
                          <td>{x.UserId}</td>
                          <td>{x.Username}</td>
                          <td>{x.FName }</td>
                          <td>{ x.LName}</td>
                          <td>{ x.LName}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                SetScreenValue(x);
                              }}
                            >
                              {" "}
                              <i className="bi bi-pen"></i> Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Scrollbar>
          </div>
          {/* </div>
            </div> */}
        </div>
      </section>
    </>
  );
};

export default User;
