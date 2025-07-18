import { Query } from "mongoose";
import Product from "../models/Product.js";
import User from "../models/User.js";

const createProduct = async (req, res) => {
  const { ram, rom, productName, description, price, gen, brand } = req.body;

  try {
    // console.log(ram,rom,productName,description,price)
    if (!ram) {
      throw new Error("ram is required");
    }
    if (!rom) {
      throw new Error("rom is required");
    }
    if (!productName || !description || !price || !gen || !brand) {
      throw new Error("Credential missing");
    }

    const data = await Product.create({
      productName: productName,
      ram: ram,
      rom: rom,
      price: price,
      description: description,
      brand: brand,
    });
    res.send(data);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const query = req.query;
    let filter = {};

    console.log(query.ram);

    if (query.productName) {
      filter.productName = {
        $regex: query.productName,
      };
    }
    if (query.description) {
      filter.description = {
        $regex: query.description,
      };
    }
    if (query.gen) {
      filter.gen = {
        $lte: query.gen,
      };
    }
    if (query.ram) {
      filter.ram = {
        $in: query.ram.split(","),
      };
    }
    if (query.price) {
      const nums = query.price.split(",");
      const from = nums[0];
      const to = nums[nums.length - 1];
      filter.price = {
        $gte: from,
        $lte: to,
      };
    }

    console.log(query);

    const sort = JSON.parse(req.query.sort || "{}");

    console.log(sort);
    const data = await Product.find(filter);

    res.status(200).json({ data });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const data = await Product.findById(id);
  res.status(200).json({ data });
};

const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deletes Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Error occured while trying to delete");
  }
};
const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    //   const {ram,rom,productName,gen,price,brand} = req.body

    const data = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ data, message: "prduct updated succcessfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

export {
  createProduct,
  getAllProduct,
  getProductById,
  deleteProductById,
  updateProduct,
};
