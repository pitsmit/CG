import { test } from '@playwright/test';

test('Обычный тест', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByRole('button', { name: 'Показать отсекатель' }).click();
  await page.locator('#container').click({
    position: {
      x: 534,
      y: 250
    }
  });
  await page.locator('#container').click({
    position: {
      x: 843,
      y: 257
    }
  });
  await page.locator('#container').click({
    position: {
      x: 660,
      y: 92
    }
  });
  await page.locator('#container').click({
    position: {
      x: 665,
      y: 415
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Все внутри', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByRole('button', { name: 'Показать отсекатель' }).click();
  await page.locator('#container').click({
    position: {
      x: 634,
      y: 168
    }
  });
  await page.locator('#container').click({
    position: {
      x: 694,
      y: 168
    }
  });
  await page.locator('#container').click({
    position: {
      x: 642,
      y: 188
    }
  });
  await page.locator('#container').click({
    position: {
      x: 696,
      y: 191
    }
  });
  await page.locator('#container').click({
    position: {
      x: 649,
      y: 216
    }
  });
  await page.locator('#container').click({
    position: {
      x: 691,
      y: 225
    }
  });
  await page.locator('#container').click({
    position: {
      x: 637,
      y: 258
    }
  });
  await page.locator('#container').click({
    position: {
      x: 689,
      y: 274
    }
  });
  await page.locator('#container').click({
    position: {
      x: 638,
      y: 296
    }
  });
  await page.locator('#container').click({
    position: {
      x: 684,
      y: 320
    }
  });
  await page.locator('#container').click({
    position: {
      x: 641,
      y: 334
    }
  });
  await page.locator('#container').click({
    position: {
      x: 713,
      y: 347
    }
  });
  await page.locator('#container').click({
    position: {
      x: 668,
      y: 193
    }
  });
  await page.locator('#container').click({
    position: {
      x: 670,
      y: 288
    }
  });
  await page.locator('#container').click({
    position: {
      x: 701,
      y: 199
    }
  });
  await page.locator('#container').click({
    position: {
      x: 715,
      y: 287
    }
  });
  await page.locator('#container').click({
    position: {
      x: 656,
      y: 196
    }
  });
  await page.locator('#container').click({
    position: {
      x: 639,
      y: 301
    }
  });
  await page.locator('#container').click({
    position: {
      x: 685,
      y: 209
    }
  });
  await page.locator('#container').click({
    position: {
      x: 660,
      y: 312
    }
  });
  await page.locator('#container').click({
    position: {
      x: 704,
      y: 261
    }
  });
  await page.locator('#container').click({
    position: {
      x: 679,
      y: 322
    }
  });
  await page.locator('#container').click({
    position: {
      x: 702,
      y: 310
    }
  });
  await page.locator('#container').click({
    position: {
      x: 671,
      y: 329
    }
  });
  await page.locator('#container').click({
    position: {
      x: 689,
      y: 186
    }
  });
  await page.locator('#container').click({
    position: {
      x: 652,
      y: 184
    }
  });
  await page.locator('#container').click({
    position: {
      x: 672,
      y: 167
    }
  });
  await page.locator('#container').click({
    position: {
      x: 646,
      y: 236
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('отрезки проходят по диагонали', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByRole('button', { name: 'Показать отсекатель' }).click();
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('100');
  await page.locator('input[name="yk"]').click();
  await page.locator('input[name="yk"]').fill('200');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.locator('input[name="yn"]').click();
  await page.locator('input[name="yn"]').fill('200');
  await page.locator('input[name="yk"]').click();
  await page.locator('input[name="yk"]').fill('0');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Горизонтальные и вертикальные отрезки', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.getByRole('button', { name: 'Показать отсекатель' }).click();
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('100');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('0');
  await page.locator('input[name="yk"]').click();
  await page.locator('input[name="yk"]').fill('200');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/4.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});