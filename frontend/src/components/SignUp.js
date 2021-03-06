import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SignUp({ setAlert, setUser }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  function createAccount() {
    fetch("/getProfile?user=" + username)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setAlert({
            variant: "danger",
            message: "Username is already in use.",
          });
          return;
        } else {
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: firstName,
              lastName: lastName,
              username: username,
            }),
          };
          fetch("/createUser", requestOptions)
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              setAlert({
                variant: "success",
                message: "Your account has been created.",
              });
              setUser(data.username);
              navigate("/");
            })

            .catch((err) => console.log(err));
        }
      });
  }

  function updateUsername(e) {
    setUsername(e.target.value);
  }
  function updateFirstname(e) {
    setFirstName(e.target.value);
  }
  function updateLastName(e) {
    setLastName(e.target.value);
  }

  return (
    <Form className="center-form">
      <Form.Group className="mb-4">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Username"
          onInput={updateUsername}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="FirstName"
          onInput={updateFirstname}
        />
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="LastName"
          onInput={updateLastName}
        />
      </Form.Group>
      <Button variant="primary" type="button" onClick={createAccount}>
        Create Account
      </Button>
    </Form>
  );
}
