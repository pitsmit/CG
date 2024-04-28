import { test } from '@playwright/test';

test('Рандомная абстракция', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('0');
  await page.locator('input[name="ycir"]').click();
  await page.locator('input[name="ycir"]').fill('0');
  await page.locator('input[name="rcir"]').click();
  await page.locator('input[name="rcir"]').fill('200');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('#container').click({
    position: {
      x: 458,
      y: 98
    }
  });
  await page.locator('#container').click({
    position: {
      x: 613,
      y: 389
    }
  });
  await page.locator('#container').click({
    position: {
      x: 949,
      y: 378
    }
  });
  await page.locator('#container').click({
    position: {
      x: 986,
      y: 141
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1008,
      y: 414
    }
  });
  await page.locator('#container').click({
    position: {
      x: 756,
      y: 565
    }
  });
  await page.locator('#container').click({
    position: {
      x: 482,
      y: 546
    }
  });
  await page.locator('#container').click({
    position: {
      x: 485,
      y: 360
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 642,
      y: 463
    }
  });
  await page.getByRole('button', { name: 'Закрасить' }).click();

  await new Promise(resolve => setTimeout(resolve, 9000));

  await page.screenshot({ path: './results/1.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0 - 9000);
});

test('Пчелиные соты', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('0');
  await page.locator('input[name="ycir"]').click();
  await page.locator('input[name="ycir"]').fill('0');
  await page.locator('input[name="rcir"]').click();
  await page.locator('input[name="rcir"]').fill('50');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('100');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('200');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="ycir"]').click();
  await page.locator('input[name="ycir"]').fill('100');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('100');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="xcir"]').click();
  await page.locator('input[name="xcir"]').fill('0');
  await page.getByRole('button', { name: 'Построить окружность' }).click();
  await page.locator('input[name="x"]').click();
  await page.locator('#container').click({
    position: {
      x: 491,
      y: 122
    }
  });
  await page.locator('#container').click({
    position: {
      x: 483,
      y: 497
    }
  });
  await page.locator('#container').click({
    position: {
      x: 1002,
      y: 501
    }
  });
  await page.locator('#container').click({
    position: {
      x: 976,
      y: 112
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 520,
      y: 256
    }
  });
  await page.getByRole('button', { name: 'Закрасить' }).click();

  await new Promise(resolve => setTimeout(resolve, 9000));

  await page.screenshot({ path: './results/2.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0 - 9000);
});


test('Динозавр', async ({ page }) => {
  var t0 = performance.now();

  await page.goto(`file://${__dirname}/../out/index.html`);
  await page.locator('#container').click({
    position: {
      x: 443,
      y: 562
    }
  });
  await page.locator('#container').click({
    position: {
      x: 466,
      y: 291
    }
  });
  await page.locator('#container').click({
    position: {
      x: 483,
      y: 347
    }
  });
  await page.locator('#container').click({
    position: {
      x: 538,
      y: 182
    }
  });
  await page.locator('#container').click({
    position: {
      x: 534,
      y: 315
    }
  });
  await page.locator('#container').click({
    position: {
      x: 646,
      y: 125
    }
  });
  await page.locator('#container').click({
    position: {
      x: 610,
      y: 255
    }
  });
  await page.locator('#container').click({
    position: {
      x: 724,
      y: 101
    }
  });
  await page.locator('#container').click({
    position: {
      x: 701,
      y: 237
    }
  });
  await page.locator('#container').click({
    position: {
      x: 791,
      y: 157
    }
  });
  await page.locator('#container').click({
    position: {
      x: 746,
      y: 287
    }
  });
  await page.locator('#container').click({
    position: {
      x: 829,
      y: 240
    }
  });
  await page.locator('#container').click({
    position: {
      x: 763,
      y: 392
    }
  });
  await page.locator('#container').click({
    position: {
      x: 848,
      y: 358
    }
  });
  await page.locator('#container').click({
    position: {
      x: 735,
      y: 499
    }
  });
  await page.locator('#container').click({
    button: 'right',
    position: {
      x: 607,
      y: 352
    }
  });
  await page.locator('#container').click();
  await page.getByRole('button', { name: 'Закрасить' }).click();

  await new Promise(resolve => setTimeout(resolve, 9000));
  await page.screenshot({ path: './results/3.png', fullPage: true});

  var t1 = performance.now();
  console.log(t1 - t0 - 9000);
});