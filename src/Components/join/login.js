import React, { useState , useRef} from 'react'
import './loginSignUp.css'
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { position } from '@chakra-ui/react';

const dummyUser = { phone : '' , password:'' , room : ''}
const errors = { phone : '' , password:'' , room : ''}

const Login = () => {
    const Navigate = useNavigate()
    const [error, setError] = useState(errors);

    const btn = useRef()

    const clickHandler = (data)=>{
        console.log(data);
        Navigate(`/chat/${user.room}` , {state : {...data , room : user.room}}  )
    }
    const [user, setUser] = useState(dummyUser);
    const [input, setInput] = useState('');

    const handleOnChange = (e)=>{
        setUser({
            ...user , 
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async  (e)=>{
        btn.current.setAttribute('disabled' , 'true')
        e.preventDefault()
        try {
            const response = await axios.post("https://chatting-app1.onrender.com/login" , user)
            const data = await response.data
            console.log(data);
            data.status&&toast.success(data.message , {position : 'top-center'}) 
            data.status && clickHandler(data.data)
            // data.status ? alert(data.message) : alert(data.message) 
            btn.current.removeAttribute('disabled')            
        } catch (err) {
            const errMsg = err.response.data.message.toLowerCase()
            const obj = {...errors}
            let errFind = false 
            for (let key in error){
            if(errMsg.match(key)){
                console.log(key);
                errFind = true
                obj[key] = errMsg
            }
            }
            !errFind && toast.error( errMsg ,{theme : "dark" ,position : 'top-right' })
            setError(obj)
            // err.response ? toast.error(err.response.data.message ,{theme : 'dark', position: "top-center"}) :toast.error(err.message ,{position: "top-center"})
            console.log(errMsg , error);        
            btn.current.removeAttribute('disabled')            
        }
    }


    return (
        <div className="JoinPage mt-1 pt-3">
          <div className="JoinContainer mt-3 pt-2">
            <p id='hding'>Login Your Account </p>
             <form className="container customForm mt-2" onSubmit={handleSubmit} method={"POST"} >

            
                    <div className="mb-3 ">
                        <input type="tel" name="phone" value={user.phone} onChange={handleOnChange}  className="input form-control mt-3" placeholder='Enter Your Phone' required id="exampleInputEmail1" aria-describedby="emailHelp"/>
                    </div>
                    {
                        error.phone && <span className="p error"> {error.phone}  </span>
                    }
                    <div className="mb-3">
                        <input type="password" value={user.password} name="password" onChange={handleOnChange}  className="input form-control mt-4" required placeholder='Enter Your Password' id="exampleInputPassword1" />
                    </div>
                    {
                        error.password && <span className="p error"> {error.password}  </span>
                    }                       
                            <select className="form-select mt-4 input" required name='room' aria-label="Default select example" onChange={handleOnChange}>
                                <option selected>Choose Your Fav Chat Room </option>
                                <option value='study'>Study</option>
                                <option value="Medical">Medical</option>
                                <option value='Sports'>Sports</option>
                                <option value='Software'>Software</option>
                                <option value='Entertainment'>Entertainment</option>        
                                <option value='Guest-Room'>others</option>
                            </select>
                            {
                        error.room && <span className="p error"> {error.room}  </span>
                    }                       
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
                <button type="submit" className="btn btn-primary"id='btn1' ref={btn} >Submit</button>
                <small  className='link' onClick={()=>Navigate('/forget-password')} 
                style = {
                    {
                        fontSize : "20px"
                    }
                }
                >forget Password  </small>
            </form>
            </div>
            <ToastContainer />
        </div>
              );
}

export default Login
// export { user }
