import { StridedView } from '../src/index';

const S = 15;

const sub = StridedView.empty<string>([S, S])
  .map<string>((_, [x, y]) => (Math.sqrt(x * x + y * y) < S * 0.5 ? '*' : ' '))
  .rotate90()
  .rotate90();
const full = StridedView.empty<string>([2 * S, 2 * S]);

full.place(sub, [0, 0]);
full.place(sub.flip(), [S, 0]);
full.place(sub.flip(1), [0, S]);
full.place(sub.flip(1).flip(), [S, S]);

console.log(full.join(''));
