import React, { useState } from 'react';
import { buscarContrato } from '../../api/contratos.js';
import './BuscarContrato.css';
import toast, { Toaster } from 'react-hot-toast';

const BuscarContrato = () => {
    const [numeroContrato, setNumeroContrato] = useState('');
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const buscar = async () => {
        setError('');
        setResultado(null);

        if (!/^\d{8}$/.test(numeroContrato)) {
            setError('El número de contrato debe tener exactamente 8 dígitos.');
            return;
        }

        const toastId = toast.loading('Buscando contrato...');

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const data = await buscarContrato(numeroContrato, token);
            setResultado(data);
            toast.success('Contrato encontrado', { id: toastId });
        } catch (err) {
            const mensaje = err.response?.data?.detail || 'No se encontró el contrato o hubo un error.';
            setError(mensaje);
            toast.error(mensaje, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="buscar-contrato-container">
            <Toaster position="top-right" />
            <h2>Buscar Contrato</h2>
            <input
                type="text"
                placeholder="Número de contrato (8 dígitos)"
                value={numeroContrato}
                onChange={(e) => setNumeroContrato(e.target.value)}
            />
            <button onClick={buscar} disabled={isLoading}>
                {isLoading ? 'Buscando...' : 'Buscar'}
            </button>

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


