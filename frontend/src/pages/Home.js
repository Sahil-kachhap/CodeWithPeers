import React from 'react'

const Home = () => {
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

            />
           <input 
           type="text" 
           className='inputField' 
           placeholder='USERNAME'

           />
           <button className='btn joinBtn'>JOIN</button>
           <span className='createInfo'>
             if you don't have an invite then create &nbsp;
             <a href='www.google.com' className='createNewRoom'>new room</a>
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