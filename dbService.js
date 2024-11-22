// conversationModel.js
const db = require('./dbConfig');



// admin login
async function getAdmin(username) {
  const sql = 'SELECT * FROM admin WHERE username = ?';
  const [admin] = await db.execute(sql, [username]);
 return admin;
}




async function createCustomer(name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt ) {
  const sql = `INSERT INTO customer (name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try{
     const [result] = await db.execute(
      sql,
      [name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt]
    );
    return result; 
  }catch(error){
 return error;
  }
    
  }


async function getCustomers(){
  try {
    const [customers] = await db.execute('SELECT * FROM customer');
    return customers;
  } catch (error) {
    return error
  }

}


async function updateCustomers(name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id){

  try {
    await db.execute(
      `UPDATE customer SET name = ?, url = ?, portal_username = ?, portal_password = ?, secret_client_id = ?, greeting_message = ?, chatbot_prompt = ? WHERE id = ?`,
      [name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id]
    );
   
  } catch (error) {
    return error;
  }
}


 async function deleteCustomer(id){
  try {
    await db.execute('DELETE FROM customer WHERE id = ?', [id]);
  } catch (error) {
    return error;
  } 
 }

 async function customerLogin(username){

  const [customer] = await db.execute('SELECT * FROM customer WHERE portal_username = ?', [username]);
 return customer;

 }

 function authenticateCustomer(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).send('Token is required');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.customerId = decoded.customerId;
    next();
  } catch (error) {
    res.status(403).send('Invalid or expired token');
  }
}

// Portal API to Get and Update Customer Configuration
async function customerPortal(){
  try {
    const [customer] = await db.execute('SELECT name, url, greeting_message, chatbot_prompt FROM customer WHERE id = ?', [req.customerId]);
    if (customer.length === 0) {
      return res.status(404).send('Customer not found');
    }
    res.json(customer[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}





module.exports = {
  getAdmin,
  createCustomer,
  getCustomers,
  updateCustomers,
  deleteCustomer,
  customerLogin,
  authenticateCustomer,
  customerPortal



};
