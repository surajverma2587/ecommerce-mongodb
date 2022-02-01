const { ObjectId } = require("mongodb");

const { Product } = require("../models");

const getPayloadWithValidFieldsOnly = (validFields, payload) =>
  Object.entries(payload).reduce(
    (acc, [key, value]) =>
      validFields.includes(key) ? { ...acc, [key]: value } : acc,
    {}
  );

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get all products | ${error.message}`);
    return res.status(500).json({ error: "Failed to get all products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await Product.find({ _id: ObjectId(id) });
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res.status(500).json({ error: "Failed to get product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, tags = [] } = req.body;

    const newProduct = new Product({ name, category, tags });

    newProduct.name = newProduct.name.toUpperCase();

    await newProduct.save();

    return res.json({ success: true, message: "Created product successfully" });
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get product" });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = getPayloadWithValidFieldsOnly(
      ["name", "category", "tags"],
      req.body
    );

    await Product.findByIdAndUpdate(
      ObjectId(id),
      { $set: { ...payload } },
      {
        returnDocument: "after",
        lean: true,
      }
    );
    return res.json({ success: true, message: "Updated product successfully" });
  } catch (error) {
    console.log(`[ERROR]: Failed to update product | ${error.message}`);
    return res
      .status(500)
      .json({ success: false, error: "Failed to update product" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(ObjectId(id));
    return res.json({ success: true, message: "Deleted product successfully" });
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res
      .status(500)
      .json({ success: false, error: "Failed to get product" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
