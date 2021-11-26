/* eslint-disable react-hooks/exhaustive-deps */
import React,{ useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import Header from "../components/Header";
import { Col, Row } from "react-bootstrap";

type ChildProps = {
  children : any
}

const AppRoutes = () => {
  const [state, setstate] = useState(false);
  const RequireAuth = ({ children }: ChildProps) => {
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
      } else {
        setstate(!state);
        window.localStorage.removeItem("user");
      }
    });
    return () => unsubscribe();
  }, []);

  const Layout = ({ children }: ChildProps) => (
    <Col>
      <Row  className="m-0">
        <Header />
      </Row>
      <Row  className="m-0">{children}</Row>
    </Col>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
