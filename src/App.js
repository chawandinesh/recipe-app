import Routes from "./routes";
import {  Col } from "react-bootstrap";
const App = () => {
  console.log(process.env)
  return (
    <div>
      <Col>
       <Routes/>
      </Col>
    </div>
  );
};

export default App;
