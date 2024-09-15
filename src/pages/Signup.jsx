import Header from "../components/Header/Header"
import SignupSignin from "../components/SignupSignin/SignupSignin"



function Signup() {
  return (
    <div>
        <Header/>
        <div className="wrapper">
          <SignupSignin/>
        </div>
    </div>
  )
}

export default Signup