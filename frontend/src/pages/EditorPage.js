import React, {useState, useRef, useEffect} from 'react'
import ACTIONS from '../Actions';
import Client from '../components/client'
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { Navigate, useLocation, useNavigate, useParams} from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  
  const socketRef = useRef(null);
  const location = useLocation();
  const codeRef = useRef(null);
  const reactNavigator = useNavigate();
  const {roomId} = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connection-error', (error) => handleError(error));
      socketRef.current.on('connection-failed', (error) => handleError(error));
       
      function handleError(error){
        console.log('socket error', error);
        toast.error('socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state.userName
      });

      socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) => {
        if(username !== location.state?.userName){
           toast.success(`${username} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) => {
          toast.success(`${username} left the room`);
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);  
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }
  }, []);

  async function copyRoomId(){
    try{
     await navigator.clipboard.writeText(roomId);
     toast.success("Room ID has been copied to your clipboard")
    }catch(error){
      toast.error("Could not copy the Room Id");
      console.log(error);
    }
  }

  function leaveRoom(){
    reactNavigator('/');
  }

  if(!location.state){
    return <Navigate to="/" />
  }

  return (
    <div className='mainWrapper'>
      <div className='aside'>
         <div className='asideInner'>
            <div className='logo'>
               <img className='logoImage' src="/coding-guy.png" alt='logo'/>
            </div>
            <h3>Connected</h3>
            <div className='clientsList'>
              {clients.map((client) => <Client key={client.socketId} username={client.username}/>)}
            </div>
         </div>
         <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
         <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorWrap'>
         <Editor socketRef = {socketRef} roomId = {roomId} onCodeChange={(code) => {codeRef.current = code;}}/>
      </div>
    </div>
  )
}

export default EditorPage