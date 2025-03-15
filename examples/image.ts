import got from 'got';
import { Jimp, RGBAColor, intToRGBA } from 'jimp';
import chalk from 'chalk';

import { StridedView } from '../src/index';

const PIXEL = '\u2584';
const terminalColumns = process.stdout.columns || 80;
displayImage('https://sindresorhus.com/unicorn');

async function displayImage(url: string) {
  const buffer = await got(url).buffer();
  const image = await Jimp.fromBuffer(Buffer.from(buffer));

  let { width, height } = image.bitmap;
  if (width > terminalColumns) {
    height = Math.floor((height * terminalColumns) / width);
    width = terminalColumns;
    image.resize({ w: width, h: height });
  }

  const view = StridedView.of<RGBAColor>([], [width, height])
    .update((_, [x, y]) => intToRGBA(image.getPixelColor(x, y)))
    .floodFill([0, 0], { r: 0, g: 0, b: 255, a: 255 }, 4, (t, c) =>
      sameColor(t, c, 60)
    )
    .flip()
    .floodFill([0, 0], { r: 0, g: 0, b: 255, a: 255 }, 4, (t, c) =>
      sameColor(t, c, 60)
    );

  const output = StridedView.of<string>([], [width, ~~(height / 2)]).map(
    (_, [x, y]) => {
      const t = view.get(x, y * 2)!;
      const b = view.get(x, y * 2 + 1)!;
      return pixelsToChar(t, b);
    }
  );

  console.log(output.join(''));
}

function pixelsToChar(top: RGBAColor, bottom: RGBAColor): string {
  if (!top || !bottom) return ' ';
  const { r, g, b, a } = top;
  const { r: r2, g: g2, b: b2 } = bottom;
  return a === 0 ? ' ' : chalk.bgRgb(r, g, b).rgb(r2, g2, b2)(PIXEL);
}

function sameColor(a: RGBAColor, b: RGBAColor, tolarance: number): boolean {
  if (!a || !b) return false;
  return (
    Math.abs(a.r - b.r) <= tolarance &&
    Math.abs(a.g - b.g) <= tolarance &&
    Math.abs(a.b - b.b) <= tolarance
  );
}
