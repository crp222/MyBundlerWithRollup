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

module.exports = {getFiles,getFileName,getFileExtension,copy};