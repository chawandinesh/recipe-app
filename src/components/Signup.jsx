/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import { Form, Button, Row, Col } from "react-bootstrap";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { addDoc, collection } from "@firebase/firestore";
import { auth, db } from "../firebase";
const SignUp = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const setErrorMessage = (code) => {
    switch (code) {
      case "auth/password-not-matched":
        setError("Password and confirm password not matched")
        break;
      case "auth/invalid-email":
        setError("Invalid Email/Password");
        break;
      case "auth/internal-error":
        setError("Invalid Email/Password");
        break;
      case "auth/weak-password":
        setError("Weak password")
        break;
      case "auth/user-not-found":
        setError("User not found");
        break;
      case "auth/wrong-password":
        setError("Invalid credentials");
        break;
      case "auth/email-already-in-use":
        setError("Email already registered")
        break;
      default:
        setError("");
        break;
    }
  };

  const { name, email, password, confirmPassword } = formData;
  
  const handleSubmit = async() => {
    const usersCollectionRef = collection(db,"users")
    try {
      if(password === confirmPassword){
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      const result = await addDoc(usersCollectionRef,{name: name, email: email, id: user.uid})
      localStorage.setItem("user", JSON.stringify(user))
      if(res.user){
        window.localStorage.setItem("user",JSON.stringify(res.user))
        navigate("/dashboard", { replace: true });
      }
      return result
    }else{
      setErrorMessage("auth/password-not-matched")
    }
    } catch (err) {
      setErrorMessage(err.code)
    }
  };
  return (
    <Row>
      <Col></Col>
      <Col xs="8" className="align-items-center d-flex justify-content-center login-card">
        <Form className="w-50">
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control value={name} name="name" onChange={handleChange} type="text" placeholder="Enter Name" />
            {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" value={email} name="email" onChange={handleChange} placeholder="Enter email" />
            {/* <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text> */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              name="password"
              onChange={handleChange}
              placeholder="Password"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm Password"
            />
          </Form.Group>
          {error && <p className="text-danger font-weight-bold">*{error}</p>}
          <p>
            Already registered?{" "}
            <a
              className="link pointer"
              onClick={() => {
                navigate("/login", { replace: true });
              }}
            >
              Click here
            </a>
          </p>
          <Button onClick={handleSubmit} className="submit-btn" variant="primary" type="button">
            Submit
          </Button>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default SignUp;
