'use client'
import { useState } from 'react'

export default function Inscription() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div>
      <h1>Inscription</h1>
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
        fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              alert(data.error)
            } else {
              window.location.href = '/connexion'
            }
          })
      }}>S'inscrire</button>
    </div>
  )
}
