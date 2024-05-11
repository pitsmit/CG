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