import swal from 'sweetalert'
import { useState, useEffect } from 'react'
import { BiPlus, BiTrash } from 'react-icons/bi'

import Table from '../components/Table'
import Button from '../components/Button'
import TextField from '../components/TextField'
import ScreenTemplate from '../components/ScreenTemplate'

import formatNumber from '../services/generateReport/formatNumber'
import { getSettings, updateSettings } from '../services/settings'

function Settings() {
    const [settings, setSettings] = useState<any>()
    const [deletedIds, setDeletedIds] = useState<number[]>([])

    useEffect(() => {
        getSettings().then(settings => {
            setSettings({
                discounts: settings.discounts.map(discount => ({
                    ...discount,
                    value: formatNumber(discount.value * 100)
                })),
                fetus: settings.fetus.map(fetus => ({
                    ...fetus,
                    weight: formatNumber(fetus.weight)
                }))
            })
        })
    }, [])

    function addDiscount() {
        if (!settings) return
        const discounts = settings.discounts
        discounts.push({ name: '', value: 0 })
        setSettings({ ...settings, discounts })
    }

    function removeDiscount(index: number) {
        if (!settings) return
        if (settings.discounts?.[index]?.id) {
            setDeletedIds([...deletedIds, settings.discounts[index].id])
        }
        let discounts = settings.discounts.filter((_: any, i: number) => i !== index)
        if (!discounts.length) {
            discounts = [{ name: '', value: 0 }]
        }
        setSettings({ ...settings, discounts })
    }

    function updateFetus(index: number, field: string, value: string) {
        if (!settings) return
        const fetus = settings.fetus
        fetus[index][field] = value
        setSettings({ ...settings, fetus })
    }

    function updateDiscount(index: number, field: string, value: string) {
        if (!settings) return
        const discounts: any = settings.discounts
        discounts[index][field] = value
        setSettings({ ...settings, discounts })
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
        updateSettings(data, deletedIds)
            .then(() => { swal('', 'Configurações atualizadas com sucesso!', 'success') })
            .catch(() => { swal('', 'Erro ao atualizar configurações!', 'error') })
    }

    if (!settings) {
        return (
            <div>Carregando...</div>
        )
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
                                    <th>Idade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.fetus.map((fetus: any, index: number) => {
                                    return (
                                        <tr key={`fetal-${fetus.id}`}>
                                            <td>{fetus.size}</td>
                                            <td><TextField type='decimal' value={fetus.weight} onChange={val => updateFetus(index, 'weight', val)} /></td>
                                            <td><TextField value={fetus.age} onChange={val => updateFetus(index, 'age', val)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </>
                    </Table>

                    <Table title='Descontos'>
                        <>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Valor (%)</th>
                                    <th><BiPlus size={15} onClick={addDiscount} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings?.discounts.map((discount: any, index: number) => {
                                    return (
                                        <tr key={`discount-${index}`}>
                                            <td><TextField value={discount.name} onChange={val => updateDiscount(index, 'name', val)} /></td>
                                            <td><TextField type='decimal' value={discount.value.toString()}  onChange={val => updateDiscount(index, 'value', val)} /></td>
                                            <td><BiTrash onClick={() => removeDiscount(index)} /></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </>
                    </Table>
                </div>

                <Button variant='secondary' text='Salvar' onClick={handleSubmit} />
            </>
        </ScreenTemplate>
    )
}

export default Settings