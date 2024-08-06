import axios from 'axios';
import React, { useState, ChangeEvent } from 'react';

const ipdev = import.meta.env.VITE_API_URL_DEV;
console.log(ipdev)
const ipprod = import.meta.env.VITE_API_URL_PROD;
console.log(ipprod)

interface Audiencia {
  id: number;
  data: string;
  hora: string;
  processo: string;
  orgao_julgador: string;
  partes: string;
  classe: string;
  tipo_audiencia: string;
  sala: string;
  situacao: string;
}

const View: React.FC = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    turno: '',
    orgao_julgador: '',
    sala: '',
  });

  const [audiencias, setAudiencias] = useState<Audiencia[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get<Audiencia[]>(`${ipdev}/audiencias-filter`, {
        params: filters,
      });
      setAudiencias(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div>
      <h1>Buscar Audiências</h1>
      <div>
      <label>
          Data Inicial:
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </label>
        <label>
          Data Final:
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </label>
        <label>
          Turno:
          <select name="turno" value={filters.turno} onChange={handleChange}>
            <option value="">Todos</option>
            <option value="MANHÃ">Manhã</option>
            <option value="TARDE">Tarde</option>
          </select>
        </label>
        <label>
          Órgão Julgador:
          <input type="text" name="orgao_julgador" value={filters.orgao_julgador} onChange={handleChange} />
        </label>
        <label>
          Sala:
          <input type="text" name="sala" value={filters.sala} onChange={handleChange} />
        </label>
        <button onClick={handleSearch}>Pesquisar</button>
      </div>
      <h2>Resultados</h2>
      <table>
      <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Processo</th>
            <th>Órgão Julgador</th>
            <th>Partes</th>
            <th>Classe</th>
            <th>Tipo de Audiência</th>
            <th>Sala</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {audiencias.map(audiencia => (
            <tr key={audiencia.id}>
              <td>{audiencia.data}</td>
              <td>{audiencia.hora}</td>
              <td>{audiencia.processo}</td>
              <td>{audiencia.orgao_julgador}</td>
              <td>{audiencia.partes}</td>
              <td>{audiencia.classe}</td>
              <td>{audiencia.tipo_audiencia}</td>
              <td>{audiencia.sala}</td>
              <td>{audiencia.situacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )


}

export default View;
