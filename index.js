const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAIApi = require('openai');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./routes/apiRoutes');

//const dbService = require('./dbService');


// Use CORS middleware for CORS

  app.use(cors());
//   app.use(cors({
//     origin: 'http://localhost:4200/'  // Allow only this domain
// }));

   // Middleware to parse incoming requests
   app.use(express.json());
   app.use('/api', router); // Use the router for all `/api` routes

   // Sample route to get recommended products
   app.get('/api/recommendations', (req, res) => {
       const recommendations = getRecommendedProducts(req.query);
       res.json(recommendations);
   });


   // Function to get recommended products 
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

    //get secret key from client portal DB
    app.post('/api/secret-key',(req,res) =>{
      const secretKey = "aloha"; // get it from db
      if (secretKey) {
        res.json({ key: secretKey });
      } else {
        res.status(404).json({ error: 'Secret key not found' });
      }
    });

    app.post('/api/meta-prompt',(req,res) =>{
      var clientId = req.body.clientId;
      console.log(req.body);
      var productName = req.body.productName;
     var META_PROMPT = `You are a Maui Jim assistant.Help users find all kind of products based on their needs and provide customer support service. Recommend products with highlighted name & sku,short information.Focus on use case, lens type, frame style, fit, and color. Ask short follow-ups if needed and suggest multiple options when unsure.response must be in markdown format`;
     var PDP_META_PROMPT= `You are the Maui Jim Assistant for *${productName}* (details:${productDetails}). *Suggest**: Recommend alternatives from *${recommendProduct}* or complements as needed. *Purchase Info**: Offer stock, shipping, and return details. **Support**: If unsure, guide users to support. Keep replies brief and in Markdown.`;
     var META_ef =`You are a mauijim website product expert providing concise advice`

      if (clientId) {     
        if(productName != undefined)
          {
            res.json({ metaData: PDP_META_PROMPT });
          }else{
            res.json({ metaData: META_PROMPT });
          }
      
      } else {
        res.status(404).json({ error: 'meta data not found' });
      }
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
        max_tokens: 200, 

      });
     console.log(response);
      res.json(response);
     
    } catch (error) {
      console.error('Error:', error);
      
    }
});


  
app.post('/api/guided-search/update', async (req, res) => {
   
  try {
    var { messages } = req.body;  // If conversation grows too long, summarize the past and keep only the summary
      const summary = await summarizeConversation(messages.slice(1)); // Skip system prompt   
    console.log("update :-"+summary);
    res.json(summary);
   
  } catch (error) {
    console.error('Error:', error);
    
  }
});



async function summarizeConversation(messages) {
  const summaryPrompt = `Summarize the following conversation in a concise manner:${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'system', content: summaryPrompt }],
    temperature: 0.3, // Lower temperature for concise summaries
    max_tokens: 200,  // Keep the summary short
  });

  return response.choices[0].message.content;
}


// function extractKeyMessages(messages) {
//   // Filter messages based on role or importance (e.g., user queries and key responses)
//   return messages.filter(msg =>
//     msg.role === 'user' || msg.content.includes('recommended')
//   );
// }

// const keyMessages = extractKeyMessages(longMessages);
// console.log('Key Messages:', keyMessages);

  

   
