'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Inscription() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

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
              router.push('/connexion')
            }
          })
          .catch(() => alert('Erreur réseau, réessaie.'))
      }}>S'inscrire</button>
    </div>
  )
}
