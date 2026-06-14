export function getScore(ecs) {
  if (ecs < 1000) return { lettre: 'A', couleur: 'bg-green-600',  texte: 'Excellent' }
  if (ecs < 1400) return { lettre: 'B', couleur: 'bg-menthe-fonce',  texte: 'Bien' }
  if (ecs < 1900) return { lettre: 'C', couleur: 'bg-lin-fonce',  texte: 'Moyen' }
  if (ecs < 2600) return { lettre: 'D', couleur: 'bg-lagune',     texte: 'Mauvais' }
  return           { lettre: 'E', couleur: 'bg-red-500',           texte: 'Très mauvais' }
}
