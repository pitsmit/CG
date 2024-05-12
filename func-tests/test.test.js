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