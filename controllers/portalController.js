const service = require('../dbService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'aloha';

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
      const admin =  service.getAdmin(username);
        if (admin.length === 0 || !await bcrypt.compare(password, admin[0].password)) {
            return res.status(401).send('Invalid credentials');
          }
          const token = jwt.sign({ adminId: admin[0].id, role: admin[0].role }, JWT_SECRET, { expiresIn: '1h' });
          res.json({ token }); 
        }


exports.createCustomer = async(req,res)=>{
  const { name, url, portal_username, portal_password, secret_client_id, greeting_message, chatbot_prompt } = req.body;

  const hashedPassword = await bcrypt.hash(portal_password, 10);
  try {
    const result =  service.createCustomer(name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt);
    //handle error
    res.status(201).send('Customer created');
  } catch (error) {
    res.status(500).send(error.message);
  }
}

  exports.getCustomers = async(req,res)=>{
    const result = await service.getCustomers();
    res.json(result);
  }


  
  exports.updateCustomers = async(req,res)=>{
    const { name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id} = req.body;
    try {
     await service.updateCustomers(name, url, portal_username, hashedPassword, secret_client_id, greeting_message, chatbot_prompt, id);
      
      res.status(201).send('Customer updated');
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  exports.deleteCustomer = async (req,res) =>{
    const {id } = req.body;
    try {
      await service.deleteCustomer(id);
      res.send('Customer deleted');
    } catch (error) {
      res.status(500).send(error.message);
    } 
   }

   
   exports.customerLogin= async (req,res)=>{
    const {password,username} = req.body;

    const [customer] = await service.customerLogin(username);
  
    // Verify username and password
    if (customer.length === 0 || !await bcrypt.compare(password, customer[0].portal_password)) {
      return res.status(401).send('Invalid credentials');
    }
  
    // Generate JWT token
    const token = jwt.sign({ customerId: customer[0].id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  
   }