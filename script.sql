CREATE DATABASE IF NOT EXISTS bamazonMkII;
CREATE database bamazonMkII;
USE bamazonMkII;

DROP TABLE inventory;

CREATE TABLE inventory(
  item_id INT NOT NULL PRIMARY KEY auto_increment,
  product_name VARCHAR (100) NULL,
  department_name VARCHAR (100) NULL,
  price DECIMAL (10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL (10,2) NULL
);

INSERT INTO  inventory (product_name, department_name, price, stock_quantity, product_sales)
VALUES (
"Dune", "books", 10.00, 30, 80.00
), (
"The Hobbet", "books", 16.00, 40, 90.00
), (
"What Color Is Your Parachute?", "books", 9.00, 30, 60.00
), (
"Walden", "books", 11.00, 20, 40.00
), (
"Popular Mechanics", "magazines", 5.00, 20, 20.00
), (
"Guns and Gardens", "magazines", 15.00, 10, 50.00
), (
"Contact 3 2 1", "magazines", 5.00, 20, 70.00
), (
"Wired", "magazines", 6.00, 25, 12.00
), (
"spatula", "kitchen", 6.00, 15, 30.00
), (
"garlic press", "kitchen", 8.00, 15, 30.00
), (
"rolling pin", "kitchen", 3.00, 8, 9.00
), (
"cutting board", "kitchen", 2.00, 16, 20.00
), (
"pillow", "bedding", 15.00, 22, 45.00
), (
"blanket", "bedding", 17.00, 28, 88.00
), (
"comforter", "bedding", 30.00, 4, 90.00
), (
"pillow case", "bedding", 13.00, 18, 90.00
), (
"iPhone", "electronics", 800.00, 8, 1600.00
), (
"iPad", "electronics", 1000.00, 7, 2000.00
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

UPDATE inventory SET stock_quantity=17 WHERE item_id=1;

SELECT d.department_id, d.department_name, d.over_head_costs, SUM(i.product_sales) as product_sales, d.over_head_costs - i.product_sales as total_profit
FROM inventory i 
JOIN departments d 
ON d.department_name=i.department_name 
GROUP BY i.department_name 
ORDER BY d.department_id;