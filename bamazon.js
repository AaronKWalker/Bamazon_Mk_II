const mysql = require('mysql');
const inquirer = require('inquirer');
//const Table = require('cli-table');
const chalk = require('chalk');
const Table = require('cli-table-redemption');

let userStatus, itemIndex;

const connection = mysql.createConnection({
  host: 'localhost',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'bamazonMkII'
});


//======[UTILITY FUNCTIONS]======
function connectToDB(){
  connection.connect(function(err){
    if (err) throw err;
    console.log('connected to DB');
    displayWelcome();
  });
}


function updateInventory(param1, param2, param3){
  connection.query('UPDATE inventory SET ? WHERE ?', [
    {
      stock_quantity: param1,
      product_sales: param2
    }, {
      item_id: param3
    }
  ], function(err){
    if (err) throw err;
  });
}


function stayOrGo(answer){
  switch (userStatus) {
    case 'customer':
      inquirer.prompt([
        {
          name: 'userChoice',
          type: 'confirm',
          message: `You bought ${answer.amount} ${answer.item}.  Your total is $${answer.cost}.00. Would you like to buy anything else?`
        }
      ]).then(function(answer){
        answer.userChoice ? customer() : displayWelcome();
      });
      break;
  }
}


function showInv(input){
  if (input === 'all') {
    connection.query('SELECT * FROM inventory', function(error, results){
      if (error) throw error;

      let table = new Table({
        head: ['No.', 'Product', 'Department', 'Price', 'Stock Quanity'],
        colWidths: [5, 15, 15, 10, 15]
      });
      for (let i = 0; i < results.length; i++) {
        table.push(
          [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]
        );
      }
      console.log(table.toString());
      manager();
    });//--connection.query--
  }

  if (input === 'low') {
    connection.query('SELECT * FROM inventory WHERE stock_quantity<=5', function(error, results){
      if (error) throw error;

      let table = new Table({
        head: ['No.', 'Product', 'Department', 'Price', 'Stock Quanity'],
        colWidths: [5, 15, 15, 10, 15]
      });
      for (let i = 0; i < results.length; i++) {
        table.push(
          [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]
        );
      }
      console.log(table.toString());
      manager();
    });//--connection.query--
  }
}


function manageInv(input){
  if (input === 'increase') {
    let choiceArr = [];
    connection.query('SELECT * FROM  inventory', function(error, results){
      if (error) throw error;
      for (var i = 0; i < results.length; i++) {
        choiceArr.push(results[i].product_name);
      }

      let table = new Table({
        head: ['No.', 'Product', 'Department', 'Price', 'Stock Quanity'],
        colWidths: [5, 15, 15, 10, 15]
      });
      for (let i = 0; i < results.length; i++) {
        table.push(
          [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]
        );
      }
      console.log(table.toString());

      inquirer.prompt([
        {
          type: 'input',
          name: 'userChoice',
          message: 'Which item do you want to increase? Please input item No.'
        }, {
          type: 'input',
          name: 'amount',
          message: 'How much do you want to increase by?'
        }, {
          type: 'confirm',
          name: 'validation',
          message: 'Are you sure?'
        }
      ]).then(function(answer){
        if (answer.validation) {
          let index = parseInt(answer.userChoice) - 1;
          let newAmount = parseInt(results[index].stock_quantity) + parseInt(answer.amount);
          connection.query('UPDATE inventory SET ? WHERE ?', [
            {
              stock_quantity: newAmount
            }, {
              item_id: answer.userChoice
            }
          ],function(error){
            if (error) throw error;
            connection.query('SELECT * FROM  inventory WHERE ?', [
              {
                item_id: answer.userChoice
              }
            ] ,function(err, res){
              if (err) throw err;
              let table2 = new Table({
                head: ['No.', 'Product', 'Department', 'Price', 'Stock Quanity'],
                colWidths: [5, 15, 15, 10, 15]
              });
              for (let i = 0; i < res.length; i++) {
                table2.push(
                  [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity, res[i].product_sales]
                );
              }
              console.log(chalk.white.bgGreen.bold('Success! Here is the updated inventory'));
              console.log(table2.toString());
              manager();
            });
          })

        } else {
          manageInv('increase');
        }
      });
    });
  }

  if (input === 'add') {
    inquirer.prompt([
      {
        type: 'input',
        name: 'productName',
        message: 'What is the new product called?'
      }, {
        type: 'input',
        name: 'departmentName',
        message: 'What department does it belong to?'
      },{
        type: 'input',
        name: 'productCost',
        message: 'How much does it cost?'
      }, {
        type: 'input',
        name: 'stockQuantity',
        message: 'How many?'
      }, {
        type: 'confirm',
        name: 'confirmation',
        message: 'Are you sure?'
      }
    ]).then(function(answer){
      if (answer.confirmation) {
        var queryString = 'INSERT INTO inventory (product_name, department_name, price, stock_quantity) VALUES ("' + answer.productName + '", "' + answer.departmentName + '", ' + answer.productCost + ', ' +  answer.stockQuantity + ')';
        connection.query(queryString, function(err){
          if (err) throw err;
          manager();
        });
      } else {
        manageInv('add')
      }
    });
  }
}

