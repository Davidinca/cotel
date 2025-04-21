import React, { useState } from 'react';
import axios from '../api/axios.js';
import './BuscarContrato.css';

const BuscarContrato = () => {
    const [numeroContrato, setNumeroContrato] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');

    const buscarContrato = async () => {
        setError('');
        setResultado(null);

        if (!/^\d{8}$/.test(numeroContrato)) {
            setError('El número de contrato debe tener exactamente 8 dígitos.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/contratos/buscar/?numero_contrato=${numeroContrato}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResultado(res.data);
        } catch (err) {
            setError(err.response?.data?.detail || 'No se encontró el contrato o hubo un error.');
        }
    };

    return (
        <div className="buscar-contrato-container">
            <h2
            >Buscar Contrato</h2>
            <input
                type="text"
                placeholder="Número de contrato (8 dígitos)"
                value={numeroContrato}
                onChange={(e) => setNumeroContrato(e.target.value)}
            />
            <button onClick={buscarContrato}>Buscar</button>

            {error && <p className="error">{error}</p>}

            {resultado && (
                <div className="resultado">
                    <h3>Datos del Contrato</h3>
                    <div className="tabla-contenedor">
                        <table className="tabla-resultado">
                            <thead>
                            <tr>
                                <th>Número de Contrato</th>
                                <th>Cliente</th>
                                <th>CI</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Servicios</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{resultado.numero_contrato}</td>
                                <td>{`${resultado.cliente.nombres} ${resultado.cliente.apellidos}`}</td>
                                <td>{resultado.cliente.ci}</td>
                                <td>{resultado.cliente.direccion}</td>
                                <td>{resultado.cliente.telefono}</td>
                                <td>
                                    {Array.isArray(resultado.servicios)
                                        ? resultado.servicios.map(s => s.tipo_servicio_display).join(', ')
                                        : 'Sin servicios'}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BuscarContrato;

