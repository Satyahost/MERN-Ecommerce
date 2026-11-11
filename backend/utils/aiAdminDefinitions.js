export const aiAdminDefinitions = [
  {
    type: "function",

    name: "create_product_draft",

    description:
      "Create a draft for a new product. This does NOT modify the database. The admin must explicitly confirm the draft before the product is created.",

    strict: true,

    parameters: {
      type: "object",

      properties: {
        name: {
          type: "string",
          description: "Product name",
        },

        description: {
          type: "string",
          description: "Product description",
        },

        price: {
          type: "number",
          description: "Product price",
        },

        category: {
          type: "string",
          description: "Product category",
        },

        stock: {
          type: "integer",
          description: "Initial product stock",
        },
      },

      required: ["name", "description", "price", "category", "stock"],

      additionalProperties: false,
    },
  },

  {
    type: "function",

    name: "update_product_draft",

    description:
      "Create a draft for updating an existing product. This does NOT modify the database. Admin confirmation is required.",

    strict: true,

    parameters: {
      type: "object",

      properties: {
        productId: {
          type: "string",
          description: "MongoDB product ID",
        },

        name: {
          type: ["string", "null"],
          description: "New product name",
        },

        description: {
          type: ["string", "null"],
          description: "New product description",
        },

        price: {
          type: ["number", "null"],
          description: "New product price",
        },

        category: {
          type: ["string", "null"],
          description: "New product category",
        },

        stock: {
          type: ["integer", "null"],
          description: "New product stock",
        },
      },

      required: [
        "productId",
        "name",
        "description",
        "price",
        "category",
        "stock",
      ],

      additionalProperties: false,
    },
  },

  {
    type: "function",

    name: "delete_product_draft",

    description:
      "Create a draft for deleting a product. This does NOT delete the product. Admin confirmation is required.",

    strict: true,

    parameters: {
      type: "object",

      properties: {
        productId: {
          type: "string",
          description: "MongoDB product ID",
        },
      },

      required: ["productId"],

      additionalProperties: false,
    },
  },
];
