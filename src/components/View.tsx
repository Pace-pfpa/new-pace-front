import { Autocomplete, Button, TextField, AutocompleteChangeReason,
  AutocompleteChangeDetails } from '@mui/material';
import axios from 'axios';
import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from '../styles/view.module.css';

const ipdev = import.meta.env.VITE_API_URL_DEV;
console.log(ipdev)
const ipprod = import.meta.env.VITE_API_URL_PROD;
console.log(ipprod)

// MUDE PARA ipprod QUANDO FOR PARA A PRODUÇÃO
const ip = ipprod;

interface Audiencia {
  id: number;
  data: string;
  hora: string;
  processo: string;
  tipo_contest: string;
  assunto: string;
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
  const [loadingContestation, setLoadingContestation] = useState<boolean>(false);  // Estado de carregamento para "Achar contestação"
  const [loadingSubject, setLoadingSubject] = useState<boolean>(false);
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [downloadAvailable, setDownloadAvailable] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Fetch órgãos julgadores from the backend
    const fetchOrgaosJulgadores = async () => {
      try {
        const response = await axios.get<string[]>(`${ip}/newpace/orgaos-julgadores`);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOrgaoJulgadorChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null,
    _reason: AutocompleteChangeReason,
    _details?: AutocompleteChangeDetails<string>
  ) => {
    setFilters({
      ...filters,
      orgao_julgador: value || '',
    });
    fetchSalas(value || '');
  };

  const fetchSalas = async (orgao_julgador: string) => {
    try {
      const response = await axios.get<string[]>(`${ip}/newpace/salas/${encodeURIComponent(orgao_julgador)}`)
      setSalas(response.data);
    } catch (error) {
      console.error('Error fetching salas:', error);
    }
  };

  const handleSearch = async () => {
    try {

      const response = await axios.get<Audiencia[]>(`${ip}/newpace/audiencias-filter`, {
        params: filters,
      });

      setAudiencias(response.data);

      if (response.data.length > 0) {
        setMessage("");
        setDownloadAvailable(true);
      } else {
        setDownloadAvailable(false);
        setMessage("Nenhuma audiência encontrada.");
      }

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
      setLoadingContestation(true);
      const response = await axios.post(`${ip}/newpace/filtroAudienciasPace`, data);
      console.log('Response: ', response.data);
      handleSearch();
    } catch (error) {
      console.error('Error sending processes:', error);
    } finally {
      setLoadingContestation(false);
    }
  }

  const handleFindAssunto = async () => {
    const processos = audiencias.map((audi) => audi.processo);

    
    const data = {
      cpf,
      senha,
      processos,
    };
    
    try {
      setLoadingSubject(true);
      const response = await axios.post(`${ip}/newpace/filtroAssuntoPace`, data);
      console.log('Response: ', response.data);
      handleSearch();
    } catch (error) {
      console.error('Error sending processes:', error);
    } finally {
      setLoadingSubject(false);
    }
  }

  const onDownload = async () => {

    try {
      const response = await axios.get(`${ip}/newpace/audiencias-export`, {
        params: filters,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'audiencias.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage(`Failed to download file: ${error.response ? error.response.data.error : error.message}`);
    }
  }

  console.log(audiencias);
  return (
    <div className={styles.container}>
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
          <Autocomplete
            options={orgaosJulgadores}
            getOptionLabel={(option) => option}
            value={filters.orgao_julgador || null}
            onChange={handleOrgaoJulgadorChange}
            renderInput={(params) => <TextField {...params} />} 
          />
          {/* <select name='orgao_julgador' value={filters.orgao_julgador} onChange={handleChange}>
            <option value="">Todos</option>
            {orgaosJulgadores.map(orgao => (
              <option key={orgao} value={orgao}>
                {orgao}
              </option>
            ))}
          </select> */}
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
        <br/>
        {message && <p>{message}</p>}
        {downloadAvailable && (
        <Button color="success" variant='contained' onClick={onDownload}>
          Baixar Pautas
        </Button>
      )}
      </div>


      {audiencias.length > 0 && (
      <>
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
          <div className={styles.btnDiv}>
            <button
              onClick={handleSendProcesses}
              disabled={loadingSubject || loadingContestation} // Desativa se qualquer um dos estados estiver ativo
            >
              Achar contestação
            </button>
            {loadingContestation && <p>Buscando contestação...</p>}

            <button
              onClick={handleFindAssunto}
              disabled={loadingContestation || loadingSubject} // Desativa se qualquer um dos estados estiver ativo
            >
              Achar assunto
            </button>
            {loadingSubject && <p>Buscando assunto...</p>}
          </div>
      </div>
        <h2>Total de audiências encontradas: {audiencias.length}</h2>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Turno</th>
                <th>Processo</th>
                <th>Contestação</th>
                <th>Assunto</th>
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
                  <td>{audiencia.assunto}</td>
                  <td>{audiencia.orgao_julgador}</td>
                  <td>{audiencia.partes}</td>
                  <td>{audiencia.sala}</td>
                  <td>{audiencia.situacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
      )}
    </div>
  )


}

export default View;