function salesByDept(){
  connection.query('SELECT d.department_id, d.department_name, d.over_head_costs, SUM(i.product_sales) as product_sales, d.over_head_costs - i.product_sales as total_profit FROM inventory i JOIN departments d ON d.department_name=i.department_name GROUP BY i.department_name ORDER BY d.department_id',
  function(error, results){
    if (error) throw error;
    let table = new Table({
      head: ['No.', 'Department', 'Overhead Costs', 'Product Sales', 'Total Profit'],
      colWidths: [5, 20, 20, 20, 20]
    });
    for (let i = 0; i < results.length; i++) {
      table.push(
        [results[i].department_id, results[i].department_name, results[i].over_head_costs, results[i].over_head_costs, results[i].total_profit]
      );
    }
    console.log(table.toString());
    supervisor();
  });
}


function createDept(){
 inquirer.prompt([
   {
     type: 'input',
     name: 'departmentName',
     message: 'What is the name of the new department?'
   }, {
     type: 'input',
     name: 'overheadCosts',
     message: 'What is the overhead costs of the new department?'
   }, {
     type: 'confirm',
     name: 'confirmation',
     message: 'Are you sure?'
   }
 ]).then(function(answer){
   if (answer.confirmation) {
     var queryString = 'INSERT INTO departments (department_name, over_head_costs) VALUES ("' + answer.departmentName + '", "' + answer.overheadCosts + '")';
     connection.query(queryString, function(err){
       if (err) throw err;
       supervisor();
   } else {
     supervisor();
   }
 });
}


//======[INTERFACE FUNCTIONS]======

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
    "||||||    ||    ||  ||      ||  ||    ||  ||||||||  ||||||||  ||      ||"
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
        userStatus = 'customer';
        customer();
        break;
      case 'Manager':
        userStatus = 'manager';
        manager();
        break;
      case 'Supervisor':
        userStatus = 'supervisor';
        supervisor();
        break;
    }
  });
}


//IF costumer//////////////////
function customer(){
  connection.query('SELECT * FROM inventory', function(error, results){
    if (error) throw error;
    let table = new Table({
      head: ['No.', 'Product', 'Department', 'Price', 'Stock Quanity'],
      colWidths: [5, 15, 15, 10, 15]
    });

    for (let i = 0; i < results.length; i++) {
      table.push(
        [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity, results[i].product_sales]
      );
    }
    console.log(table.toString());


    inquirer.prompt([
      {
        name: 'userChoice',
        type:'input',
        message: 'Please select an item to buy via its No.'
      }, {
        name: 'amount',
        type: 'input',
        message: 'How many would you like?'
      }
    ]).then(function(answer){
      itemIndex = parseInt(answer.userChoice) - 1;
      if (parseInt(results[itemIndex].stock_quantity - answer.amount) <= 0) {
        console.log(chalk.white.bgRed.bold('Not enough inventory available! Please make another selection'));
        customer();
      } else {
        var newAmount = parseInt(results[itemIndex].stock_quantity - answer.amount);
        var totalSale = parseInt(answer.amount) * parseInt(results[itemIndex].price) + parseInt(results[itemIndex].product_sales);
        updateInventory(newAmount, totalSale, answer.userChoice);
        answer.item = results[itemIndex].product_name;
        answer.cost = parseInt(results[itemIndex].price * answer.amount);
      }
      return answer;
    }).then(function(answer){
      stayOrGo(answer);
    });//--.then--
  });//--connection.query--
}//--customer--


//IF manager//////////////////
function manager(){
  inquirer.prompt([
    {
      name: 'userChoice',
      type:'rawlist',
      message: 'Please make a selection',
      choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Go Back']
    },
  ]).then(function(answer){
    switch (answer.userChoice) {
      case 'View Products for Sale':
        showInv('all');
        break;
      case 'View Low Inventory':
        showInv('low');
        break;
      case 'Add to Inventory':
        manageInv('increase');
        break;
      case 'Add New Product':
        manageInv('add');
        break;
      case 'Go Back':
        displayWelcome();
        break;
    }
  });
}



//IF supervisor//////////////////
function supervisor(){
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'userChoice',
      message: 'Please select an option',
      choices: ['View Product Sales by Department', 'Create New Department', 'Go Back']
    }
  ]).then(function(answer){
    switch (answer.userChoice) {
      case 'View Product Sales by Department':
        salesByDept();
        break;
      case 'Create New Department':
        createDept();
        break;
      case 'Go Back':
        displayWelcome();
        break;
    }
  });
}
  //display options

connectToDB();
