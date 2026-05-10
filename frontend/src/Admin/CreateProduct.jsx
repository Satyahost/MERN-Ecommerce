import React, { useState, useEffect } from "react";
import "../AdminStyles/CreateProduct.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../features/admin/adminSlice";

const CreateProduct = () => {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // images for backend submit
  const [image, setImage] = useState([]);

  // images for preview
  const [imagePreview, setImagePreview] = useState([]);

  const categories = ["glass", "shirt", "mobile", "dress", "tv", "pant", 
    "fruits",
    "laptop",
    "shoes",
    "glass",
    "watch",
    "cookies",
    "socks",
    "bag",
    "mouse",
    "headphone",
    "bucket",
    "ring",
    "LCD",
    "jacket",
    "tops",];

  // Success / Error Handling
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeErrors());
    }

    if (success) {
      toast.success("Product Created Successfully", {
        position: "top-center",
        autoClose: 2000,
      });

      dispatch(removeSuccess());

      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setImage([]);
      setImagePreview([]);
    }
  }, [dispatch, error, success]);

  // Submit Product
  const CreateProductSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    image.forEach((img) => {
      myForm.append("image", img);
    });

    dispatch(createProduct(myForm));
  };

  // Select Images
  const createProductImage = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage((old) => [...old, reader.result]);
          setImagePreview((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });

    // allow same image again
    e.target.value = null;
  };

  // Remove Single Image
  const removeSelectedImage = (indexToRemove) => {
    setImage((old) => old.filter((_, index) => index !== indexToRemove));

    setImagePreview((old) =>
      old.filter((_, index) => index !== indexToRemove)
    );

    toast.info("Image Removed", {
      position: "top-center",
      autoClose: 1500,
    });
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />

      <div className="create-product-container">
        <h1 className="form-title">Create Product</h1>

        <form
          className="product-form"
          encType="multipart/form-data"
          onSubmit={CreateProductSubmit}
        >
          {/* Product Name */}
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Product Price */}
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Description */}
          <textarea type="text"
            className="form-input"
            placeholder="Enter Product Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)} ></textarea>
          
          {/* Category */}
          <select
            className="form-select"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a Category</option>

            {categories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* Stock */}
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Stock"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          {/* Upload Images */}
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              multiple
              className="form-input-file"
              onChange={createProductImage}
            />
          </div>

          {/* Preview + Remove */}
          <div className="image-preview-container">
            {imagePreview.map((img, index) => (
              <div className="preview-box" key={index}>
                <img src={img} alt="Preview" className="image-preview" />

                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => removeSelectedImage(index)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Product..." : "Create"}
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default CreateProduct;