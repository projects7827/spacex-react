import  Express  from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Main from "../src/component/main";


const app = Express();

app.get('/', (req, res) => {
    console.log(ReactDOMServer);
  res.send(ReactDOMServer.renderToString(<Main />))
})
app.listen(8000,()=>{
    console.log("connected");
});