import { useState, useEffect } from 'react'
import { BiPlus } from 'react-icons/bi'
import { Link } from 'react-router-dom'

import TextField from '../../components/TextField'
import ScreenTemplate from '../../components/ScreenTemplate'
import ReportCard from '../../components/ReportCard'

import { getReports, ReportItem } from '../../services/report'

function ReportList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [reports, setReports] = useState<ReportItem[]>([])

    useEffect(() => {
        getReports().then(setReports)
    }, [])


    function getFilteredReports() {
        if (!searchTerm) return reports
        const term = searchTerm.toLowerCase()

        return reports.filter(report => {
            return report.client.toLowerCase().includes(term) ||
                report.slaughterhouse.toLowerCase().includes(term) ||
                report.ranch.toLowerCase().includes(term)
        })
    }

    return (
        <ScreenTemplate
            title='Relatórios'
            noBackground
            rightComponent={(
                <Link to='/reports/add'>
                    <BiPlus size={25} className='svg-button' />
                </Link>
            )}
        >
            <>
            <TextField placeholder='Pesquisar' onChange={setSearchTerm} />
                
                {getFilteredReports().map(report => (
                    <Link key={report.id} to={`/reports/${report.id}`}>
                        <ReportCard report={report} />
                    </Link>
                ))}
                
                {!reports.length && <p>Nenhum relatório cadastrado</p>}
                {!!reports.length && !getFilteredReports().length && <p>Nenhum relatório encontrado</p>}
            </>
        </ScreenTemplate>
    )
}

export default ReportList