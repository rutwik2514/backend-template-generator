import React from 'react'
import Error from '../Utils/Error'
import Validate from '../Validators/Validate'
import { useNavigate } from 'react-router-dom'
import { handleRegister } from '../api/auth'
function Register() {
    /***************State Declarations  *******************************/
    const [data, setData] = React.useState({
        email: "",
        userName: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = React.useState({
        show: false,
        title: "",
        body: "",
    })
    const navigate = useNavigate();

    /********************Functions ************************************/
    const handleClose = () => {
        setError(prev => ({ ...prev, show: false, title: "", body: "" }));
    }
    
    const handleClick = async() => {
        if (data?.email === "" || data?.userName === "" || data?.password === "" || data?.confirmPassword === "") {
            setError(prev => ({ ...prev, show: true, title: "Error", body: "Fields cannot be empty" }))
            return;
        }
        else if(!Validate("email", data?.email)){
            setError(prev =>({...prev,show:true,title:"Error",body:"Email is not valid"}))
            return;
        }
        else if(!Validate("password", data?.password)){
            setError(prev =>({...prev,show:true,title:"Error", body:"Password is not valid"}))
            return;
        }
        else if(data?.password !== data?.confirmPassword){
            setError(prev => ({...prev,show:true,title:"Error", body:"Password and Confirm Password does not match"}))
            return;
        }
        
        const {error} =await handleRegister(data);
        if(!error){
            navigate("/login")
            return;
        }
        else{
            setError(prev => ({...prev,show:true,title:"Error", body:error}))
            return;
        }
    }
  
    return (
        <>
            <div>Register</div>
            <input type='email' placeholder='Email' onChange={(e) => { setData(prev => ({ ...prev, email: e.target.value })) }} />
            <input type='text' placeholder='Username' onChange={(e) => { setData(prev => ({ ...prev, userName: e.target.value })) }} />
            <input type='password' placeholder='Password' onChange={(e) => { setData(prev => ({ ...prev, password: e.target.value })) }} />
            <input type='password' placeholder='Confirm Password' onChange={(e) => { setData(prev => ({ ...prev, confirmPassword: e.target.value })) }} />
            <p>password should be of length of atleast 6 and shall contain only aplhabets and numbers</p>
            <button onClick={handleClick}>Register</button>
            {error.show && <>
                <Error show={true} title={error.title} body={error.body} handleClose={handleClose} />
            </>}
        </>
    )
}

export default Register