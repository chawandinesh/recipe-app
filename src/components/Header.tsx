/* eslint-disable jsx-a11y/anchor-is-valid */
import { Navbar, Nav } from "react-bootstrap";
import * as _ from "lodash";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router";

const Header = () => {
  const navigate = useNavigate()
  const getUser = localStorage.getItem("user")
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Navbar bg="dark" variant="dark" className="w-100 d-flex justify-content-between" >
      {/* <Container> */}
        <Navbar.Brand href="#home">
          Recipe App
        </Navbar.Brand>
        {localStorage.getItem("user") && (
          <Nav>
            <div className="d-inline-flex justify-content-center align-items-center">
              <p className="signin-as m-0">Signin as: </p>
              <p className="text-white m-0 px-2"> {getUser ? _.get(JSON.parse(getUser), "email") : null}</p>
              <a className="btn btn-danger" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </Nav>
        )}
      {/* </Container> */}
    </Navbar>
  );
};

export default Header;
