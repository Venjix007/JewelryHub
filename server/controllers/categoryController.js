import { validationResult } from 'express-validator';
import Category from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    console.log('Fetching categories...');
    
    // Test database connection
    const db = mongoose.connection;
    if (db.readyState !== 1) {
      console.error('MongoDB connection not ready. State:', db.readyState);
      return res.status(500).json({ 
        success: false,
        message: 'Database connection not established',
        dbState: db.readyState
      });
    }

    const categories = await Category.find({ isActive: true })
      .populate('children', 'name')
      .sort({ sortOrder: 1, name: 1 })
      .lean(); // Convert to plain JavaScript objects

    console.log(`Found ${categories.length} categories`);
    
    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    console.error('Error stack:', error.stack);
    
    // More detailed error response
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name')
      .populate('children', 'name');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, image, parent, sortOrder } = req.body;

    const category = await Category.create({
      name,
      description,
      image,
      parent,
      sortOrder,
    });

    // If this is a subcategory, add it to parent's children
    if (parent) {
      await Category.findByIdAndUpdate(parent, {
        $push: { children: category._id },
      });
    }

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const { name, description, image, sortOrder, isActive } = req.body;

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(image && { image }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isActive !== undefined && { isActive }),
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has children
    if (category.children.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category with subcategories' });
    }

    // Remove from parent's children if it's a subcategory
    if (category.parent) {
      await Category.findByIdAndUpdate(category.parent, {
        $pull: { children: category._id },
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};