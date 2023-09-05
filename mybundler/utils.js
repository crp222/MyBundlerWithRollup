const fs = require("fs");

function getFiles(dir, files = []) {
    // Get an array of all files and directories in the passed directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
      let name = `${dir}/${file}`;
      // Check if the current file/directory is a directory using fs.statSync
      if (fs.statSync(name).isDirectory()) {
        // If it is a directory, recursively call the getFiles function with the directory path and the files array
        getFiles(name, files);
      } else {
        // If it is a file, push the full path to the files array
        files.push(name);
      }
    }
    return files;
}

function getFileName(path){
    let withoutExtension = path.split(".")[0];
    return withoutExtension.split("/").pop();
}

function getFileExtension(path){
    return path.split(".").pop();
}

function copy(src,dest){
    let path = "";
    let dir = dest.split("/");
    dir.pop();
    dir.forEach(d => {
        path += d + "/";
        if(!fs.existsSync(path))
            fs.mkdirSync(path);
    })
    fs.copyFileSync(src,dest);
}


///////////////////////////////////////////////////
///////      MODULE IMPORT PATH  FIXING     ///////
///////////////////////////////////////////////////
/**
 * Finds out that which module in matchingModules exports the module given in moduleName
 * If the export isn't default the noDefaultExport will be true
 * If doesn't find any module, returns an empty string, but the application will break anyways
 * @param {string} moduleName 
 * @param {Array<string>} matchingModules 
 * @param {{value:true}} noDefaultExport 
 * @returns 
 */
function findModule(moduleName,matchingModules,noDefaultExport){
    let goodModules = [];
    matchingModules.forEach(m => {
      if(!m.includes("/cjs/") && !m.includes("/_virtual/")) {
          let content = fs.readFileSync(m,"utf-8");
          let regex = new RegExp(`(export)[^a-zA-Z]{1,}(${moduleName != "_" ? moduleName : "[a-zA-Z]{1,}"})[^a-zA-Z]`);
          if(regex.test(content)){
              goodModules.push(m);
          }
      }
    })
    try {
      let content = fs.readFileSync(goodModules[0],"utf-8");
      if(!content.match(/[^a-zA-Z](default)[^a-zA-Z]/)) {
        noDefaultExport.value = true;
      }
      return goodModules[0];
    }catch {
      console.log("Wrong module import!");
      return "";
    }
}

/**
 * It handles 3 types of imports: (example) 
 *  - import 'SomeModule' from "'some path'"
 *  - import 'SomeModule',{'SomeModule','SomeModule'} from "'some path'"
 *  - import { 'SomeModule','SomeModule' } from "'some path'"
 * @param {string} module here gets the `'some path'`
 * @param {Array<string>} methods  here gets the first part between the `import` and the `from`(example: `'SomeModule',{'SomeModule'}`)
 * @param {Array<string>} buildDirFiles  all the js files that should be checked for exports
 * @returns 
 */
function getModulePath(module,methods,buildDirFiles){
  let matchingModules = buildDirFiles.filter(file => file.includes("/"+module));
  let separate = methods.split("{");
  if(separate.length == 1){
    return [{name:methods,path:findModule(methods,matchingModules)}];
  }
  let moduleName = separate[0].replace(",","").split(",")[0];
  let other = separate[1].replace("}","").split(",");
  if(moduleName && moduleName != ""){
      return [{name:moduleName,path:findModule(moduleName,matchingModules)}];
  }else {
      let paths = [];
      for(let i in other){
          let noDefaultExport = {value:false};
          let path = findModule(other[i],matchingModules,noDefaultExport);
          if(noDefaultExport.value)
            paths.push({name:"{"+other[i]+"}",path:path});
          else
            paths.push({name:other[i],path:path});
      }
      return paths;
  }
}


/**
* It handles 3 types of imports: (example) 
 *  - import 'SomeModule' from "'some path'"
 *  - import 'SomeModule',{'SomeModule','SomeModule'} from "'some path'"
 *  - import { 'SomeModule','SomeModule' } from "'some path'"
 * 
 * It searches trough the content,and tries to replace all the lazy import paths with correct paths.
 * Does this by separating lines containing import statements,break them into parts,and searching in buildDirFiles for files which exports 
 * the imported modules, then modifying the line to contain the right import path.
 * @param {string} content file content
 * @param {Array<string>} buildDirFiles all the js files that should be checked for exports
 * @returns the content with fixed import paths
 */
function fixImportPath(content,buildDirFiles) {
  let lines = content.split("\n");
  lines.forEach((line,i) => {
      if(line.trim().startsWith("import")){
          // fix import path
          let module = line.split("'")[1];
          if(!module.startsWith(".")){
            if(!line.includes("from")){
              line = `import _ from '${module}'`;
            }
            let methods = line.split("from")[0];
            methods = methods.replace("import ","").replaceAll(" ","");
            let modulePath = getModulePath(module,methods,buildDirFiles);
            lines[i] = "";
            for(let m of modulePath){
                lines[i] += `import ${m.name} from '${m.path.replace("build","")}'\n`; 
            }
          }
      }
  })
  return lines.join("\n");
}



module.exports = {getFiles,getFileName,getFileExtension,copy,fixImportPath};