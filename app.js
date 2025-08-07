const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all routes

const connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "myDBuser",
  database: "myDB",
});

//connect to mysql database
connection.connect((err) => {
  if (err) {
    console.log("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});


//create a table
app.get("/install", (req, res) => {
  //products table
  let createProducts = `CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_url VARCHAR(255) NOT NULL,
    product_name VARCHAR(100) NOT NULL
  )`;

  //product description table
  let createProductDescription = `CREATE TABLE IF NOT EXISTS productDescription (
    description_id INT auto_increment PRIMARY KEY,
    product_id INT NOT NULL,
    product_brief_description TEXT NOT NULL,
    product_description TEXT NOT NULL,
    product_img VARCHAR(255) NOT NULL,
    product_link VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
  )`;

  //product price table
  let createProductPrice = `CREATE TABLE IF NOT EXISTS ProductPrice (
    price_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    starting_price varchar(255) NOT NULL,
    price_range varchar(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
  )`;

  //user table
  let createUser = `CREATE TABLE IF NOT EXISTS User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
     product_id INT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_password VARCHAR(100) NOT NULL

  )`;

  //product_order table
  let createProductOrder = `CREATE TABLE IF NOT EXISTS ProductOrder (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(product_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)

)`;

  connection.query(createProducts, (err, results) => {
    if (err) console.log("Error creating products table:", err);
    else console.log("Products table created successfully.");

    connection.query(createProductDescription, (err, results) => {
      if (err) console.log("Error creating products table:", err);
      else console.log("product description table created successfully.");
    });
    connection.query(createProductPrice, (err, results) => {
      if (err) console.log("Error creating products table:", err);
      else console.log("Product Price table created successfully.");
    });
    connection.query(createUser, (err, results) => {
      if (err) console.log("Error creating products table:", err);
      else console.log("User table created successfully.");
      connection.query(createProductOrder, (err, results) => {
        if (err) console.log("Error creating products table:", err);
        else console.log("Product Order table created successfully.");
      });
    });
  });

  res.send(
    "<h1>✅ Tables created successfully. Check your database for details.</h1>"
  );
});

app.post("/addiphone",  (req, res) => {
  const {
    product_url,
    product_name,
    product_brief_description,
    product_description,
    product_img,
    product_link,
    starting_price,
    price_range,
    user_name,
    user_email,
    user_password,
  } = req.body;

  // 1. Insert Product
  const insertproduct = "INSERT INTO products (product_url, product_name) VALUES (?, ?)";
  connection.query(insertproduct,

    [product_url, product_name],
    (err, productResult) => {
      if (err) res.status(500).send("Error inserting product");

      const product_id = productResult.insertId;

      // 2. Insert Product Description
      const insertDescripition = "INSERT INTO productDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?, ?, ?, ?, ?)";
      connection.query( insertDescripition,

        [
          product_id,
          product_brief_description,
          product_description,
          product_img,
          product_link,
        ],
        (err) => {
          if (err) res.status(500).send("Error inserting description");

          // 3. Insert Product Price
          connection.query(
            "INSERT INTO ProductPrice (product_id, starting_price, price_range) VALUES (?, ?, ?)",
            [product_id, starting_price, price_range],
            (err) => {
              if (err) res.status(500).send("Error inserting price");

              // 4. Insert User
              connection.query(
                "INSERT INTO User (product_id, user_name, user_email, user_password) VALUES (?, ?, ?, ?)",
                [product_id, user_name, user_email, user_password],

                (err, userResult) => {
                  if (err) res.status(500).send("Error inserting user");

                  const user_id = userResult.insertId;

                  // 5. Insert Product Order
                  connection.query(
                    "INSERT INTO ProductOrder (product_id, user_id) VALUES (?, ?)",
                    [product_id, user_id],
                    (err) => {
                      if (err) res.status(500).send("Error inserting order");
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
  res.send("<h1>✅Product and related data added successfully!</h1");
});



app.listen(5555, () => {
  console.log("Server is running on port 5555");
});
