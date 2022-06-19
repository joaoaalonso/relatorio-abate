import { useState, useEffect } from 'react'
import { BiPlus } from 'react-icons/bi'
import { Link } from 'react-router-dom'

import Card from '../../components/Card'
import TextField from '../../components/TextField'
import ScreenTemplate from '../../components/ScreenTemplate'

import { getReports, Report } from '../../services/report'

function ReportList() {
    const [searchTerm, setSearchTerm] = useState('')
    const [reports, setReports] = useState<Report[]>([])

    useEffect(() => {
        getReports().then(setReports)
    }, [])


    function getFilteredReports() {
        if (!searchTerm) return reports
        return reports.filter(report => {
            return report.id?.toString() == searchTerm
        })
    }

    return (
        <ScreenTemplate
            title='Relatórios'
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
                        <Card text={`${report.sex} - ${report.date}`} />
                    </Link>
                ))}
                
                {!reports.length && <p>Nenhum relatório cadastrado</p>}
                {!!reports.length && !getFilteredReports().length && <p>Nenhum relatório encontrado</p>}
            </>
        </ScreenTemplate>
    )
}

export default ReportList