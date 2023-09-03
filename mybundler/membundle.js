const { rollup } = require("rollup");
const fs = require("fs");
const commonjs = require("@rollup/plugin-commonjs")
const babel = require("@rollup/plugin-babel");
const {getFiles, getFileExtension,copy} = require("./utils.js");
const resolve = require("@rollup/plugin-node-resolve");

var files = [];
var bundle;

const inputOptions = {
    input : {},
    external:[],
    plugins : [
        commonjs(),
        babel({ 
            presets: ['@babel/preset-react'],
            babelHelpers:"bundled",
            extensions:[".js",".jsx"],
            compact: false,
        })
    ]
}

const outputOptions = {
    format : "es",
}

function init() {
    let packageJson = fs.readFileSync("./package.json");
    let package = JSON.parse(packageJson);
    Object.keys(package.dependencies).forEach(dep => {
        inputOptions.external.push(new RegExp(dep));
    })
}
init();

function getInputFiles() {
    inputOptions.input = {};
    files = [];
    let buff = [];
    getFiles("src",buff);
    buff.forEach(f => {
        if(["js","jsx"].includes(getFileExtension(f)))
            inputOptions.input[f.replace("src/","").split(".")[0]] = f;
        else {
            let buildf = f.replace("src","build")
            let content = fs.readFileSync(f,"utf-8");
            let type = "text/plain";
            if((""+buildf).endsWith(".css")) 
                type = "text/css";
            if((""+buildf).endsWith(".html"))
                type = "text/html";
               
            
            files.push({path:buildf,content:content,type:type});
        }
    })
}

function saveBundledFiles(output) {
    output.forEach(o => {
        files.push({path:"build/"+o.fileName,content:o.code,type:"javascript"});
    })
}

async function bundleInMemory() {
    console.log("Building in memory...");
    getInputFiles();
    try {
        bundle = await rollup(inputOptions);
        let rollupOutput = await bundle.generate(outputOptions);
        saveBundledFiles(rollupOutput.output);
        console.log("Build in memory finished!");
    }catch(err){
        console.log(err);
    }
}

function getMemorySavedFiles() {
    return files;
}

module.exports = {
    build : bundleInMemory,
    getFiles : getMemorySavedFiles,
}