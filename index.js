const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAIApi = require('openai');
const app = express();
const PORT = process.env.PORT || 3000;


// Use CORS middleware for CORS

  app.use(cors());
//   app.use(cors({
//     origin: 'http://localhost:4200/'  // Allow only this domain
// }));

   // Middleware to parse incoming requests
   app.use(express.json());

   // Sample route to get recommended products
   app.get('/api/recommendations', (req, res) => {
       const recommendations = getRecommendedProducts(req.query);
       res.json(recommendations);
   });


   // Function to get recommended products (placeholder)
   const getRecommendedProducts = (filters) => {
       return [
           { name: 'KAHANA', description: 'Polarized Aviator Sunglasses',image:'https://images.mauijim.com/sunglasses/640/RS640-01_front.jpg?imwidth=900' },
           { name: 'BABY BEACH',  description: 'Polarized Aviator Sunglasses',image:'https://images.mauijim.com/sunglasses/245/P245-16R_front.jpg?imwidth=900'},
       ];
   };


   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });

     // Initialize OpenAI API
    const openai = new OpenAIApi({
      apiKey:process.env.KEY,
 
    });
  
  app.post('/api/guided-search', async (req, res) => {
   
    try {
      // OpenAI API call
      const { messages } = req.body;
      console.log(messages);
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.5,

      });
 
      res.json(response);
  
     
    } catch (error) {
      console.error('Error:', error);
      
    }

  });
  

   
