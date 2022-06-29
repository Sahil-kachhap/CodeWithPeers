import React, {useState} from 'react'
import {v4 as uuidv4} from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [userName, setUsername] = useState('');

  const createNewRoom = (e)=>{
    e.preventDefault();
     const id = uuidv4();
     setRoomId(id);
     toast.success("Created a new room")
  }

  const joinRoom = ()=>{
    if(!roomId || !userName){
      toast.error("Room ID and Username is required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state:{
        userName,
      }
    })
  }

  const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
      joinRoom();
    }
  }

  return (
    <div className='homeWrapper'>
      <div className='formWrapper'>
         <img className='formLogo' src='/coding-guy.png' alt='form-logo' />
         <h4 className='formLabel'>Paste your invitation ROOM ID</h4>
         <div className='inputGroup'>
           <input 
              type="text" 
              className="inputField" 
              placeholder='ROOM ID'
              value={roomId}
              onChange={(e) => {setRoomId(e.target.value)}}
              onKeyUp={handleInputEnter}
            />
           <input 
           type="text" 
           className='inputField' 
           placeholder='USERNAME'
           value={userName}
           onChange={(e)=>{setUsername(e.target.value)}}
           onKeyUp={handleInputEnter}
           />
           <button className='btn joinBtn' onClick={joinRoom}>JOIN</button>
           <span className='createInfo'>
             if you don't have an invite then create &nbsp;
             <a href='/' className='createNewRoom' onClick={createNewRoom}>new room</a>
           </span>
         </div>
      </div>
        <footer>
            <h4>Built with 💛 by &nbsp;<a href="www.github.com">Sahil Kachhap</a></h4>
        </footer>
    </div>
  )
}

export default Home