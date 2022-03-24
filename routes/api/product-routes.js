const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const producData = await Product.findAll({
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    })
    res.status(200).json(producData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        Category,
        {
          model: Tag,
          through: ProductTag,
        },
      ],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product with this id!' });
      return;
    }
    res.status(200).json(productData.get({ plain: true }));
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
     {
      "product_name": "Basketball",
      "price": 200.00,
      "stock": 3,
      "category_id": 1,
      "tagIds": [1, 2, 3, 4]
    }
  */
  try {
    const productData = await Product.create(req.body);
    if (!productData) {
      res.status(404).json({ message: 'Unable to create product.' });
      return;
    }
    if (req.body.tagIds && req.body.tagIds.length) {
      const arrProductTags = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id
        };
      });
      await ProductTag.bulkCreate(arrProductTags);
    }
    // get the new product
    const newProductData = await Product.findOne({
      where: { id: productData.id, }, include: [Category, { model: Tag, through: ProductTag, },],
    });

    res.status(200).json(newProductData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: { id: req.params.id, },
    });
    if (req.body.tagIds && req.body.tagIds.length) {
      // delete all product_tags for this product
      await ProductTag.destroy({ where: { product_id: req.params.id } });

      // insert new tags
      const arrProductTags = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id
        };
      });
      await ProductTag.bulkCreate(arrProductTags);
    }
    // get the updated product
    const upadatedProductData = await Product.findOne({
      where: { id: req.params.id, }, include: [Category, { model: Tag, through: ProductTag, },],
    });

    res.status(200).json(upadatedProductData);
  } catch (err) {
    res.status(400).json(err);
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const numProducts = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(`${numProducts} products deleted`);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
