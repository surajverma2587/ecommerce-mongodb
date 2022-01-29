const { ObjectId } = require("mongodb");

const getPayloadWithValidFieldsOnly = (validFields, payload) =>
  Object.entries(payload).reduce(
    (acc, [key, value]) =>
      validFields.includes(key) ? { ...acc, [key]: value } : acc,
    {}
  );

const getAllProducts = async (req, res) => {
  try {
    const products = await req.db.collection("products").find().toArray();
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get all products | ${error.message}`);
    return res.status(500).json({ error: "Failed to get all products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await req.db
      .collection("products")
      .find({ _id: ObjectId(id) })
      .toArray();
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res.status(500).json({ error: "Failed to get product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, tags = [] } = req.body;

    const products = await req.db
      .collection("products")
      .insertOne({ name, category, tags });
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res.status(500).json({ error: "Failed to get product" });
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = getPayloadWithValidFieldsOnly(
      ["name", "category", "tags"],
      req.body
    );

    const product = await req.db.collection("products").findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: { ...payload } },
      {
        returnNewDocument: true,
      }
    );
    return res.json(product);
  } catch (error) {
    console.log(`[ERROR]: Failed to update product | ${error.message}`);
    return res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const products = await req.db
      .collection("products")
      .deleteOne({ _id: ObjectId(id) });
    return res.json(products);
  } catch (error) {
    console.log(`[ERROR]: Failed to get product | ${error.message}`);
    return res.status(500).json({ error: "Failed to get product" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
};
