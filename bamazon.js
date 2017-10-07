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
  inquirer.prompt([
    {
      name: 'userChoice',
      type: 'list',
      message: 'Please select your level of access',
      choices: ['Customer', 'Manager', 'Supervisor']
    }
  ]).then(function(answer){
    console.log(answer);
  });
}

//IF costumer//////////////////

  //diplay items available

  //take user input

  //check if quanity requested is available

  //change amount of item in DB

  //diplay items again

//IF manager//////////////////

  //display options

  //take user input

  //do whatever the option selected will do


//IF supervisor//////////////////

  //display options

connectToDB();
