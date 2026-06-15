'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Connexion() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErreur('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.error) {
        setErreur(data.error)
      } else {
        localStorage.setItem('token', data.token)
        document.cookie = `token=${data.token}; path=/; max-age=604800`
        window.location.href = '/'
      }
    } catch {
      setErreur('Erreur réseau, réessaie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-fond flex flex-col">
      <main id="contenu-principal" className="flex-1 flex flex-col items-center justify-center px-6 py-8 w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border border-black/5 p-8 w-full max-w-sm flex flex-col gap-6 shadow-sm">

          <div>
            <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Bon retour</span>
            <h1 className="font-nunito font-black text-2xl text-bleu mt-1">Se connecter</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {erreur && (
              <p role="alert" className="text-red-500 text-sm font-poppins bg-red-50 px-4 py-2 rounded-xl">
                {erreur}
              </p>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-bleu font-poppins text-sm font-medium">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-black/10 rounded-xl px-4 py-3 text-sm font-poppins text-bleu placeholder:text-lagune/60 focus:outline-none focus:ring-2 focus:ring-bleu/30"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-bleu font-poppins text-sm font-medium">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-black/10 rounded-xl px-4 py-3 text-sm font-poppins text-bleu placeholder:text-lagune/60 focus:outline-none focus:ring-2 focus:ring-bleu/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-bleu text-white font-nunito font-black text-base py-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion en cours…' : 'Se connecter →'}
            </button>
          </form>

          <p className="text-center text-lagune text-sm font-poppins">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="text-bleu font-medium underline">
              S&apos;inscrire
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}
