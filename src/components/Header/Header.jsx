import React, { useEffect } from 'react'
import "./style.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import {  signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userSvg from '../../assets/user.svg'


function Header() {

  const [user] = useAuthState(auth);
  const navigate=useNavigate();
  useEffect(()=>{
     if(user){
      navigate('/dashboard');
     }
  },[user,navigate]);
    
  
  function logoutFuc (){
try {
  signOut(auth).then(() => {
        // Sign-out successful.
        navigate('/');
        toast.success('Logged Out Successfuly');
      }).catch((error) => {
        // An error happened.
        toast.error(error.error);
      });
} catch (e) {
  toast.error(e.error);
}
    }
  return (
    <div className='navBar'>
        <p className='logo'>Financefy.</p>
        {user && 
        <div className='img-logout'>
          <img
              src={user.photoURL ? user.photoURL : userSvg}
              width={user.photoURL ? "32" : "24"}
              style={{ borderRadius: "50%" }}
            />
        <p className='logo link' onClick={logoutFuc}>
        {/* <span style={{ marginRight: "1rem" }}>
            <img
              src={user.photoURL ? user.photoURL : userSvg}
              width={user.photoURL ? "32" : "24"}
              style={{ borderRadius: "50%" }}
            />
          </span> */}
          Logout</p>
          </div>
          }
        
    </div>
  )
}

export default Header