const readline = require("readline");
const path  = require("node:path");
const fs  = require("node:fs");
// const { execFile } = require('node:child_process');
const {spawn} = require('node:child_process');

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

function executeExternal(fullPath, args, done){
  const programName = path.basename(fullPath);
  const child = spawn(fullPath,args, {
    stdio : 'inherit',
    argv0 : programName
  });
  child.on('close', (code) => {
    done();
  })
}

function parseArgs(input){

  const args = [];
  let currentArg = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for(let i = 0; i < input.length; i++){
    const char = input[i];

   
    if(char === "'" && !inDoubleQuote){
      inSingleQuote = !inSingleQuote;
    }
     else if(char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
    }
    else if(char === ' ' && !inSingleQuote && !inDoubleQuote){
      if(currentArg.length > 0){
        args.push(currentArg);
        currentArg = "";
      }
    }else{
      currentArg += char;
    }
  }

  if(currentArg.length > 0){
    args.push(currentArg);
  }

  return args;
}

function prompt(){

  const builtins = ["echo", "exit", "type", "pwd", "cd"];

  rl.question("$ ", (answer) => {
    
    //Remove whitespace from the answer
    const trimmed = answer.trim();

    if(trimmed === "") return prompt();

    //const parts = trimmed.split(' ');           //Gives the array like parts [ 'hello', 'world', 'ai' ]
    const parts = parseArgs(trimmed);
    const cmd = parts[0];                       //Gets the first part, hello
    const args = parts.slice(1);                //Gets except the first part in array like args [ 'world', 'ai' ]

    //Exits the shell
    if(cmd === "exit"){
      rl.close();
      return;
    }

    //Returns the argument after cmd 
    if(cmd === "echo"){
      console.log(args.join(" "));
    }
    else if(cmd === "type"){

      const target = args[0];

      if(!target){
        prompt();
        return;
      }

      if(builtins.includes(target)){
        console.log(`${target} is a shell builtin`);
      }
      else{
        const pathName = pathFinder(target);
        if(pathName){
          console.log(`${target} is ${pathName}`)
        }else{
          console.log(`${target}: not found`)
        }
      }
    }
    else if(cmd === "pwd"){
      console.log(process.cwd());
    }
    else if(cmd === "cd"){
        const pathArg = args[0];
        const targetPath = pathArg === "~" ? process.env.HOME : pathArg;
        try{
          process.chdir(targetPath);
        }catch{
          console.log(`cd: ${pathArg}: No such file or directory`);
        }
    }
    else{
      const pathName = pathFinder(cmd);

      if(pathName){
        executeExternal(pathName, args, () => prompt());
        return;
      }else{
        console.log(`${cmd}: command not found`);
      }
      
    }

    prompt();
   
  });
}

prompt();


