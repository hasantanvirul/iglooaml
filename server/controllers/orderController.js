const mysql = require("mysql");
let addressId1;

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "iglooaml",
});

// Proceed to Payment endpoint logic
const checkout = (req, res) => {
  const {
    userData,
    subtotal,
    currentTime,
    cartContent,
  } = req.body;

  // Assuming you have functions to handle SQL queries
  const insertAddressQuery1 = `INSERT INTO address_books (name, phone, country, address_name, address, appartment, city, status, created_at)
                              VALUES (?, ?, "Bangladesh", "Billing address", ?, ?, "Dhaka", "Active", ?)`;
  const insertAddressQuery2 = `INSERT INTO address_books (name, phone, country, address_name, address, appartment, city, status, created_at)
                              VALUES (?, ?, "Bangladesh", "Shipping address", ?, ?, "Dhaka", "Active", ?)`;
  const insertOrderQuery = `INSERT INTO orders (amount, product_details, billing_address, shipping_address, order_note, payment_type, payment_status, status, created_at)
                            VALUES (?, ?, ?, ?, ?, "Online Payment", "Paid", "Pending", ?)`;
                            

  // const product_details='O:29:"Illuminate\Support\Collection":1:{s:8:"�*�items";a:1:{s:32:"f3c810b16e511321bb414f8c85174799";O:32:"Gloudemans\Shoppingcart\CartItem":10:{s:5:"rowId";s:32:"f3c810b16e511321bb414f8c85174799";s:2:"id";i:83;s:3:"qty";s:1:"1";s:4:"name";s:8:"Ambrosia";s:5:"price";d:1100;s:6:"weight";d:0;s:7:"options";O:39:"Gloudemans\Shoppingcart\CartItemOptions":1:{s:8:"�*�items";a:5:{s:5:"image";s:29:"product_images/1581918716.jpg";s:12:"regularPrice";d:1100;s:9:"pDiscount";N;s:6:"Volume";s:6:"5000ml";s:6:"Flavor";s:8:"Ambrosia";}}s:7:"taxRate";i:0;s:49:"�Gloudemans\Shoppingcart\CartItem�associatedModel";N;s:46:"�Gloudemans\Shoppingcart\CartItem�discountRate";i:0;}}}';
  // Inserting into address_books table
  connection.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      res.status(500).json({ message: "Error starting transaction" });
      return;
    }

    connection.query(
      insertAddressQuery1,
      [
        userData.name,
        userData.phone,
        userData.address,
        userData.appartment,
        currentTime,
      ],
      (err, result1) => {
        if (err) {
          console.error("Error inserting into address_books:", err);
          connection.rollback(() => {
            res.status(500).json({ message: "Error saving address details" });
          });
        } else {
          addressId1 = result1.insertId;

          connection.query(
            insertAddressQuery2,
            [
              userData.name,
              userData.phone,
              userData.address,
              userData.appartment,
              currentTime,
            ],
            (err, result2) => {
              if (err) {
                console.error("Error inserting into address_books:", err);
                connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error saving address details" });
                });
              } else {
                const addressId2 = result2.insertId;

                connection.query(
                  insertOrderQuery,
                  [
                    subtotal,
                    cartContent,
                    addressId1,
                    addressId2,
                    userData.orderNotes,
                    currentTime,
                  ],
                  (err, result3) => {
                    if (err) {
                      console.error("Error inserting into orders:", err);
                      connection.rollback(() => {
                        res
                          .status(500)
                          .json({ message: "Error saving order details" });
                      });
                    } else {
                      connection.commit((err) => {
                        if (err) {
                          console.error("Error committing transaction:", err);
                          connection.rollback(() => {
                            res
                              .status(500)
                              .json({
                                message: "Error committing transaction",
                              });
                          });
                        } else {
                          // res
                          //   .status(200)
                          //   .json({ message: "Order successfully placed" });
                          // After the order is successfully placed (inside the success block)
                          // Inside the successful order placement block
                          connection.commit((err) => {
                            if (err) {
                              // Handle commit error
                            } else {
                              const orderID = result3.insertId; // Assuming result3 contains the inserted order's ID
                              //  orderID="34"; 
                              res.status(200).json({
                                message: "Order successfully placed",
                                orderID: orderID // Sending the orderID in the response
                              });
                            }
                          });
                        }
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};

module.exports = {
  checkout,
};
