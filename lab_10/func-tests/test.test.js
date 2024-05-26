import { test } from '@playwright/test';

test('cos(x * z)', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByRole('button', { name: 'Построить' }).click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('sin(x) * cos(z)', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByLabel('sin(x) * cos(z)').check();
  await page.locator('#fromx').click();
  await page.locator('#fromx').fill('-20');
  await page.locator('#tox').click();
  await page.locator('#tox').fill('20');
  await page.getByRole('button', { name: 'Построить' }).click();
  await page.locator('#rotatey').click();
  await page.locator('#rotatey').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('log(x) * log(z)', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByLabel('log(x) * log(z)').check();
  await page.getByLabel('Выберите цвет результата').click();
  await page.getByLabel('Выберите цвет результата').fill('#ff0000');
  await page.getByText('Выберите цвет результата Выбрать функцию отрисовки: cos(x * z) sin(x) * cos(z)').click();
  await page.getByRole('button', { name: 'Построить' }).click();
  await page.locator('#rotatey').click();
  await page.locator('#rotatex').click({
    clickCount: 3
  });
  await page.locator('#rotatez').click({
    clickCount: 3
  });
  await page.locator('#rotatey').click({
    clickCount: 4
  });
  await page.locator('#rotatex').click({
    clickCount: 4
  });
  await page.locator('#rotatex').click({
    clickCount: 3
  });
  await page.locator('#rotatex').click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatey').dblclick();
  await page.locator('#rotatey').click();

  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('sin(x + z)', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByLabel('sin(x + z)').check();
  await page.getByRole('button', { name: 'Построить' }).click();
  await page.locator('#rotatex').click();
  await page.locator('#rotatey').click();
  await page.locator('#rotatey').click();
  await page.locator('#rotatex').dblclick();

  await page.screenshot({ path: './results/4.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});