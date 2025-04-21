import axios from './axios';

// Buscar contrato
export const buscarContrato = async (numeroContrato, token) => {
    const response = await axios.get(`/contratos/buscar/?numero_contrato=${numeroContrato}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
