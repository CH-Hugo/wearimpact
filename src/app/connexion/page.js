'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

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
              router.push('/scan')
            }
          })
          .catch(() => alert('Erreur réseau, réessaie.'))
      }}>Se connecter</button>
    </div>
  )
}
