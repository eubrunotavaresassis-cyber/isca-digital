const puppeteer = require('puppeteer');

(async ()=>{
  const base = 'http://localhost:5174'
  const unique = Date.now()
  const name = 'Automated User'
  const email = `auto.user.${unique}@example.com`
  const password = 'Senha123!'

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.setDefaultTimeout(20000)

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

    // add a row
    await page.waitForSelector('.sheet-controls .btn.primary')
    await page.click('.sheet-controls .btn.primary')
    await page.waitForTimeout(500)

    // fill description in first row
    await page.waitForSelector('table tbody tr')
    const descSelector = 'table tbody tr:first-child td:nth-child(3) input'
    await page.click(descSelector)
    await page.focus(descSelector)
    await page.keyboard.type('Teste automatizado')

    // set value
    const valueSelector = 'table tbody tr:first-child td:nth-child(5) input'
    await page.click(valueSelector)
    await page.focus(valueSelector)
    await page.keyboard.press('Control+A')
    await page.keyboard.type('123.45')

    await page.waitForTimeout(900) // let debounce save
    console.log('Added and edited a row')

    // open profile modal
    await page.click('button.btn.ghost') // first ghost button is Perfil
    await page.waitForSelector('.modal', { timeout: 5000 })
    console.log('Profile modal opened')
    await page.click('.modal .btn.ghost') // close

    // export CSV
    const exportBtn = await page.$('button.btn.ghost')
    if (exportBtn) {
      // there are multiple ghost buttons; click the one in ExportButtons by locating text
      const buttons = await page.$$('button.btn.ghost')
      // click the second ghost (rough heuristic)
      if (buttons.length >= 2) {
        await buttons[1].click()
        console.log('Clicked export (CSV/PDF) button')
      }
    }

    // logout
    const logoutBtn = await page.$x("//button[contains(., 'Logout')]")
    if (logoutBtn.length) await logoutBtn[0].click()
    await page.waitForTimeout(400)
    console.log('Logged out')

    console.log('Frontend flow test completed successfully')
  }catch(err){
    console.error('Frontend test error:', err)
    await page.screenshot({path:'frontend_test_error.png', fullPage:true})
  }finally{
    await browser.close()
  }

})()
