import Product from "../models/productModel.js";
import mongoose from "mongoose";

/*
 * ============================================================
 * CREATE PRODUCT DRAFT
 * ============================================================
 */

export const createProductDraft = (args) => {
  const { name, description, price, category, stock, image } = args;

  if (!name) {
    throw new Error("Product name is required.");
  }

  if (!description) {
    throw new Error("Product description is required.");
  }

  if (price === undefined || price === null) {
    throw new Error("Product price is required.");
  }

  if (!category) {
    throw new Error("Product category is required.");
  }

  if (stock === undefined || stock === null) {
    throw new Error("Product stock is required.");
  }

  /*
   * Image is required by the Product schema.
   *
   * We allow the draft to exist without an image,
   * but confirmation must reject it later.
   */

  return {
    success: true,

    requiresConfirmation: true,

    type: "product_create",

    data: {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),

      image: image || [],
    },

    message:
      image && image.length > 0
        ? "Product creation draft is ready for admin confirmation."
        : "Product draft created, but an image is required before the product can be created.",
  };
};

/*
 * ============================================================
 * UPDATE PRODUCT DRAFT
 * ============================================================
 */

export const updateProductDraft = async (args) => {
  const { productId, changes = {} } = args;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Valid product ID is required.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  /*
   * Only allow fields that AI is allowed
   * to modify.
   */

  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "stock",
    "image",
  ];

  const safeChanges = {};

  for (const field of allowedFields) {
    if (changes[field] !== undefined) {
      safeChanges[field] = changes[field];
    }
  }

  if (Object.keys(safeChanges).length === 0) {
    throw new Error("No valid product changes were provided.");
  }

  return {
    success: true,

    requiresConfirmation: true,

    type: "product_update",

    productId,

    product: {
      name: product.name,
    },

    changes: safeChanges,

    message: "Product update draft is ready for admin confirmation.",
  };
};

/*
 * ============================================================
 * DELETE PRODUCT DRAFT
 * ============================================================
 */

export const deleteProductDraft = async (args) => {
  const { productId } = args;

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Valid product ID is required.");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found.");
  }

  return {
    success: true,

    requiresConfirmation: true,

    type: "product_delete",

    productId,

    product: {
      name: product.name,

      price: product.price,

      category: product.category,
    },

    message: "Product deletion draft is ready for admin confirmation.",
  };
};
