import React, { useEffect, useState, useRef } from 'react'
import { API_URL } from '../config'

const CATEGORIES = ['Todas','Alimentação','Mercado','Transporte','Moradia','Cartão','Assinaturas','Lazer','Saúde','Educação','Investimentos','Outros']

export default function Spreadsheet(){
  const [rows, setRows] = useState([])
  const [displayRows, setDisplayRows] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [sortField, setSortField] = useState('date')
  const [sortDir, setSortDir] = useState('desc')
  const savingTimers = useRef(new Map())
  const token = localStorage.getItem('pi_token')

  useEffect(()=>{ fetchRows() }, [])

  useEffect(()=>{ applyFilters() }, [rows, search, category, sortField, sortDir])

  function fetchRows(){
    fetch(`${API_URL}/api/entries`, { headers: { Authorization: 'Bearer '+token } })
      .then(r=>r.json()).then(d=>{ if (d.entries) setRows(d.entries) })
  }

  function addRow(){
    const newRow = { date: new Date().toISOString().slice(0,10), category: 'Outros', description:'', type:'Saida', value:0, payment_method:'Dinheiro', necessary:1, notes:'' }
    fetch(`${API_URL}/api/entries`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token}, body: JSON.stringify(newRow) })
      .then(r=>r.json()).then(()=>fetchRows())
  }

  function applyFilters(){
    let out = [...rows]
    if (category && category !== 'Todas') out = out.filter(r=>r.category === category)
    if (search) {
      const s = search.toLowerCase()
      out = out.filter(r=> (r.description||'').toLowerCase().includes(s) || (r.notes||'').toLowerCase().includes(s) || (r.category||'').toLowerCase().includes(s))
    }
    out.sort((a,b)=>{
      const A = a[sortField] || ''
      const B = b[sortField] || ''
      if (sortField === 'value') return (sortDir==='asc'?A-B:B-A)
      if (A < B) return sortDir==='asc'? -1:1
      if (A > B) return sortDir==='asc'? 1:-1
      return 0
    })
    setDisplayRows(out)
  }

  function scheduleSave(id, data){
    const map = savingTimers.current
    if (map.has(id)) clearTimeout(map.get(id))
    const t = setTimeout(()=>{
      fetch(`${API_URL}/api/entries/`+id, { method:'PUT', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token}, body: JSON.stringify(data) })
        .then(()=>fetchRows())
    }, 700)
    map.set(id, t)
  }

  function handleChange(id, field, value){
    setRows(prev => prev.map(r => r.id === id ? ({...r, [field]: value}) : r))
    const row = rows.find(r=>r.id===id) || {}
    const updated = {...row, [field]: value}
    scheduleSave(id, updated)
  }

  function deleteRow(id){
    fetch(`${API_URL}/api/entries/`+id, { method:'DELETE', headers:{ Authorization:'Bearer '+token } })
      .then(()=>fetchRows())
  }

  return (
    <div className="spreadsheet">
      <div className="sheet-controls">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="btn primary" onClick={addRow}>+ Adicionar linha</button>
          <input placeholder="Pesquisar descrição, notas ou categoria" value={search} onChange={e=>setSearch(e.target.value)} style={{minWidth:220}} />
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortField} onChange={e=>setSortField(e.target.value)}>
            <option value="date">Data</option>
            <option value="category">Categoria</option>
            <option value="value">Valor</option>
          </select>
          <button className="btn ghost" onClick={()=>setSortDir(d=>d==='asc'?'desc':'asc')}>Ordenar: {sortDir}</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Categoria</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Forma</th>
              <th>Necessário?</th>
              <th>Observações</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map(r=> (
              <tr key={r.id}>
                <td><input value={r.date||''} onChange={e=>handleChange(r.id,'date',e.target.value)} /></td>
                <td>
                  <select value={r.category||'Outros'} onChange={e=>handleChange(r.id,'category',e.target.value)}>
                    {CATEGORIES.filter(c=>c!=='Todas').map(c=> <option key={c} value={c}>{c}</option>)}
                  </select>
                </td>
                <td><input value={r.description||''} onChange={e=>handleChange(r.id,'description',e.target.value)} /></td>
                <td>
                  <select value={r.type||'Saida'} onChange={e=>handleChange(r.id,'type',e.target.value)}>
                    <option value="Entrada">Entrada</option>
                    <option value="Saida">Saida</option>
                  </select>
                </td>
                <td><input type="number" step="0.01" value={r.value||0} onChange={e=>handleChange(r.id,'value',parseFloat(e.target.value)||0)} /></td>
                <td><input value={r.payment_method||''} onChange={e=>handleChange(r.id,'payment_method',e.target.value)} /></td>
                <td><input type="checkbox" checked={r.necessary==1} onChange={e=>handleChange(r.id,'necessary', e.target.checked?1:0)} /></td>
                <td><input value={r.notes||''} onChange={e=>handleChange(r.id,'notes',e.target.value)} /></td>
                <td><button className="btn danger" onClick={()=>deleteRow(r.id)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
