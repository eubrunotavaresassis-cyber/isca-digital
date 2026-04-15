import React, { useEffect, useState } from 'react'

export default function InstallBanner(){
  const [promptEvent, setPromptEvent] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(()=>{
    function handler(e){
      e.preventDefault()
      setPromptEvent(e)
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return ()=> window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!visible) return null

  async function install(){
    if (!promptEvent) return
    promptEvent.prompt()
    const res = await promptEvent.userChoice
    setVisible(false)
    setPromptEvent(null)
  }

  return (
    <div style={{position:'fixed',left:20,bottom:80,background:'linear-gradient(90deg,#111,#151515)',padding:12,borderRadius:10,boxShadow:'0 8px 24px rgba(0,0,0,0.6)',zIndex:999}}>
      <div style={{fontWeight:700,color:'#FF7A00'}}>Instalar PLAN INVEST</div>
      <div className="small" style={{marginTop:6}}>Adicione a plataforma ao seu dispositivo para acesso rápido.</div>
      <div style={{marginTop:8,display:'flex',gap:8}}>
        <button className="btn primary" onClick={install}>Instalar</button>
        <button className="btn ghost" onClick={()=>setVisible(false)}>Fechar</button>
      </div>
    </div>
  )
}
