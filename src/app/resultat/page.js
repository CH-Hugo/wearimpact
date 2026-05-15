'use client'

import { useState, useEffect } from 'react'

export default function Resultat () {
    const [impact, setImpact] = useState(null)
    useEffect(() => {
        const impact = localStorage.getItem('impact')
        if (impact) {
            setImpact(JSON.parse(impact))
            console.log(impact)
        }
    }, [])

    return (
        <div>
            <h1>Résultat de l'impact</h1>
            {impact ? (
                <div>
                    <p>Impact carbone : {impact.impacts.cch} kg CO2e</p>
                    <p>Impact eau : {impact.impacts.wtu} L</p>
                    <p>Score global : {impact.impacts.ecs} kWh</p>
                </div>
            ) : (
                <p>Aucun résultat disponible</p>
            )}
        </div>
    )
}