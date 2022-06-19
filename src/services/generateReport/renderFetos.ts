import formatNumber from './formatNumber'
import { getSettings } from '../settings'

export default async function(report: any) {
    if (report.sex != 'F' || Object.keys(report.fetus).length == 0) return null

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
    report.fetus.forEach((fetos: any) => {
        if (!!fetos.type && fetos.value > 0) {
            const type: 'P' | 'M' | 'G' = fetos.type
            pesoTotalFetos += fetus[fetos.type].weight * fetos.value
            descricaoFetos.push(`${fetos.value} FETOS DE TAMANHO ${type} ${fetus[fetos.type].age} COM MÉDIA DE ${fetus[fetos.type].weight} KG`)
        }
    })
    
    if (!pesoTotalFetos) return null

    const PC = report.PC / 100
    const PV = report.PV / 100
    const pesoMedioFeto = pesoTotalFetos/report.numberOfAnimals
    const RCAjustado = (PC/(PV - pesoMedioFeto))*100
    const PVAjustado = (PV - pesoMedioFeto)

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