import React from "react";
import CheckboxTree from "react-checkbox-tree";
import { useState, useEffect } from "react";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Alerts from "../htmlcomponents/Alerts";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/Webcall";
import Spinner from "../htmlcomponents/Spinner";

import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { GetMenuItems, GetMenuRole } from "../utilities/getmenulist";
import { GetBranchList } from "../utilities/getbranchlist";
import {
  MenuItemsNodeSource,
  UserBranchRoleMapNodeSource,
} from "./treenodesource";

import appsettings from "../../appsettings.json";

const apiendpoints = appsettings.ApiEndpoints;

//Ref
//https://react-bootstrap.github.io/components/modal//

let count = 0;

const getNodeIds = (nodes) => {
  let ids = [];

  nodes?.forEach(({ value, children }) => {
    ids = [...ids, value, ...getNodeIds(children)];
  });

  return ids;
};

const schema = yup.object().shape({
 // txtMenuId: yup.string().required("Pls select the menu"),
});

let menunode = [];
let rolenode = [];

function MngMenuRole() {
  var menudetails;
  let menures;

  let sourcearr = [];
  let nodecheck = [];

  count++;
  console.log(count);

  const [isLoading, setLoanding] = useState(false);

  // GetMenuItems

  const [menuitemresbody, setmenuitemresbody] = useState([]);
  const [IsGroupMenu, SetIsGroupMenu] = useState(false);
  const FetchMenuItems = async () => {
    const MenuItemsResponse = await GetMenuItems();
    setmenuitemresbody(MenuItemsResponse.body.mnugrpitm);

    console.log(MenuItemsResponse.body.mnugrpitm);
  };

  // Get Branch List

  const [branchresbody, setbranchlistresbody] = useState([]);
  const FetchBranchList = async () => {
    const BranchListResponse = await GetBranchList();

    console.log(BranchListResponse.body);

    setbranchlistresbody(BranchListResponse.body.Branches);
  };

  useEffect(() => {
    FetchMenuItems();
    FetchBranchList();
  }, []);

  const [checked, setchecked] = useState([]);
  const [expanded, setExpand] = useState([]);
  const [roleexpanded, setRoleExpand] = useState([]);
  const [rolechecked, setRolechecked] = useState([]);
  const [MnuItmId, setMnuItmId] = useState(0);
  const [ClickedValue, SetClickedValue] = useState("");

  if (menunode.length == 0 || rolenode.length == 0) {
    menunode = MenuItemsNodeSource(menuitemresbody);
    rolenode = UserBranchRoleMapNodeSource(branchresbody);
    console.log(menunode);
  }

  const [smenunode, setsmenunode] = useState(menunode);

  // Add Role Popup
  useEffect(() => {
    setRoleExpand(getNodeIds(rolenode));
  }, [rolechecked]);




//==============================================================
  //  Tree Node click function

  const onClick = async (clicked) => {
    let mnugroupid = "";
    let nodearr = [];
    let mnuitemid = "";

    console.log("clicked.value", clicked.value);
    SetClickedValue(clicked.value);

    if (clicked.treeDepth == 0) {      
      let node = clicked.value;
      nodearr = node.split("-");
      if (nodearr.length > 1) {
        mnugroupid = nodearr[1];
      }

      SetIsGroupMenu(true);
      setMnuItmId(mnugroupid);
    }
     else {
      let node = clicked.value;
      nodearr = node.split("-");

      if (nodearr.length > 2) {
        mnugroupid = nodearr[1];
        mnuitemid = nodearr[0];
      }
      setMnuItmId(mnuitemid);
    }


//======================================================================

    const mnuroleres = await GetMenuRole(mnugroupid, mnuitemid);

    //setRolechecked(menudetails.label.BRMapIds);
    //setRoleExpand(menudetails.label.BRMapIds);

    if (clicked.treeDepth == 0) {
      SetIsGroupMenu(true);
      reset({
        txtMenuId: mnugroupid,
        txtMenuname: clicked.label,
      });
      let brmapids = [];
      let BRMapIdsstr = mnuroleres.body.MnuGroup.BRMapIds;
      BRMapIdsstr = BRMapIdsstr.replace("[", "").replace("]", ""); // role mapi provide [ ' ] bracktes, this need to be removed
      let brmapidsarray = BRMapIdsstr.split(",");
      console.log("brmapidsarray", brmapidsarray);
      setRolechecked(brmapidsarray);
    } else {
      SetIsGroupMenu(false);
      reset({
        txtMenuId: mnuitemid,
        txtMenuname: clicked.label,
      });

      console.log("brmapidsarray", mnuroleres.body.MnuItem.BRMapIds);
      setRolechecked(mnuroleres.body.MnuItem.BRMapIds);
    }
  };

  //---------------------------------------------

  const [menus, setmenus] = useState({
    txtMenuId: "",
    txtMenuname: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: menus,
  });

  const [alert, setAlert] = useState("");

  const [gridshow, setgridShow] = useState(false);

  const gridhandleClose = () => setgridShow(false);
  const gridhandleShow = () => setgridShow(true);




  const onGridModalSubmitHandler = async (data, e) => {
    try {
      e.preventDefault(); 

      let frmData = {};

      let createmenuurl = apiendpoints.ManageMenuItem;

        frmData = { txtMnuGrpId: data.txtModalMnuGroupId, txtMnuItmId:data.txtModalMnuId ,txtMnuItmName:data.txtModalMnuItmName, 
                txtParentId:data.txtModalMnuParentId,ntxtOrd:data.txtModalMnuOrd,txtLink:data.txtModalLink};
      
      
      

      console.log(frmData);

      setLoanding(true);

      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "rolusrmap",
        orgid: "",
        vendid: "0",
      };

      const reqdata = { hdr: frmHdr, body: frmData };
      const token = localStorage.getItem("token");
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

      console.log(reqHdr);
      try {
        //
        const response = await api.post(
          createmenuurl,
          compressBase64(reqdata),
          reqHdr
        );

        const strResponse = JSON.parse(decompressBase64(response.data));

        console.log(strResponse);

        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          ShowAlert("Error", JSON.stringify(strResponse.fdr));
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
           
            setLoanding(false);
          }, 300);
        }
      } catch (err) {
        console.log(err.message);
        ShowAlert("Error", "Unable to process request");
        setLoanding(false);
      }
    } catch (error) {
      ShowAlert("Error", error.message);
      setLoanding(false);
    }

    setgridShow(false);
  };
  //Update Role change for the selected menu




