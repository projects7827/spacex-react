import express from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Main from "../src/component/main";
import fs from "fs";

const app = express();
app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.get("*", (req, res) => {

  const indexpath = path.resolve("./build/index.html");

  fs.readFile(indexpath, "utf8", function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send(
        data.replace(
          `<div id="root"></div>`,
          `<div id="root">${ReactDOMServer.renderToString(<Main />)}</div>`
        )
      );
    }
  });
});

app.listen(8000, () => {
  console.log("connected");
});
