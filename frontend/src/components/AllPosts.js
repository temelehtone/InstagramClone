import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import { BsFillHeartFill, BsHeart, BsTrash } from "react-icons/bs";
import IconButton from "@mui/material/IconButton";
import "../css/AllPosts.css";

export default function AllPosts({ user }) {
  const [allPostsData, setAllPosts] = useState(null);
  const [comment, setComment] = useState("");
  var canLike = true;

  useEffect(() => {
    initializePage();
  }, [user]);

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
          setAllPosts(data);
        })
        .catch((err) => console.error(err));
    }
  }

  function likeButtonPressed(post) {
    if (!user || !canLike) return;
    canLike = false;
    if (post.likes.filter((like) => like.like === user).length === 0) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, post: post }),
      };
      fetch("/addLike", requestOptions)
        .then((_data) => {
          canLike = true;
          initializePage();
        })
        .catch((err) => console.error(err));
    } else {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, post: post }),
      };
      fetch("/removeLike", requestOptions)
        .then((_data) => {
          canLike = true;
          initializePage();
        })
        .catch((err) => console.error(err));
    }
  }

  function addComment(post) {
    if (comment.trim() === "") {
      initializePage();
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: user, comment: comment.trim(), post: post }),
    };

    fetch("/addComment", requestOptions)
      .then((_data) => {
        initializePage();
        setComment("");
        document.querySelector(".comment-input").value = "";
      })
      .catch((err) => console.error(err));
  }
  function removeComment(post, commentKey) {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: commentKey, post: post }),
    };

    fetch("/removeComment", requestOptions)
      .then((_data) => {
        initializePage();
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
                        post.likes.filter((like) => like.like === user).length >
                        0 ? (
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
                    <Link
                      to={"/profile/" + post.username}
                      style={{ color: "black" }}
                    >
                      <strong>{post.username}</strong>
                    </Link>
                    {"  " + post.description}
                  </Card.Text>
                  <h5>Comments</h5>
                  {post.comments
                    ? post.comments.map((item, idx) => (
                        <div className="comment-field" key={idx}>
                          <Link
                            to={"/profile/" + item.comment.split(" ")[0]}
                            style={{ color: "black" }}
                          >
                            <strong>{item.comment.split(" ")[0]}</strong>:
                          </Link>

                          <Card.Text
                            style={{ color: "grey", marginBottom: "5px" }}
                          >
                            {item.comment
                              .split(" ")
                              .slice(1, item.comment.split(" ").length)
                              .join(" ")}
                          </Card.Text>
                          {user === item.comment.split(" ")[0] ? (
                            <IconButton
                              onClick={() => removeComment(post, item._key)}
                            >
                              <BsTrash size="0.5em" style={{ color: "red" }} />
                            </IconButton>
                          ) : null}
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
