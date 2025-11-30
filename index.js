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

    console.log(`${answer}: command not found`);

    prompt();
   
  });
}

prompt();


