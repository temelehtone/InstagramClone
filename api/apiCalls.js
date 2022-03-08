import sanityClient from "./client.js";
import { createReadStream } from "fs";
import { basename } from "path";
import { nanoid } from "nanoid";

const functions = {};

functions.createUser = (firstName, lastName, username) => {
  return sanityClient.create({
    _type: "user",
    first_name: firstName,
    last_name: lastName,
    username: username,
    created_at: new Date(),
  });
};

functions.getProfile = (user) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == $username]{
      ...,
      following[]->{
        ...,
        "followers": *[_type == "user" && references(^._id)],
        photo{
          asset->{
            _id,
            url
          }
        }
      },
      "followers": *[_type == "user" && references(^._id)]{
        ...,
        "followers": *[_type == "user" && references(^._id)],
        photo{
          asset->{
            _id,
            url
          }
        }
      },
      photo{
        asset->{
          _id,
          url
        }
      }
    }`,
    { username: user }
  );
};

functions.createPost = (user, caption, image) => {
  return sanityClient.assets
    .upload("image", createReadStream(image.path), {
      filename: basename(image.path),
    })
    .then((data) =>
      functions.getUserId(user).then((ids) => {
        const id = ids[0]._id;
        return sanityClient.create({
          _type: "post",
          author: { _ref: id },
          photo: { asset: { _ref: data._id } },
          description: caption,
          created_at: new Date(),
        });
      })
    );
};

functions.getUserId = (user) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == $username]{
    _id
  }`,
    { username: user }
  );
};

functions.getAllPosts = () => {
  return sanityClient.fetch(`*[_type == "post"]{
    ...,
    likes[]->{
      ...
    },
    "username": author->username,
    photo{
      asset->{
        _id,
        url
      }
    }
  }`);
};

functions.getPostsOfFollowing = (username) => {
  return sanityClient.fetch(
    `*[_type == "user" && username == $username]{
    following[]->{
      "posts": *[_type == "post" && references(^._id)]{
        ...,
        likes[]->{
          ...
        },
        "username": author->username,
        photo{
          asset->{
            _id,
            url
          }
        }
      }
    }
  }`,
    { username }
  );
};

functions.searchForUsername = (text) => {
  return sanityClient.fetch(
    `*[_type == "user" && username match "${text}*"]{
      ...,
      "followers": *[_type == "user" && references(^._id)],
      photo{
          asset->{
          _id,
          url
        }
      }
    }`
  );
};

functions.getPosts = (user) => {
  return sanityClient.fetch(
    `*[_type == "post" && author->username == $username]{
    ...,
    "username": author->username,
    photo{
      asset->{
        _id, 
        url
      }
    }
  }`,
    { username: user }
  );
};

functions.updateProfile = (user, first_name, last_name, bio, image) => {
  if (image) {
    return sanityClient.assets
      .upload("image", createReadStream(image.path), {
        filename: basename(image.path),
      })
      .then((data) =>
        functions.getUserId(user).then((ids) =>
          sanityClient
            .patch(ids[0]._id)
            .set({
              first_name,
              last_name,
              bio,
              photo: { asset: { _ref: data._id } },
            })
            .commit()
        )
      );
  } else {
    return functions.getUserId(user).then((ids) =>
      sanityClient
        .patch(ids[0]._id)
        .set({
          first_name,
          last_name,
          bio,
        })
        .commit()
    );
  }
};

functions.addFollower = (user, followingId) => {
  return functions.getUserId(user).then((ids) =>
    sanityClient
      .patch(ids[0]._id)
      .setIfMissing({ following: [] })
      .insert("after", "following[-1]", [
        { _ref: followingId, _key: nanoid(), _type: "reference" },
      ])
      .commit()
  );
};

functions.removeFollower = (user, followingId) => {
  return functions.getUserId(user).then((ids) =>
    sanityClient
      .patch(ids[0]._id)
      .unset([`following[_ref=="${followingId}"]`])
      .commit()
  );
};

functions.addLike = (postId, userId) => {
  return sanityClient
    .patch(postId)
    .setIfMissing({ likes: [] })
    .insert("after", "likes[-1]", [
      { _ref: userId, _type: "reference" },
    ])
    .commit();
};

functions.removeLike = (postId, userId) => {
  return sanityClient
    .patch(postId)
    .unset([`likes[_ref=="${userId}"]`])
    .commit();
};
functions.addComment = (user, comment, postId) => {
  return sanityClient
    .patch(postId)
    .setIfMissing({ comments: [] })
    .insert("after", "comments[-1]", [`${user} ${comment}`])
    .commit();
};

export default functions;
