import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import rentRoutes from "./routes/rentRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Accept raw/plain/text types
// app.use(express.text({ 
//   type: ["application/javascript", 
// "text/plain", "text/html", 
// "application/xml"]
// }));

// Routes
app.use('/api/rent', rentRoutes);

// Error handler
app.use((error, req, res, next) => {
  return res.status(error.status || 501).json({
    message: error.message || "universal error response"
  });
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
