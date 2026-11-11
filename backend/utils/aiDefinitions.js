export const aiToolDefinitions = [
  {
    type: "function",
    name: "search_products",
    description: "Search E-Cart products using a product name, description, or category. Use this for catalog searches and product recommendations.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Product name, keyword, or description to search for." },
        category: { type: "string", description: "Optional exact product category." },
        limit: { type: "integer", description: "Maximum number of products to return, from 1 to 10.", minimum: 1, maximum: 10 },
      },
      required: ["query", "category", "limit"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_product",
    description: "Get details for one E-Cart product when its MongoDB product ID is known.",
    strict: true,
    parameters: {
      type: "object",
      properties: { productId: { type: "string", description: "MongoDB product ID." } },
      required: ["productId"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "check_product_stock",
    description: "Check the current stock quantity for one E-Cart product when its MongoDB product ID is known.",
    strict: true,
    parameters: {
      type: "object",
      properties: { productId: { type: "string", description: "MongoDB product ID." } },
      required: ["productId"],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "get_categories",
    description: "List the product categories currently present in the E-Cart catalog.",
    strict: true,
    parameters: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    },
  },
  {
    type: "function",
    name: "navigate_to_page",
    description: "Navigate the customer to a supported E-Cart page when they explicitly ask to open or go to a page.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: ["home", "products", "cart", "profile", "orders", "about", "contact", "login", "register"],
          description: "The supported E-Cart page to open.",
        },
      },
      required: ["page"],
      additionalProperties: false,
    },
  },
];
