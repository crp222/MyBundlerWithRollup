const express = require('express');
const app = express();
const bundle = require("./mybundler/bundler.js");
const memBundle = require("./mybundler/membundle.js");
const path = require("path");
const {getFiles} = require("./mybundler/utils.js");
const customRouter = require("./router.js");

///////////////////////////////////////////
//               CONFIG                 //
const DEVELOPMENT = false;
///////////////////////////////////////////

app.use(customRouter);

var buildDirFiles = [];
if(DEVELOPMENT){
    app.get("/",(req,res)=>{
        memBundle.build().then(()=>{
            res.send(memBundle.getFiles().find(file => file.path == "build/index.html").content);
        });
    })

    // static serving
    app.get("*",(req,res)=>{
        let url = "build"+req.url;
        let memFile = memBundle.getFiles().find(file => file.path == url);
        if(memFile){
            let content = memFile.content;
            if(memFile.type == "javascript"){
                content = fixImportPath(content);
                res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            }else {
                res.setHeader('Content-Type',`${memFile.type}; charset=UTF-8`);
            }        
            if(memFile.type == "text/html"){
                memBundle.build().then(()=>{
                    res.send(`${content}`);
                });
                return;
            }
            res.send(`${content}`);
            return;
        }
        if(buildDirFiles.includes(url))
            res.sendFile(path.join(__dirname,url));
    })

    
}else {
    app.get("/",(req,res)=>{
        res.sendFile(path.join(__dirname,"build/index.html"));
    })

    app.get("*",(req,res)=>{
        let url = "build"+req.url;
        if(buildDirFiles.includes(url))
            res.sendFile(path.join(__dirname,url));
    })
}

async function run() {
    await bundle.build();
    if(DEVELOPMENT) 
        await memBundle.build();
        buildDirFiles = getFiles("build");
    app.listen(3000,()=>{
        console.log("Server is listening on port 3000");
    });
}
run();

function fixImportPath(content) {
    let lines = content.split("\n");
    lines.forEach((line,i) => {
        if(line.trim().startsWith("import")){
            // fix import path
            let module = line.split("'")[1];
            module = module.split("'")[0];
            if(!module.startsWith(".")){
                let matchingModules = buildDirFiles.filter(file => file.includes("/"+module));
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
    return lines.join("\n");
}
