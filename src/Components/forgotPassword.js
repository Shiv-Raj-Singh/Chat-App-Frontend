import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './reset.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ForgetPassword(){
    const Nav = useNavigate()
    const [email , setEmail] = useState('')
  
    async  function onSubmitFunc(e){
        e.preventDefault()

        try {
            // console.log(email);
            // const response = await axios.post("https://chatting-app1.onrender.com/forgot-password" , {email : email})
            const response = await axios.post("https://chatting-app1.onrender.com/forgotPassword" , {email : email})
            const data = await response.data
            // Nav('/')
            // console.log(data);
            data.status&&toast.success(data.message , {position : 'top-center'}) 
            // data.status && clickHandler(data.data)
            // data.status ? alert(data.message) : alert(data.message) 
            
        } catch (err) {
            err.response ? toast.error(err.response.data.message ,  {position : 'top-center' , theme: 'dark'}) :toast.error(err.message)
        }
    }

    return (
        <>
    <div className='reset pt-5' onSubmit={onSubmitFunc} >
         <form className='form pt-5'>
        <div className="form-group px-5">
        <h4  className='hding' >Enter Your Registered Email</h4>
          <input type="email" required onChange={(e)=>setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
        </div>
        <small  className='link' onClick={()=>Nav('/login')} >for login click Here </small>
        <button type="submit" className="btn btn-primary mt-3" id='btn1' >Submit</button>
      </form>
    );
</div>

        <ToastContainer/>
        </>
    )
}