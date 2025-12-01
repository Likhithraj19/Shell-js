const readline = require("readline");
const path  = require("node:path");
const fs  = require("node:fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const PATH = ['/usr/bin/', '/usr/local/bin/', '/bin/'];
const PATH = (process.env.PATH || "").split(path.delimiter);

function pathFinder(cmd){

  for(const dir of PATH){
    const fullPath = path.join(dir, cmd);

    if(!fs.existsSync(dir)) continue;

    try{
      fs.accessSync(fullPath, fs.constants.X_OK);
      return fullPath;
    }catch{

    }
  }
  return null;
}

function prompt(){
  rl.question("$ ", (answer) => {

    if(answer.toLowerCase() === "exit"){
      rl.close();
      return;
    }

    if(answer.startsWith("echo ")){
      console.log(`${answer.slice(5)}`);
    }
    else if(answer.startsWith("type ")){
      const cmd = answer.slice(5).trim();

      const pathName = pathFinder(cmd);

      const builtins = ["echo", "exit", "type"];

      if(builtins.includes(cmd)){
        console.log(`${cmd} is a shell builtin`);
      }
      else if(pathName){
          console.log(`${cmd} is ${pathName}`)
      }
      else{
        console.log(`${cmd}: not found`);
      }
    }
    else{
      console.log(`${answer}: command not found`);
    }

    prompt();
   
  });
}

prompt();


