import React from 'react'

function fmt(v){
  try{ return new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(v||0)) }catch(e){return '0,00'}
}

export default function TopCards({summary}){
  const s = summary || { total_in:0, total_out:0, balance:0, potential_invest:0 }
  return (
    <div className="top-cards">
      <div className="card small">
        <div className="label">Receita do mês</div>
        <div className="value">R$ {fmt(s.total_in)}</div>
      </div>
      <div className="card small">
        <div className="label">Gastos do mês</div>
        <div className="value">R$ {fmt(s.total_out)}</div>
      </div>
      <div className="card small">
        <div className="label">Saldo atual</div>
        <div className="value">R$ {fmt(s.balance)}</div>
      </div>
      <div className="card small">
        <div className="label">Potencial para investir</div>
        <div className="value">R$ {fmt(s.potential_invest)}</div>
      </div>
    </div>
  )
}
