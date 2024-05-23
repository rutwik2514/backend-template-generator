import React from "react"
import Error from '../Utils/Error'
import Validate from '../Validators/Validate'

function Login() {
    /*************************  State Declarations  *************************/
    const [data, setData] = React.useState({
        email: "",
        password: ""
    })
    const [error, setError] = React.useState({
        show: false,
        title: "",
        body: ""
    })

    /*************************  Functions  *************************/
    const handleClick = async () => {
        if (data.email === "" || data.password === "") {
            setError(prev => ({ ...prev, show: true, title: "Error", body: "Fields cannot be empty" }))
        }
        else if (!Validate("email", data.email)) {
            setError(prev => ({ ...prev, show: true, title: "Error", body: "Email is not valid" }))
        }
    }

    const handleClose = () => {
        setError(prev => ({ ...prev, show: false, title: "", body: "" }));
    }

    return (
        <>
            <div>Login</div>
            <input type='email' placeholder='Email' onChange={(e) => { setData(prev => ({ ...prev, email: e.target.value })) }} />
            <input type='password' placeholder='Password' onChange={(e) => { setData(prev => ({ ...prev, password: e.target.value })) }} />
            <button onClick={handleClick}>Login</button>
            {error.show && <>
                <Error show={true} title={error.title} body={error.body} handleClose={handleClose} />
            </>}
        </>
    )
}

export default Login