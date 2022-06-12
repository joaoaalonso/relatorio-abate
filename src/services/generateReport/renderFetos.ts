import formatNumber from './formatNumber'
import { getSettings } from '../settings'

export default async function(input: any) {
    if (input.sexo != 'F' || Object.keys(input.fetos).length == 0) return null

    const settings = await getSettings()
    let pesoTotalFetos = 0
    const descricaoFetos: any[] = []
    const fetus: any = {}
    settings.fetus.forEach(f => {
        fetus[f.size] = {
            age: f.age,
            weight: f.weight
        }
    })
    input.fetos.forEach((fetos: any) => {
        if (!!fetos.type && !!fetos.value) {
            const type: 'P' | 'M' | 'G' = fetos.type
            pesoTotalFetos += fetus[fetos.type].weight * fetos.value
            descricaoFetos.push(`${fetos.value} FETOS DE TAMANHO ${type} ${fetus[fetos.type].age} COM MÉDIA DE ${fetus[fetos.type].weight} KG`)
        }
    })
    
    if (!pesoTotalFetos) return null

    const pesoMedioFeto = pesoTotalFetos/input.numeroAnimais
    const RCAjustado = (input.PC/(input.PV - pesoMedioFeto))*100
    const PVAjustado = (input.PV - pesoMedioFeto)

    return {
        stack: [
            ...descricaoFetos,
            `*TOTALIZANDO PERDA DE +/- ${formatNumber(pesoTotalFetos)}KG DE FETO NO LOTE`,
            {
                columns: [
                    { text: `CONSIDERANDO ${formatNumber(pesoTotalFetos)}KG DE FETO, SERIA -${formatNumber(pesoMedioFeto)}KG NA MÉDIA DE PV(${formatNumber(PVAjustado)}) COM RC:`, width: 'auto' },
                    { text: ' ', width: 2 },
                    { text: `${formatNumber(RCAjustado, 1)}%`, width: 'auto', color: 'red' }
                ]
            }
        ]
    }
}