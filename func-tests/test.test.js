import { test, expect } from '@playwright/test';

test('lib-circle', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/index.html');
  await page.locator('input[name="state"]').first().check();
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('0');
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.locator('input[name="fig"]').first().check();
  await page.getByLabel('Радиус:').click();
  await page.getByLabel('Радиус:').fill('100');
  await page.getByLabel('Выберите цвет фигуры').click();
  await page.getByLabel('Выберите цвет фигуры').fill('#ff0000');
  await page.getByRole('button', { name: 'Применить' }).click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('brez-ellipse-degree', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input[name="state"]').nth(1).check();
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('0');
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.getByLabel('Выберите цвет фигуры').click();
  await page.getByLabel('Выберите цвет фигуры').fill('#ea0b0b');
  await page.getByText('Шаг изменения радиуса:').click();
  await page.locator('input[name="rdelta"]').click();
  await page.locator('input[name="rdelta"]').fill('10');
  await page.locator('input[name="countfig"]').click();
  await page.locator('input[name="countfig"]').fill('20');
  await page.locator('input[name="fig"]').nth(1).check();
  await page.getByLabel('A(по горизонтали):').click();
  await page.getByLabel('A(по горизонтали):').fill('10');
  await page.getByLabel('B(по вертикали):').click();
  await page.getByLabel('B(по вертикали):').fill('15');
  await page.getByRole('button', { name: 'Применить' }).click();

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('param-ellipse-degree', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/degree_researchers.html');
  await page.locator('input[name="state"]').nth(3).check();
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('0');
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.locator('input[name="rdelta"]').click();
  await page.locator('input[name="rdelta"]').fill('20');
  await page.locator('input[name="countfig"]').click();
  await page.locator('input[name="countfig"]').click();
  await page.locator('input[name="countfig"]').click();
  await page.locator('input[name="countfig"]').fill('20');
  await page.locator('input[name="fig"]').nth(1).check();
  await page.getByLabel('A(по горизонтали):').click();
  await page.getByLabel('A(по горизонтали):').fill('5');
  await page.getByLabel('B(по вертикали):').click();
  await page.getByLabel('B(по вертикали):').fill('30');
  await page.getByRole('button', { name: 'Применить' }).click();

  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('canon-circle-degree', async ({ page }) => {
  var t0 = performance.now();

  await page.goto('file:///C:/Users/User/Desktop/uni/CG/out/index.html');
  await page.getByRole('link', { name: '2' }).click();
  await page.locator('input[name="state"]').nth(2).check();
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('0');
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.locator('input[name="rdelta"]').click();
  await page.locator('input[name="rdelta"]').fill('10');
  await page.locator('input[name="countfig"]').click();
  await page.locator('input[name="countfig"]').fill('10');
  await page.locator('input[name="fig"]').first().check();
  await page.getByLabel('Радиус:').click();
  await page.getByLabel('Радиус:').fill('30');
  await page.getByRole('button', { name: 'Применить' }).click();

  await page.screenshot({ path: './results/4.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});