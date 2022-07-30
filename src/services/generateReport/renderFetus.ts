import { Report } from '../report'
import { getSettings } from '../settings'
import formatNumber from './formatNumber'
import renderSection from './renderSection'

export default async function (report: Report) {
    if (report.sex != 'F' || !report.fetus ||  Object.keys(report.fetus).length == 0) return null

    function renderProperty(name: string, value: string) {
        return {
            columns: [
                { text: `${name.toUpperCase()}: `, width: 'auto' },
                { text: ' ', width: 2 },
                { text: value.toUpperCase(), bold: true, width: 'auto'  }
            ]
        }
    }

    const P = +(report.fetus.find(fetus => fetus.type === 'P')?.value || 0)
    const M = +(report.fetus.find(fetus => fetus.type === 'M')?.value || 0)
    const G = +(report.fetus.find(fetus => fetus.type === 'G')?.value || 0)

    if (!P && !M && !G) {
        return renderSection('Fêmeas prenhas', { text: 'NENHUM FETO' })
    }

    const PV = report.PV / 100
    const PC = report.PC / 100

    const settings = await getSettings()
    const fetus: any = {}
    settings.fetus.forEach(f => {
        fetus[f.size] = f.weight
    })

    const totalWeight = P*fetus['P'] + M*fetus['M'] + G*fetus['G']
    const newPV = PV - (totalWeight / report.numberOfAnimals)
    const newRC = (PC / newPV) * 100

    return renderSection('Fêmeas prenhas', {
        table: {
            widths: ['*', '*', '*'],
            body: [
                [
                    renderProperty('Terço inicial de gestação', `${P}`),
                    renderProperty('Terço média de gestação', `${M}`),
                    renderProperty('Terço final de gestação', `${G}`)
                ],
                [
                    renderProperty('Quantidade total', `${P + M + G}`),
                    renderProperty('Peso total', `${formatNumber(totalWeight)}KG`),
                    ''
                ],
                [
                    renderProperty('Peso vivo', `${formatNumber(newPV)} KG`),
                    renderProperty('Peso de carcaça', `${formatNumber(PC)} KG`),
                    renderProperty('Rendimento de carcaça', `${formatNumber(newRC, 1)}%`)
                ]
            ]
        },
        colSpan: 2,
        layout: 'noBorders'
    })
}