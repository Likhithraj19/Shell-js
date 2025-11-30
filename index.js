const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


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


