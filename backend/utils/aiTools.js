import Product from "../models/productModel.js";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const serializeProduct = (product) => ({
  id: product._id.toString(),
  name: product.name,
  description: product.description,
  price: product.price,
  ratings: product.ratings ?? 0,
  numberOfReviews: product.numberOfReviews ?? 0,
  category: product.category,
  stock: product.stock ?? 0,
  image: product.image?.[0]?.url || null,
});

export const searchProductsTool = async ({ query = "", category = "", limit = 6 }) => {
  const safeQuery = String(query).trim();
  const safeCategory = String(category).trim();
  const safeLimit = Math.min(Math.max(Number(limit) || 6, 1), 10);
  const filter = {};

  if (safeQuery) {
    const regex = { $regex: escapeRegex(safeQuery), $options: "i" };
    filter.$or = [
      { name: regex },
      { description: regex },
      { category: regex },
    ];
  }

  if (safeCategory) {
    filter.category = {
      $regex: `^${escapeRegex(safeCategory)}$`,
      $options: "i",
    };
  }

  const products = await Product.find(filter)
    .sort({ ratings: -1, numberOfReviews: -1, createdAt: -1 })
    .limit(safeLimit);

  return {
    success: true,
    count: products.length,
    products: products.map(serializeProduct),
  };
};

export const getProductTool = async ({ productId }) => {
  const product = await Product.findById(productId);
  if (!product) return { success: false, message: "Product not found." };
  return { success: true, product: serializeProduct(product) };
};

export const checkProductStockTool = async ({ productId }) => {
  const product = await Product.findById(productId).select("name stock category");
  if (!product) return { success: false, message: "Product not found." };

  return {
    success: true,
    productId: product._id.toString(),
    name: product.name,
    category: product.category,
    stock: product.stock ?? 0,
    inStock: (product.stock ?? 0) > 0,
  };
};

export const getCategoriesTool = async () => {
  const categories = await Product.distinct("category");
  return { success: true, categories: categories.filter(Boolean).sort() };
};

const NAVIGATION_TARGETS = {
  home: { path: "/", label: "home" },
  products: { path: "/products", label: "products" },
  cart: { path: "/cart", label: "cart" },
  profile: { path: "/profile", label: "profile" },
  orders: { path: "/orders/user", label: "orders" },
  about: { path: "/about-us", label: "about us" },
  contact: { path: "/contact-us", label: "contact us" },
  login: { path: "/login", label: "login" },
  register: { path: "/register", label: "register" },
};

export const navigateToPageTool = async ({ page }) => {
  const target = NAVIGATION_TARGETS[page];
  if (!target) return { success: false, message: "That page is not available through the assistant." };
  return { success: true, ...target };
};

export const aiToolHandlers = {
  search_products: searchProductsTool,
  get_product: getProductTool,
  check_product_stock: checkProductStockTool,
  get_categories: getCategoriesTool,
  navigate_to_page: navigateToPageTool,
};
