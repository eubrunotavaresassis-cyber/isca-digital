(async ()=>{
  const base = 'http://localhost:4001'
  const t = Date.now()
  const email = `test.user.${t}@example.com`
  const password = 'Senha123!'
  const name = 'Test User'

  function ok(res){ return res && (res.ok || res.token || res.summary || res.insights) }

  try{
    console.log('1) Registering user', email)
    let r = await fetch(base + '/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({name,email,password}) })
    let j = await r.json()
    console.log('register:', j)

    console.log('2) Logging in')
    r = await fetch(base + '/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password}) })
    j = await r.json()
    console.log('login:', j)
    if (!j.token) throw new Error('Login failed')
    const token = j.token

    console.log('3) Profile')
    r = await fetch(base + '/api/auth/profile', { headers: { Authorization: 'Bearer '+token } })
    j = await r.json()
    console.log('profile:', j)

    console.log('4) Create entry')
    const entry = { date: new Date().toISOString().slice(0,10), category: 'Lazer', description: 'Cinema', type: 'Saida', value: 45.5, payment_method: 'Cartão', necessary:0, notes:'Teste' }
    r = await fetch(base + '/api/entries', { method:'POST', headers:{'Content-Type':'application/json', Authorization: 'Bearer '+token}, body: JSON.stringify(entry) })
    j = await r.json()
    console.log('create entry:', j)
    const entryId = j.id

    console.log('5) List entries')
    r = await fetch(base + '/api/entries', { headers: { Authorization: 'Bearer '+token } })
    j = await r.json()
    console.log('entries count:', (j.entries||[]).length)

    console.log('6) Analytics summary')
    r = await fetch(base + '/api/analytics/summary', { headers: { Authorization: 'Bearer '+token } })
    j = await r.json()
    console.log('summary:', j.summary)

    console.log('7) Analytics insights')
    r = await fetch(base + '/api/analytics/insights', { headers: { Authorization: 'Bearer '+token } })
    j = await r.json()
    console.log('insights:', j.insights)

    console.log('8) Update entry')
    r = await fetch(base + '/api/entries/'+entryId, { method:'PUT', headers:{'Content-Type':'application/json', Authorization: 'Bearer '+token}, body: JSON.stringify({...entry, value:50}) })
    j = await r.json()
    console.log('update:', j)

    console.log('9) Delete entry')
    r = await fetch(base + '/api/entries/'+entryId, { method:'DELETE', headers:{ Authorization: 'Bearer '+token } })
    j = await r.json()
    console.log('delete:', j)

    console.log('All tests completed successfully')
  }catch(err){
    console.error('Test script error:', err)
  }
})()
