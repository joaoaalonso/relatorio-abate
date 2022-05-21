import formatNumber from './formatNumber'

export default function (input: any) {
    const RC = (input.PC/input.PV)*100
    
    return {
        stack: [
            `PV: ${formatNumber(input.PV)} KG`,
            '\n',
            `PC: ${formatNumber(input.PC)} KG`,
            '\n',
            `RC: ${formatNumber(RC, 1)} %`
        ],
        colSpan: 2
    }
}