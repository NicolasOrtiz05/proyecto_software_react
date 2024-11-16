const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('paginaprincipaltest', function () {
  this.timeout(30000);
  let driver;

  beforeEach(async function () {
    const options = new chrome.Options();
    
    // Opciones básicas
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--allow-insecure-localhost');

    // Configuración para CI (GitHub Actions)
    if (process.env.GITHUB_ACTIONS) {
      options.addArguments('--headless');  // Modo headless para CI
      options.addArguments('--disable-gpu');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer('http://localhost:4444/wd/hub')  // Usamos el servidor Selenium en Docker
        .build();
    } else {
      // Configuración local
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    }
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('paginaprincipaltest', async function () {
    await driver.get("http://localhost:3000/");
    await driver.manage().window().setRect({ width: 1382, height: 736 });

    // Interactuar con los elementos
    await clickWhenVisible(driver, By.css(".producto:nth-child(1) .producto-agregar"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(3) .producto-agregar"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(11) .producto-agregar"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(14) .producto-agregar"));

    // Navegar entre secciones
    await clickWhenVisible(driver, By.css("li:nth-child(2) > .boton-menu"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(2) .producto-agregar"));

    await clickWhenVisible(driver, By.css("li:nth-child(3) > .boton-menu"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(5) .producto-agregar"));

    await clickWhenVisible(driver, By.css("li:nth-child(4) > .boton-menu"));
    await clickWhenVisible(driver, By.css(".producto:nth-child(3) .producto-agregar"));
  });
});

// Función auxiliar para esperar hasta que el elemento sea visible y clickeable
async function clickWhenVisible(driver, locator, timeout = 10000) {
  await driver.wait(until.elementLocated(locator), timeout);
  
  const element = await driver.findElement(locator);
  
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.executeScript("arguments[0].scrollIntoView({block: 'center', inline: 'center'});", element);

  await driver.wait(async () => {
    const isClickable = await driver.executeScript(`
      var el = arguments[0];
      var rect = el.getBoundingClientRect();
      var x = rect.left + rect.width / 2;
      var y = rect.top + rect.height / 2;
      return document.elementFromPoint(x, y) === el;
    `, element);
    return isClickable;
  }, timeout, "Elemento bloqueado por otro elemento.");

  try {
    await element.click();
  } catch (error) {
    if (error.name === 'StaleElementReferenceError') {
      const freshElement = await driver.findElement(locator);
      await freshElement.click();
    } else {
      throw error;
    }
  }
}
