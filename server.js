const express = require('express');
const app = express();
const bundle = require("./bundler.js");
const path = require("path");
const {getFiles} = require("./utils.js");
const fs = require("fs");

const DEVELOPMENT = true;

if(DEVELOPMENT){
    app.get("/",(req,res)=>{
        bundle.build().then(()=>{
            fixImports();
            res.sendFile(path.join(__dirname,"build/index.html"));
        });
    })
}else {
    app.get("/",(req,res)=>{
        res.sendFile(path.join(__dirname,"build/index.html"));
    })
}

var files = [];
app.get("*",(req,res)=>{
    let url = "build"+req.url;
    if(files.includes(url))
        res.sendFile(path.join(__dirname,url));
})

function fixImports() {
    files.forEach(file => {
        if(file.includes("node_modules")){
            return;
        }
        let content = fs.readFileSync(file,"utf-8");
        let lines = content.split("\n");
        lines.forEach((line,i) => {
            if(line.trim().startsWith("import")){
                // fix import path
                let module = line.split("'")[1];
                module = module.split("'")[0];
                if(!module.startsWith(".")){
                    let matchingModules = files.filter(file => file.includes("/"+module));
                    let modulePath = "";
                    if(matchingModules.length == 1){
                        modulePath  = matchingModules[0].replace("build/","");
                    }else {
                        modulePath = "node_modules/"+module+"/index.js";
                    }
                    lines[i] = line.replace(module,"/"+modulePath);
                }
                // TODO : fix import react functions "{ useState, useEffect } => { r as reactExports }"
            }
        })
        content = lines.join("\n");
        fs.writeFileSync(file,content);
    })
}

async function run() {
    await bundle.build();
    if(DEVELOPMENT) 
        await bundle.build();
    files = getFiles("build");
    fixImports();
    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    });
}
run();