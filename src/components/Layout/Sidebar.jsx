import React, { useEffect, useState } from "react";
import { Menu } from "../../menu";
import { Link, useNavigate } from "react-router-dom";
import { GetMenuitemList, GetMenuGroupList } from "../utilities/getmenulist";
import {
  generateUUID,
  compressBase64,
  decompressBase64,
} from "../utilities/utils";
import api from "../api/Webcall";

const Sidebar = () => {
  const navigate = useNavigate();

  // let Groupname = "";

  //https://stackoverflow.com/questions/54786653/parent-child-treeview-in-javascript-from-json-file
  //https://www.tutorialspoint.com/how-to-generate-child-keys-by-parent-keys-in-array-javascript
  //https://stackoverflow.com/questions/52607922/javascript-convert-array-of-objects-with-parent-keys-to-parent-child-tree-in

  // Menu Group Fetch
  const [Groupname, setGroupname] = useState("");
  const [GroupId, setGroupId] = useState("");
  const [menugrouplist, setMenugrouplist] = useState([]);
  const FetchMenugroupList = async () => {
    console.log("FetchMenugroupList int");
    const MenuGropListResponse = await GetMenuGroupList();
    setGroupname(MenuGropListResponse.body.mnugrps[0].mnugrpname);
    setGroupId(MenuGropListResponse.body.mnugrps[0].mnugrpid);
    setMenugrouplist(MenuGropListResponse.body.mnugrps);
  };

  useEffect(() => {
    FetchMenugroupList();
  }, []);

  // Menu Item Fetch based on menu Group

  const [Menulist, setMenuitemlist] = useState([]);
  const FetchMenuitemList = async () => {
    console.log("FetchMenuitemList int");
    const MenuitemListResponse = await GetMenuitemList(GroupId);
    setMenuitemlist(MenuitemListResponse);
    console.log(MenuitemListResponse);
  };

  useEffect(() => {
    FetchMenuitemList();
  }, [GroupId]);

  const onChange = (e) => {
    // setchecked(checked=>[...checked,'manager1'])

    let id = 0;
    id = e;
    setGroupId(id);
  };

  return (
    <>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            {/* <label  >Select Menu Group</label> */}
            <select
              defaultValue={GroupId}
              onChange={(e) => onChange(e.target.value)}
              className="form-control"
            >
              {
                //Combo Data binding
                menugrouplist.map((res) => (
                  <option key={res.mnugrpid} value={res.mnugrpid}>
                    {res.mnugrpname}
                  </option>
                ))
              }
            </select>
          </li>

          {Menulist.map((menu, index) =>
            menu.fixMenu ? (
              <React.Fragment key={index}>
                <li className="nav-item">
                  <Link
                    to={menu.path}
                    key={menu.name}
                    className="nav-link collapsed"
                  >
                    <i className="bi bi-person"></i>
                    <span>{menu.name}</span>
                  </Link>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <li className="nav-item">
                  <Link
                    to="#"
                    key={menu.name}
                    className="nav-link collapsed"
                    data-bs-target={"#a" + index}
                    data-bs-toggle="collapse"
                    href="#"
                    aria-expanded="false"
                  >
                    <i className="bi bi-journal-text"></i>
                    <span>{menu.name}</span>
                    <i className="bi bi-chevron-down ms-auto"></i>
                  </Link>

                  <ul
                    id={"a" + index}
                    className="nav-content collapse"
                    data-bs-parent="#sidebar-nav"
                  >
                    {menu.childrens.map((child, cIndex) => (
                      <li>
                        <Link key={child.path} to={child.path}>
                          <i className="bi bi-circle"></i>
                          <span>{child.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </React.Fragment>
            )
          )}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
