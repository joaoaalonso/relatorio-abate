import formatNumber from './formatNumber'
import { ARROBA, getSettings } from '../settings'

export default async function (report: any) {
    if (!report.arroba) return null
    const settings = await getSettings()
    const avg = (report.PC / 100) / ARROBA
    const valorBruto = (report.arroba / 100) * report.numberOfAnimals * avg
    const discount = settings.discounts.find(d => d.name == report.discountId)
    const porcentagemDesconto =  discount ? discount.value : 0
    const desconto = valorBruto * porcentagemDesconto

    const textoPorcentagemDesconto = `${formatNumber(porcentagemDesconto * 100, 1)}%`



    let valorPremiacoes = 0
    const premiacoes: any[] = []
    report.awards.forEach((award: any) => {
        if(!!award.type && !!award.value) {
            const value = parseFloat(award.value) / 100
            valorPremiacoes += value
            premiacoes.push(`${award.type.toUpperCase()}: R$ ${formatNumber(value)}`) 
        }
    })
    const valorLiquido = valorBruto - desconto + valorPremiacoes

    return {
        stack: [
            { text: 'ACERTO:', bold: true },
            '\n',
            ...premiacoes,
            `VALOR BRUTO: R$ ${formatNumber(valorBruto)}`,
            `DSCONTO ${discount?.name.toUpperCase()} (${textoPorcentagemDesconto}): R$ ${formatNumber(desconto)}`,
            `VALOR LÍQUIDO: R$ ${formatNumber(valorLiquido)}`,
        ]
    }
}