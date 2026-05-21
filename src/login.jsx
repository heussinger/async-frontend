import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useNavigate } from 'react-router-dom';

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    async function handleLogin(e) {

        e.preventDefault();
        setErrorMessage('');

        try{

            const res = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            if (res.ok) { 
                //localStorage.setItem('userRole', res.role);
                navigate("/dashboard"); 
            } else {
                    console.error("Login failed:", res.status);
                    setErrorMessage("Login failed");
                }
        }
        catch (error) {
            setErrorMessage("Server error");
            return;
        }

    }

    return (
        <div class="login">
            <h1><a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>Async Frontend <a href="https://react.dev" target="_blank">
                      <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </h1>
            <h2>Login</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleLogin}>
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <br />
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />
                <button type="submit" >Login</button>
            </form>
        </div>
    )
}