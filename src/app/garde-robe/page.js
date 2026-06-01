'use client'
import { useState, useEffect } from 'react'

export default function GardeRobe() {
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
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setVetements(Array.isArray(data) ? data : [])
      })
  }, [])

  const handleSupprimer = async (id) => {
  const token = localStorage.getItem('token')
  const response = await fetch('/api/vetements', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id })
  })
  const data = await response.json()
  if (!data.error) {
    setVetements(vetements.filter(v => v._id !== id))
  }
}

  const getScore = (ecs) => {
    if (ecs < 1000) return { lettre: 'A', couleur: 'bg-green-600' }
    if (ecs < 1400) return { lettre: 'B', couleur: 'bg-[#447461]' }
    if (ecs < 1900) return { lettre: 'C', couleur: 'bg-[#8B7355]' }
    if (ecs < 2600) return { lettre: 'D', couleur: 'bg-lagune' }
    return { lettre: 'E', couleur: 'bg-red-500' }
  }

  return (
    <div className="min-h-screen bg-fond flex flex-col">
      <main className="flex-1 px-6 py-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">

        <div>
          <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Mon impact</span>
          <h1 className="font-nunito font-black text-3xl text-bleu mt-1">Ma garde-robe</h1>
          <p className="text-lagune text-sm mt-1">{vetements.length} vêtement{vetements.length > 1 ? 's' : ''} analysé{vetements.length > 1 ? 's' : ''}</p>
        </div>

        {vetements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center flex flex-col gap-4">
            <p className="text-lagune font-poppins text-sm">Ta garde-robe est vide.</p>
            <a href="/scan" className="bg-bleu text-white font-nunito font-black px-6 py-3 rounded-full text-sm inline-block">
              Scanner mon premier vêtement →
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {vetements.map(vetement => (
              <div key={vetement._id} className="bg-white rounded-2xl border border-black/5 p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs text-lagune uppercase tracking-wide font-semibold">Pays de fabrication</span>
                    <p className="font-nunito font-black text-bleu text-lg mt-0.5">{vetement.pays || 'Inconnu'}</p>
                  </div>
                  <div className="flex items-center gap-2">
  <span className="bg-fond text-lagune text-xs px-3 py-1 rounded-full font-medium">
    {new Date(vetement.createdAt).toLocaleDateString('fr-FR')}
  </span>
  {vetement.impacts?.ecs && (
    <span className={`${getScore(vetement.impacts.ecs).couleur} text-white font-nunito font-black text-sm px-3 py-1 rounded-full`}>
      {getScore(vetement.impacts.ecs).lettre}
    </span>
  )}
  <button
    onClick={() => handleSupprimer(vetement._id)}
    aria-label="Supprimer ce vêtement"
    className="text-red-400 text-xs font-poppins hover:text-red-600"
  >
    Supprimer
  </button>
</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-fond rounded-xl p-3 text-center">
                    <span className="font-nunito font-black text-bleu text-xl block">{vetement.impacts?.cch?.toFixed(1)}</span>
                    <span className="text-lagune text-xs">kg CO₂</span>
                  </div>
                  <div className="bg-fond rounded-xl p-3 text-center">
                    <span className="font-nunito font-black text-bleu text-xl block">{vetement.impacts?.wtu?.toFixed(1)}</span>
                    <span className="text-lagune text-xs">m³ eau</span>
                  </div>
                  <div className="bg-bleu rounded-xl p-3 text-center">
                    <span className="font-nunito font-black text-white text-xl block">{Math.round(vetement.impacts?.ecs)}</span>
                    <span className="text-white/70 text-xs">score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}