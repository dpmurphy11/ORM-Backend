const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, },],
    });
    res.status(200).json(tagData)
  } catch (err) {
      console.log(err);
      res.status(500).json('Unable to find tags.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findOne({
      where: { id: req.params.id, }, include: [{ model: Product, through: ProductTag, },],
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json('Unable to find tag.');
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json('Unable to save tag.');
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    await Tag.update(req.body, {
      where: { id: req.params.id, },
    });
    const tagData = await Tag.findOne({ where: { id: req.params.id, }, include: [{ model: Product, through: ProductTag, },], });
    res.status(200).json(tagData);
  } catch (err) {
    console.log(err);
    res.status(500).json('Unable to update tags.');
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const numTags = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(`${numTags} tags deleted.`);
  } catch (err) {
    console.log(err);
    res.status(500).json('Unable to delete tag.');
  }
});

module.exports = router;
