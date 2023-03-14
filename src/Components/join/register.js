import React, { useState } from 'react'
import './loginSignUp.css'
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dummyUser = {name : '' ,  phone : '' , email: '' , password : '' , cPassword:''}


const Register = () => {
    const [user, setUser] = useState(dummyUser);
    const Navigate = useNavigate()

    const clickHandler = ()=>{
        Navigate('/login')
    }

    const handleOnChange = (e)=>{
        console.log(e);
        setUser({
            ...user , 
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async  (e)=>{
        e.preventDefault()
        try {
            const response = await axios.post("https://chatting-app1.onrender.com/register" , user)
            console.log(response);
            const data = await response.data
            console.log(response);
            data.status && clickHandler()
            data? toast.success("Submit-Successfully !" ,{theme : 'green', position: "top-center"}) : alert(data.msg) 
            
        } catch (err) {
            setUser(dummyUser)
            err.response ? toast.error(err.response.data.message ,{theme : 'dark', position: "top-center"}) :toast.error(err.message ,{position: "top-center"})
            console.log(err);
        }
    
    }

console.log(user);

    return (
        <>
            <div className="JoinPage mt-1 pt-3">
          <div className="JoinContainer mt-3 py-3 px-3 pt-3">
            <p id='hding'>Register Your Account </p>
             <form className="container mt-2 customForm pt-1" id='customForm' onSubmit={handleSubmit}>
                    {/* <h1 className='hding'>Register Your Account </h1> */}
                    <div className="mb-2 mt-4 ">
                        <input type="text" value={user.name} className="form-control input"required placeholder='Enter Your Name' name="name" onChange={handleOnChange} id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-2 ">
                        <input type="tel" value={user.phone} className="form-control"required placeholder='Enter Your Phone' name="phone" onChange={handleOnChange}id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-2 ">
                        <input type="email" value={user.email} className="form-control" required placeholder='Enter Your Email' name="email" onChange={handleOnChange}id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-2">
                        <input type="password"  value={user.password} className="form-control" required placeholder='Enter Your Password' name="password" onChange={handleOnChange}  id="exampleInputPassword1" />
                    </div>
                    <div className="mb-2">
                        <input type="password" value={user.cPassword} className="form-control" required placeholder='Confirm Your Password' 
                        name="cPassword" onChange={handleOnChange} id="exampleInputPassword1" />
                    </div>
                    <div className="mb-3 form-check">
                        <div className='d-flex footer justify-content-between'>
                            <div>
                            <input type="checkbox" className="form-check-input" required id="exampleCheck1" />
                        <label className="form-check-label checkme" for="exampleCheck1">Check me out</label>
                            </div>
                            <div>
                                <p onClick={clickHandler} className="pLink">Have an account? Login Here</p>
                            </div>
                        </div>          
                    </div>
                <button type="submit" className="btn btn-primary" id='btn1' >Submit</button>
            </form>
            </div>
        
        </div>
        <ToastContainer />
        </>
                      );
}

export default Register
// export { user }
