import express from "express";
import bodyParser from "body-parser";
import functions from "./apiCalls.js";
import multer from "multer";


const { createUser, getProfile, createPost } = functions;

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

app.post("/createPost", upload.single("file"), (req, res) => {
  const body = req.body;
  createPost(body.user, body.caption, req.file).then((data) => res.json(data));
});

app.listen(3001, () => console.log("Started..."));
