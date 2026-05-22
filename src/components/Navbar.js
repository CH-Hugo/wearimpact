'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-fond px-6 py-4 w-full sticky top-0 z-50">
      <div className="max-w-3xl mx-auto flex justify-between items-center">
        <Link className="text-bleu font-poppins text-xl font-bold" href="/">WearImpact</Link>

        {/* Liens visibles sur desktop (md = 768px+), cachés sur mobile */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/scan">Scanner</Link>
          <Link className="text-bleu font-poppins text-sm hover:text-menthe transition-colors" href="/connexion">Connexion</Link>
          <Link className="bg-bleu text-white font-poppins text-sm px-4 py-2 rounded-full" href="/inscription">Inscription</Link>
        </nav>

        {/* Burger visible sur mobile, caché sur desktop */}
        <button
          className="md:hidden text-bleu text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}>
          ☰
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {isOpen && (
        <nav className="fixed inset-0 top-16 bg-fond flex flex-col gap-6 p-8 z-40 items-end md:hidden">
          <Link className="text-bleu font-poppins text-xl" href="/scan" onClick={() => setIsOpen(false)}>Scanner</Link>
          <Link className="text-bleu font-poppins text-xl" href="/connexion" onClick={() => setIsOpen(false)}>Connexion</Link>
          <Link className="text-bleu font-poppins text-xl" href="/inscription" onClick={() => setIsOpen(false)}>Inscription</Link>
        </nav>
      )}
    </header>
  )
}
