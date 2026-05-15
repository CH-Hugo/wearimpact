export async function POST(request) {
  const body = await request.json()
  
  const response = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/materials', {
    headers: { 'token': process.env.ECOBALYSE_API_TOKEN }
  })
  
  const materials = await response.json()

  const trouverMatiere = (nomMatiere) => {
    return materials.find(m => 
      m.name.toLowerCase().includes(nomMatiere.toLowerCase())
    )
  }

  const materiesEcobalyse = body.matieres
  if (materiesEcobalyse.length === 0) {
    return Response.json({ error: 'Aucune matière trouvée' }, { status: 400 })
  }
  else materiesEcobalyse = body.matieres
    .map(m => {
      const matiere = trouverMatiere(m.matiere)
      return matiere ? { id: matiere.id, share: m.pourcentage / 100 } : null
    })
    .filter(m => m !== null)

  console.log(materiesEcobalyse)

const simulateur = await fetch('https://ecobalyse.beta.gouv.fr/api/textile/simulator', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'token': process.env.ECOBALYSE_API_TOKEN
  },
  body: JSON.stringify({
    mass: 0.2,
    product: 'tshirt',
    materials: materiesEcobalyse,
    countryMaking: 'FR'
  })
})

const impact = await simulateur.json()
console.log(impact)

return Response.json(impact)
}