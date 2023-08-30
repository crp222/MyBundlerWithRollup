const { rollup } = require("rollup");
const fs = require("fs");
const commonjs = require("@rollup/plugin-commonjs")
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const babel = require("@rollup/plugin-babel");
const {getFiles, getFileExtension,copy} = require("./utils.js");

var FirstBuild = true;

const SecondBuildPlugins = [
    babel({ 
        presets: ['@babel/preset-react'],
        babelHelpers:"bundled",
        extensions:[".js",".jsx"],
        compact: false,
    })
]

const inputOptions = {
    input : {},
    plugins : [
        resolve(),
        commonjs(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __buildDate__: () => JSON.stringify(new Date()),
            preventAssignment:true,
        }),
        babel({ 
            presets: ['@babel/preset-react'],
            babelHelpers:"bundled",
            extensions:[".js",".jsx"],
            compact: false,
        })
    ]
}

const outputOptions = {
    dir : "build",
    format : "es",
    preserveModules : true,
}

function getInputFiles() {
    if(FirstBuild){
        fs.rmSync("build",{recursive:true});
        fs.mkdirSync("build");
    }else {
        inputOptions.plugins = SecondBuildPlugins;
    }
        
    let files = [];
    getFiles("src",files);
    files.forEach(f => {
        if(["js","jsx"].includes(getFileExtension(f)))
            inputOptions.input[f.replace("src/","").split(".")[0]] = f;
        else {
            let buildf = f.replace("src","build")
            copy(f,buildf);
        }
    })
}

async function build() {
    console.log("Building...");
    getInputFiles();
    let bundle;
    try {
        bundle = await rollup(inputOptions);
        await bundle.write(outputOptions);
        console.log("Build finished!");
        if(FirstBuild)
            FirstBuild = false;
    }catch(err){
        console.log(err);
    }
}

module.exports = {build};