'use client'
import { useState, useEffect } from 'react'
import { deconnecterEtRediriger } from '@/lib/deconnexion'

export default function Dashboard() {
  const [vetements, setVetements] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/connexion'
      return
    }
    fetch('/api/vetements', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) { deconnecterEtRediriger(); return null }
        return res.json()
      })
      .then(data => { if (data) setVetements(Array.isArray(data) ? data : []) })
  }, [])

    const totalCO2 = vetements.reduce((sum, v) => sum + (v.impacts?.cch || 0), 0)
    const totalVetements = vetements.length
    const scoreMoyen = vetements.reduce((sum, v) => sum + (v.impacts?.ecs || 0), 0) / totalVetements || 0

return (
  <div className="min-h-screen bg-fond flex flex-col">
    <main id="contenu-principal" className="flex-1 px-6 py-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <h1 className="font-nunito font-black text-3xl text-bleu">Mon dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <span className="text-lagune text-xs uppercase tracking-wide">Vêtements</span>
          <p className="font-nunito font-black text-3xl text-bleu mt-1">{totalVetements}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-black/5">
          <span className="text-lagune text-xs uppercase tracking-wide">CO₂ total</span>
          <p className="font-nunito font-black text-3xl text-bleu mt-1">{totalCO2.toFixed(1)}<span className="text-sm font-normal text-lagune"> kg</span></p>
        </div>
        <div className="bg-bleu rounded-2xl p-5 col-span-2">
          <span className="text-white/70 text-xs uppercase tracking-wide">Score moyen</span>
          <p className="font-nunito font-black text-3xl text-white mt-1">{Math.round(scoreMoyen)}<span className="text-sm font-normal text-white/70"> pts</span></p>
        </div>
      </div>
    </main>
  </div>
)
}