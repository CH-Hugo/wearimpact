'use client'
import { useState, useEffect } from 'react'

export default function SaisieManuelle() {
  const [matiere, setMatiere] = useState('')
  const [pourcentage, setPourcentage] = useState(100)
  const [pays, setPays] = useState('')
  const [listeMatieres, setListeMatieres] = useState([])
  const [listePays, setListePays] = useState([])

  useEffect(() => {
    fetch('/api/materiaux')
  .then(res => res.json())
  .then(data => {
    setListeMatieres(data)
    if (data.length > 0) setMatiere(data[0].id)
  })

fetch('/api/pays')
  .then(res => res.json())
  .then(data => {
    setListePays(data)
    if (data.length > 0) setPays(data[0].code)
  })
  }, [])

  const handleCalculer = () => {
    fetch('/api/impact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  pays: pays,
  matieres: [{ id: matiere, share: parseInt(pourcentage) / 100 }]
})
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('impact', JSON.stringify(data))
        window.location.href = '/resultat'
      })
  }

  return (
    <div>
      <h1>Saisie manuelle</h1>

      <select value={matiere} onChange={(e) => setMatiere(e.target.value)}>
        {listeMatieres.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>

      <input
        type="number"
        value={pourcentage}
        onChange={(e) => setPourcentage(e.target.value)}
        min="1"
        max="100"
      />

      <select value={pays} onChange={(e) => setPays(e.target.value)}>
        {listePays.map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <button onClick={handleCalculer}>Calculer l'impact</button>
    </div>
  )
}