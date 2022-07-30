import swal from 'sweetalert'
import { useState, useEffect } from 'react'

import Table from '../components/Table'
import Button from '../components/Button'
import TextField from '../components/TextField'
import ScreenTemplate from '../components/ScreenTemplate'

import { deleteOldReports } from '../services/report'
import formatNumber from '../services/generateReport/formatNumber'
import { getSettings, updateSettings } from '../services/settings'

function Settings() {
    const [settings, setSettings] = useState<any>({ discounts: [], fetus: [] })

    useEffect(() => {
        getSettings().then(settings => {
            setSettings({
                fetus: settings.fetus.map(fetus => ({
                    ...fetus,
                    weight: formatNumber(fetus.weight)
                }))
            })
        })
    }, [])

    function updateFetus(index: number, field: string, value: string) {
        if (!settings) return
        const fetus = settings.fetus
        fetus[index][field] = value
        setSettings({ ...settings, fetus })
    }

    function handleSubmit() {
        if(!settings) return
        const data = {
            discounts: settings.discounts.map((discount: any) => ({
                ...discount,
                value: (parseFloat(discount.value.replace(',', '.')) || 0)
            })),
            fetus: settings.fetus.map((fetus: any) => ({
                ...fetus,
                weight: (parseFloat(fetus.weight.replace(',', '.')) || 0)
            }))
        }

        updateSettings(data)
            .then(() => { swal('', 'Configurações atualizadas com sucesso!', 'success') })
            .catch(() => { swal('', 'Erro ao atualizar configurações!', 'error') })
    }

    function removeOldReports() {
        const months = 3
        swal({
            title: 'Deseja realmente continuar?', 
            text: `Todos os relatórios criados a mais de ${months} meses serão deletados`,
            icon: 'warning',
            buttons: {
                cancel: {
                    visible: true,
                    text: 'Não'
                },
                confirm: {
                    text: 'Sim',
                },
            },
            dangerMode: true,
        })
        .then(confirm => {
            confirm && deleteOldReports(months)
        })
    }

    return (
        <ScreenTemplate title='Configurações'>
            <>
                <div className='row' style={{ justifyContent: 'center' }}>
                    <Table title='Fetos'>
                        <>
                            <thead>
                                <tr>
                                    <th>Tamanho</th>
                                    <th>Peso (Kg)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.fetus.map((fetus: any, index: number) => {
                                    return (
                                        <tr key={`fetal-${fetus.id}`}>
                                            <td>{fetus.size}</td>
                                            <td><TextField type='decimal' value={fetus.weight} onChange={val => updateFetus(index, 'weight', val)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </>
                    </Table>
                </div>

                <Button variant='secondary' text='Salvar' onClick={handleSubmit} />
                <br /><br /><br /><br />
                <div className='row'>
                    <Button variant='primary' text='Excluir relatórios antigos' onClick={removeOldReports} />
                </div>
            </>
        </ScreenTemplate>
    )
}

export default Settings