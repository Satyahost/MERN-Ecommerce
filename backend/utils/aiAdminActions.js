import mongoose from "mongoose";
import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

/*
 * ============================================================
 * CREATE PRODUCT
 * ============================================================
 */

export const executeCreateProduct = async (req, data) => {
  const { name, description, price, category, stock, image = [] } = data;

  /*
   * Product schema requires an image.
   */

  if (!Array.isArray(image) || image.length === 0) {
    return {
      success: false,
      message: "Product image is required before creation.",
    };
  }

  /*
   * Validate required fields.
   */

  if (
    !name ||
    !description ||
    price === undefined ||
    !category ||
    stock === undefined
  ) {
    return {
      success: false,
      message: "Name, description, price, category and stock are required.",
    };
  }

  /*
   * Upload images to Cloudinary.
   *
   * The same Cloudinary folder used by
   * your existing productController is used.
   */

  const imageLinks = [];

  for (const imageSource of image) {
    /*
     * If AI provides a Cloudinary-style
     * existing object, don't upload it again.
     */

    if (
      typeof imageSource === "object" &&
      imageSource.public_id &&
      imageSource.url
    ) {
      imageLinks.push({
        public_id: imageSource.public_id,

        url: imageSource.url,
      });

      continue;
    }

    /*
     * Otherwise treat it as an image
     * source accepted by Cloudinary.
     */

    const result = await cloudinary.uploader.upload(imageSource, {
      folder: "products",
    });

    imageLinks.push({
      public_id: result.public_id,

      url: result.secure_url,
    });
  }

  /*
   * IMPORTANT:
   *
   * Never accept user/admin ID from AI.
   *
   * Use authenticated request user.
   */

  const product = await Product.create({
    name,

    description,

    price: Number(price),

    category,

    stock: Number(stock),

    image: imageLinks,

    user: req.user._id || req.user.id,
  });

  return {
    success: true,

    message: "Product created successfully.",

    product,
  };
};

/*
 * ============================================================
 * UPDATE PRODUCT
 * ============================================================
 */

export const executeUpdateProduct = async (req, productId, changes) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return {
      success: false,
      message: "Invalid product ID.",
    };
  }

  let product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,
      message: "Product not found.",
    };
  }

  const safeChanges = {};

  const allowedFields = ["name", "description", "price", "category", "stock"];

  for (const field of allowedFields) {
    if (changes?.[field] !== undefined) {
      safeChanges[field] = changes[field];
    }
  }

  /*
   * Image update is handled separately
   * because existing Cloudinary images
   * must be deleted.
   */

  if (Array.isArray(changes?.image) && changes.image.length > 0) {
    /*
     * Delete old images.
     */

    for (const oldImage of product.image) {
      if (oldImage.public_id) {
        await cloudinary.uploader.destroy(oldImage.public_id);
      }
    }

    const imageLinks = [];

    for (const imageSource of changes.image) {
      if (
        typeof imageSource === "object" &&
        imageSource.public_id &&
        imageSource.url
      ) {
        imageLinks.push({
          public_id: imageSource.public_id,

          url: imageSource.url,
        });

        continue;
      }

      const result = await cloudinary.uploader.upload(imageSource, {
        folder: "products",
      });

      imageLinks.push({
        public_id: result.public_id,

        url: result.secure_url,
      });
    }

    safeChanges.image = imageLinks;
  }

  /*
   * Don't allow AI to change:
   *
   * ratings
   * numberOfReviews
   * reviews
   * user
   * createdAt
   */

  product = await Product.findByIdAndUpdate(productId, safeChanges, {
    new: true,
    runValidators: true,
  });

  return {
    success: true,

    message: "Product updated successfully.",

    product,
  };
};

/*
 * ============================================================
 * DELETE PRODUCT
 * ============================================================
 */

export const executeDeleteProduct = async (req, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return {
      success: false,

      message: "Invalid product ID.",
    };
  }

  const product = await Product.findById(productId);

  if (!product) {
    return {
      success: false,

      message: "Product not found.",
    };
  }

  /*
   * Delete Cloudinary images first.
   */

  for (const image of product.image) {
    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  await product.deleteOne();

  return {
    success: true,

    message: "Product deleted successfully.",
  };
};
