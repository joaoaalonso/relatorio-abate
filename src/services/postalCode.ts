import axios from "axios"

interface Address {
    postalCode: string
    streetName: string
    neighborhood: string
    city: string
    state: string
}

interface AddressCache {
    [key: string]: Address
}

const cache: AddressCache = {}

const convertToAddress = (viaCepAddress: any): Address => {
    return {
        postalCode: viaCepAddress.cep,
        streetName: viaCepAddress.logradouro,
        neighborhood: viaCepAddress.bairro,
        city: viaCepAddress.localidade,
        state: viaCepAddress.uf
    }
}

export const getAddressFromPostalCode = async (postalCode: string): Promise<Address> => {
    if (cache[postalCode]) {
        return cache[postalCode]
    }

    const url = `https://viacep.com.br/ws/${postalCode}/json/`
    return axios.get(url)
        .then(({ data }) => {
            const address = convertToAddress(data)
            cache[postalCode] = address
            return address
        })
}