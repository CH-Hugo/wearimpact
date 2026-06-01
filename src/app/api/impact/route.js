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

const materiesEcobalyse = body.matieres.map(m => {
  if (m.id) {
    return { id: m.id, share: m.share }
  }
  const matiere = trouverMatiere(m.matiere)
  return matiere ? { id: matiere.id, share: m.pourcentage / 100 } : null
}).filter(m => m !== null)

  if (materiesEcobalyse.length === 0) {
    return Response.json({ error: 'Aucune matière trouvée' }, { status: 400 })
  }

  console.log('materiesEcobalyse:', materiesEcobalyse)
  console.log('pays:', body.pays)

  const paysMapping = {
  'france': 'FR',
  'chine': 'CN',
  'china': 'CN',
  'bangladesh': 'BD',
  'inde': 'IN',
  'india': 'IN',
  'turquie': 'TR',
  'turkey': 'TR',
  'portugal': 'PT',
  'italie': 'IT',
  'italy': 'IT',
  'maroc': 'MA',
  'vietnam': 'VN',
  'cambodge': 'KH',
  'myanmar': 'MM',
  'pakistan': 'PK',
  'espagne': 'ES',
  'spain': 'ES',
}

const codePays = body.pays ? (paysMapping[body.pays.toLowerCase()] || body.pays.toUpperCase()) : 'FR'

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
      countryMaking: codePays
    })
  })

  const impact = await simulateur.json()
  console.log(impact)

  return Response.json(impact)
}