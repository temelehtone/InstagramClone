import sanityClient from "./client.js";
import { createReadStream } from "fs";
import { basename } from "path";

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
      "following": count(following),
      "followers": *[_type == "user" && references(^._id)],
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
        console.log(data._id);
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
      "followers": count(*[_type == "user" && references(^._id)]),
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
      .then((data) => functions.getUserId(user).then((ids) =>
      sanityClient
        .patch(ids[0]._id)
        .set({
          first_name,
          last_name,
          bio,
          photo: { asset: { _ref: data._id } },
        }).commit()
    ))
      
  } else {
    return functions.getUserId(user)
    .then((ids) =>
      sanityClient
        .patch(ids[0]._id)
        .set({
          first_name,
          last_name,
          bio,
        }).commit()
    );
  }
};

export default functions;
