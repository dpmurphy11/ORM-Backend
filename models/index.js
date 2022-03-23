// import models
const Product = require('./Product');
const ProductTag = require('./ProductTag');
const Tag = require('./Tag');
const Category = require('./Category');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  // category_id is nullabale. remember to do outer join
  onDelete: 'SET NULL',
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
});

// setting many to many (product <-> tag) through product_tag
Product.belongsToMany(Tag, {
  through: ProductTag,
  // as: 'product_tags',
  foreignKey: 'product_id',
});

// setting many to many (product <-> tag) through product_tag
Tag.belongsToMany(Product, {
  through: ProductTag,
  // as: 'product_tags',
  foreignKey: 'tag_id',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
