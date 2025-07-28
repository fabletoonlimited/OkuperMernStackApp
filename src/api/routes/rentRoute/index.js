import express from 'express';
import propertyModel from '../models/propertyModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { status, price, bedroom, type } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (bedroom) filter.bedroom = parseInt(bedroom);
  if (type) filter.type = type;

  if (price) {
    const [min, max] = price.split('-').map(Number);
    filter.price = { $gte: min, $lte: max };
  }

  try {
    const properties = await propertyModel.find(filter).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch properties', error });
  }
});

export default router;
