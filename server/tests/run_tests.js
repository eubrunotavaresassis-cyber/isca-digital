(async ()=>{
  const port = process.env.PORT || 4001
  const base = `http://localhost:${port}`
  const t = Date.now()
  const email = `ci.test.${t}@example.com`
  const password = 'SenhaTest123'

  try{
    console.log('Running server tests against', base)
    let r = await fetch(base + '/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:'CI Test', email, password }) })
    let j = await r.json()
    if (!j.token) throw new Error('Register failed: '+JSON.stringify(j))
    console.log('Register OK')

    r = await fetch(base + '/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    j = await r.json()
    if (!j.token) throw new Error('Login failed')
    const token = j.token
    console.log('Login OK')

    r = await fetch(base + '/api/entries', { method:'POST', headers:{'Content-Type':'application/json', Authorization: 'Bearer '+token}, body: JSON.stringify({ date: new Date().toISOString().slice(0,10), category:'Teste', description:'CI', type:'Saida', value:10, payment_method:'Dinheiro', necessary:0, notes:'' }) })
    j = await r.json()
    if (!j.id) throw new Error('Create entry failed')
    console.log('Create entry OK')

    console.log('Server tests passed')
  }catch(e){
    console.error('Server tests failed:', e)
    process.exit(1)
  }
})();
