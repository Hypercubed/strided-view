import { StridedView } from '../src/index';

const H = 13;
const W = 50;

const full = StridedView.empty<string>([W, H]).fill(':');
full.scale([1, 2]).fill('#');
full.slice([1, 0], [20, H / 2]).fill(' ');
full
  .slice([1, 0], [19, H / 2])
  .update((_, [x, y]) => ((x + y) % 2 === 0 ? '*' : ' '));
full.col(0).fill('|');

console.log(full.join(''));
