import { Report } from '../report'
import renderSection from './renderSection'

export default function (report: Report) {
    const text = report.penalties || 'Nenhuma penalização'

    return renderSection('Penalizações', { text: text.toUpperCase() })
}