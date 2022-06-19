import { Report } from '../report'
import formatNumber from './formatNumber'

export default function (report: Report) {
    const PC = report.PC / 100
    const PV = report.PV / 100
    const RC = (PC/PV)*100
    
    return {
        stack: [
            `PV: ${formatNumber(PV)} KG`,
            '\n',
            `PC: ${formatNumber(PC)} KG`,
            '\n',
            `RC: ${formatNumber(RC, 1)} %`
        ],
        colSpan: 2
    }
}