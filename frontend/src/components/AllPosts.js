import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { BsFillHeartFill } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import "../css/AllPosts.css";

export default function AllPosts({ user }) {
  const [allPostsData, setAllPosts] = useState(null);
  const [userId, setUserId] = useState(null);
  var canLike = true;

  useEffect(() => {
    initializePage();
    if (user) getUserId(user);
  }, [user]);

function removeDuplicants(data){
  var list = []
  data.forEach((post) => list.push(post._id))
  list.forEach((id => {if (count(list.filter((id => id ))) > 1) {
    
    list.splice(list.indexOf(id), 1)
    data.splice(list.indexOf(id), 1)
  }}))

}

  function initializePage() {
    if (!user) {
      fetch("/getAllPosts")
        .then((res) => res.json())
        .then((data) => {
          
          setAllPosts(data);
        })
        .catch((err) => console.error(err));
    } else {
      fetch("getPostsOfFollowing?user=" + user)
        .then((res) => res.json())
        .then((data) => {
          removeDuplicants(data)
          console.log(data);
          setAllPosts(data);
        })
        .catch((err) => console.error(err));
    }
  }

  function getUserId(username) {
    fetch("/getUserId?user=" + username)
      .then((res) => res.json())
      .then((data) => {
        setUserId(data[0]._id);
      });
  }

  function likeButtonPressed(post) {
    if (!user || !canLike) return;
    canLike = false;
    if (
      post.likes.filter((likerProfile) => likerProfile.username === user)
        .length === 0
    ) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, post: post }),
      };
      fetch("/addLike", requestOptions)
        .then((_data) => {
          setTimeout(() =>{}, 500)
          canLike = true;
          initializePage();
        })
        .catch((err) => console.error(err));
    } else {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, post: post }),
      };
      fetch("/removeLike", requestOptions)
        .then((_data) => {
          setTimeout(() =>{}, 500)
          canLike = true;
          initializePage();
        })
        .catch((err) => console.error(err));
    }
  }

  return (
    <div className="center mb-3">
      {allPostsData
        ? allPostsData.map((post, index) => (
            <div
              className="center m-2"
              style={{ minWidth: "30%", maxWidth: "400px" }}
              key={index}
            >
              <Card>
                <div className="d-flex align-items-center flex-column">
                  <Link to={"/profile/" + post.username}>
                    <Card.Title>@{post.username}</Card.Title>
                  </Link>
                  <Card.Img
                    variant="top"
                    src={post.photo.asset.url}
                    style={{ width: "100%" }}
                  ></Card.Img>
                </div>
                <Card.Body>
                  <div className="likes-and-comments">
                    <IconButton
                      onClick={() => likeButtonPressed(post)}
                      className="like-button"
                    >
                      {user ? (
                        post.likes.filter(
                          (likerProfile) => likerProfile.username === user
                        ).length > 0 ? (
                          <BsFillHeartFill className="liked-heart" />
                        ) : (
                          <BsFillHeartFill className="unliked-heart" />
                        )
                      ) : null}
                    </IconButton>
                    <Card.Text style={{ color: "black" }}>
                      <strong>{post.likes ? post.likes.length : 0}</strong>{" "}
                      likes
                    </Card.Text>
                  </div>

                  <Card.Text style={{ color: "black" }}>
                    {post.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {new Date(post.created_at).toLocaleString()}
                </Card.Footer>
              </Card>
            </div>
          ))
        : null}
    </div>
  );
}
