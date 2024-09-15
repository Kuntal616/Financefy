import { createUserWithEmailAndPassword } from "firebase/auth";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react"
import Input from "../Input/Input"
import "./style.css"
import Button from "../Button/Button";
import { toast } from "react-toastify";
import { auth, db, doc, provider, setDoc } from "../../firebase"
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import {  signInWithPopup, GoogleAuthProvider } from "firebase/auth";
function SignupSignin() {
  const [name,setName]=useState("");
  const [email , setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [comfrimPassword,setConfrimPassword]=useState("");
  const [loading,setLoading] = useState(false)
  const [loginForm,setLoginForm] = useState(false);
  const navigate=useNavigate();

  const signupWithEmail =()=>{
    setLoading(true);
    //authenticate the user
    // console.log(name);
    // console.log(email);
    // console.log(password);
    // console.log(comfrimPassword);
    if(name!="" && email!="" && password!="" && comfrimPassword!=""){
      if(password == comfrimPassword){

        createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // console.log(user);
        toast.success("User created")
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfrimPassword("");
        createDoc(user);
        navigate('/dashboard');
        // ...create a doc with user id following the id is created
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
        // .. 
      });
      }
      else{
        toast.error("Password and Confrim Password doesn't match!");
        setLoading(false);
      }
    }else{
      toast.error("All Field are Mandatory!");
      setLoading(false);
    }

  }

  async function createDoc(user){
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()){
    try {
      await setDoc(doc(db, "users", user.uid), {
      name: user.displayName ? user.displayName : name,
      email:user.email ,
      photoURL: user.photoURL
      ? user.photoURL
      : "",
      createdAt:new Date(),
    });
    setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
   
  } else{
      // toast.error("User is Already Exists!")
      setLoading(false);
    }}


  const googleAuth=()=>{
    setLoading(true);
    try {
      
      signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // console.log("User>>",user);
      toast.success("User Authenticate");
      createDoc(user);
      navigate('/dashboard');
      setLoading(false);
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(errorMessage);
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      setLoading(false);
      // ...
    });
    } catch (e) {
      toast.error(e.errorMessage);
      setLoading(false);
    }
  }

  const loginUsingEmail =()=>{
    setLoading(true);
    if(email!="" && password!="" ){
      signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    toast.success("User Loged In!")
    setLoading(false);

    navigate('/dashboard');
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
  });
    }else{
      toast.error("All Field are Mandatory!");
      setLoading(false);
    }

  }



  return (
    <>
   {loginForm?<>
    <div className="signup-wrapper">
      <h2 className="title">Login on <span style={{color:"var(--theme)"}}>Financefy.</span></h2>
      <form>
        
        <Input label="Email" type="email" state={email}  setState={setEmail} placeholder="johndoe@gmail.com" />
        <Input type="password" label="Password" state={password}  setState={setPassword} placeholder="Example123" />
        
        <Button disabled={loading} text={loading?"Loading..":"Login Using Email And Password"} onClick={loginUsingEmail} blue={false}/>
        <p className="or-line">or</p>
        <Button text={loading?"Loading..":"Login Using Google"} onClick={googleAuth}  blue={true}/>
        <p className="p-log" onClick={()=>setLoginForm(!loginForm)}>Or Don&apos;t Have An Account?Click Here.</p>
      </form>
    </div>
   </>:<>
    <div className="signup-wrapper">
      <h2 className="title">Sign Up on <span style={{color:"var(--theme)"}}>Financefy.</span></h2>
      <form>
        <Input label="Full Name" type="text" state={name}  setState={setName} placeholder="John Doe" />
        <Input label="Email" type="email" state={email}  setState={setEmail} placeholder="johndoe@gmail.com" />
        <Input type="password" label="Password" state={password}  setState={setPassword} placeholder="Example123" />
        <Input type="password" label="Confrim Password" state={comfrimPassword}  setState={setConfrimPassword} placeholder="Example123" />
        <Button disabled={loading} text={loading?"Loading..":"Signup Using Email And Password"} onClick={signupWithEmail} blue={false}/>
        <p className="or-line">or</p>
        <Button text={loading?"Loading..":"Signup Using Google"} onClick={googleAuth}  blue={true}/>
        <p className="p-log" onClick={()=>setLoginForm(!loginForm)}>Or Have An Account Already?Click Here.</p>
      </form>
    </div>
   </>}
    
     </>
  )
}

export default SignupSignin