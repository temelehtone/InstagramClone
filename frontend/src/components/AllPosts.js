import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import "../css/AllPosts.css";

export default function AllPosts({ user }) {
  const [allPostsData, setAllPosts] = useState(null);
  const [userId, setUserId] = useState(null);
  const [comment, setComment] = useState("");
  var canLike = true;

  useEffect(() => {
    initializePage();
    if (user) getUserId(user);
  }, [user, allPostsData]);

  function initializePage() {
    if (!user) {
      fetch("/getAllPosts")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setAllPosts(data);
        })
        .catch((err) => console.error(err));
    } else {
      fetch("getPostsOfFollowing?user=" + user)
        .then((res) => res.json())
        .then((data) => {
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
          setTimeout(() => {}, 500);
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
          setTimeout(initializePage(), 500);
          canLike = true;
          
        })
        .catch((err) => console.error(err));
    }
  }

  function addComment(post) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user, comment: comment, post: post }),
    };

    fetch("/addComment", requestOptions)
      .then((_data) => {setTimeout(initializePage(), 500); setComment("")
      document.querySelector(".comment-input").value = ""
    })
      .catch((err) => console.error(err));
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
                <Card.Body className="card-body">
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
                          <BsHeart className="unliked-heart" />
                        )
                      ) : null}
                    </IconButton>
                    <Card.Text>
                      <strong>{post.likes ? post.likes.length : 0}</strong>{" "}
                      likes
                    </Card.Text>
                  </div>

                  <Card.Text>
                    <Link to={"/profile/" + post.username} style={{color: "black"}}><strong>{post.username}</strong></Link> 
                      {"  " + post.description}
                  </Card.Text>
                  <h5>Comments</h5>
                  {post.comments
                    ? post.comments.map((item, idx) => (
                      
                      <div className="comment-field" key={idx}>
                        <Link to={"/profile/" + item.split(" ")[0]} style={{ color: "black" }}>
                        <strong>{item.split(" ")[0]}</strong>:
                        </Link>
                        <Card.Text style={{ color: "grey" }}>
                          {item.split(" ").slice(1, item.split(" ").length).join(" ")}
                        </Card.Text>
                        </div>
                      ))
                    : null}
                  {user ? (
                    <Form>
                      <div className="comment-form">
                        <Form.Control
                        className="comment-input"
                          placeholder="Add a Comment..."
                          type="text"
                          onInput={(e) => setComment(e.target.value)}
                        />
                        <Button onClick={() => addComment(post)}>Post</Button>
                      </div>
                    </Form>
                  ) : null}
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
