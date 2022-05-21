export default function (number: number | null, fractionDigits = 2) {
    try {
        return number?.toLocaleString('pt-BR', { 
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits
        })
    } catch (e) {
        return ''
    }
}