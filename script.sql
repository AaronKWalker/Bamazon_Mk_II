CREATE database bamazonMkII;
USE bamazonMkII;

DROP TABLE inventory;

CREATE TABLE inventory(
  item_id INT NOT NULL PRIMARY KEY auto_increment,
  product_name VARCHAR (100) NULL,
  department_name VARCHAR (100) NULL,
  price DECIMAL (10,4) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL (10,4) NULL
);

INSERT INTO  inventory (product_name, department_name, price, stock_quantity)
VALUES (
"Dune", "books", 10.00, 30
), (
"The Hobbet", "books", 16.00, 40
), (
"What Color Is Your Parachute?", "books", 9.00, 30
), (
"Walden", "books", 11.00, 20
), (
"Popular Mechanics", "magazines", 5.00, 20
), (
"Guns and Gardens", "magazines", 15.00, 10
), (
"Contact 3 2 1", "magazines", 5.00, 20
), (
"Wired", "magazines", 6.00, 25
), (
"spatula", "kitchen", 6.00, 15
), (
"garlic press", "kitchen", 8.00, 15
), (
"rolling pin", "kitchen", 3.00, 8
), (
"cutting board", "kitchen", 2.00, 16
), (
"pillow", "bedding", 15.00, 22
), (
"blanket", "bedding", 17.00, 28
), (
"comforter", "bedding", 30.00, 4
), (
"pillow case", "bedding", 13.00, 18
);

CREATE TABLE departments(
  department_id INT NOT NULL PRIMARY KEY auto_increment,
  department_name VARCHAR (100) NULL,
  over_head_costs DECIMAL (10,4) NULL
);

DROP TABLE departments;

INSERT INTO  departments (department_name, over_head_costs)
VALUES (
"books", 75.00
), (
"magazines", 60.00
), (
"kitchen", 100.00
), (
"bedding", 80.00
);
