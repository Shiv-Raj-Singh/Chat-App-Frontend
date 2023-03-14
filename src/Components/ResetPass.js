import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './reset.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ResetPassword(){
    const Nav = useNavigate()
    const [email , setEmail] = useState('')
  
    async  function onSubmitFunc(e){
        e.preventDefault()

        try {
            // console.log(email);
            // const response = await axios.post("https://chatting-app1.onrender.com/forgot-password" , {email : email})
            const response = await axios.post("http://localhost:5000/forgot-password" , {email : email})
            // const data = await response.data
            Nav('/')
            // console.log(data);
            // data.status&&toast.success(data.message , {position : 'top-center'}) 
            // data.status && clickHandler(data.data)
            // data.status ? alert(data.message) : alert(data.message) 
            
        } catch (err) {
            err.response ? toast.error(err.response.data.message ,  {position : 'top-center' , theme: 'dark'}) :toast.error(err.message)
        }
    }
    return (
        <>
            <div className='resetPass pt-5' onSubmit={onSubmitFunc} >
                    <form className='formReset pt-5'>
                        <h3 className='hding'>Reset Your Password </h3>
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Enter Your New Password</h6>
                    <input type="text" required onChange={(e)=>setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="New Password" />
                    </div>
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Confirm Your Password</h6>
                    <input type="text" required onChange={(e)=>setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Confirm New Password" />
                    </div>
                    <button type="submit" className="btn btn-primary my-4" id='btn1' >Submit</button>
                </form>
                );
            </div>
        <ToastContainer/>
 
        </>
    )
}