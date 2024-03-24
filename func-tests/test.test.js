import { test, expect } from '@playwright/test';

test('библиотечная функция построения', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/index.html');
  await page.getByRole('link', { name: '2' }).click();
  await page.locator('input').first().check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('300');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/1.png', fullPage: true});
});



test('Алгоритм ЦДА', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input:nth-child(8)').check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('200');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/2.png', fullPage: true});
});


test('Брезенхем с действительными числами', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input:nth-child(11)').check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('200');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/3.png', fullPage: true});
});


test('Брезенхем с целыми числами', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input:nth-child(14)').check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('200');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/4.png', fullPage: true});
});


test('Брезенхем с устранением ступенчатости', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input:nth-child(17)').check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('200');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/5.png', fullPage: true});
});


test('Алгоритм ВУ', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input:nth-child(20)').check();
  await page.locator('input[name="len"]').click();
  await page.locator('input[name="len"]').fill('200');
  await page.locator('input[name="shag"]').click();
  await page.locator('input[name="shag"]').fill('5');
  await page.getByLabel('Выберите цвет отрезка').click();
  await page.getByLabel('Выберите цвет отрезка').fill('#ff0000');
  await page.getByLabel('Выберите цвет фона').click();
  await page.getByLabel('Выберите цвет фона').fill('#000000');
  await page.getByRole('button', { name: 'Применить' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);
  await page.screenshot({ path: './results/6.png', fullPage: true});
});


test('Исследование временных характеристик', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/timers_diagrams.html');
  await page.getByRole('button', { name: 'Получить данные о временных характеристиках' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);

  await page.screenshot({ path: './results/7.png', fullPage: true});
});


test('Исследование ступенчатых характеристик', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/step_researchers.html');
  await page.getByRole('textbox').click();
  await page.getByRole('textbox').fill('30');
  await page.getByRole('button', { name: 'Получить данные о ступенчатых характеристиках' }).click();
  

  var t1 = performance.now();
  console.log(t1 - t0);

  await page.screenshot({ path: './results/8.png', fullPage: true});
});