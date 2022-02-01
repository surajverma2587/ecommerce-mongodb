const { Schema, model } = require("mongoose");

// schema
const productSchema = {
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
};

// compile model using the schema
const schema = new Schema(productSchema);
const Product = model("Product", schema);

module.exports = Product;
