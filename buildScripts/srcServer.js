import express from "express";
import path from "path";
import webpack from "webpack";
import config from "../webpack.config.dev";
import { exec } from "child_process";

/* eslint-disable no-console */

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(
  require("webpack-dev-middleware")(compiler, {
    publicPath: config.output.publicPath,
  })
);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/index.html"));
});

app.get("/users", function (req, res) {
  // Hard Coding
  res.json([
    {
      id: 1,
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@gmail.com",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Doe",
      email: "john@gmail.com",
    },
    {
      id: 3,
      firstName: "Mark",
      lastName: "Hazleton",
      email: "mark@gmail.com",
    },
  ]);
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    exec(`start http://localhost:${port}`, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
});
