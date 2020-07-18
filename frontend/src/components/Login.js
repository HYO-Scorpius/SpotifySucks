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
        <a href="http://localhost:1337/spotify/login"><i className="fas fa-sign-in-alt icon"></i></a>
        </header>
        </div>
            
    );
}
        
        export default Login;
        
