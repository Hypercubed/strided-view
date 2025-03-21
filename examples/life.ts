import { StridedView } from '../src/index';

let field = StridedView.zeros([12, 12]);
const square = StridedView.of([1, 1, 1, 1, 1, 1, 1, 1, 1], [3, 3]); // 3x3 square

field.place(square, [3, 3]);
field.place(square, [6, 6]);

let i = 0;
console.log('Figure eight');
console.log();

print();

while (i < 8) {
  i++;
  next();
  print();
}

function print() {
  console.log(`Generation ${i}`);
  console.log(field.map(v => (v ? '#' : '.')).join(''));
  console.log();
}

function next() {
  field = field.map((c, [x, y]) => {
    const neighborhood = field.findNeighborIndices([x, y]);
    const n = neighborhood.reduce((acc, [x, y]) => (field.get(x, y) ? acc + 1 : acc), 0);

    switch (n) {
      case 0:
      case 1:
        c = 0;
        break;
      case 2:
        break;
      case 3:
        c = 1;
        break;
      default:
        c = 0;
        break;
    }
    return c;
  });
}
