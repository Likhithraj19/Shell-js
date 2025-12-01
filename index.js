const readline = require("readline");
const path  = require("node:path");
// const os = require("os");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// console.log("os.path", os.arch());

// const pathName = path.join('/usr', 'bin');
// console.log("pathName", pathName);

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

      const pathName = path.join('/usr', 'bin', `${cmd}`);
      const validLocal = path.join('/usr', 'local', 'bin', `${cmd}`);

      switch (cmd) {
        case "echo":
          console.log("echo is a shell builtin");
          break;

        case "exit":
          console.log("exit is a shell builtin");
          break;
        
        case "type":
          console.log("type is a shell builtin");
          break;
         
        case "grep":
          console.log(`grep is ${pathName}`);
          break;
        
        case "ls":
          console.log(`ls is ${pathName}`);
          break;
          
        case "valid_command":
          console.log(`valid_command is ${validLocal}`);
          break;
        
        default:
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


