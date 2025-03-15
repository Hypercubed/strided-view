import { StridedView } from '../src/index';

{
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const view = StridedView.of(data, [2, 5]);

  console.log(view.toArrays());
}

{
  const data = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10]
  ];
  const view = StridedView.from(data);

  console.log(view.toArrays());
}

{
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const view = StridedView.of(data, [2, 5]);

  view.set(0, 0, 100);
  view.forEach((value, [x, y]) => {
    console.log(`view[${x}, ${y}] = ${value}`);
  });
}

{
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const view = StridedView.of(data, [2, 5]);

  console.log(view.flip().toString());
}

{
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const view = StridedView.of(data, [2, 5]);

  const copy = view.copy();
  const mapped = view.map((value, [x, y]) => value * 2);
}
