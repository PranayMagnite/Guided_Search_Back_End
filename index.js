const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const OpenAIApi = require('openai');
//require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware for CORS

  //app.use(cors());
  app.use(cors({
    origin: 'http://localhost:4200'  // Allow only this domain
}));

   // Middleware to parse incoming requests
   app.use(express.json());

   // Sample route to get recommended products
   app.get('/api/recommendations', (req, res) => {
       const recommendations = getRecommendedProducts(req.query);
       res.json(recommendations);
   });


   // MongoDB Connection
// const MONGO_URI = 'mongodb+srv://guidedsearch:swBlRhmIdj1VYVAQ@cluster0.ryu9y.mongodb.net/'; // or your Atlas URL
// mongoose
//   .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

   // Function to get recommended products (placeholder)
   const getRecommendedProducts = (filters) => {
       // Logic to fetch product data based on filters like category, style, etc.
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
      apiKey:'sk-fUvARr1dO2chu1f2MVHviP_uq0EF-_g3kvkefQcuEcT3BlbkFJyEjjssTEhRfyj4ox6Z8Qm6HTXkkGVg2jjOGyda2IIA',
      dangerouslyAllowBrowser: true  // This is the default and can be omitted
    });
  
  app.get('/api/guided-search', async (req, res) => {
    //const { userMessage } = req.body;
    const { userMessage } = "best mauijim sunglasses";

  
    try {
      // OpenAI API call
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `You are a chatbot helping users select Maui Jim sunglasses. Ask them guided questions step-by-step and suggest products accordingly.\nUser: ${userMessage}\nBot:` }],
        stream: true,

      });

      for await (const chunk of response) {
        
      const botMessage = chunk.choices[0]?.delta?.content || '';
      this.messages.push({ sender: 'bot', text: botMessage || 'I could not process that, please try again.' });
     
      }
  

    } catch (error) {
      console.error('Error:', error);
      this.messages.push({ sender: 'bot', text: 'Something went wrong. Please try again.' });
    }
    res.json(this.messages);
  });
  

   
