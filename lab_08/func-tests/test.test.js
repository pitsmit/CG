import { test } from '@playwright/test';

test('Что то похожее на правильный пятиугольник и рандомные отрезки', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);

  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 516,
      y: 146
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 530,
      y: 546
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 910,
      y: 434
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 989,
      y: 155
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 844,
      y: 73
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 714,
      y: 60
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 598,
      y: 69
    }
  });
  await page.locator('#container').click({
    position: {
      x: 565,
      y: 586
    }
  });
  await page.locator('#container').click({
    position: {
      x: 730,
      y: 319
    }
  });
  await page.locator('#container').click({
    position: {
      x: 768,
      y: 540
    }
  });
  await page.locator('#container').click({
    position: {
      x: 843,
      y: 141
    }
  });
  await page.locator('#container').click({
    position: {
      x: 949,
      y: 524
    }
  });
  await page.locator('#container').click({
    position: {
      x: 888,
      y: 160
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1032,
      y: 244
    }
  });
  await page.locator('#container').click({
    position: {
      x: 631,
      y: 301
    }
  });
  await page.locator('#container').click({
    position: {
      x: 913,
      y: 66
    }
  });
  await page.locator('#container').click({
    position: {
      x: 443,
      y: 429
    }
  });
  await page.locator('#container').click({
    position: {
      x: 464,
      y: 262
    }
  });
  await page.locator('#container').click({
    position: {
      x: 905,
      y: 575
    }
  });
  await page.locator('#container').click({
    position: {
      x: 484,
      y: 257
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1028,
      y: 200
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1000,
      y: 76
    }
  });
  await page.locator('#container').click({
    position: {
      x: 513,
      y: 522
    }
  });
  await page.locator('#container').click({
    position: {
      x: 947,
      y: 480
    }
  });
  await page.locator('#container').click({
    position: {
      x: 479,
      y: 196
    }
  });
  await page.locator('#container').click({
    position: {
      x: 774,
      y: 30
    }
  });
  await page.locator('#container').click({
    position: {
      x: 704,
      y: 559
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Отсекатель - треугольник, все отрезки +- горизонтальные', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);

  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 519,
      y: 475
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 757,
      y: 127
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 982,
      y: 485
    }
  });
  await page.locator('#container').click({
    position: {
      x: 659,
      y: 157
    }
  });
  await page.locator('#container').click({
    position: {
      x: 949,
      y: 173
    }
  });
  await page.locator('#container').click({
    position: {
      x: 591,
      y: 197
    }
  });
  await page.locator('#container').click({
    position: {
      x: 899,
      y: 206
    }
  });
  await page.locator('#container').click({
    position: {
      x: 563,
      y: 250
    }
  });
  await page.locator('#container').click({
    position: {
      x: 915,
      y: 248
    }
  });
  await page.locator('#container').click({
    position: {
      x: 557,
      y: 295
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1018,
      y: 306
    }
  });
  await page.locator('#container').click({
    position: {
      x: 432,
      y: 333
    }
  });
  await page.locator('#container').click({
    position: {
      x: 981,
      y: 329
    }
  });
  await page.locator('#container').click({
    position: {
      x: 526,
      y: 375
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1115,
      y: 372
    }
  });
  await page.locator('#container').click({
    position: {
      x: 478,
      y: 421
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1047,
      y: 426
    }
  });
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('100');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Идеально вертикальные и горизонтальные отрезки', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('100');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.locator('input[name="xk"]').click();
  await page.locator('input[name="xk"]').fill('0');
  await page.locator('input[name="yk"]').click();
  await page.locator('input[name="yk"]').fill('100');
  await page.getByRole('button', { name: 'Добавить отрезок' }).click();
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 543,
      y: 227
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 533,
      y: 458
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 710,
      y: 294
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 715,
      y: 142
    }
  });

  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});


test('Тест других цветов просто', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);

  await page.getByLabel('Выберите цвет отрезков').click();
  await page.getByLabel('Выберите цвет отрезков').fill('#ffd500');
  await page.getByText('Выберите цвет отрезков Выберите цвет отсекателя Выберите цвет результата -------').click();
  await page.getByLabel('Выберите цвет отсекателя').click();
  await page.getByLabel('Выберите цвет отсекателя').fill('#0011ff');
  await page.getByText('Выберите цвет отрезков Выберите цвет отсекателя Выберите цвет результата -------').click();
  await page.getByLabel('Выберите цвет результата').click();
  await page.getByLabel('Выберите цвет результата').fill('#ff0000');
  await page.getByText('Выберите цвет отрезков Выберите цвет отсекателя Выберите цвет результата -------').click();
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 563,
      y: 160
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 562,
      y: 518
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 950,
      y: 373
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 932,
      y: 77
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 730,
      y: 68
    }
  });
  await page.locator('#container').click({
    position: {
      x: 509,
      y: 338
    }
  });
  await page.locator('#container').click({
    position: {
      x: 984,
      y: 252
    }
  });
  await page.locator('#container').click({
    position: {
      x: 519,
      y: 250
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1027,
      y: 161
    }
  });
  await page.locator('#container').click({
    position: {
      x: 955,
      y: 46
    }
  });
  await page.locator('#container').click({
    position: {
      x: 801,
      y: 500
    }
  });
  await page.locator('#container').click({
    position: {
      x: 854,
      y: 106
    }
  });
  await page.locator('#container').click({
    position: {
      x: 771,
      y: 531
    }
  });
  await page.locator('#container').click({
    position: {
      x: 526,
      y: 545
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1070,
      y: 535
    }
  });
  await page.locator('#container').click({
    position: {
      x: 538,
      y: 438
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1166,
      y: 363
    }
  });
  await page.locator('#container').click({
    position: {
      x: 555,
      y: 398
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1025,
      y: 232
    }
  });
  await page.locator('#container').click({
    position: {
      x: 424,
      y: 293
    }
  });
  await page.locator('#container').click({
    position: {
      x: 528,
      y: 587
    }
  });
  await page.locator('#container').click({
    position: {
      x: 572,
      y: 217
    }
  });
  await page.locator('#container').click({
    position: {
      x: 669,
      y: 601
    }
  });
  await page.locator('#container').click({
    position: {
      x: 691,
      y: 214
    }
  });
  await page.locator('#container').click({
    position: {
      x: 782,
      y: 654
    }
  });
  await page.locator('#container').click({
    position: {
      x: 804,
      y: 177
    }
  });
  await page.locator('#container').click({
    position: {
      x: 915,
      y: 546
    }
  });
  await page.locator('#container').click({
    position: {
      x: 884,
      y: 202
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1025,
      y: 526
    }
  });
  await page.locator('#container').click({
    position: {
      x: 505,
      y: 226
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1007,
      y: 181
    }
  });
  await page.getByRole('button', { name: 'Отсечь' }).click();

  await page.screenshot({ path: './results/4.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0);
});