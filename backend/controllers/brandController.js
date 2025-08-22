// controllers/brandController.js
const  Brand  = require("../models/Brand");
const slugify = require("slugify");

// Create Brand
exports.createBrand = async (req, res) => {
  try {
    const { name, logo, description, isFeatured } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Brand name is required" });
    }

    const brand = await Brand.create({
      name,
      slug: slugify(name, { lower: true }),
      logo,
      description,
      isFeatured: isFeatured || false
    });

    res.status(201).json(brand);
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({ error: err.message });
  }
};


// Get All Brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ order: [["name", "ASC"]] });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single Brand by ID
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, logo, description, isFeatured } = req.body;

    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    await brand.update({
      name,
      slug: slugify(name, { lower: true }),
      logo,
      description,
      isFeatured
    });

    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Brand
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    await brand.destroy();
    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
