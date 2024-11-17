const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const SELENIUM_HOST = process.env.SELENIUM_HOST || "localhost";  // Se conecta al contenedor de Selenium

describe('paginaprincipaltest', function () {
  this.timeout(30000); // Tiempo máximo para cada test
  let driver;

  beforeEach(async function () {
    const options = new chrome.Options();
    // options.addArguments('--headless');  // Comentar si prefieres ver el navegador
    options.addArguments('--disable-gpu');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--ignore-certificate-errors');
    options.addArguments('--allow-insecure-localhost');

    // Usamos el host de Selenium en el contenedor
    driver = await new Builder()
      .usingServer(`http://${SELENIUM_HOST}:4444/wd/hub`)  // Esto apunta al contenedor Docker de Selenium
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('paginaprincipaltest', async function () {
    await driver.get(`${BASE_URL}/`);
    await driver.manage().window().setRect({ width: 1382, height: 736 });

    // Esperar a que la página cargue productos antes de interactuar
    await driver.wait(until.elementLocated(By.css(".producto")), 30000);

    // Interactuar con los elementos
    await clickWhenVisible(driver, By.css(".producto:nth-child(1) .producto-agregar"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(3) .producto-agregar"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(11) .producto-agregar"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(14) .producto-agregar"), 30000);

    // Navegar entre secciones
    await clickWhenVisible(driver, By.css("li:nth-child(2) > .boton-menu"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(2) .producto-agregar"), 30000);

    await clickWhenVisible(driver, By.css("li:nth-child(3) > .boton-menu"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(5) .producto-agregar"), 30000);

    await clickWhenVisible(driver, By.css("li:nth-child(4) > .boton-menu"), 30000);
    await clickWhenVisible(driver, By.css(".producto:nth-child(3) .producto-agregar"), 30000);
  });
});

async function clickWhenVisible(driver, locator, timeout = 30000) {
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
