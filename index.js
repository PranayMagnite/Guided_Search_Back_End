const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware for CORS

  app.use(cors());
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
   
