import axios from 'axios';
import React, { useState, ChangeEvent, useEffect } from 'react';

const ipdev = import.meta.env.VITE_API_URL_DEV;
console.log(ipdev)
const ipprod = import.meta.env.VITE_API_URL_PROD;
console.log(ipprod)

interface Audiencia {
  id: number;
  data: string;
  hora: string;
  processo: string;
  tipo_contest: string;
  orgao_julgador: string;
  partes: string;
  sala: string;
  turno: string;
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
  const [orgaosJulgadores, setOrgaosJulgadores] = useState<string[]>([]);
  const [salas, setSalas] = useState<string[]>([]);
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    // Fetch órgãos julgadores from the backend
    const fetchOrgaosJulgadores = async () => {
      try {
        const response = await axios.get<string[]>(`${ipdev}/newpace/orgaos-julgadores`);
        setOrgaosJulgadores(response.data);
      } catch (error) {
        console.error('Error fetching órgãos julgadores:', error);
      }
    };

    fetchOrgaosJulgadores();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === 'orgao_julgador') {
      fetchSalas(e.target.value);
    }
  };

  const fetchSalas = async (orgao_julgador: string) => {
    try {
      const response = await axios.get<string[]>(`${ipdev}/newpace/salas/${encodeURIComponent(orgao_julgador)}`)
      setSalas(response.data);
    } catch (error) {
      console.error('Error fetching salas:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get<Audiencia[]>(`${ipdev}/newpace/audiencias-filter`, {
        params: filters,
      });
      setAudiencias(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSendProcesses = async () => {
    const processos = audiencias.map((audi) => audi.processo);

    const data = {
      cpf,
      senha,
      processos,
    };

    try {
      const response = await axios.post(`${ipdev}/newpace/filtroAudienciasPace`, data);
      console.log('Response: ', response.data);
    } catch (error) {
      console.error('Error sending processes:', error);
    }
  }

  console.log(audiencias);
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
          <select name='orgao_julgador' value={filters.orgao_julgador} onChange={handleChange}>
            <option value="">Todos</option>
            {orgaosJulgadores.map(orgao => (
              <option key={orgao} value={orgao}>
                {orgao}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sala:
          <select name="sala" value={filters.sala} onChange={handleChange} disabled={!filters.orgao_julgador}>
            <option value="">Todas</option>
            {salas.map(sala => (
              <option key={sala} value={sala}>
                {sala}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSearch}>Pesquisar</button>
      </div>

      <h2>Login Sapiens</h2>
      <div>
        <label>
          CPF:
          <input type="text" value={cpf} required onChange={(e) => setCpf(e.target.value)} />
        </label>
        <label>
          Senha:
          <input type="password" value={senha} required onChange={(e) => setSenha(e.target.value)} />
        </label>
        <button onClick={handleSendProcesses}>Enviar Processos</button>
      </div>

      <h2>Resultados</h2>
      <table>
      <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Turno</th>
            <th>Processo</th>
            <th>Contestação</th>
            <th>Órgão Julgador</th>
            <th>Partes</th>
            <th>Sala</th>
            <th>Situação</th>
          </tr>
        </thead>
        <tbody>
          {audiencias.map(audiencia => (
            <tr key={audiencia.id}>
              <td>{audiencia.data}</td>
              <td>{audiencia.hora}</td>
              <td>{audiencia.turno}</td>
              <td>{audiencia.processo}</td>
              <td>{audiencia.tipo_contest}</td>
              <td>{audiencia.orgao_julgador}</td>
              <td>{audiencia.partes}</td>
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
