const mongoose = require('mongoose');
const Product = mongoose.model('products');  // Ensure this matches the model name 'products'

const handleHomepageGet = async (req, res) => {
    try {
        const productId = req.params.id; // Get the product ID from the URL
        console.log("Requested Product ID:", productId); // Log the requested ID

        const product = await Product.findById(productId);

        if (!product) {
            console.log("Product not found in the database");
            return res.status(404).json({ message: "Product not found" });
        }

        console.log("Fetched Product:", product); // Log the fetched product
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    handleHomepageGet
};
