const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
const chalk = require('chalk');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazonMkII'
});

function connectToDB(){
  connection.connect(function(err){
    if (err) throw err;
    console.log('connected to DB');
    displayWelcome();
  });
}

//display the welcome/type of user screen
function displayWelcome(){
  console.log(chalk.yellow.bold(
    "////////////////////////////////////////////////////////////////////////"
  ));
  console.log(chalk.blue.bold(
    "||||||    ||||||||  ||      ||  ||||||||  ||||||||  ||||||||  ||      ||"
  ));
  console.log(chalk.blue.bold(
    "||    ||  ||    ||  ||||  ||||  ||    ||        ||  ||    ||  ||||    ||"
  ));
  console.log(chalk.blue.bold(
    "||    ||  ||    ||  ||  ||  ||  ||    ||        ||  ||    ||  ||  ||  ||"
  ));
  console.log(chalk.blue.bold(
    "||||||    ||||||||  ||      ||  ||||||||    ||||    ||    ||  ||    ||||"
  ));
  console.log(chalk.blue.bold(
    "||    ||  ||    ||  ||      ||  ||    ||  ||        ||    ||  ||      ||"
  ));
  console.log(chalk.blue.bold(
    "||    ||  ||    ||  ||      ||  ||    ||  ||        ||    ||  ||      ||"
  ));
  console.log(chalk.blue.bold(
    "||||||    ||    ||  ||      ||  ||    ||  |||||||   ||||||||  ||      ||"
  ));
  console.log(chalk.yellow.bold(
    "////////////////////////////////////////////////////////////////////////"
  ));
  inquirer.prompt([
    {
      name: 'userChoice',
      type: 'rawlist',
      message: 'Please select your level of access',
      choices: ['Customer', 'Manager', 'Supervisor']
    }
  ]).then(function(answer){
    switch (answer.userChoice) {
      case 'Customer':
        customer();
        break;
      case 'Manager':
        manager();
        break;
      case 'Supervisor':
        supervisor();
        break;
    }
  });
}

//IF costumer//////////////////
function customer(){
  console.log('customer');
}
  //diplay items available

  //take user input

  //check if quanity requested is available

  //change amount of item in DB

  //diplay items again

//IF manager//////////////////
function manager(){
  console.log('manager');
}
  //display options

  //take user input

  //do whatever the option selected will do


//IF supervisor//////////////////
function supervisor(){
  console.log('supervisor');
}
  //display options

connectToDB();
