import React from 'react';
import App from '../App';
import { getCookie , getHashParams} from '../helper';

const api_token = getCookie('api_token');
function Login() {
    console.log(process.env.REACT_APP_API_URL);
    
    const {access_token, } = getHashParams();
    return (api_token || access_token) ? (
        <App />
    ) : (
        <div className="Login">
        <header className="Login-header">
        <a href={
            process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/spotify/login`:
            "https://intense-reef-77781.herokuapp.com/spotify/login"
        }
        ><i className="fas fa-sign-in-alt icon"></i></a>
        </header>
        </div>
            
    );
}
        
        export default Login;
        
