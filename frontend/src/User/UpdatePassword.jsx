import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { removeErrors, removeSuccess, updatePassword } from '../features/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

const UpdatePassword = () => {

    const { success, loading, error } = useSelector(state => state.user)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const updatePasswordSubmit = (e) => {
        e.preventDefault()

        // ✅ Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required")
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        dispatch(updatePassword({
            oldPassword,
            newPassword,
            confirmPassword
        }))
    }

    // ✅ Error toast
    useEffect(() => {
        if (error) {
            toast.error(error?.message || error, {
                position: "top-center",
                autoClose: 2000,
                toastId: "update-error"
            })

            dispatch(removeErrors())
        }
    }, [error, dispatch])

    // ✅ Success toast
    useEffect(() => {
        if (success) {
            toast.success('Password Updated Successfully', {
                position: "top-center",
                autoClose: 2000,
                toastId: "update-success"
            })

            dispatch(removeSuccess())
            navigate('/profile')
        }
    }, [success, dispatch, navigate])

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <PageTitle title='Update Password' />

                    <div className="container update-container">
                        <div className="form-content">
                            <form className="form" onSubmit={updatePasswordSubmit}>
                                <h2>Update Password</h2>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder='Old Password'
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder='New Password'
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button className="authBtn" disabled={loading}>
                                    {loading ? "Updating..." : "Update Password"}
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

export default UpdatePassword