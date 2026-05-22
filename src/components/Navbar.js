'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-fond px-6 py-4 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center">
        <Link className="text-bleu font-poppins text-xl font-bold" href="/">WearImpact</Link>
        <button className="text-bleu text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}>
          ☰
        </button>
      </div>
{isOpen && (
  <nav className="fixed inset-0 top-16 bg-fond flex flex-col gap-6 p-8 z-40 items-end">
    <Link className="text-bleu font-poppins text-xl" href="/scan" onClick={() => setIsOpen(false)}>Scanner</Link>
    <Link className="text-bleu font-poppins text-xl" href="/connexion" onClick={() => setIsOpen(false)}>Connexion</Link>
    <Link className="text-bleu font-poppins text-xl" href="/inscription" onClick={() => setIsOpen(false)}>Inscription</Link>
  </nav>
)}
    </header>
  )
}