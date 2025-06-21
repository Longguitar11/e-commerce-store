import cloudinary from "../config/cloudinary.js";
import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
    const { name, image } = req.body;

    try {
        const existingCategory = await Category.findOne({ name });

        if(existingCategory) {
            return res.status(400).json({ error: "Category already exists"});
        }

        let cloudinaryResponse = null;
        
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "categories" });
        }

        const newCategory = new Category({
            name,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
        });

        await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        console.log("Error in createCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        res.json(categories);
    } catch (error) {
        console.log("Error in getCategories controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteCategoryById = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findById(id);

        if(!category) {
            return res.status(400).json({ error: "Category doesn't exist"});
        }

        if (category.image) {
            const publicId = category.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`categories/${publicId}`);
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error deleting image from cloudinary", error);
            }
        }

        await Category.findByIdAndDelete(id);

        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCategoryById controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateCategoryById = async (req, res) => {
    const { id } = req.params;
    const {name, image} = req.body;

    try {
        const category = await Category.findById(id);

        if(!category) {
            return res.status(400).json({ error: "Category doesn't exist"});
        }

        let cloudinaryRes = null;
        
        if(image) {
            cloudinaryRes = await cloudinary.uploader.upload(image, {folder: "categories"});
            if (category.image) {
                const publicId = category.image.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(`categories/${publicId}`);
                    console.log("deleted image from cloudinary");
                } catch (error) {
                    console.log("error deleting image from cloudinary", error);
                }
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, {
            name,
            image: cloudinaryRes?.secure_url ? cloudinaryRes.secure_url : "",
        });


        res.json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.log("Error in updateCategoryById controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
