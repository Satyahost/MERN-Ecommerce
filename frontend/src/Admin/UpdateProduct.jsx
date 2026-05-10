import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateProduct.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getProductDetails,
    removeErrors,
} from "../features/products/productSlice";

import {
    updateProduct,
    removeSuccess,
} from "../features/admin/adminSlice";

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const { updateId } = useParams();

    const { product } = useSelector((state) => state.product);
    const { success, error, loading } = useSelector((state) => state.admin);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState("");

    // base64 images for backend
    const [image, setImage] = useState([]);

    // old images from db
    const [oldImage, setOldImage] = useState([]);

    // preview images
    const [imagePreview, setImagePreview] = useState([]);

    const categories = [
        "mobile",
        "fruits",
        "laptop",
        "shirt",
        "shoes",
        "pants",
        "glass",
        "watch",
        "cookies",
        "Pomegranate",
        "socks",
        "bag",
        "mouse",
        "headphone",
        "bucket",
        "ring",
        "LCD",
        "jacket",
        "tops",
    ];

    // Fetch Product
    useEffect(() => {
        dispatch(getProductDetails(updateId));
    }, [dispatch, updateId]);

    // Set Product Data
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setPrice(product.price || "");
            setDescription(product.description || "");
            setCategory(product.category || "");
            setStock(product.stock || "");
            setOldImage(product.image || []);
        }
    }, [product]);

    // Toasts
    useEffect(() => {
        if (success) {
            toast.success("Product Updated Successfully", {
                position: "top-center",
                autoClose: 2000,
            });

            dispatch(removeSuccess());
            navigate('/admin/products')
        }

        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000,
            });

            dispatch(removeErrors());
        }
    }, [success, error, dispatch]);

    // IMAGE FIXED FUNCTION
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // clear old selected new images
        setImage([]);
        setImagePreview([]);

        files.forEach((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                // correct state check
                if (reader.result) {
                    setImage((old) => [...old, reader.result]); // pure base64
                    setImagePreview((old) => [...old, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });

        // reset input
        e.target.value = "";
    };

    // Submit
    const updateProductSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set("name", name);
        myForm.set("price", price);
        myForm.set("description", description);
        myForm.set("category", category);
        myForm.set("stock", stock);

        // only append if images selected
        if (image.length > 0) {
            image.forEach((img) => {
                myForm.append("image", img);
            });
        }

        dispatch(updateProduct({ id: updateId, formData: myForm }));
    };

    return (
        <>
            <Navbar />
            <PageTitle title="Update Product" />

            <div className="update-product-wrapper">
                <h1 className="update-product-title">Update Product</h1>

                <form
                    className="update-product-form"
                    encType="multipart/form-data"
                    onSubmit={updateProductSubmit}
                >
                    <label>Product Name</label>
                    <input
                        type="text"
                        className="update-product-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Price</label>
                    <input
                        type="number"
                        className="update-product-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />

                    <label>Description</label>
                    <textarea
                        className="update-product-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Category</label>
                    <select
                        className="update-product-select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Choose Category</option>

                        {categories.map((item, index) => (
                            <option key={index} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <label>Stock</label>
                    <input
                        type="number"
                        className="update-product-input"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />

                    <label>Upload New Images</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="update-product-file-input"
                        onChange={handleImageChange}
                    />

                    {/* New Preview */}
                    <div className="update-product-preview-wrapper">
                        {imagePreview.map((img, index) => (
                            <img
                                src={img}
                                key={index}
                                alt="preview"
                                className="update-product-preview-image"
                            />
                        ))}
                    </div>

                    {/* Old Images */}
                    {image.length === 0 && (
                        <div className="update-product-old-images-wrapper">
                            {oldImage.map((img, index) => (
                                <img
                                    src={img.url}
                                    key={index}
                                    alt="old"
                                    className="update-product-old-image"
                                />
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="update-product-submit-btn"
                    >
                        {loading ? "Updating..." : "Update Product"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
};

export default UpdateProduct;