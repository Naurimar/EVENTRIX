
import { useEffect, useState } from 'react'
import { Users, Plus, Search, Pencil, Trash2, Eye } from 'lucide-react'
import { clientesApi } from '../../services/api'
import './ClientesPage.css'

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    clientesApi.listar()
      .then(datos => setClientes(datos))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const clientesFiltrados = clientes.filter(cliente =>
    `${cliente.nombre} ${cliente.documento} ${cliente.correo ?? ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  return (
    <div className="clientes-page">
      <div className="clientes-encabezado">
        <div>
          <h2><Users size={28} /> Gestión de clientes</h2>
          <p>Administra la información de los clientes y sus eventos.</p>
        </div>

        <button className="clientes-nuevo" type="button" disabled>
          <Plus size={18} /> Nuevo cliente
        </button>
      </div>

      <label className="clientes-busqueda">
        <Search size={19} />
        <input
          type="search"
          placeholder="Buscar cliente..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </label>

      {error && <p role="alert" className="clientes-error">{error}</p>}

      {cargando ? (
        <p>Cargando clientes...</p>
      ) : (
        <div className="clientes-tabla-contenedor">
          <table className="clientes-tabla">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Correo electrónico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientesFiltrados.map(cliente => (
                <tr key={cliente.idCliente}>
                  <td>{cliente.documento}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono || '—'}</td>
                  <td>{cliente.correo || '—'}</td>
                  <td>
                    <div className="clientes-acciones">
                      <button type="button" title="Consultar" disabled>
                        <Eye size={17} />
                      </button>
                      <button type="button" title="Editar" disabled>
                        <Pencil size={17} />
                      </button>
                      <button type="button" title="Eliminar" disabled>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!clientesFiltrados.length && (
                <tr>
                  <td colSpan={5}>No se encontraron clientes.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
