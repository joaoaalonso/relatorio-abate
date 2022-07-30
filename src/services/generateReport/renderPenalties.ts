import { Report } from '../report'
import renderSection from './renderSection'

export default function (report: Report) {
    if (!report.penalties) return null

    return renderSection('Penalizações', { text: report.penalties.toUpperCase() })
}