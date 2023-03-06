import { useEffect, useRef, useState } from "react"
import { useLocation , useNavigate } from "react-router-dom"
import Moment from 'react-moment'
import { io } from "socket.io-client"
import './chat.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatRoom = () => {
    const Navigate = useNavigate()
    const location = useLocation()
    const msgBoxRef = useRef()

    const [ data, setData ] = useState({})
    const [ msg, setMsg ] = useState("")
    const [ newUser, setNewUser ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ allMessages, setMessages ] = useState([])
    const [ socket, setSocket ] = useState()

    useEffect(() => {
        const socket = io("https://chatting-app1.onrender.com")
        setSocket(socket)

        socket.on("connect", () => {
            console.log("socket Connected")
            socket.emit("joinRoom", location.state)
        })        
    }, [])

    useEffect(() => {
        if(socket){
            socket.on('user-joined' , (room) =>{
                // setMessages([ ...allMessages,  {name : name , msg : `${name} join the chat` , time : `${Date.now()}`} ])
                setNewUser(room)
            })
            socket.on("getLatestMessage", (newMessage) => {
                // console.log(allMessages , 'shiv raj singh error')
                // console.log(newMessage)

                setMessages([ ...allMessages,  newMessage ])
                msgBoxRef.current.scrollIntoView({behavior: "smooth"})
                setMsg("")
                setLoading(false)
            })
        }
    }, [socket, allMessages])    

    useEffect(() => {
        // console.log(Location.state);
        setData(location.state)
    }, [location])
    
    const handleChange = e => setMsg(e.target.value)
    const handleEnter = e => e.keyCode===13 ? onSubmit() : ""
    const onSubmit = () => {
        if(msg){
            // console.log(msg , data ) ;
            setLoading(true)
            const newMessage = { time:new Date(), msg, name: data.name }
            socket.emit("newMessage", {newMessage, room: data.room})
        }
    }
console.log(newUser);
    return (
                    //   Main UI Code 

        <div className="container chatBox mt-2" id="chatBox"  >
                <div className="text-center px-3 mb-4 text-capitalize d-flex justify-content-between align-items-center">
                    <h1 className="hding mt-3">Welcome in {data?.room} Chat Room</h1>
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} fill="currentColor" className="bi cross bi-x text-light border border-warning" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
        onClick={()=>Navigate('/')} 
        />
        
      
      </svg>
                </div>
                </div>
                <div className="border rounded p-3 mb-4 box">
                    {
                        (newUser && newUser===data.room)&&<span className="d-flex flex-column align-items-end" >someone join the chat-room</span>
                    }
                    {
                        allMessages.map(msg => {
                            return data.name === msg.name
                            ?
                            <div className="row justify-content-end pl-5 ">
                                <div className="d-flex flex-column align-items-end m-2 shadow border rounded " id="msg" >
                                    <div>
                                        <strong className="m-1 msgName">{msg.name}</strong>
                                        <small className="text-muted m-1 msgTime"><Moment fromNow>{msg.time}</Moment></small>
                                    </div>
                                    <h4 className="m-1 msg">{msg.msg}</h4>
                                </div>
                            </div>
                            :
                            <div className="row justify-content-start">
                                <div className="d-flex flex-column m-2 p-2 shadow bg-white border rounded w-auto" id="msg">
                                    <div>
                                        <strong className="m-1">{msg.name}</strong>
                                        <small className="text-mmuted m-1"><Moment fromNow>{msg.time}</Moment></small>
                                    </div>
                                    <h4 className="m-1">{msg.msg}</h4>
                                </div>
                            </div>
                        })
                    }
                    <div ref={msgBoxRef} ></div>
                </div>
                <div className="form-group d-flex msgType mx-5">
                    <input type="text" className="form-control bg-light ml-5" name="message" onKeyDown={handleEnter} placeholder="Type your message" value={msg} onChange={handleChange} />
                    <button type="button" className="btn btn-warning mx-2" disabled={loading} onClick={onSubmit}>
                        {
                            loading
                            ?
                            <div className="spinner-border spinner-border-sm text-primary"></div>                            
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
                            </svg>
                        }
                    </button>   
                </div>
                <ToastContainer />
        </div>
    )
}

export default ChatRoom