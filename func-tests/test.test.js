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