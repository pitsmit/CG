import { test } from '@playwright/test';

test('Отсекаемый внутри отсекателя', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('#container').click({
    position: {
      x: 598,
      y: 169
    }
  });
  await page.locator('#container').click({
    position: {
      x: 567,
      y: 444
    }
  });
  await page.locator('#container').click({
    position: {
      x: 786,
      y: 416
    }
  });
  await page.locator('#container').click({
    position: {
      x: 763,
      y: 186
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 558,
      y: 105
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 493,
      y: 553
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 904,
      y: 522
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 878,
      y: 67
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Отсекаемый и отсекатель не пересекаются', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('#container').click({
    position: {
      x: 608,
      y: 169
    }
  });
  await page.locator('#container').click({
    position: {
      x: 533,
      y: 512
    }
  });
  await page.locator('#container').click({
    position: {
      x: 762,
      y: 448
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 970,
      y: 206
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 933,
      y: 508
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 1109,
      y: 459
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Что-то напоминающее новогоднюю ёлку', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 711,
      y: 109
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 568,
      y: 515
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 933,
      y: 544
    }
  });
  await page.locator('#container').click({
    position: {
      x: 650,
      y: 134
    }
  });
  await page.locator('#container').click({
    position: {
      x: 864,
      y: 140
    }
  });
  await page.locator('#container').click({
    position: {
      x: 630,
      y: 233
    }
  });
  await page.locator('#container').click({
    position: {
      x: 840,
      y: 250
    }
  });
  await page.locator('#container').click({
    position: {
      x: 570,
      y: 291
    }
  });
  await page.locator('#container').click({
    position: {
      x: 917,
      y: 284
    }
  });
  await page.locator('#container').click({
    position: {
      x: 503,
      y: 352
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1067,
      y: 349
    }
  });
  await page.locator('#container').click({
    position: {
      x: 440,
      y: 417
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1084,
      y: 399
    }
  });
  await page.locator('#container').click({
    position: {
      x: 458,
      y: 496
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1063,
      y: 493
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('тестирование других цветов', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);

  await page.getByLabel('Выберите цвет отсекаемого').click();
  await page.getByLabel('Выберите цвет отсекаемого').fill('#1100ff');
  await page.getByLabel('Выберите цвет отсекателя').click();
  await page.getByLabel('Выберите цвет отсекателя').fill('#ff0000');
  await page.getByLabel('Выберите цвет результата').click();
  await page.getByLabel('Выберите цвет результата').fill('#fff700');
  await page.getByText('Выберите цвет отсекаемого Выберите цвет отсекателя Выберите цвет результата Отсе').click();
  await page.locator('#container').click({
    position: {
      x: 595,
      y: 120
    }
  });
  await page.locator('#container').click({
    position: {
      x: 572,
      y: 445
    }
  });
  await page.locator('#container').click({
    position: {
      x: 856,
      y: 240
    }
  });
  await page.locator('#container').click({
    position: {
      x: 839,
      y: 128
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 467,
      y: 248
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 1003,
      y: 138
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 744,
      y: 451
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 496,
      y: 376
    }
  });

  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/4.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});