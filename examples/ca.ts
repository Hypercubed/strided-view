import { StridedView } from '../src/index';

let field = StridedView.random([60, 30], () => (Math.random() < 0.4 ? 1 : 0));

let i = 0;
console.log('Cellular automaton');
console.log();

const born = [5, 6, 7, 8];
const survive = [4, 5, 6, 7, 8];

while (i < 8) {
  i++;
  next();
}

console.log(field.map(v => (v ? '.' : '#')).join(''));

function next() {
  field = field.map((c, [x, y]) => {
    const n = field
      .neighborhood([x, y])
      .reduce((acc, v) => (v ? acc + 1 : acc), c ? -1 : 0 /* subtract self */);

    if (c) {
      if (survive.includes(n)) return 1;
    } else {
      if (born.includes(n)) return 1;
    }
    return c;
  });
}
