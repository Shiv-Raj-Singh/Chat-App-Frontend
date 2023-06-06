import { useRef, useState } from 'react'
import { useNavigate , useParams} from 'react-router-dom'
import './reset.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const dummyUser = { cPassword : '', password:'' }
export default function ResetPassword(){
    const {id} = useParams()
    console.log(id);
    const btn = useRef()
    const Nav = useNavigate()
    const [user , setUser] = useState(dummyUser)
    const [error , setErr] = useState(dummyUser)
  
    const onChangeHandle = (e)=>{
        setUser({
            ...user , [e.target.name] : e.target.value
        })
        console.log(user);
    }

    async  function onSubmitFunc(e){
        e.preventDefault()
        btn.current.setAttribute('disabled' , 'true')
        try {
            
            const response = await axios.put(`https://chatting-app1.onrender.com/resetPassword/${id}` , user)
            const data = await response.data
            // Nav('/')
            console.log(data);
            // data.status&&toast.success(data.message , {position : 'top-center' , theme : 'green' , color : 'blue'}) 
            // data.status && clickHandler(data.data)
            // data.status ? alert(data.message) : alert(data.message) 
            Nav('/login')
            
        } catch (err) {
            const errMsg = err.response.data.message.toLowerCase()
            const obj = {...dummyUser}
            let errFind = false 
            for (let key in error){
            if(errMsg.match(key.toLowerCase())){
                console.log(key);
                errFind = true
                obj[key] = errMsg
            }
            }
            !errFind && toast.error( errMsg ,{theme : "dark" ,position : 'top-right' })
            setErr(obj)
            // err.response ? toast.error(err.response.data.message ,{theme : 'dark', position: "top-center"}) :toast.error(err.message ,{position: "top-center"})
            console.log(errMsg , error);        
            btn.current.removeAttribute('disabled')            
        }
    }

    return (

        <>     
        <div className='resetPass pt-5' onSubmit={onSubmitFunc} >
                    <form className='formReset pt-5'onSubmit={onSubmitFunc}>
                    <h3 className='hding'>Reset Your Password </h3>
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Enter Your New Password</h6>
                    <input type="password" required  name='password' onChange={onChangeHandle} className=" inp1 form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="New Password" />
                    </div>
                    {
                        error.password && <span className="p error"> {error.password}  </span>
                    }     
                    <div className="form-group px-5">
                    <h6  className='mt-2' >Confirm Your Password</h6>
                    <input type="password" name='cPassword' required onChange={onChangeHandle} className=" inp1 form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Confirm New Password" />
                    </div>
                    {
                        error.cPassword && <span className="p error"> {error.cPassword}  </span>
                    }     
                    <button type="submit" className="btn btn-primary my-4" id='btn1' ref={btn} >Submit</button>
                </form>
        </div>
        <ToastContainer/>

     </>
    )

}