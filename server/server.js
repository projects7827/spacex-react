import  Express  from "express";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Main from "../src/component/main";


const app = Express();
console.log(__dirname, '..', 'build');
app.use(Express.static(path.resolve('build')))

app.get('/', (req, res) => {
    console.log("homepage");
    console.log(<Main />);
  res.send(`<div id="root">${ReactDOMServer.renderToString(<Main />)}</div>`)
})
app.listen(8000,()=>{
    console.log("connected");
});