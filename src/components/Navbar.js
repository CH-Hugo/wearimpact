'use client'
import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'

function subscribeStorage(callback) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const isLoggedIn = useSyncExternalStore(
    subscribeStorage,
    () => !!localStorage.getItem('token'),
    () => false
  )

  const handleDeconnexion = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; max-age=0'
    window.location.href = '/'
  }

  return (
    <header className="bg-fond px-6 py-4 w-full sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link className="text-bleu font-poppins text-xl font-bold" href="/">WearImpact</Link>

        {/* Desktop */}
        <nav className="hidden md:flex gap-6 items-center" aria-label="Navigation principale">
          <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/scan">Scanner</Link>
          {isLoggedIn ? (
            <>
              <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/garde-robe">Ma garde-robe</Link>
              <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/dashboard">Dashboard</Link>
              <button onClick={handleDeconnexion} className="text-bleu font-poppins text-sm hover:text-menthe transition-colors">Déconnexion</button>
            </>
          ) : (
            <>
              <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/connexion">Connexion</Link>
              <Link className="bg-bleu text-white font-poppins text-sm px-4 py-2 rounded-full" href="/inscription">Inscription</Link>
            </>
          )}
        </nav>

        {/* Burger */}
        <button
          className="md:hidden text-bleu text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}>
          ☰
        </button>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <nav className="fixed inset-0 top-16 bg-fond flex flex-col gap-6 p-8 z-40 items-end md:hidden" aria-label="Menu mobile">
          <Link className="text-bleu font-poppins text-xl" href="/scan" onClick={() => setIsOpen(false)}>Scanner</Link>
          {isLoggedIn ? (
            <>
              <Link className="text-bleu font-poppins text-xl" href="/garde-robe" onClick={() => setIsOpen(false)}>Ma garde-robe</Link>
              <Link className="text-bleu font-poppins text-xl" href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <button onClick={handleDeconnexion} className="text-bleu font-poppins text-xl">Déconnexion</button>
            </>
          ) : (
            <>
              <Link className="text-bleu font-poppins text-xl" href="/connexion" onClick={() => setIsOpen(false)}>Connexion</Link>
              <Link className="text-bleu font-poppins text-xl" href="/inscription" onClick={() => setIsOpen(false)}>Inscription</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
