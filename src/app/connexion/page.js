'use client'
import { useState } from 'react'

export default function Connexion() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  return (
    <div>
        <h1>Connexion</h1>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => {
            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                    } else {
    localStorage.setItem('token', data.token)
    window.location.href = '/scan'
}
            })
        }}>Se connecter</button>
    </div>
  )
}