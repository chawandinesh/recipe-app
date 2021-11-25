/* eslint-disable jsx-a11y/img-redundant-alt */
import { collection, doc, getDocs, query, setDoc } from "@firebase/firestore";
import { getDownloadURL, uploadBytes } from "@firebase/storage";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaCheckSquare, FaPlus } from "react-icons/fa";
import { auth, db, storageRef } from "../firebase";
import _ from "lodash";
const AddRecipeModalForm = ({ show, setShow , getAllRecipies}) => {
  const imageRef = React.createRef();
  const [imageLoading, setImageLoading] = useState({
    loading: false,
    error: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    overView: "",
    image: null,
  });

  const clearForm = ()  => {
     setFormData({
      name: "",
      overView: "",
      image: null,
     })
  }
  const [allRecipes, setAllRecipes] = useState([]);

  const getAllRecipiesOfCurrentUser = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      if (doc.data().id === auth?.currentUser?.uid) {
        setAllRecipes(_.get(doc.data(), "recipes", ""));
      }
    });
  };

  const addRecipes = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((eachDoc) => {
      if (eachDoc.data().id === auth?.currentUser?.uid) {
        setDoc(doc(db, "users", eachDoc.id.toString()), {
          ...eachDoc.data(),
          recipes: [...allRecipes, formData],
        }).then((res) => {
          getAllRecipies()
          clearForm()
        });
      }
    });
  };

  useEffect(() => {
    getAllRecipiesOfCurrentUser();
  }, []);

  const handleImage = (e) => {
    setImageLoading({ ...imageLoading, loading: true });
    uploadBytes(storageRef(`${auth?.currentUser?.uid}-${formData.name}`), e.target.files[0]).then((snapshot) => {
      getDownloadURL(storageRef(`${auth?.currentUser?.uid}-${formData.name}`)).then((data) => {
        setFormData({ ...formData, image: data });
        setImageLoading({ ...imageLoading, loading: false });
      });
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <Modal show={show} onHide={() => {
      setShow(false)
      clearForm()
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Add Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Paneer curry"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Overview</Form.Label>
            <Form.Control as="textarea" rows={3} name="overView" value={formData.overView} onChange={handleChange} />
          </Form.Group>
        </Form>
        <Form.Group>
          <div className="d-flex justify-content-between align-items-center">
            {/* <div className="image-div">
                <FaPlus/>

            </div> */}
            <div
              className="image-div d-flex align-items-center justify-content-center"
              onClick={() => {
                imageRef.current.click();
              }}
            >
              {imageLoading.loading ? (
                <Spinner animation="border" variant="primary" />
              ) : formData.image ? (
                <img alt="no-image" src={formData.image} />
              ) : (
                <FaPlus color="#ddd" fontSize={30} />
              )}
            </div>
            {formData.image ? (
              <div className="font-bold success-image text-center">
                <FaCheckSquare color="#008000" /> Successfully Added
              </div>
            ) : (
              <div className="font-bold text-center">Add Image</div>
            )}

            {/* <div className="font-bold fail-image text-center">
              <FaWindowClose color="#ff3737" /> Failed to add
            </div> */}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {
          setShow(false)
          clearForm()
        }}>
          Close
        </Button>
        <Button variant="primary" onClick={() => addRecipes()}>
          Add Recipe
        </Button>
      </Modal.Footer>
      <input type="file" accept="image/*" onChange={handleImage} className="d-none" ref={imageRef} />
    </Modal>
  );
};

export default AddRecipeModalForm;
