import React from 'react';
import App from '../App';
import { getCookie } from '../helper';

const api_token = getCookie('api_token');
function Login() {
    
    return api_token ? (
        <App />
    ) : (
        <div className="Login">
        <header className="Login-header">
        <a href={
            process.env.API_URL ? `${process.env.API_URL}/api/spotify`:
            "http://intense-reef-77781.herokuapp.com/spotify/login"
        }
        ><i className="fas fa-sign-in-alt icon"></i></a>
        </header>
        </div>
            
    );
}
        
        export default Login;
        
