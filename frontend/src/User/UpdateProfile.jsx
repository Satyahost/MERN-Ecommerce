import React, { useEffect, useState, useRef } from 'react'
import '../UserStyles/form.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import imageCompression from "browser-image-compression";

import {
    loadUser,
    removeSuccess,
    updateProfile,
    removeErrors
} from '../features/user/userSlice'

const UpdateProfile = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/images/profile.png")

    const { user, error, success, message, loading } = useSelector(state => state.user)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // ✅ Prevent duplicate toasts
    const successToastShown = useRef(false)
    const errorToastShown = useRef(false)

    // ✅ Load user data into form
    useEffect(() => {
        if (user) {
            setName(user.name || "")
            setEmail(user.email || "")
            setAvatarPreview(user.avatar?.url || "/images/profile.png")
        }
    }, [user])

    // ✅ Load user if not available
    useEffect(() => {
        if (!user) {
            dispatch(loadUser())
        }
    }, [user, dispatch])

    // ✅ Handle image upload (base64)
    const profileImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // ✅ Compression options
            const options = {
                maxSizeMB: 0.5,          // 🔥 max size (0.5 MB)
                maxWidthOrHeight: 800,   // 🔥 resize image
                useWebWorker: true,
            };

            // ✅ Compress image
            const compressedFile = await imageCompression(file, options);

            // ✅ Convert to base64
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result); // base64
                }
            };

            reader.readAsDataURL(compressedFile);

        } catch (error) {
            toast.error("Image compression failed");
        }
    };
    // ✅ Submit form
    const updateSubmit = (e) => {
        e.preventDefault()

        dispatch(updateProfile({
            name,
            email,
            avatar
        }))
    }

    // ✅ Error toast (single)
    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 3000,
                toastId: "update-error" // ✅ prevents duplicate
            });

            dispatch(removeErrors());
        }
    }, [error]);

    // ✅ Success toast (single)
    useEffect(() => {
        if (success) {
            toast.success(message || "Profile Updated", {
                position: "top-center",
                autoClose: 3000,
                toastId: "update-success" // ✅ prevents duplicate
            });

            dispatch(removeSuccess());
            navigate('/profile');
        }
    }, [success]);

    // ✅ Reset refs on unmount (important)
    useEffect(() => {
        return () => {
            successToastShown.current = false
            errorToastShown.current = false
        }
    }, [])

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />

                    <div className="container update-container">
                        <div className="form-content">
                            <form className="form" onSubmit={updateSubmit}>
                                <h2>Update Profile</h2>

                                <div className="input-group avatar-group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input"
                                        name="avatar"
                                        onChange={profileImageUpdate}
                                    />

                                    <img
                                        src={avatarPreview}
                                        alt="User"
                                        className="avatar"
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        name="name"
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        name="email"
                                    />
                                </div>

                                <button className="authBtn" disabled={loading}>
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <Footer />
                </>
            )}
        </>
    )
}

export default UpdateProfile