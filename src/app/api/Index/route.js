import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working properly' });
});

export default route;