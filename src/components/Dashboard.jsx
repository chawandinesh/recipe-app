import { collection, getDocs, query } from "@firebase/firestore";
import React,{useEffect, useState} from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
import { auth, db } from "../firebase";
import _ from 'lodash'
import AddRecipeModalForm from "./AddRecipeModalForm";

const Dashboard = () => {
    const [show, setShow] = useState(false)
    const [allRecipes, setAllRecipes] = useState()
    const getAllRecipiesOfCurrentUser = async () => {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          if (doc.data().id === auth?.currentUser?.uid) {
            setAllRecipes(_.get(doc.data(), "recipes", ""));
            setShow(false)
          }
        });
      };

      useEffect(() => {
        getAllRecipiesOfCurrentUser()
      }, [])
  return (
    <Row>
      <Col></Col>
      <Col xs={6}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="text-center p-2">Recipes</h1>
          </div>
          <div>
            <Button variant="primary" onClick={() => setShow(true)}>Add Recipe</Button>{" "}
          </div>
        </div>
        <hr />
        <div>

        <Row xs={1} md={2} className="g-4">
  { _.map(allRecipes, each=> (
    <Col>
      <Card>
        <Card.Img variant="bottom" src={each.image} style={{height: "160px", objectFit:"cover"}}/>
        <Card.Body>
          <Card.Title>{each.name}</Card.Title>
          <Card.Text>
            {each.overView}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  ))}
  </Row>
            {/* {
                _.map(allRecipes, eachRecipe => {
                    return (
                        
                    )
                })
            } */}
        </div>
      </Col>
      <Col></Col>
      <AddRecipeModalForm show={show} setShow={setShow} getAllRecipies={getAllRecipiesOfCurrentUser}/>
    </Row>
  );
};

export default Dashboard;
