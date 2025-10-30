// import { NextResponse } from "next/server";
import express from 'express';
import propertyModel from '../models/propertyModel.js';

const router = express.Router();

router.post('/createproperty', async (req, res) => {
  if (!req.body.title || !req.body.price) {
    return res.status(400).json({ message: 'Title and price are required' });
  } 
  const newProperty = new propertyModel(req.body);
  try {
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create property', error });
  }
});

router.get('/', async (req, res) => {
  const properties = await propertyModel
  .find()
  .sort({ createdAt: -1 });
  return res.json(properties);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const property = await propertyModel.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    return res.json(property);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching property', error });
  }
});

router.get('/filter', async (req, res) => {

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
