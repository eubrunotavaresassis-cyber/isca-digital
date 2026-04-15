import React, { useEffect, useState } from 'react'
import Logo from '../components/Logo'
import TopCards from '../components/TopCards'
import Spreadsheet from '../components/Spreadsheet'
import Charts from '../components/Charts'
import Loader from '../components/Loader'
import ProfileModal from '../components/ProfileModal'
import ExportButtons from '../components/ExportButtons'
import InstallBar from '../components/InstallBar'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

export default function Dashboard(){
  const nav = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartsData, setChartsData] = useState({spendingByCategory:[], monthlyEvolution:[]})
  const [showProfile, setShowProfile] = useState(false)

  useEffect(()=>{
    const token = localStorage.getItem('pi_token')
    if (!token) return nav('/')
    setLoading(true)
    fetch(`${API_URL}/api/analytics/summary`, { headers: { Authorization: 'Bearer '+token } })
      .then(r=>r.json()).then(d=>{ if (d.summary) setSummary(d.summary); setLoading(false) })

    // small local derivations for charts: use entries endpoint
    fetch(`${API_URL}/api/entries`, { headers: { Authorization: 'Bearer '+token } })
      .then(r=>r.json()).then(d=>{
        const entries = d.entries||[]
        const byCat = {}
        const monthly = {}
        entries.forEach(e=>{
          if (e.type === 'Saida'){
            byCat[e.category] = (byCat[e.category]||0) + (Number(e.value)||0)
          }
          const m = (e.date||'').slice(0,7)
          monthly[m] = (monthly[m]||0) + ((e.type==='Entrada'?1:-1)*(Number(e.value)||0))
        })
        const spendingByCategory = Object.keys(byCat).map(k=>({category:k,spent:byCat[k]})).sort((a,b)=>b.spent-a.spent).slice(0,6)
        const monthlyEvolution = Object.keys(monthly).sort().map(k=>({month:k,value:monthly[k]})).slice(-6)
        setChartsData({spendingByCategory, monthlyEvolution, entries})
      })
  }, [])

  function handleLogout(){
    localStorage.removeItem('pi_token')
    nav('/')
  }

  return (
    <div className="page dashboard-page">
      <header className="header">
        <div className="left"><Logo/></div>
        <div className="right">
          <span className="user">{summary?.user?.name || 'Usuário'}</span>
          <button className="btn ghost" onClick={()=>setShowProfile(true)}>Perfil</button>
          <button className="btn ghost" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main style={{display:'grid',gridTemplateColumns:'1fr 420px',gap:18,marginTop:18}}>
        <section>
          <TopCards summary={summary} />
          <section className="sheet-section">
            <h3>Planilha</h3>
            <Spreadsheet />
          </section>
        </section>

        <aside>
          <div className="card" style={{marginBottom:12}}>
            {loading ? <Loader/> : (
              <div>
                <div className="small">Resumo</div>
                <div style={{fontSize:24,fontWeight:700,marginTop:8}}>R$ {((summary&&summary.balance)||0).toFixed(2)}</div>
                <div className="muted" style={{marginTop:6}}>Gastos inúteis detectados: R$ {(summary&&summary.waste)||0}</div>
              </div>
            )}
          </div>

          <Charts spendingByCategory={chartsData.spendingByCategory} monthlyEvolution={chartsData.monthlyEvolution} />

          <div className="card" style={{marginTop:12}}>
            <h4 className="small">Exportar dados</h4>
            <ExportButtons entries={chartsData.entries || []} />
          </div>

          <div className="card" style={{marginTop:12}}>
            <h4 className="small">Quer aprender a investir melhor seu dinheiro?</h4>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <a className="btn primary" href="https://wa.me/556198143068?text=QUERO%20SABER%20MAIS%20SOBRE%20O%20CLUBE%20INVEST" target="_blank" rel="noreferrer">Falar no WhatsApp</a>
              <a className="btn ghost" href="https://kiwify.app/3hXOQgt?afid=maumjB9W" target="_blank" rel="noreferrer">Conhecer Mentoria</a>
            </div>
          </div>
        </aside>
      </main>

      <ProfileModal open={showProfile} onClose={()=>setShowProfile(false)} />
      <InstallBar />

    </div>
  )
}
