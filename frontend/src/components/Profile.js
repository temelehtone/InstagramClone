import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

import EditProfile from "./EditProfile";
import "../css/Profile.css";
import FollowersList from "./FollowersList";
import FollowingList from "./FollowingList";

export default function Profile({ setAlert, user }) {
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState({});
  const [following, setFollowing] = useState(false);
  const [owner, setOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const params = useParams();

  useEffect(() => {
    updateProfile(params.username);
  }, [params.username, user]);

  function updateFollowing(profile) {
    for (let follower of profile.followers) {
      if (follower.username === user) {
        setFollowing(true);
        return;
      }
    }
    setFollowing(false);
  }

  function updateProfile(username) {
    fetch("/getProfile?user=" + username)
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          setAlert({ variant: "danger", message: "Profile does not exist." });
          return;
        }
        fetch("/getPosts?user=" + username)
          .then((res) => res.json())
          .then((posts) => {
            setProfileData(data[0]);
            setPosts(posts);
            updateFollowing(data[0]);
            setOwner(user === data[0].username);
          });
      })
      .catch((err) => console.error(err));
  }
  function followClick() {
    if (owner) return;

    if (!following) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, id: profileData._id }),
      };
      fetch("/addFollower", requestOptions)
        .then((res) => res.json())
        .then((_data) => updateProfile(params.username))
        .catch((err) => console.error(err));
    } else {
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user, id: profileData._id }),
      };
      fetch("/removeFollower", requestOptions)
        .then((res) => res.json())
        .then((_data) => updateProfile(params.username))
        .catch((err) => console.error(err));
    }
  }

  function hideEditCallback() {
    updateProfile(params.username);
    setEditing(false);
  }
  function listHideCallback() {
    setShowFollowing(false);
    setShowFollowers(false);
  }

  return (
    <div className="profile">
      <EditProfile
        user={user}
        show={editing}
        hideCallback={hideEditCallback}
        profileData={profileData}
        setAlert={setAlert}
      />
      <FollowersList
        profileData={profileData}
        show={showFollowers}
        listHideCallback={listHideCallback}
      />
      <FollowingList
        profileData={profileData}
        show={showFollowing}
        listHideCallback={listHideCallback}
      />
      <div className="profile-banner">
        <h4>@{profileData.username}</h4>
        <div className="profile-data">
          <img
            alt=""
            src={
              profileData.photo
                ? profileData.photo.asset.url
                : "https://via.placeholder.com/80"
            }
            id="profile-img"
          />
          <div className="vertical-data">
            <p>
              <strong>Posts</strong>
            </p>
            <h4>{posts ? posts.length : 0}</h4>
          </div>
          <div className="vertical-data">
            {user && (owner || following) ? (
              <Button variant="success" onClick={() => setShowFollowers(true)}>
                Followers
              </Button>
            ) : (
              <p>
                <strong>Followers</strong>
              </p>
            )}

            <h4>{profileData.followers ? profileData.followers.length : 0}</h4>
          </div>
          <div className="vertical-data">
            {user && (owner || following) ? (
              <Button variant="success" onClick={() => setShowFollowing(true)}>
                Following
              </Button>
            ) : (
              <p>
                <strong>Following</strong>
              </p>
            )}
            <h4>{profileData.following ? profileData.following.length : 0}</h4>
          </div>
          
        </div>
        <div className="profile-second-row">
          <div className="profile-bio">
            <div className="profile-name">
              <strong>
                {(profileData.first_name ? profileData.first_name : "") +
                  " " +
                  (profileData.last_name ? profileData.last_name : "")}
              </strong>
            </div>
            <div className="profile-text">{profileData.bio}</div>
          </div>
        <div>
        <div className="follow-button">
            {user && !owner ? (
              <Button
                variant={following ? "danger" : "success"}
                onClick={followClick}
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            ) : null}
          </div>
          {user && owner ? (
            <Button variant="primary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : null}
        </div>
        </div>
      </div>
      <div className="break"></div>
      <div className="profile-posts-wrapper">
        <div className="profile-posts">
          {posts && posts.length > 0
            ? posts.map((post, idx) => (
                <img alt="" src={post.photo.asset.url} key={idx} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
