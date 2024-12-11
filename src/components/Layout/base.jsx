import React, { Suspense, lazy, useEffect, useContext } from "react";
import { MenuRoutes } from "../../routes";
import Spinner from "../htmlcomponents/Spinner";

import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Login from "../User/LoginForm";
import Newheader from "./Newheader";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";

const DashBoard = lazy(() => import("../Inbox"));

const Base = () => {
  const navigate = useNavigate();

  const logindata = useSelector((state) => state.logindata);

  let hasToken = localStorage.getItem("token");

  useEffect(() => {}, []);

  return (
    <React.Fragment>
      <Newheader key="header" />


      <Sidebar key="side" />

      <footer />

      <main id="main" className="main">
        <section>
          <Suspense
            fallback={
              <div>
                <Spinner />
              </div>
            }
          >
            <Routes>
              {MenuRoutes.map((route, index) => {
                return (
                  <Route
                    path={route.path}
                    key={route.path}
                    element={<route.component />}
                  />
                );
              })}

              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </section>
      </main>
    </React.Fragment>
  );
};

export default Base;
