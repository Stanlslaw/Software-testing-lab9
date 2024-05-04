import { assert } from "chai";
import { Builder, By, until } from 'selenium-webdriver';

const newsEmailTest = async (incorrectEmail) => {
  const webdriver = await new Builder().forBrowser('chrome').build();
  try {
    await webdriver.manage().window().maximize();
    await webdriver.get('https://pentagon.by/');

    // // Поиск родительского div по классу
    const parentDiv = await webdriver.wait(until.elementLocated(By.xpath('//div[@class="acymailing_fulldiv"]')),5000);

// Поиск элемента input email внутри родительского div
    const inputEmail = parentDiv.findElement(By.xpath('.//input[@name="user[email]"]'));

// Поиск кнопки по имени внутри родительского div
    const submitButton = parentDiv.findElement(By.xpath('.//input[@name="Submit"]'));

    await inputEmail.sendKeys(incorrectEmail);
    await submitButton.click();
    await webdriver.wait((until.alertIsPresent()),1000);

    const alertText = await webdriver.switchTo().alert().getText()

    await webdriver.switchTo().alert().dismiss()
    await webdriver.quit();
    return alertText === 'Please enter a valid e-mail address';
  } catch (err) {
    await webdriver.quit();
    console.log(err)
    return false;
  }
}

describe('Email input test', () => {
  it('should summon alert for empty email', async () => {
    const result = await newsEmailTest(" ");
    assert.isTrue(result);
  })
  it('should summon alert for incorrect email', async () => {
    const result = await newsEmailTest("swofford.mail.com");
    assert.isTrue(result);
  })
  it('should reload page for correct email', async () => {
    const result = await newsEmailTest("swofford@mail.com");
    assert.isFalse(result);
  })
})
