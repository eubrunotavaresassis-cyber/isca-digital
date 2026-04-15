import React from 'react'
import { jsPDF } from 'jspdf'

function formatCurrency(v){
  try{ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v||0)) }catch(e){ return String(v) }
}

export default function ExportButtons({ entries }){
  function exportCSV(){
    const headers = ['Data','Categoria','Descrição','Tipo','Valor','Forma','Necessário','Observações']
    const keys = ['date','category','description','type','value','payment_method','necessary','notes']
    const rows = entries.map(e => keys.map(k => {
      let v = e[k]
      if (k === 'value') v = formatCurrency(v)
      if (k === 'necessary') v = e.necessary ? 'Sim' : 'Não'
      if (v == null) v = ''
      return '"'+String(v).replace(/"/g,'""')+'"'
    }).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plan_invest_export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF(){
    const doc = new jsPDF({unit:'pt', format:'a4'})
    doc.setFontSize(16)
    doc.setTextColor(255,122,0)
    doc.text('PLAN INVEST', 40, 48)
    doc.setTextColor(255,255,255)
    doc.setFontSize(12)
    doc.text('Relatório de Transações', 40, 68)
    let y = 100
    const marginLeft = 40
    const lineHeight = 16
    doc.setFontSize(10)
    // header
    doc.setFillColor(15,15,15)
    doc.rect(30, y-8, 540, 24, 'F')
    const headers = ['Data','Categoria','Descrição','Tipo','Valor','Forma','Necess.','Observações']
    let x = marginLeft
    const widths = [60,80,140,40,60,70,50,120]
    headers.forEach((h,i)=>{ doc.setTextColor(200); doc.text(h, x, y+8); x += widths[i] })
    y += 26

    entries.forEach(e=>{
      x = marginLeft
      const vals = [e.date||'', e.category||'', (e.description||'').slice(0,40), e.type||'', formatCurrency(e.value||0), e.payment_method||'', e.necessary? 'Sim':'Não', (e.notes||'').slice(0,40)]
      vals.forEach((v,i)=>{ doc.setTextColor(230); doc.text(String(v), x, y); x += widths[i] })
      y += lineHeight
      if (y > 740){ doc.addPage(); y = 40 }
    })

    doc.save('plan_invest_export.pdf')
  }

  return (
    <div style={{display:'flex',gap:8,marginTop:12}}>
      <button className="btn ghost" onClick={exportCSV}>Exportar CSV</button>
      <button className="btn ghost" onClick={exportPDF}>Exportar PDF</button>
    </div>
  )
}
