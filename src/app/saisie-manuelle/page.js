'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SaisieManuelle() {
  const [matieres, setMatieres] = useState([{ id: '', share: 100 }])
  const [pays, setPays] = useState('')
  const [listeMatieres, setListeMatieres] = useState([])
  const [listePays, setListePays] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/materiaux')
      .then(res => res.json())
      .then(data => {
        setListeMatieres(data)
        if (data.length > 0) setMatieres([{ id: data[0].id, share: 100 }])
      })

    fetch('/api/pays')
      .then(res => res.json())
      .then(data => {
        setListePays(data)
        if (data.length > 0) setPays(data[0].code)
      })
  }, [])

  const ajouterMatiere = () => {
    setMatieres([...matieres, { id: listeMatieres[0]?.id || '', share: 0 }])
  }

  const supprimerMatiere = (index) => {
    setMatieres(matieres.filter((_, i) => i !== index))
  }

  const updateMatiere = (index, field, value) => {
    const nouvelles = [...matieres]
    nouvelles[index][field] = value
    setMatieres(nouvelles)
  }

  const handleCalculer = () => {
    setLoading(true)
    fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pays: pays,
        matieres: matieres.map(m => ({ id: m.id, share: parseInt(m.share) / 100 }))
      })
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('impact', JSON.stringify(data))
        window.location.href = '/resultat'
      })
  }

  const totalPourcentage = matieres.reduce((sum, m) => sum + parseInt(m.share || 0), 0)

  return (
    <div className="min-h-screen bg-fond flex flex-col">

      <header className="px-6 py-4 flex items-center justify-between bg-fond sticky top-0 z-10">
        <Link href="/" className="text-bleu font-poppins font-bold text-xl">WearImpact</Link>
        <Link href="/scan" className="text-lagune text-sm font-poppins">← Scanner</Link>
      </header>

      <main className="flex-1 px-6 py-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">

        <div>
          <span className="text-lagune text-xs font-semibold tracking-widest uppercase">Saisie manuelle</span>
          <h1 className="font-nunito font-black text-3xl text-bleu mt-1 leading-tight">
            Compose ton vêtement
          </h1>
          <p className="text-lagune text-sm mt-2">Ajoute les matières et leur pourcentage.</p>
        </div>

        {/* MATIÈRES */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-bleu text-sm font-semibold font-poppins">Composition</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${totalPourcentage === 100 ? 'bg-menthe/20 text-[#447461]' : 'bg-red-100 text-red-500'}`}>
              {totalPourcentage}%
            </span>
          </div>

          {matieres.map((m, index) => (
<div key={index} className="bg-white rounded-2xl border border-black/5 p-4 flex flex-col gap-2">
  <select
    value={m.id}
    onChange={(e) => updateMatiere(index, 'id', e.target.value)}
    className="w-full border border-black/10 rounded-xl px-3 py-2 text-sm font-poppins text-bleu outline-none focus:border-bleu bg-fond"
    aria-label={`Matière ${index + 1}`}
  >
    {listeMatieres.map(mat => (
      <option key={mat.id} value={mat.id}>{mat.name}</option>
    ))}
  </select>

  <div className="flex gap-2 items-center">
    <div className="flex items-center gap-1 border border-black/10 rounded-xl px-3 py-2 bg-fond flex-1">
      <input
        type="number"
        value={m.share}
        onChange={(e) => updateMatiere(index, 'share', e.target.value)}
        min="1"
        max="100"
        className="w-full text-sm font-poppins text-bleu outline-none bg-transparent"
        aria-label={`Pourcentage matière ${index + 1}`}
      />
      <span className="text-lagune text-sm">%</span>
    </div>

    {matieres.length > 1 && (
      <button
        onClick={() => supprimerMatiere(index)}
        className="text-lagune text-lg px-2"
        aria-label="Supprimer cette matière"
      >
        ✕
      </button>
    )}
  </div>
</div>
          ))}

          <button
            onClick={ajouterMatiere}
            className="border-2 border-dashed border-menthe text-[#447461] font-nunito font-black text-sm py-3 rounded-2xl w-full"
            aria-label="Ajouter une matière"
          >
            + Ajouter une matière
          </button>
        </div>

        {/* PAYS */}
        <div className="flex flex-col gap-2">
          <label htmlFor="pays" className="text-bleu text-sm font-semibold font-poppins">Pays de fabrication</label>
          <select
            id="pays"
            value={pays}
            onChange={(e) => setPays(e.target.value)}
            className="border border-black/10 rounded-xl px-4 py-3 text-sm font-poppins text-bleu outline-none focus:border-bleu bg-white"
          >
            {listePays.map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* BOUTON */}
        <button
          onClick={handleCalculer}
          disabled={loading || totalPourcentage !== 100}
          aria-label="Calculer l'impact environnemental"
          className="w-full bg-bleu text-white font-nunito font-black text-base py-4 rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calcul en cours…' : 'Calculer l\'impact →'}
        </button>

        {totalPourcentage !== 100 && (
          <p className="text-red-400 text-xs text-center font-poppins">
            Le total des pourcentages doit être égal à 100%
          </p>
        )}

      </main>
    </div>
  )
}