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

    useEffect(() => {
        getSettings().then(settings => {
            setSettings({
                ...settings,
                discounts: settings.discounts.map(discount => ({
                    name: discount.name,
                    value: formatNumber(discount.value * 100),
                })),
                fetalWeights: {
                    P: formatNumber(settings.fetalWeights.P),
                    M: formatNumber(settings.fetalWeights.M),
                    G: formatNumber(settings.fetalWeights.G),
                }
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
        let discounts = settings.discounts.filter((_: any, i: number) => i !== index)
        if (!discounts.length) {
            discounts = [{ name: '', value: 0 }]
        }
        setSettings({ ...settings, discounts })
    }

    function updateFetalWeight(size: string, value: string) {
        if (!settings) return
        const fetalWeights = settings.fetalWeights
        fetalWeights[size] = value
        setSettings({ ...settings, fetalWeights })
    }

    function updateFetalAge(size: string, value: string) {
        if (!settings) return
        const fetalAges = settings.fetalAges
        fetalAges[size] = value
        setSettings({ ...settings, fetalAges })
    }

    function updateDiscount(index: number, field: string, value: string) {
        if (!settings) return
        const discounts: any = settings.discounts
        discounts[index][field] = value
        setSettings({ ...settings, discounts })
    }
    
    function handleSubmit() {
        if(!settings) return
        const discounts = settings.discounts.map((discount: any) => ({ 
            name: discount.name,
            value: (parseFloat(discount.value.replace(',', '.')) || 0) / 100
        }))
        const fetalWeights = {
            P: parseFloat(settings.fetalWeights.P.replace(',', '.')),
            M: parseFloat(settings.fetalWeights.M.replace(',', '.')),
            G: parseFloat(settings.fetalWeights.G.replace(',', '.')),
        }
        updateSettings({ ...settings, discounts, fetalWeights })
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
                                {(Object.keys(settings.fetalAges)).map(size => {
                                    return (
                                        <tr key={`fetal-${size}`}>
                                            <td>{size}</td>
                                            <td><TextField type='decimal' value={settings.fetalWeights[size].toString()} onChange={val => updateFetalWeight(size, val)} /></td>
                                            <td><TextField value={settings.fetalAges[size]} onChange={val => updateFetalAge(size, val)} /></td>
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