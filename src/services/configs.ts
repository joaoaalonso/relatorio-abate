let ARROBA = 15.00
let FETAL_WEIGHTS = {
    P: 8,
    M: 16,
    G: 32
}
let FETAL_AGES = {
    P: 'DE ATÉ 2 MESES',
    M: 'ENTRE 2 À 5 MESES',
    G: 'DE ATÉ 9 MESES'
}
let DISCOUNTS = [
    { name: 'Funrural', value: 0.015},
    { name: 'Senar', value: 0.002 }
]

export function getArroba() {
    return ARROBA
}

export function getDiscounts() {
    return DISCOUNTS
}

export function getDiscountNames() {
    return DISCOUNTS.map(d => d.name)
}

export function getDiscountValue(discount: 'string') {
    return DISCOUNTS.find(d => d.name === discount)?.value || 1
}

export function getFetalWeights() {
    return FETAL_WEIGHTS
}

export function getFetalWeight(size: 'P' | 'M' | 'G') {
    return FETAL_WEIGHTS[size] || 0
}

export function getAvaliableFetalSizes() {
    return Object.keys(FETAL_WEIGHTS)
}

export function getFetalAges() {
    return FETAL_AGES
}

export function getFetalAge(size: 'P' | 'M' | 'G') {
    return FETAL_AGES[size] || ''
}

export function getConfigs() {
    return {
        arroba: ARROBA,
        discounts: DISCOUNTS,
        fetalWeights: FETAL_WEIGHTS,
        fetalAges: FETAL_AGES,
    }
}

interface Discount {
    name: string
    value: number
}

interface FetalWeights {
    P: number
    M: number
    G: number
}

interface FetalAges {
    P: string
    M: string
    G: string
}

interface UpdateConfigs {
    arroba: number
    discounts: Discount[],
    fetalWeights: FetalWeights,
    fetalAges: FetalAges
}

export function update(data: UpdateConfigs) {
    ARROBA = data.arroba
    DISCOUNTS = data.discounts
    FETAL_WEIGHTS = data.fetalWeights
    FETAL_AGES = data.fetalAges
}