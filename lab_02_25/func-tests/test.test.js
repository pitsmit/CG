import { test } from '@playwright/test';

test('CheckMove', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.screenshot({ path: './results/1-before.png', fullPage: true});
  await page.locator('input[name="dx"]').click();
  await page.locator('input[name="dx"]').fill('10');
  await page.locator('input[name="dy"]').click();
  await page.locator('input[name="dy"]').fill('20');
  await page.locator('#mover').getByRole('button', { name: 'Применить' }).click({
    clickCount: 3
  });
  await page.locator('#mover').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#mover').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#mover').getByRole('button', { name: 'Применить' }).dblclick();
  await page.locator('input[name="dy"]').click();
  await page.locator('input[name="dy"]').press('ArrowLeft');
  await page.locator('input[name="dy"]').press('ArrowLeft');
  await page.locator('input[name="dy"]').fill('-20');
  await page.locator('input[name="dx"]').click();
  await page.locator('input[name="dx"]').press('ArrowLeft');
  await page.locator('input[name="dx"]').press('ArrowLeft');
  await page.locator('input[name="dx"]').fill('-10');
  await page.locator('#mover').getByRole('button', { name: 'Применить' }).click({
    clickCount: 4
  });

  await page.screenshot({ path: './results/1-after.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('scalingBigSmall', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.screenshot({ path: './results/2-before.png', fullPage: true});
  await page.locator('#scaling input[name="x"]').click();
  await page.locator('#scaling input[name="x"]').fill('0');
  await page.locator('#scaling input[name="y"]').click();
  await page.locator('#scaling input[name="y"]').fill('0');
  await page.locator('input[name="kx"]').click();
  await page.locator('input[name="kx"]').fill('2');
  await page.locator('input[name="ky"]').click();
  await page.locator('input[name="ky"]').fill('2');
  await page.locator('#scaling').getByRole('button', { name: 'Применить' }).click();
  await page.locator('input[name="kx"]').click();
  await page.locator('input[name="kx"]').fill('0.5');
  await page.locator('input[name="ky"]').click();
  await page.locator('input[name="ky"]').fill('0.5');
  await page.locator('#scaling').getByRole('button', { name: 'Применить' }).click();
  await page.screenshot({ path: './results/2-after.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('ScaleReverse', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.screenshot({ path: './results/3-before.png', fullPage: true});
  await page.locator('#scaling input[name="x"]').click();
  await page.locator('#scaling input[name="x"]').fill('0');
  await page.locator('#scaling input[name="y"]').click();
  await page.locator('#scaling input[name="y"]').fill('0');
  await page.locator('input[name="kx"]').click();
  await page.locator('input[name="kx"]').fill('-1');
  await page.locator('input[name="ky"]').click();
  await page.locator('input[name="ky"]').fill('-1');
  await page.locator('#scaling').getByRole('button', { name: 'Применить' }).click();
  await page.screenshot({ path: './results/3-after.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Rotate36by10', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.screenshot({ path: './results/4-before.png', fullPage: true});
  await page.locator('#rotator input[name="x"]').click();
  await page.locator('#rotator input[name="x"]').fill('0');
  await page.locator('#rotator input[name="y"]').click();
  await page.locator('#rotator input[name="y"]').fill('0');
  await page.locator('input[name="q"]').click();
  await page.locator('input[name="q"]').fill('10');
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.screenshot({ path: './results/4-after.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('ScaleAndRotate10by36', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.screenshot({ path: './results/5-before.png', fullPage: true});
  await page.locator('#scaling input[name="x"]').click();
  await page.locator('#scaling input[name="x"]').fill('0');
  await page.locator('#scaling input[name="y"]').click();
  await page.locator('#scaling input[name="y"]').fill('0');
  await page.locator('input[name="kx"]').click();
  await page.locator('input[name="kx"]').fill('2');
  await page.locator('input[name="ky"]').click();
  await page.locator('input[name="ky"]').fill('2');
  await page.locator('#scaling').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator input[name="x"]').click();
  await page.locator('#rotator input[name="x"]').fill('0');
  await page.locator('#rotator input[name="y"]').click();
  await page.locator('#rotator input[name="y"]').fill('0');
  await page.locator('input[name="q"]').click();
  await page.locator('input[name="q"]').fill('-36');
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.locator('#rotator').getByRole('button', { name: 'Применить' }).click();
  await page.screenshot({ path: './results/5-after.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});