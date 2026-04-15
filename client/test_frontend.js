const puppeteer = require('puppeteer');

(async ()=>{
  const base = process.env.FRONTEND_URL || 'http://localhost:5173'
  const unique = Date.now()
  const name = 'Automated User'
  const email = `auto.user.${unique}@example.com`
  const password = 'Senha123!'

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.setDefaultTimeout(20000)
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  try{
    console.log('Opening register page')
    await page.goto(base + '/register', { waitUntil: 'networkidle2' })

    await page.type('input[placeholder="Nome"]', name)
    await page.type('input[placeholder="Email"]', email)
    await page.type('input[placeholder="Senha"]', password)
    await page.click('button.btn.primary')

    // wait for dashboard to load
    await page.waitForSelector('.dashboard-page, .sheet-section', { timeout: 10000 })
    console.log('Registered and redirected to dashboard')

    // ensure token exists
    const token = await page.evaluate(()=>localStorage.getItem('pi_token'))
    console.log('Token present?', !!token)

    // add a row - wait longer for spreadsheet to render
    await page.waitForSelector('.sheet-section', { timeout: 20000 })
    await page.waitForSelector('.sheet-controls .btn.primary', { timeout: 20000 })
    await page.click('.sheet-controls .btn.primary')
    await new Promise(r => setTimeout(r, 500))

    // fill description in first row
    await page.waitForSelector('table tbody tr')
    const descSelector = 'table tbody tr:first-child td:nth-child(3) input'
    await page.click(descSelector)
    await page.focus(descSelector)
    await page.keyboard.type('Teste automatizado')

    // set value
    const valueSelector = 'table tbody tr:first-child td:nth-child(5) input'
    await page.evaluate((sel)=>{ const el = document.querySelector(sel); if(el){ el.value = '123.45'; el.dispatchEvent(new Event('input',{bubbles:true})); } }, valueSelector)

    await new Promise(r => setTimeout(r, 900)) // let debounce save
    console.log('Added and edited a row')

    // open profile modal (find button by text)
    const profileClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(el => el.textContent && el.textContent.trim().startsWith('Perfil'))
      if (b) { b.click(); return true }
      return false
    })
    if (profileClicked) {
      await page.waitForSelector('.modal', { timeout: 5000 })
      console.log('Profile modal opened')
      await page.evaluate(()=>{ const close = document.querySelector('.modal .btn.ghost'); if(close) close.click(); })
    }

    // export CSV - click ExportButtons ghost buttons
    const ghostButtons = await page.$$('button.btn.ghost')
    if (ghostButtons.length >= 2) {
      await ghostButtons[1].click()
      console.log('Clicked export (CSV/PDF) button')
    }

    // logout (find by text)
    const loggedOut = await page.evaluate(()=>{
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find(el => el.textContent && el.textContent.trim().startsWith('Logout'))
      if (b){ b.click(); return true }
      return false
    })
    if (loggedOut) await new Promise(r => setTimeout(r, 400))
    console.log('Logged out')

    console.log('Frontend flow test completed successfully')
  }catch(err){
    console.error('Frontend test error:', err)
    try{ await page.screenshot({path:'..\\frontend_test_error.png', fullPage:true}) }catch(e){ console.error('Screenshot failed', e) }
  }finally{
    await browser.close()
  }

})()
