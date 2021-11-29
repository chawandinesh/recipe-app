/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "@firebase/auth";

const Login = () => {
  let navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const setErrorMessage = (code: string) => {
    switch (code) {
      case "auth/invalid-email":
        setError("Invalid Email/Password");
        break;
      case "auth/internal-error":
        setError("Invalid Email/Password");
        break;
      case "auth/user-not-found":
        setError("User not found");
        break;
      case "auth/wrong-password":
        setError("Invalid credentials");
        break;
      default:
        setError("");
        break;
    }
  };
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const { email, password } = formData;

  const handleSubmit = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (res.user) {
        window.localStorage.setItem("user", JSON.stringify(res.user));
        navigate("/dashboard", { replace: true });
      }
      return res;
    } catch (err: any) {
      setErrorMessage(err.code);
      return null;
    }
  };
  return (
    <Row className="m-0">
      <Col></Col>
      <Col xs={12} sm={8} lg={6} className="align-items-center d-flex justify-content-center login-card">
        <Form className="w-75">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control name="email" value={email} onChange={handleChange} type="email" placeholder="Enter email" />
            {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              value={password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
          </Form.Group>
          {error && <p className="text-danger font-weight-bold">*{error}</p>}

          <p>
            New user?{" "}
            <a
              className="link pointer"
              onClick={() => {
                navigate("/signup", { replace: true });
              }}
            >
              Click here
            </a>
          </p>

          <Button className="submit-btn" onClick={handleSubmit} variant="primary" type="button">
            Login
          </Button>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default Login;
