/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import Header from "../components/Header";
import { Row } from "react-bootstrap";
// import fs from 'fs-extra'
const AppRoutes = () => {
  const [state, setstate] = useState(false)
  const RequireAuth = ({ children }) => {
    let location = useLocation();
    if (localStorage.getItem("user")) {
      return children;
    }
    return <Navigate to="/login" state={{ from: location }} />;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        window.localStorage.setItem("user", JSON.stringify(user));
      }else{
        setstate(!state)
        window.localStorage.removeItem("user")
      }
    });
    return () => unsubscribe();
  }, []);

  const Layout = ({ children }) => (
    <>
      {" "}
      <Row>
        <Header />
      </Row>
      <Row>{children}</Row>
    </>
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
     
              <Login />
         
          }
        />
        <Route
          path="/signup"
          element={
      
              <Signup />
           
          }
        />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            </Layout>
          }
        />
        <Route exact path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
