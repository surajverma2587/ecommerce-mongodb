const { Router } = require("express");

const products = require("./products");

const router = Router();

router.use("/products", products);

module.exports = router;
