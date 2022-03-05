import React from "react";
import { ListGroup, ListGroupItem, Modal, Card } from "react-bootstrap";

import ProfileItem from "./ProfileItem.js";

export default function FollowersList({ show, profileData, listHideCallback }) {
  return (
    <Modal show={show} onHide={listHideCallback}>
      <Modal.Header closeButton>
        <Modal.Title>Followers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {profileData.followers ? (
          <div className="search-results-wrapper">
            <Card style={{ width: "100%" }}>
              <ListGroup>
                {profileData.followers.map((item, idx) => (
                  <ListGroupItem>
                    <ProfileItem {...item} key={idx} />
                  </ListGroupItem>
                ))}
              </ListGroup>
            </Card>
          </div>
        ) : (
          <p>No Followers!</p>
        )}
      </Modal.Body>
    </Modal>
  );
}
