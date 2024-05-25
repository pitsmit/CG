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