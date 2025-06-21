import express from 'express';
import { adminRoute, protectRoute } from '../middlewares/auth.middleware.js';
import { createCategory, deleteCategoryById, getCategories, updateCategoryById } from '../controllers/category.controller.js';

const route = new express.Router();

route.get('/', protectRoute, getCategories);
route.post('/', protectRoute, adminRoute, createCategory);
route.post('/:id', protectRoute, adminRoute, updateCategoryById);
route.delete('/:id', protectRoute, adminRoute, deleteCategoryById);

export default route;
