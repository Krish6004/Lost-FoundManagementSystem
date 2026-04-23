import express from 'express';
import Item from '../models/Item.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/items/search?name=xyz -> Search
router.get('/items/search', auth, async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Search term "name" is required' });
    }
    const items = await Item.find({ 
      itemName: { $regex: name, $options: 'i' } 
    }).populate('user', 'name email');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/items -> Add item
router.post('/items', auth, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;
    
    const newItem = new Item({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      user: req.user.id
    });

    const item = await newItem.save();
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/items -> View all items
router.get('/items', auth, async (req, res) => {
  try {
    const items = await Item.find().sort({ date: -1 }).populate('user', 'name email');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/items/:id -> View item by ID
router.get('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/items/:id -> Update item (only own entries)
router.put('/items/:id', auth, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);
    
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this item' });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/items/:id -> Delete item (only own entries)
router.delete('/items/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Make sure user owns item
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
