import { test } from '@playwright/test';

test('FillRect', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('0');
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.getByRole('button', { name: 'Добавить точку' }).click();
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('100');
  await page.getByRole('button', { name: 'Добавить точку' }).click();
  await page.locator('input[name="x"]').click();
  await page.locator('input[name="x"]').fill('100');
  await page.getByRole('button', { name: 'Добавить точку' }).click();
  await page.locator('input[name="y"]').click();
  await page.locator('input[name="y"]').fill('0');
  await page.getByRole('button', { name: 'Добавить точку' }).click();
  await page.getByRole('button', { name: 'Закрасить' }).click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('почти круг', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('canvas').click({
    position: {
      x: 634,
      y: 266
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 617,
      y: 281
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 617,
      y: 294
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 616,
      y: 308
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 619,
      y: 325
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 631,
      y: 336
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 650,
      y: 341
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 664,
      y: 341
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 677,
      y: 337
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 686,
      y: 326
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 688,
      y: 305
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 686,
      y: 285
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 682,
      y: 269
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 673,
      y: 262
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 652,
      y: 258
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 643,
      y: 257
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 637,
      y: 259
    }
  });
  await page.getByRole('button', { name: 'Закрасить' }).click();
  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Песочные часы или буква Z', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('canvas').click({
    position: {
      x: 591,
      y: 253
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 696,
      y: 252
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 586,
      y: 352
    }
  });
  await page.locator('canvas').click({
    position: {
      x: 692,
      y: 361
    }
  });
  await page.getByRole('button', { name: 'Закрасить' }).click();
  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});