//==============================================================================

  const handlepopup = async (e) => {
    let stagearr = [];
  

    let node = ClickedValue;
    let nodearr = node.split("-");

   
    if (e=="EDIT")
    {
      if (IsGroupMenu)
      {
       
        reset({    
          txtModalMnuId:nodearr[0],         
          txtModalMnuGroupId: nodearr[1],         
          txtModalMnuItmName:nodearr[2],
          txtModalMnuOrd: nodearr[3]})
          
         if (nodearr.length > 4)
         {
          reset({
            txtModalMnuId:nodearr[0],         
            txtModalMnuGroupId: nodearr[1],         
            txtModalMnuItmName:nodearr[2],
            txtModalMnuOrd: nodearr[3],
            txtModalLink:(nodearr[4]=='undefined'?'':nodearr[4])
          
          });
         }
              
         console.log(IsGroupMenu);
      }
      else
      {

        reset({    
          txtModalMnuId:nodearr[0],         
          txtModalMnuGroupId: nodearr[1],    
          txtModalMnuItmName:nodearr[2],
          txtModalMnuOrd: nodearr[3]
        
        });

        if (nodearr.length > 4)
          {
           reset({
            txtModalMnuId:nodearr[0],         
            txtModalMnuGroupId: nodearr[1],    
            txtModalMnuItmName:nodearr[2],
            txtModalMnuOrd: nodearr[3],
            txtModalMnuParentId:(nodearr[4]=='undefined'?'':nodearr[4])});
          }

        if (nodearr.length > 5)
            {
             reset({
              txtModalMnuId:nodearr[0],         
              txtModalMnuGroupId: nodearr[1],    
              txtModalMnuItmName:nodearr[2],
              txtModalMnuOrd: nodearr[3],
              txtModalMnuParentId: (nodearr[4]=='undefined'?'':nodearr[4]),
              txtModalLink: (nodearr[5]=='undefined'?'':nodearr[5])});
          }
      }
    }


    if (e=="ADD")
      {
        if (IsGroupMenu)
        {
          reset({    
               
            txtModalMnuGroupId: nodearr[1]}         
           )           
           
         
        }
        else
        {
  
          reset({               
            txtModalMnuGroupId: nodearr[1],           
            txtModalMnuParentId: MnuItmId
          
          });
  
        
        }
      }


    gridhandleShow();
  };

 

  //==================================================================================================

  const onSubmitHandler = async (data, e) => {
    try {
      e.preventDefault();
      console.log(data);
      console.log("Enter Save role ");

      let frmData = {};

      let createmenuurl = apiendpoints.RoleUserMap;

      if (IsGroupMenu) {
        //manage menu group rights
        frmData = { txtMnuGrpId: data.txtMenuId, txtBRMapIds: rolechecked };

        createmenuurl = apiendpoints.ManageMenuGroupRights;
      } // manage menu item rights
      else {
        frmData = { txtMnuItmId: data.txtMenuId, txtBRMapIds: rolechecked };
        createmenuurl = apiendpoints.ManageMenuItemRights;
      }

      console.log(frmData);

      setLoanding(true);

      //e.preventDefault();
      /* Header */
      const convID = generateUUID();
      const frmHdr = {
        convid: convID,
        tag: "rolusrmap",
        orgid: "",
        vendid: "0",
      };

      const reqdata = { hdr: frmHdr, body: frmData };
      const token = localStorage.getItem("token");
      const reqHdr = { headers: { Authorization: `Bearer ${token}` } };
      const CoreUrl = process.env.REACT_APP_FinXCoreUrl;

      console.log(reqHdr);
      try {
        //
        const response = await api.post(
          createmenuurl,
          compressBase64(reqdata),
          reqHdr
        );

        const strResponse = JSON.parse(decompressBase64(response.data));

        console.log(strResponse);

        if (strResponse.hdr.rst == "FAILED" || strResponse.hdr.rst == "ERROR") {
          ShowAlert("Error", JSON.stringify(strResponse.fdr));
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

            setRolechecked([]);
            setRoleExpand([]);
            reset({
              txtMenuId: "",
              txtMenuname: "",
            });

            setLoanding(false);
          }, 300);
        }
      } catch (err) {
        console.log(err.message);
        ShowAlert("Error", "Unable to process request");
        setLoanding(false);
      }
    } catch (error) {
      ShowAlert("Error", error.message);
      setLoanding(false);
    }
  };

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
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-12 col-xl-11">
                <div
                  className="card text-black"
                  style={{ borderRadius: "25px" }}
                >
                  <div className="card-body p-md-5">
                    <div></div>
                    <div className="row justify-content-center">
                      <div className="row">
                        <div className="col-sm">
                          <div className="mb-3">
                            <p className="text-left h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                              Menu
                            </p>

                            <i
                              className="bx bxs-plus-circle"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setExpand(getNodeIds(menunode));
                              }}
                            ></i>
                            <i
                              className="bx bxs-minus-circle"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setExpand([]);
                              }}
                            ></i>

                            <CheckboxTree
                              checked={checked}
                              expanded={expanded}
                              nodes={menunode}
                              onCheck={(checked) => setchecked(checked)}
                              onExpand={(expanded) => setExpand(expanded)}
                              onClick={(nodes) => onClick(nodes)}
                            />
                          </div>
                        </div>
                        <div className="col-sm">
                          <div className="mb-3">
                            <p className="text-center h4 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                              Role
                            </p>
                            <div>{isLoading ? <Spinner></Spinner> : ""}</div>
                            <Alerts alert={alert} />
                            <form
                              onSubmit={handleSubmit(onSubmitHandler)}
                              autocomplete="off"
                            >
                              <div className="row">
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <input
                                      {...register("txtMenuId")}
                                      type="text"
                                      className="form-control"
                                      id="txtMenuId"
                                      disabled
                                      placeholder="Menu Id"
                                    />
                                    <p>{errors.txtMenuId?.message}</p>
                                  </div>
                                </div>
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <input
                                      {...register("txtMenuname")}
                                      type="text"
                                      className="form-control"
                                      id="txtMenuname"
                                      disabled
                                      placeholder=" Name"
                                    />

                                  <button  className="btn btn-success" onClick={() => {  
                                    handlepopup('ADD');                                                 
                                    }} > <i className="bi bi-table"></i> Add </button>

                                  <button className="btn btn-primary"   onClick={() => {   
                                               handlepopup('EDIT');                                                   
                                                }} >  <i className="bi bi-pen"></i> </button>
                                  
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-sm">
                                  <div className="mb-3">
                                    <CheckboxTree
                                      //nodes={nodes}
                                      nodes={rolenode}
                                      checked={rolechecked}
                                      expanded={roleexpanded}
                                      onCheck={(checked) =>
                                        setRolechecked(checked)
                                      }
                                      onExpand={(expanded) =>
                                        setRoleExpand(expanded)
                                      }

                                      // onClick={(nodes) => settreenode(nodes)}
                                    />
                                  </div>
                                </div>
                              </div>

                              <button type="submit" className="btn btn-primary">
                                Submit
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Modal
          show={gridshow}
          onHide={gridhandleClose}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Child Menu</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form    onSubmit={handleSubmit(onGridModalSubmitHandler)}
                              autocomplete="off" >
              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalMnuGroupId" className="form-label">
                      {" "}
                      Menu Group Id
                    </label>
                    <input
                      {...register("txtModalMnuGroupId")}
                      type="text"
                      className="form-control"
                      disabled="disabled"
                      readonly="readonly"
                    />
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalMnuParentId" className="form-label">
                      {" "}
                      Menu Parent Id
                    </label>
                    <input
                      {...register("txtModalMnuParentId")}
                      type="text"
                      className="form-control"
                      disabled="disabled"
                      readonly="readonly"
                    />
                  </div>
                </div>

                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalMnuId" className="form-label">
                      {" "}
                      Menu Id
                    </label>
                    <input
                      {...register("txtModalMnuId")}
                      type="text"
                      className="form-control"
                      disabled="disabled"
                      readonly="readonly"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalMnuItmName" className="form-label">
                      {" "}
                      Menu Name
                    </label>
                    <input
                      {...register("txtModalMnuItmName")}
                      type="text"
                      className="form-control"
                    />
                    <p>{errors.txtMnuItmName?.message}</p>
                  </div>
                </div>
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalMnuOrd" className="form-label">
                      {" "}
                      Order
                    </label>
                    <input
                      {...register("txtModalMnuOrd")}
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-sm">
                  <div className="mb-3">
                    <label htmlFor="txtModalLink" className="form-label">
                      {" "}
                      Link
                    </label>
                    <input
                      {...register("txtModalLink")}
                      type="text"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <Modal.Footer>
                <Button variant="secondary" onClick={gridhandleClose}>
                  Close
                </Button>
                <Button type="submit" variant="secondary">
                  Update
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  } catch (error) {
    console.log(error.message);
  }
}

export default MngMenuRole;
