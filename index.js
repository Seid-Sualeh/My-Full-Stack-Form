
const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

const db = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "myDBuser",
  database: "myDB",
});

//connect to mysql database
db.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});



app.get("/install", (req, res) => {
  // products table
  let createProducts = `CREATE TABLE IF NOT EXISTS Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_url VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL
)
`;
  // product description table
  let createProductDescription = `CREATE TABLE IF NOT EXISTS ProductDescription (
    description_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    product_brief_description TEXT,
    product_description TEXT,
    product_img VARCHAR(255),
    product_link VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)`;
  // product price table
  let createProductPrice = `CREATE TABLE IF NOT EXISTS ProductPrice (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    starting_price VARCHAR(50),
    price_range TEXT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
)`;
  // user table
  let createUser = `CREATE TABLE IF NOT EXISTS Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL
)
`;

  // order id table
  let createOrder = `CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    user_id INT,
    FOREIGN KEY (product_id) REFERENCES Products(product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
`;

  db.query(createProducts, (err) => {
    if (err) console.log(err);
  });
  db.query(createProductDescription, (err) => {
    if (err) console.log(err);
  });
  db.query(createProductPrice, (err) => {
    if (err) console.log(err);
  });
  db.query(createOrder, (err) => {
    if (err) console.log(err);
  });
  db.query(createUser, (err) => {
    if (err) console.log(err);
  });
  res.end("<h1>Table Created</h1>");
});

// Route to handle form POST
app.post("/addiphone", (req, res) => {
  const {
    product_name,
    product_url,
    product_brief_description,
    product_description,
    product_img,
    product_link,
    starting_price,
    price_range,
    user_name,
    user_password,
  } = req.body;
// console.log(req.body);
  // 1. Insert into Products
  const insertProduct = `INSERT INTO Products (product_url, product_name) VALUES (?, ?)`;

  db.query(insertProduct, [product_url, product_name], (err, productResult) => {
    if (err) return res.status(500).send("Error inserting product");

    const product_id = productResult.insertId;
    // const product_id = SELECT * FROM Products WHERE product_name="${product_name}";

    // 2. Insert into ProductDescription
    const insertDescription = `INSERT INTO ProductDescription 
      (product_id, product_brief_description, product_description, product_img, product_link)
      VALUES (?, ?, ?, ?, ?)`;
    db.query(
      insertDescription,
      [
        product_id,
        product_brief_description,
        product_description,
        product_img,
        product_link,
      ],
      (err, descResult) => {
        if (err)
          return res.status(500).send("Error inserting product description");

        // 3. Insert into ProductPrice
        const insertPrice = `INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES (?, ?, ?)`;
        db.query(
          insertPrice,
          [product_id, starting_price, price_range],
          (err, priceResult) => {
            if (err)
              return res.status(500).send("Error inserting product price");

            // 4. Insert into Users
            const insertUser = `INSERT INTO Users (user_name, user_password) VALUES (?, ?)`;
            db.query(
              insertUser,
              [user_name, user_password],
              (err, userResult) => {
                if (err) {
                  return res.status(500).send("Error inserting user");
                }
                const user_id = userResult.insertId; // 2

                // 5. Insert into Orders
                const insertOrder = `INSERT INTO Orders (product_id, user_id) VALUES (?, ?)`;
                db.query(
                  insertOrder,
                  [product_id, user_id],
                  (err, orderResult) => {
                    if (err)
                      return res.status(500).send("Error inserting order");

                    res.send(
                      "Product, description, price, user, and order added successfully!"
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

app.listen(5555, () => {
  console.log("Server is running on port 5555");
});
