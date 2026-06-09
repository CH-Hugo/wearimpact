'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Resultat() {
  const [impact] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('impact')
      if (stored) return JSON.parse(stored)
    }
    return null
  })

  const handleAjout = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    window.location.href = '/connexion'
    return
  }

  const response = await fetch('/api/vetements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      pays: impact.query?.countryMaking,
      matieres: impact.query?.materials,
      impacts: impact.impacts
    })
  })

  const data = await response.json()
  if (data.error) {
    alert(data.error)
  } else {
    alert('Vêtement ajouté à ta garde-robe !')
  }
}

const getScore = (ecs) => {
  if (ecs < 1000) return { lettre: 'A', couleur: 'bg-green-600', texte: 'Excellent' }
  if (ecs < 1400) return { lettre: 'B', couleur: 'bg-menthe', texte: 'Bien' }
  if (ecs < 1900) return { lettre: 'C', couleur: 'bg-lin', texte: 'Moyen' }
  if (ecs < 2600) return { lettre: 'D', couleur: 'bg-lagune', texte: 'Mauvais' }
  return { lettre: 'E', couleur: 'bg-red-500', texte: 'Très mauvais' }
}

const score = impact?.impacts?.ecs ? getScore(impact.impacts.ecs) : null

  return (
    <div className="min-h-screen bg-fond flex flex-col">

      <main className="flex-1 flex flex-col px-6 py-8 gap-6 w-full max-w-3xl mx-auto">

        {/* TITRE */}
        <div>
          <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Analyse complète</span>
          <h1 className="font-nunito font-black text-3xl text-bleu mt-1 leading-tight">
            Impact de ton vêtement
          </h1>
        </div>

        {impact ? (
          impact.error ? (

            /* ERREUR API */
            <div className="bg-white border border-black/10 rounded-2xl p-6 flex flex-col items-center gap-4">
              <p className="text-bleu font-poppins text-sm text-center">{impact.error}</p>
              <Link
                href="/scan"
                className="bg-bleu text-white font-nunito font-black px-6 py-3 rounded-full text-sm"
              >
                Réessayer →
              </Link>
            </div>

          ) : (

            /* RESULTATS */
            <div className="flex flex-col gap-4">

              {/* SCORE A-E */}
{score && (
  <div className={`${score.couleur} rounded-2xl p-6 flex items-center justify-between`}>
    <div>
      <span className="text-white text-xs uppercase tracking-widest font-semibold">Note écologique</span>
      <p className="text-white font-poppins text-sm mt-1">{score.texte}</p>
    </div>
    <span className="font-nunito font-black text-7xl text-white leading-none">{score.lettre}</span>
  </div>
)}

              {/* CO2 */}
              <div className="bg-white rounded-2xl border border-black/5 p-6">
                <span className="text-lagune text-xs uppercase tracking-widest font-semibold">
                  Impact carbone
                </span>
                <div className="flex items-end gap-2 mt-2">
                  <span className="font-nunito font-black text-4xl text-bleu">
                    {impact.impacts.cch}
                  </span>
                  <span className="text-lagune font-poppins text-sm mb-1">kg CO₂e</span>
                </div>
                <p className="text-lagune text-xs mt-2">
                  CO₂ généré tout au long du cycle de vie du vêtement
                </p>
               <div className="flex items-center gap-2 mt-3 bg-fond rounded-xl px-3 py-2">
  <span className="text-lg">🚗</span>
  <span className="text-bleu text-xs font-semibold">≈ {Math.round(impact.impacts.cch * 6)} km en voiture</span>
</div>
              </div>

              {/* EAU */}
              <div className="bg-white rounded-2xl border border-black/5 p-6">
                <span className="text-lagune text-xs uppercase tracking-widest font-semibold">
                  Consommation d&apos;eau
                </span>
                <div className="flex items-end gap-2 mt-2">
                  <span className="font-nunito font-black text-4xl text-bleu">
                    {impact.impacts.wtu?.toFixed(2)}
                  </span>
                  <span className="text-lagune font-poppins text-sm mb-1">m³</span>
                </div>
                <p className="text-lagune text-xs mt-2">
                  Eau utilisée tout au long du cycle de vie du vêtement
                </p>
                <div className="flex items-center gap-2 mt-3 bg-fond rounded-xl px-3 py-2">
  <span className="text-lg">🚿</span>
  <span className="text-bleu text-xs font-semibold">≈ {Math.round(impact.impacts.wtu * 1000 / 60)} douches</span>
</div>
              </div>

              {/* SCORE GLOBAL */}
              <div className="bg-bleu rounded-2xl p-6">
                <span className="text-white text-xs uppercase tracking-widest font-semibold">
                  Score environnemental
                </span>
                <div className="flex items-end gap-2 mt-2">
                  <span className="font-nunito font-black text-4xl text-white">
                    {impact.impacts.ecs}
                  </span>
                  <span className="text-white font-poppins text-sm mb-1">pts</span>
                </div>
                <p className="text-white text-xs mt-2">
                  Score global calculé par Ecobalyse
                </p>
              </div>
            <button
  onClick={handleAjout}
  aria-label="Ajouter ce vêtement à ma garde-robe"
  className="w-full bg-bleu text-white font-nunito font-black text-base px-10 py-4 rounded-full shadow-lg"
>
  Ajouter à ma garde-robe →
</button>
              {/* BOUTON AUTRE SCAN */}
              <Link
                href="/scan"
                aria-label="Lancer un nouveau scan"
                className="bg-menthe text-white font-nunito font-black text-base px-10 py-4 rounded-full shadow-lg text-center mt-2"
              >
                Scanner un autre vêtement →
              </Link>

            </div>
          )
        ) : (

          /* AUCUN RESULTAT */
          <div className="bg-white border border-black/10 rounded-2xl p-6 text-center">
            <p className="text-lagune font-poppins text-sm">
              Aucun résultat disponible. Utilise le lien &quot;Nouveau scan&quot; en haut de page.
            </p>
          </div>

        )}

      </main>
    </div>
  )
}
