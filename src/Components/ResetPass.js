import { useState } from 'react'
import { useNavigate , useParams} from 'react-router-dom'
import './reset.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dummyUser = { cPassword : '', password:'' }
export default function ResetPassword(){
    const {id} = useParams()
    console.log(id);
    const Nav = useNavigate()
    const [user , setUser] = useState(dummyUser)
  
    const onChangeHandle = (e)=>{
        setUser({
            ...user , [e.target.name] : e.target.value
        })
        console.log(user);
    }

    async  function onSubmitFunc(e){
        e.preventDefault()
        try {
            
            const response = await axios.put(`https://chatting-app1.onrender.com/resetPassword/${id}` , user)
            const data = await response.data
            // Nav('/')
            console.log(data);
            // data.status&&toast.success(data.message , {position : 'top-center' , theme : 'green' , color : 'blue'}) 
            // data.status && clickHandler(data.data)
            data.status ? alert(data.message) : alert(data.message) 
            Nav('/login')
            
        } catch (err) {
            err.response ? toast.error(err.response.data.message ,  {position : 'top-center' , theme: 'dark'}) :toast.error(err.message)
        }
    }
    return (
        <>
            <div className='resetPass pt-5' onSubmit={onSubmitFunc} >
                    <form className='formReset pt-5'onSubmit={onSubmitFunc}>
                    <h3 className='hding'>Reset Your Password</h3>
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Enter Your New Password</h6>
                    <input type="password" required  name='password' onChange={onChangeHandle} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="New Password" />
                    </div>
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Confirm Your Password</h6>
                    <input type="password" name='cPassword' required onChange={onChangeHandle} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Confirm New Password" />
                    </div>
                    <button type="submit" className="btn btn-primary my-4" id='btn1' >Submit</button>
                </form>
            </div>
        <ToastContainer/>
 
        </>
    )
}