// conversationModel.js
const db = require('./dbConfig');

// Helper function for error handling
function handleDbError(error, customMessage = 'Database operation failed') {
  console.error('DB Error:', error.message || error);
  // Return a structured error object
  return { status: 500, message: customMessage, originalError: error };
}

// Admin login
async function getAdmin(username) {
  try {
    const sql = 'SELECT * FROM admin WHERE username = ?';
    const [admin] = await db.execute(sql, [username]);
    return admin;
  } catch (error) {
    throw handleDbError(error, 'Failed to retrieve admin details');
  }
}

// Create a new customer
async function createCustomer(name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt) {
  try {
    const sql = `INSERT INTO customer (name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt]);
    return result;
  } catch (error) {
    throw handleDbError(error, 'Failed to create customer');
  }
}

// Retrieve all customers
async function getCustomers() {
  try {
    const [customers] = await db.execute('SELECT * FROM customer');
    return customers;
  } catch (error) {
    throw handleDbError(error, 'Failed to retrieve customers');
  }
}

// Update a customer
async function updateCustomers(name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id) {
  try {
    await db.execute(
      `UPDATE customer SET name = ?, url = ?, portal_username = ?, portal_password = ?, secret_client_id = ?, greeting_message = ?, chatbot_prompt = ? WHERE id = ?`,
      [name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id]
    );
    return { message: 'Customer updated successfully' };
  } catch (error) {
    throw handleDbError(error, 'Failed to update customer');
  }
}

// Delete a customer
async function deleteCustomer(id) {
  try {
    await db.execute('DELETE FROM customer WHERE id = ?', [id]);
    return { message: 'Customer deleted successfully' };
  } catch (error) {
    throw handleDbError(error, 'Failed to delete customer');
  }
}

// Retrieve a customer by username
async function getCustomer(username) {
  try {
    const [customer] = await db.execute('SELECT * FROM customer WHERE portal_username = ?', [username]);
    return customer;
  } catch (error) {
    throw handleDbError(error, 'Failed to retrieve customer details');
  }
}

// Retrieve a customer's portal configuration
async function customerPortal(customerId) {
  try {
    const [customer] = await db.execute('SELECT name, url, greeting_message, chatbot_prompt FROM customer WHERE id = ?', [customerId]);
    return customer[0];
  } catch (error) {
    throw handleDbError(error, 'Failed to retrieve customer portal configuration');
  }
}

module.exports = {
  getAdmin,
  createCustomer,
  getCustomers,
  updateCustomers,
  deleteCustomer,
  getCustomer,
  customerPortal,
};
