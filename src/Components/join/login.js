import React, { useState } from 'react'
import './loginSignUp.css'
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dummyUser = { phone : '' , password:'' , room : ''}

const Login = () => {
    const Navigate = useNavigate()

    const clickHandler = (data)=>{
        console.log(data);
        Navigate(`/chat/${user.room}` , {state : {...data , room : user.room}}  )
    }
    const [user, setUser] = useState(dummyUser);

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
            console.log(user);
            const response = await axios.post("https://chatting-app1.onrender.com/login" , user)
            const data = await response.data
            console.log(data);
            data.status&&toast.success(data.message , {position : 'top-center'}) 
            data.status && clickHandler(data.data)
            // data.status ? alert(data.message) : alert(data.message) 
            
        } catch (err) {
            err.response ? toast.error(err.response.data.message ,  {position : 'top-center' , theme: 'dark'}) :toast.error(err.message)
        }
    }


    return (
        <div className="JoinPage mt-5 pt-3">
          <div className="JoinContainer mt-3 pt-2">
            <p id='hding'>Login Your Account </p>
             <form className="container customForm mt-2" onSubmit={handleSubmit} method={"POST"} >

            
                    <div className="mb-3 ">
                        <input type="tel" name="phone" value={user.phone} onChange={handleOnChange}  className="input form-control mt-3" placeholder='Enter Your Phone' required id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    <div className="mb-3">
                        <input type="password" value={user.password} name="password" onChange={handleOnChange}  className="input form-control mt-4" required placeholder='Enter Your Password' id="exampleInputPassword1" />
                    </div>
                                            
                            <select className="form-select mt-4 input" required name='room' aria-label="Default select example" onChange={handleOnChange}>
                                <option selected>Choose Your Fav Chat Room </option>
                                <option value='study'>Study</option>
                                <option value="gaming">Medical</option>
                                <option value='Sports'>Sports</option>
                                <option value='Coding'>Software</option>
                                <option value='music'>music</option>
                                <option value='movies'>movies</option>
                                <option value='Guest-Room'>others</option>
                            </select>
                    <div className="mb-3 form-check">
                        <div className='d-flex justify-content-between footer mt-3'>
                            <div className=''>
                            <input type="checkbox" required className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label checkme " required for="exampleCheck1">Check me out</label>
                            </div>
                            <div>
                            <p onClick={()=>Navigate('/')} className="pLink">Haven't Account Register Here</p>
                            </div>
                        </div>
    
                    </div>
                <button type="submit" className="btn btn-primary btn1">Submit</button>
            </form>
            </div>
            <ToastContainer />
        </div>
              );
}

export default Login
// export { user }
