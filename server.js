const express = require('express');
const app = express();
const bundle = require("./mybundler/bundler.js");
const memBundle = require("./mybundler/membundle.js");
const path = require("path");
const {getFiles,fixImportPath} = require("./mybundler/utils.js");
const routes = require("./router.js");
const fs = require("fs");

///////////////////////////////////////////
//               CONFIG                 //
const DEVELOPMENT = true;
///////////////////////////////////////////

var buildDirFiles = [];
if(DEVELOPMENT){

    // Making the routes 
    // NOT TESTED
    Object.entries(routes).forEach(e=>{
        const [k,v] = e;
        app.get(k,(req,res)=>{
            let memFile = memBundle.getFiles().find(file => path.normalize(file.path) == path.join("build",v));
            if(memFile){
                memBundle.build().then(()=>{
                    res.send(`${memFile.content}`);
                });
                return;
            }
            res.sendStatus(404);
        })  
    })

    // static serving
    app.get("*",(req,res)=>{
        let url = req.url;
        if(!url.startsWith("build")) {
            url = "build"+url;
        }
        let memFile = memBundle.getFiles().find(file => path.normalize(file.path) == path.normalize(url));
        if(memFile){
            let content = memFile.content;
            if(memFile.type == "javascript"){
                content = fixImportPath(content,buildDirFiles);
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
        if(buildDirFiles.includes(url)){
            res.sendFile(path.join(__dirname,url));
            return;
        }   
        res.sendStatus(404);
    })

    
}else {
    Object.entries(routes).forEach(e=>{
        const [k,v] = e;
        app.get(k,(req,res)=>{
            memBundle.build().then(()=>{
                res.sendFile(path.join("build",v));
            });
        })  
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

