import express from "express";
import bodyParser from "body-parser";
import functions from "./apiCalls.js";
import multer from "multer";

const {
  createUser,
  getProfile,
  createPost,
  getPostsOfFollowing,
  getAllPosts,
  searchForUsername,
  getPosts,
  updateProfile,
  addFollower,
  removeFollower,
  addLike,
  removeLike,
  getUserId,
  addComment,
  removeComment
} = functions;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

app.post("/createUser", (req, res) => {
  const body = req.body;
  createUser(body.firstName, body.lastName, body.username).then((data) =>
    res.json(data)
  );
});

app.get("/getProfile", (req, res) => {
  const user = req.query.user;
  getProfile(user).then((data) => res.json(data));
});

app.get("/getUserId", (req, res) => {
  const user = req.query.user;
  getUserId(user).then((data) => res.json(data));
});

app.post("/createPost", upload.single("file"), (req, res) => {
  const body = req.body;
  createPost(body.user, body.caption, req.file).then((data) => res.json(data));
});

app.get("/getPostsOfFollowing", (req, res) => {
  const user = req.query.user;
  getPostsOfFollowing(user, userId)
    .then((data) => {
      var posts = data[0].following;
      posts = posts.map((post) => post.posts);

      posts = posts.flat(1);
      var newPosts = [];
      posts.forEach((post) => {
        if (!newPosts.includes(post)) newPosts.push(post);
      });
      newPosts.sort(function (post, post2) {
        return (
          new Date(post2.created_at).getTime() -
          new Date(post.created_at).getTime()
        );
      });
      newPosts.forEach((post) => {
        post.likes ? null : (post.likes = []);
      });
      res.json(newPosts);
    })
    .catch((err) => {
      console.error(err);
      res.json([]);
    });
});

app.get("/getAllPosts", (req, res) => {
  getAllPosts().then((data) => {
    data.sort(function (post, post2) {
      return (
        new Date(post2.created_at).getTime() -
        new Date(post.created_at).getTime()
      );
    });
    res.json(data);
  });
});

app.get("/searchForUsername", (req, res) => {
  const text = req.query.text;
  searchForUsername(text).then((data) => res.json(data));
});

app.get("/getPosts", (req, res) => {
  const user = req.query.user;
  getPosts(user).then((data) => {
    data.sort(function (post, post2) {
      return (
        new Date(post2.created_at).getTime() -
        new Date(post.created_at).getTime()
      );
    });
    res.json(data);
  });
});

app.post("/updateProfile", upload.single("file"), (req, res) => {
  const body = req.body;
  updateProfile(
    body.user,
    body.first_name,
    body.last_name,
    body.bio,
    req.file
  ).then((data) => res.json(data));
});

app.post("/addFollower", (req, res) => {
  const body = req.body;
  addFollower(body.user, body.id).then((data) => res.json(data));
});

app.delete("/removeFollower", (req, res) => {
  const body = req.body;
  removeFollower(body.user, body.id).then((data) => res.json(data));
});

app.post("/addLike", (req, res) => {
  const body = req.body;
  addLike(body.post._id, body.user);
  res.json([]);
});

app.delete("/removeLike", (req, res) => {
  const body = req.body;
  removeLike(body.post._id, body.user).then((data) => res.json(data));
});

app.post("/addComment", (req, res) => {
  const body = req.body;
  addComment(body.user, body.comment, body.post._id)
  res.json([])
})

app.delete("/removeComment", (req, res) => {
  const body = req.body;
  removeComment(body.comment, body.post._id).then((data) => res.json(data));
});


app.listen(3001, () => console.log("Started..."));
