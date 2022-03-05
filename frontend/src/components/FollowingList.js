import React from "react";
import { ListGroup, ListGroupItem, Modal, Card } from "react-bootstrap";

import ProfileItem from "./ProfileItem.js";

export default function FollowersList({ show, profileData, listHideCallback }) {
  
  console.log(profileData.following)
  return (
    <Modal show={show} onHide={listHideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Following</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {profileData.following ? (
          <div className="search-results-wrapper">
            <Card style={{ width: "100%" }}>
              <ListGroup>
                {profileData.following.map((item, idx) => (
                  
                  <ListGroupItem>
                    <ProfileItem {...item} key={idx} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>
          </div>
        ) : (
          <p>You don't follow anyone!</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
