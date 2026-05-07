import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../components/PageTitle'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeSuccess, resetPassword } from '../features/user/userSlice'
import { removeErrors } from '../features/products/productSlice'
import { toast } from 'react-toastify'
const ResetPassword = () => {
    const { success, loading, error } = useSelector(state => state.user)
    const dispatch = useDispatch();
        const navigate = useNavigate();
    const [password, setPassword] = useState("")
        const [confirmPassword, setConfirmPassword] = useState("");
        const {token} =useParams()
    
    const resetPasswordSubmit=(e)=>{
        e.preventDefault();
        const data={
           password,
           confirmPassword
        }
        dispatch(resetPassword({token:token,userData:data}))
    }

     useEffect(() => {
            if (error) {
                toast.error(error?.message || error, {
                    position: "top-center",
                    autoClose: 3000,
                    toastId: "update-error"
                })
    
                dispatch(removeErrors())
            }
        }, [error, dispatch])

    useEffect(() => {
            if (success) {
                toast.success('Password Reset Successfully', {
                    position: "top-center",
                    autoClose: 3000,
                    toastId: "update-success"
                })
    
                dispatch(removeSuccess())
                navigate('/login')
            }
        }, [success, dispatch, navigate])
  return (
    <>
    <PageTitle title='Reset Password' />

                    <div className="container form-container">
                        <div className="form-content">
                            <form className="form" onSubmit={resetPasswordSubmit}>
                                <h2>Reset Password</h2>

                               
                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder='Enter Your New Password'
                                        name='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="password"
                                        placeholder='Confirm Password'
                                        name='confirmPassword'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button className="authBtn">
                                    Reset Password
                                </button>

                            </form>
                        </div>
                    </div>
      </>
  )
}

export default ResetPassword
