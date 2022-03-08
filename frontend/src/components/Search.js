import React, { useState } from "react";
import { Form, Button, ListGroup, Card, ListGroupItem } from "react-bootstrap";
import ProfileItem from "./ProfileItem";
import "../css/Search.css";

export default function Search() {
  const [searchText, updateSearchText] = useState("");
  const [searchResults, updateSearchResults] = useState([]);

  function search() {
    fetch("/searchForUsername?text=" + searchText)
      .then((res) => res.json())
      .then((data) => updateSearchResults(data))
      .catch((err) => console.error(err));
  }

  return (
    <div className="search">
      <div className="search-wrapper">
        <Form className="search-form">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search for a username"
              onInput={(e) => {
                updateSearchText(e.target.value);
              }}
            />
          </Form.Group>
          <Button variant="primary" onClick={search}>
            Search
          </Button>
        </Form>
        {searchResults.length > 0 ? (
          <div className="search-results-wrapper">
            <Card style={{ width: "100%" }}>
              <ListGroup >
                {searchResults.map((item, idx) => (
                  <ListGroupItem key={idx} >
                    <ProfileItem {...item} listHideCallback={() => {}} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>
          </div>
        ) : (
          <p>No search results!</p>
        )}
      </div>
    </div>
  );
}
