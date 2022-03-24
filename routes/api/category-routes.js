const router = require('express').Router();
const { Category, Product, Tag, product_tag } = require('../../models');

// The `/api/categories` endpoint

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findOne({
      where: {
        id: req.params.id,
      },
      include: [Product],
    });
    res.status(200).json(categoryData);
  } catch(err) {
      res.status(500).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [Product],
    });
    res.status(200).json(categoryData);
  } catch(err) {
      res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch(err) {
      res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const categoryData = await Category.findOne({
      where: { id: req.params.id,}, include: [Product],
    });
    res.status(200).json(categoryData);
  }
  catch(err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const numCategories = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(`${numCategories} categories deleted`);
    const categoryData = await Category.findAll({ include: [Product], });
    return categoryData;
  } catch {
      res.status(500).json(err);
  }
});

module.exports = router;
