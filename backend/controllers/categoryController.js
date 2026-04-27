import Category from "../models/Category.js";


// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;
        const exist = await Category.findOne({ name });
        if (exist) return res.status(400).json({ msg: "Category already exists" });

        if (!name) {
            return res.status(400).json({ msg: "Category name is required" });
        }

        const category = await Category.create({
            name,
            parentCategory: parentCategory || null
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            error: error.message
        });
    }
};


//  Get All Categories (with nested support)
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .populate("parentCategory", "name");

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message
        });
    }
};


// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        const category = await Category.findById(req.params.id);
        

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        category.name = name || category.name;
        category.parentCategory = parentCategory ?? category.parentCategory;

        await category.save();
        

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating category",
            error: error.message
        });
    }
};


//  Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            error: error.message
        });
    }
};