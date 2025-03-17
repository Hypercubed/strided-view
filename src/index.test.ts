import {
  expect,
  test,
  describe,
  assertType,
  beforeEach,
  afterEach
} from 'vitest';
import { StridedView } from './index';

let A3: number[];
let A4: number[];
let A6: number[];
// let A9: number[];
let A12: number[];
let A25: number[];
let A36: number[];

let A2x3: number[][];
// let A2x2: number[][];
let A6x6: number[][];
let DEADBEEF: string[];

let S6: string[];
let S9: string[];
let S12: string[];
let S24: string[];
let S25: string[];
let S30: string[];
let S36: string[];

const mathRandom = Math.random;

// Quick and dirty seeded random number generator
const seededRandom = (seed: number) => {
  let i = seed;
  return () => {
    i = (i * 9301 + 49297) % 233280;
    return i / 233280.0;
  };
};

beforeEach(async () => {
  DEADBEEF = 'DEADBEEF'.split('');

  A12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // A9 = A12.slice(0, 9);
  A6 = A12.slice(0, 6);
  A4 = A6.slice(0, 4);
  A3 = A4.slice(0, 3);

  // A2x2 = [[1, 2], [3, 4]];
  A2x3 = [
    [1, 2],
    [3, 4],
    [5, 6]
  ];
  A6x6 = [
    [1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30],
    [31, 32, 33, 34, 35, 36]
  ];

  A36 = A6x6.flat();
  A25 = A36.slice(0, 25);
  A12 = A36.slice(0, 12);
  // A9 = A36.slice(0, 9);
  A6 = A36.slice(0, 6);
  A4 = A36.slice(0, 4);
  A3 = A36.slice(0, 3);

  S36 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
  S30 = S36.slice(0, 30);
  S25 = S30.slice(0, 25);
  S24 = S30.slice(0, 24);
  S12 = S30.slice(0, 12);
  S9 = S30.slice(0, 9);
  S6 = S30.slice(0, 6);
});

describe('construction', () => {
  test('constructor', () => {
    const a = new StridedView<number>(A3, [2, 3]);
    expect(a.serialize()).toMatchInlineSnapshot(`
      {
        "data": [
          1,
          2,
          3,
        ],
        "offset": 0,
        "shape": [
          2,
          3,
        ],
        "stride": [
          1,
          2,
        ],
      }
    `);
  });

  test('from', () => {
    const a = StridedView.from(A2x3);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4
      5,6"
    `);
  });

  test('of', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4
      5,6"
    `);
  });

  test('range', () => {
    const a = StridedView.range([2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "0,1
      2,3
      4,5"
    `);
  });

  test('range step', () => {
    const a = StridedView.range([2, 2], 10, 3);
    expect(a.toArrays()).toMatchInlineSnapshot(`
      [
        [
          10,
          13,
        ],
        [
          16,
          19,
        ],
      ]
    `);
  });

  test('zeros', () => {
    const a = StridedView.zeros([2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "0,0
      0,0
      0,0"
    `);
  });

  test('ones', () => {
    const a = StridedView.ones([4, 2]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,1,1,1
      1,1,1,1"
    `);
  });

  test('identity', () => {
    const a = StridedView.identity(3);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,0,0
      0,1,0
      0,0,1"
    `);
  });

  test('diagonal', () => {
    const a = StridedView.diagonal(A3);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,0,0
      0,2,0
      0,0,3"
    `);
  });

  test('fill', () => {
    const a = StridedView.fill([2, 3], 'A');
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,A
      A,A
      A,A"
    `);
  });

  describe('random', () => {
    beforeEach(() => {
      Math.random = seededRandom(123);
    });

    afterEach(() => {
      Math.random = mathRandom;
    });

    test('random', () => {
      const a = StridedView.random([2, 3]);
      expect(a.toArrays()).toMatchInlineSnapshot(`
        [
          [
            0.11539780521262002,
            0.5263074417009602,
          ],
          [
            0.3968364197530864,
            0.18686128257887516,
          ],
          [
            0.20811042524005488,
            0.8463863168724279,
          ],
        ]
      `);
    });

    test('random with map', () => {
      const a = StridedView.random([2, 3]).map(v => ~~(6 * v + 1));
      expect(a.toArrays()).toMatchInlineSnapshot(`
        [
          [
            1,
            4,
          ],
          [
            3,
            2,
          ],
          [
            2,
            6,
          ],
        ]
      `);
    });
  });

  test('of TypedArray', () => {
    const data = new Int8Array(8);
    const a = StridedView.of(data, [2, 3]);
    expect(a).toMatchInlineSnapshot(`
      StridedView {
        "data": Int8Array [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
        ],
        "offset": 0,
        "shape": [
          2,
          3,
        ],
        "stride": [
          1,
          2,
        ],
      }
    `);

    a.set(0, 0, 5);
    expect(JSON.stringify(a.toArrays())).toMatchInlineSnapshot(
      `"[[5,0],[0,0],[0,0]]"`
    );
  });

  test('from strings', () => {
    // TODO: Support StridedView.from(string);

    const a = StridedView.of(DEADBEEF, [3, 2]);
    expect(JSON.stringify(a.toArrays())).toMatchInlineSnapshot(
      `"[["D","E","A"],["D","B","E"]]"`
    );

    a.set(0, 0, 'X');
    expect(a.toArrays()).toMatchInlineSnapshot(`
      [
        [
          "X",
          "E",
          "A",
        ],
        [
          "D",
          "B",
          "E",
        ],
      ]
    `);

    assertType<string>(a.get(0, 0)!);
  });
});

describe('set/get', () => {
  test('get', () => {
    const a = StridedView.range([2, 2], 1);
    expect(a.get(0, 0)).toMatchInlineSnapshot(`1`);
    expect(a.get(1, 0)).toMatchInlineSnapshot(`2`);
    expect(a.get(0, 1)).toMatchInlineSnapshot(`3`);
    expect(a.get(1, 1)).toMatchInlineSnapshot(`4`);

    assertType<number>(a.get(0, 0)!);
  });

  test('get out of bounds', () => {
    const a = StridedView.range([2, 2], 1);
    expect(a.get(-5, -5)).toMatchInlineSnapshot(`undefined`);
    expect(a.get(5, 5)).toMatchInlineSnapshot(`undefined`);
  });

  test('set', () => {
    const a = StridedView.range([2, 2], 1);
    a.set(0, 0, 10);
    a.set(1, 1, 20);
    expect(a.toString()).toMatchInlineSnapshot(`
      "10,2
      3,20"
    `);
  });

  test('set out of bounds', () => {
    const a = StridedView.range([2, 2], 1);
    expect(() => a.set(-5, -5, 10)).toThrow('Invalid index');
    expect(() => a.set(5, 5, 10)).toThrow('Invalid index');
  });

  test('set with TypedArray', () => {
    const data = new Int8Array(8);
    const a = new StridedView<number>(data, [2, 3]);
    a.set(0, 0, 10);
    a.set(1, 1, 20);
    expect(data).toMatchInlineSnapshot(`
      Int8Array [
        10,
        0,
        0,
        20,
        0,
        0,
        0,
        0,
      ]
    `);
    expect(a.toString()).toMatchInlineSnapshot(`
      "10,0
      0,20
      0,0"
    `);
  });

  test('get from TypedArray', () => {
    const data = Int16Array.of(10, 20, 30, 40, 50, 60);
    const a = new StridedView<number>(data, [2, 3]);
    expect(a.get(0, 0)).toMatchInlineSnapshot(`10`);
    expect(a.get(1, 0)).toMatchInlineSnapshot(`20`);
    expect(a.get(0, 1)).toMatchInlineSnapshot(`30`);
    expect(a.get(1, 1)).toMatchInlineSnapshot(`40`);

    assertType<number>(a.get(0, 0)!);
  });
});

// For now iGet/iSet is not exposed
// describe('iGet/iSet', () => {
//   test('iGet', () => {
//     const a = StridedView.from(A2x2).flip();

//     expect(a.toString()).toMatchInlineSnapshot(`
//       "2,1
//       4,3"
//     `);

//     expect(a.iGet(0)).toMatchInlineSnapshot(`2`);
//     expect(a.iGet(1)).toMatchInlineSnapshot(`1`);
//     expect(a.iGet(2)).toMatchInlineSnapshot(`4`);
//     expect(a.iGet(3)).toMatchInlineSnapshot(`3`);

//     assertType<number>(a.get(0, 0));
//   });

//   test('iSet', () => {
//     const a = StridedView.of(A4, [2, 2]).flip();

//     expect(a.toString()).toMatchInlineSnapshot(`
//       "2,1
//       4,3"
//     `);

//     a.iSet(0, 10);
//     a.iSet(3, 20);
//     expect(a.toString()).toMatchInlineSnapshot(`
//       "10,1
//       4,20"
//     `);

//     // should also mutates the original data
//     expect(JSON.stringify(A4)).toMatchInlineSnapshot(`"[1,10,20,4]"`);
//   });
// });

describe('conversion', () => {
  test('toArrays', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify(a.toArrays())).toMatchInlineSnapshot(
      `"[[1,2],[3,4],[5,6]]"`
    );
  });

  test('toArray', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify(a.toArray())).toMatchInlineSnapshot(
      `"[1,2,3,4,5,6]"`
    );
  });

  test('toString', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4
      5,6"
    `);
  });

  test('toJSON', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify(a)).toMatchInlineSnapshot(
      `"{"offset":0,"data":[1,2,3,4,5,6],"shape":[2,3],"stride":[1,2]}"`
    );
  });
});

describe('inspect', () => {
  test('inspect', () => {
    const a = StridedView.range([120, 120]);
    expect(a.inspect()).toMatchInlineSnapshot(`
      "[
        [0,1,...,118,119]
        [120,121,...,238,239]
        ...
        [14160,14161,...,14278,14279]
        [14280,14281,...,14398,14399]
      ]"
    `);
  });

  test('inspect', () => {
    const a = StridedView.range([12, 5]);
    expect(a.inspect()).toMatchInlineSnapshot(`
      "[
        [0,1,...,10,11]
        [12,13,...,22,23]
        [24,25,...,34,35]
        [36,37,...,46,47]
        [48,49,...,58,59]
      ]"
    `);
  });

  test('inspect', () => {
    const a = StridedView.range([5, 5]);
    expect(a.inspect()).toMatchInlineSnapshot(`
      "[
        [0,1,2,3,4]
        [5,6,7,8,9]
        [10,11,12,13,14]
        [15,16,17,18,19]
        [20,21,22,23,24]
      ]"
    `);
  });
});

describe('fill', () => {
  test('fill', () => {
    const a = StridedView.of(A6, [2, 3]);
    a.fill(0);
    expect(a.toString()).toMatchInlineSnapshot(`
      "0,0
      0,0
      0,0"
    `);
    expect(JSON.stringify(A6)).toMatchInlineSnapshot(`"[0,0,0,0,0,0]"`);
  });

  test('fill view', () => {
    const a = StridedView.of(A25, [5, 5]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4,5
      6,7,8,9,10
      11,12,13,14,15
      16,17,18,19,20
      21,22,23,24,25"
    `);

    const b = a.slice([1, 1], [3, 3]).fill(0);
    expect(b.toString()).toMatchInlineSnapshot(`
      "0,0,0
      0,0,0
      0,0,0"
    `);

    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4,5
      6,0,0,0,10
      11,0,0,0,15
      16,0,0,0,20
      21,22,23,24,25"
    `);

    // should also mutates the original data
    expect(JSON.stringify(A25)).toMatchInlineSnapshot(
      `"[1,2,3,4,5,6,0,0,0,10,11,0,0,0,15,16,0,0,0,20,21,22,23,24,25]"`
    );
  });
});

describe('floodFill', () => {
  test('floodFill', () => {
    const a = StridedView.of([], [6, 6]).map<number>((_, [x, y]) =>
      x + y < 4 ? 0 : 1
    );
    expect(a.toString()).toMatchInlineSnapshot(`
      "0,0,0,0,1,1
      0,0,0,1,1,1
      0,0,1,1,1,1
      0,1,1,1,1,1
      1,1,1,1,1,1
      1,1,1,1,1,1"
    `);

    a.floodFill([0, 0], 2);
    expect(a.toString()).toMatchInlineSnapshot(`
      "2,2,2,2,1,1
      2,2,2,1,1,1
      2,2,1,1,1,1
      2,1,1,1,1,1
      1,1,1,1,1,1
      1,1,1,1,1,1"
    `);

    a.floodFill([3, 3], 4);
    expect(a.toString()).toMatchInlineSnapshot(`
      "2,2,2,2,4,4
      2,2,2,4,4,4
      2,2,4,4,4,4
      2,4,4,4,4,4
      4,4,4,4,4,4
      4,4,4,4,4,4"
    `);
  });

  test('floodFill topology', () => {
    const a = StridedView.of([], [6, 6]).map<number>((_, [x, y]) =>
      (x + y) % 2 === 0 ? 0 : 1
    );
    expect(a.toString()).toMatchInlineSnapshot(`
      "0,1,0,1,0,1
      1,0,1,0,1,0
      0,1,0,1,0,1
      1,0,1,0,1,0
      0,1,0,1,0,1
      1,0,1,0,1,0"
    `);

    const b = a.copy().floodFill([0, 0], 2);
    expect(b.toString()).toMatchInlineSnapshot(`
      "2,1,0,1,0,1
      1,0,1,0,1,0
      0,1,0,1,0,1
      1,0,1,0,1,0
      0,1,0,1,0,1
      1,0,1,0,1,0"
    `);

    const c = a.copy().floodFill([0, 0], 2, 8);
    expect(c.toString()).toMatchInlineSnapshot(`
      "2,1,2,1,2,1
      1,2,1,2,1,2
      2,1,2,1,2,1
      1,2,1,2,1,2
      2,1,2,1,2,1
      1,2,1,2,1,2"
    `);
  });
});

describe('map', () => {
  test('map', () => {
    const a = StridedView.of(A6, [2, 3]);
    const b = a.map(v => String.fromCharCode(v + 64));

    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4
      5,6"
    `);
    expect(b.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);

    // Does not mutate the original data
    expect(JSON.stringify(A6)).toMatchInlineSnapshot(`"[1,2,3,4,5,6]"`);
  });
});

describe('update', () => {
  test('update', () => {
    const a = StridedView.from<number | string>(A2x3);
    a.update(v => String.fromCharCode(+v + 64));

    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);
  });

  test('update view', () => {
    const data = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25
    ];

    const a = StridedView.of(data, [5, 5]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4,5
      6,7,8,9,10
      11,12,13,14,15
      16,17,18,19,20
      21,22,23,24,25"
    `);

    const b = a.slice([1, 1], [3, 3]);
    expect(b.toString()).toMatchInlineSnapshot(`
      "7,8,9
      12,13,14
      17,18,19"
    `);

    const c = b.flip(0).update((_, [x, y]) => (x + y) % 10);
    expect(c.toString()).toMatchInlineSnapshot(`
      "0,1,2
      1,2,3
      2,3,4"
    `);

    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4,5
      6,2,1,0,10
      11,3,2,1,15
      16,4,3,2,20
      21,22,23,24,25"
    `);

    expect(JSON.stringify(data)).toMatchInlineSnapshot(
      `"[1,2,3,4,5,6,2,1,0,10,11,3,2,1,15,16,4,3,2,20,21,22,23,24,25]"`
    );
  });
});

describe('transpose', () => {
  test('transpose', () => {
    const a = StridedView.of(S6, [2, 3]);
    const b = a.transpose();
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);
    expect(b.toString()).toMatchInlineSnapshot(`
      "A,C,E
      B,D,F"
    `);
    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });
});

describe('reshape', () => {
  test('reshape', () => {
    const a = StridedView.of(S6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);
    expect(a.reshape([3, 2]).toString()).toMatchInlineSnapshot(`
      "A,B,C
      D,E,F"
    `);
    expect(a.reshape([6, 1]).toString()).toMatchInlineSnapshot(`"A,B,C,D,E,F"`);
    expect(a.reshape([1, 6]).toString()).toMatchInlineSnapshot(`
      "A
      B
      C
      D
      E
      F"
    `);
    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });

  test('reshape after transpose', () => {
    const a = StridedView.of(S6, [2, 3]).transpose();
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,C,E
      B,D,F"
    `);
    expect(a.reshape([2, 3]).toString()).toMatchInlineSnapshot(`
      "A,C
      E,B
      D,F"
    `);
    expect(a.reshape([6, 1]).toString()).toMatchInlineSnapshot(`"A,C,E,B,D,F"`);
    expect(a.reshape([1, 6]).toString()).toMatchInlineSnapshot(`
      "A
      C
      E
      B
      D
      F"
    `);
    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });

  test('reshape after flip', () => {
    const a = StridedView.of(S6, [2, 3]).flip();
    expect(a.toString()).toMatchInlineSnapshot(`
      "B,A
      D,C
      F,E"
    `);
    expect(a.reshape([3, 2]).toString()).toMatchInlineSnapshot(`
      "B,A,D
      C,F,E"
    `);
    expect(a.reshape([6, 1]).toString()).toMatchInlineSnapshot(`"B,A,D,C,F,E"`);
    expect(a.reshape([1, 6]).toString()).toMatchInlineSnapshot(`
      "B
      A
      D
      C
      F
      E"
    `);
    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });

  test('invalid reshape', () => {
    const a = StridedView.of(S6, [2, 3]);
    expect(() => a.reshape([3, 3])).toThrow('Invalid shape');
    expect(() => a.reshape([1, 7])).toThrow('Invalid shape');
  });
});

describe('hi/lo/slice', () => {
  test('hi', () => {
    const a = StridedView.of(S9, [3, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C
      D,E,F
      G,H,I"
    `);
    expect(a.hi([2, 3]).toString()).toMatchInlineSnapshot(`
      "A,B
      D,E
      G,H"
    `);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C
      D,E,F
      G,H,I"
    `);
    expect(JSON.stringify(S9)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F","G","H","I"]"`
    );
  });

  test('lo', () => {
    const a = StridedView.of(S12, [4, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,G,H
      I,J,K,L"
    `);
    expect(a.lo([1, 1]).toString()).toMatchInlineSnapshot(`
      "F,G,H
      J,K,L"
    `);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,G,H
      I,J,K,L"
    `);
  });

  test('slice', () => {
    const a = StridedView.of(S30, [5, 6]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      F,G,H,I,J
      K,L,M,N,O
      P,Q,R,S,T
      U,V,W,X,Y
      Z,1,2,3,4"
    `);
    expect(a.slice([2, 3], [3, 2]).toString()).toMatchInlineSnapshot(`
      "R,S,T
      W,X,Y"
    `);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      F,G,H,I,J
      K,L,M,N,O
      P,Q,R,S,T
      U,V,W,X,Y
      Z,1,2,3,4"
    `);
    expect(JSON.stringify(S30)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4"]"`
    );
  });

  test('slice without shape', () => {
    const a = StridedView.of(S30, [5, 6]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      F,G,H,I,J
      K,L,M,N,O
      P,Q,R,S,T
      U,V,W,X,Y
      Z,1,2,3,4"
    `);
    expect(a.slice([2, 3]).toString()).toMatchInlineSnapshot(`
      "R,S,T
      W,X,Y
      2,3,4"
    `);
  });
});

describe('col/row', () => {
  test('col', () => {
    const a = StridedView.of(S24, [4, 6]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,G,H
      I,J,K,L
      M,N,O,P
      Q,R,S,T
      U,V,W,X"
    `);
    expect(a.col(2).toString()).toMatchInlineSnapshot(`
      "C
      G
      K
      O
      S
      W"
    `);
    expect(JSON.stringify(S24)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X"]"`
    );
  });

  test('row', () => {
    const a = StridedView.of(S24, [4, 6]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,G,H
      I,J,K,L
      M,N,O,P
      Q,R,S,T
      U,V,W,X"
    `);
    expect(a.row(2).toString()).toMatchInlineSnapshot(`"I,J,K,L"`);
    expect(JSON.stringify(S24)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X"]"`
    );
  });
});

describe('flip', () => {
  test('X', () => {
    const a = StridedView.of(S6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);

    expect(a.flip(0).toString()).toMatchInlineSnapshot(`
      "B,A
      D,C
      F,E"
    `);

    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);

    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });

  test('Y', () => {
    const a = StridedView.of(S6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);

    expect(a.flip(1).toString()).toMatchInlineSnapshot(`
      "E,F
      C,D
      A,B"
    `);

    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F"
    `);

    expect(JSON.stringify(S6)).toMatchInlineSnapshot(
      `"["A","B","C","D","E","F"]"`
    );
  });
});

test('reverse', () => {
  const a = StridedView.of(S6, [2, 3]);
  expect(a.toString()).toMatchInlineSnapshot(`
    "A,B
    C,D
    E,F"
  `);

  expect(a.reverse().toString()).toMatchInlineSnapshot(`
    "F,E
    D,C
    B,A"
  `);

  expect(JSON.stringify(S6)).toMatchInlineSnapshot(
    `"["A","B","C","D","E","F"]"`
  );
});

test('rotate90', () => {
  const a = StridedView.of(S6, [2, 3]);
  expect(a.toString()).toMatchInlineSnapshot(`
    "A,B
    C,D
    E,F"
  `);

  expect(a.rotate90().toString()).toMatchInlineSnapshot(`
    "B,D,F
    A,C,E"
  `);

  expect(a.toString()).toMatchInlineSnapshot(`
    "A,B
    C,D
    E,F"
  `);
  expect(JSON.stringify(S6)).toMatchInlineSnapshot(
    `"["A","B","C","D","E","F"]"`
  );
});

describe('copy/view', () => {
  test('copy', () => {
    const a = StridedView.of(A12, [4, 3]);
    const b = a.copy();
    b.set(0, 0, 5);
    b.set(1, 1, 5);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((a as any).data !== (b as any).data);
    expect(a.toString() !== b.toString());
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4
      5,6,7,8
      9,10,11,12"
    `);
    expect(b.toString()).toMatchInlineSnapshot(`
      "5,2,3,4
      5,5,7,8
      9,10,11,12"
    `);
    expect(JSON.stringify(A12)).toMatchInlineSnapshot(
      `"[1,2,3,4,5,6,7,8,9,10,11,12]"`
    );
  });

  test('copy internal struct', () => {
    const a = StridedView.of(A12, [4, 3]);
    expect(JSON.stringify(a.serialize())).toMatchInlineSnapshot(
      `"{"shape":[4,3],"stride":[1,4],"offset":0,"data":[1,2,3,4,5,6,7,8,9,10,11,12]}"`
    );
    expect(
      JSON.stringify(a.slice([1, 1], [2, 2]).serialize())
    ).toMatchInlineSnapshot(
      `"{"shape":[2,2],"stride":[1,4],"offset":5,"data":[1,2,3,4,5,6,7,8,9,10,11,12]}"`
    );
    expect(
      JSON.stringify(a.slice([1, 1], [2, 2]).copy().serialize())
    ).toMatchInlineSnapshot(
      `"{"shape":[2,2],"stride":[1,2],"offset":0,"data":[6,7,10,11]}"`
    );
  });
});

test('indexOf', () => {
  const a = StridedView.of(S25, [5, 5]);
  expect(a.toString()).toMatchInlineSnapshot(`
    "A,B,C,D,E
    F,G,H,I,J
    K,L,M,N,O
    P,Q,R,S,T
    U,V,W,X,Y"
  `);
  expect(a.indexOf('A')).toMatchInlineSnapshot(`
    [
      0,
      0,
    ]
  `);
  expect(a.indexOf('L')).toMatchInlineSnapshot(`
    [
      1,
      2,
    ]
  `);
  expect(a.indexOf('S')).toMatchInlineSnapshot(`
    [
      3,
      3,
    ]
  `);
});

describe('neighborhood', () => {
  test('neighborhood', () => {
    const a = StridedView.of(S25, [5, 5]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      F,G,H,I,J
      K,L,M,N,O
      P,Q,R,S,T
      U,V,W,X,Y"
    `);

    const b = a.neighborhood([1, 2]);
    expect(b.toString()).toMatchInlineSnapshot(`
      "F,G,H
      K,L,M
      P,Q,R"
    `);

    b.fill('Z');
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      Z,Z,Z,I,J
      Z,Z,Z,N,O
      Z,Z,Z,S,T
      U,V,W,X,Y"
    `);

    // TODO: test mutation
  });

  test('larger neighborhood', () => {
    const a = StridedView.of(S36, [6, 6]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E,F
      G,H,I,J,K,L
      M,N,O,P,Q,R
      S,T,U,V,W,X
      Y,Z,1,2,3,4
      5,6,7,8,9,0"
    `);

    const b = a.neighborhood([3, 3], 2);
    expect(b.toString()).toMatchInlineSnapshot(`
      "H,I,J,K,L
      N,O,P,Q,R
      T,U,V,W,X
      Z,1,2,3,4
      6,7,8,9,0"
    `);
  });

  test('out of bounds', () => {
    const a = StridedView.of(S25, [5, 5]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E
      F,G,H,I,J
      K,L,M,N,O
      P,Q,R,S,T
      U,V,W,X,Y"
    `);

    const b = a.neighborhood([0, 0], 1);
    expect(b.toString()).toMatchInlineSnapshot(`
      "A,B
      F,G"
    `);

    const c = a.neighborhood([4, 4], 1);
    expect(c.toString()).toMatchInlineSnapshot(`
      "S,T
      X,Y"
    `);

    const d = a.neighborhood([3, 3], 2);
    expect(d.toString()).toMatchInlineSnapshot(`
      "G,H,I,J
      L,M,N,O
      Q,R,S,T
      V,W,X,Y"
    `);
  });
});

describe('getNeighbors', () => {
  test('getNeighbors', () => {
    const a = StridedView.of(A25, [5, 5]);
    const b = a.getNeighbors([1, 1]);
    expect(JSON.stringify([...b])).toMatchInlineSnapshot(`"[[1,[0,0]],[2,[1,0]],[3,[2,0]],[6,[0,1]],[8,[2,1]],[11,[0,2]],[12,[1,2]],[13,[2,2]]]"`);
  });

  test('getNeighbors with topology', () => {
    const a = StridedView.of(A25, [5, 5]);
    const b = a.getNeighbors([1, 1], 4);
    expect(JSON.stringify([...b])).toMatchInlineSnapshot(`"[[2,[1,0]],[6,[0,1]],[8,[2,1]],[12,[1,2]]]"`);
  });

  test('getNeighbors near edge', () => {
    const a = StridedView.of(A25, [5, 5]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4,5
      6,7,8,9,10
      11,12,13,14,15
      16,17,18,19,20
      21,22,23,24,25"
    `);
    const b = a.getNeighbors([0, 4]);
    expect(JSON.stringify([...b])).toMatchInlineSnapshot(`"[[16,[0,3]],[17,[1,3]],[22,[1,4]]]"`);
  });
});

describe('flat', () => {
  test('flat', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.flat().toString()).toMatchInlineSnapshot(`"1,2,3,4,5,6"`);
    expect(JSON.stringify(A6)).toMatchInlineSnapshot(`"[1,2,3,4,5,6]"`);
  });

  test('flat after transpose', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4
      5,6"
    `);
    expect(a.transpose().toString()).toMatchInlineSnapshot(`
      "1,3,5
      2,4,6"
    `);
    expect(a.transpose().copy().flat().toString()).toMatchInlineSnapshot(
      `"1,3,5,2,4,6"`
    );
    expect(a.transpose().flat().toString()).toMatchInlineSnapshot(
      `"1,3,5,2,4,6"`
    );
    expect(JSON.stringify(A6)).toMatchInlineSnapshot(`"[1,2,3,4,5,6]"`);
  });
});

describe('place', () => {
  test('place', () => {
    const a = StridedView.of(A12, [4, 3]);
    const b = StridedView.of(A4, [2, 2]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4
      5,6,7,8
      9,10,11,12"
    `);
    expect(b.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4"
    `);

    a.place(b.flip(1), [2, 1]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "1,2,3,4
      5,6,3,4
      9,10,1,2"
    `);
  });

  test('place out of bounds', () => {
    const a = StridedView.of(A12, [4, 3]);
    const b = StridedView.of(A4, [2, 2]);

    expect(() => a.place(b, [10, 10])).toThrow('Invalid position');
    expect(() => a.place(b, [-10, -10])).toThrow('Invalid position');

    // CHECK: Should we throw?
    expect(() => a.place(b, [2, 2])).toThrow('Invalid position');
  });

  test('placeWith', () => {
    const a = StridedView.of(S12, [4, 3]);
    const b = StridedView.of(A4, [2, 2]);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,G,H
      I,J,K,L"
    `);
    expect(b.toString()).toMatchInlineSnapshot(`
      "1,2
      3,4"
    `);

    a.placeWith(b, [2, 1], v => String.fromCharCode(+v + 64));
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,A,B
      I,J,C,D"
    `);

    a.placeWith(b.transpose(), [2, 1], (v, [x, y]) => `[${v},${x},${y}]`);
    expect(a.toString()).toMatchInlineSnapshot(`
      "A,B,C,D
      E,F,[1,2,1],[3,3,1]
      I,J,[2,2,2],[4,3,2]"
    `);
  });
});

describe('some/every', () => {
  test('some', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.some(v => v === 1)).toBe(true);
    expect(a.some(v => v === 10)).toBe(false);
  });

  test('every', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.every(v => v > 0)).toBe(true);
    expect(a.every(v => v > 1)).toBe(false);
  });
});

describe('findIndex/findIndices', () => {
  test('findIndex', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(a.findIndex(v => v === 2)).toMatchInlineSnapshot(`
      [
        1,
        0,
      ]
    `);
    expect(a.findIndex(v => v === 10)).toMatchInlineSnapshot(`
      [
        -1,
        -1,
      ]
    `);
  });

  test('findIndices', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify(a.findIndices(v => v === 2))).toMatchInlineSnapshot(
      `"[[1,0]]"`
    );
    expect(a.findIndices(v => v === 10)).toMatchInlineSnapshot(`[]`);
  });
});
describe('forEach', () => {
  test('forEach', () => {
    const a = StridedView.of(A6, [2, 3]);
    const b: number[] = [];
    a.forEach(v => b.push(v));
    expect(b).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('forEach with index', () => {
    const a = StridedView.of(A6, [2, 3]);
    const b: number[] = [];
    a.forEach((_, [x, y]) => b.push(x + y));
    expect(b).toEqual([0, 1, 1, 2, 2, 3]);
  });
});

describe('iter', () => {
  test('iter', () => {
    const a = StridedView.of(A6, [2, 3]);
    const b = [...a];
    expect(b).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('entries', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify([...a.entries()])).toMatchInlineSnapshot(
      `"[[1,[0,0]],[2,[1,0]],[3,[0,1]],[4,[1,1]],[5,[0,2]],[6,[1,2]]]"`
    );
  });

  test('values', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify([...a.values()])).toMatchInlineSnapshot(
      `"[1,2,3,4,5,6]"`
    );
  });

  test('keys', () => {
    const a = StridedView.of(A6, [2, 3]);
    expect(JSON.stringify([...a.keys()])).toMatchInlineSnapshot(
      `"[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]]"`
    );
  });
});

describe('combine', () => {
  test('combine', () => {
    const a = StridedView.of(S6, [2, 3]);
    const b = StridedView.of(S6, [2, 3]);
    expect(StridedView.combine([[a, b]]).toString()).toMatchInlineSnapshot(`
      "A,B,A,B
      C,D,C,D
      E,F,E,F"
    `);
    expect(StridedView.combine([[a], [b]]).toString()).toMatchInlineSnapshot(`
      "A,B
      C,D
      E,F
      A,B
      C,D
      E,F"
    `);
    expect(
      StridedView.combine([
        [a, b],
        [b, a]
      ]).toString()
    ).toMatchInlineSnapshot(`
      "A,B,A,B
      C,D,C,D
      E,F,E,F
      A,B,A,B
      C,D,C,D
      E,F,E,F"
    `);
  });

  test('combine different sizes', () => {
    const a = StridedView.of(S6, [6, 1]);
    const b = StridedView.of(S12, [6, 2]);
    expect(StridedView.combine([[a], [b]]).toString()).toMatchInlineSnapshot(`
      "A,B,C,D,E,F
      A,B,C,D,E,F
      G,H,I,J,K,L"
    `);

    expect(() => StridedView.combine([[a, b]])).toThrow('Invalid shape');
  });

  test('concat', () => {
    const a = StridedView.of(S6, [1, 6]);
    const b = StridedView.of(S12, [2, 6]);
    expect(a.concat(b).toString()).toMatchInlineSnapshot(`
      "A,A,B
      B,C,D
      C,E,F
      D,G,H
      E,I,J
      F,K,L"
    `);
  });

  test('stack', () => {
    const a = StridedView.of(S6, [3, 2]);
    const b = StridedView.of(S9, [3, 3]);
    expect(a.stack(b).toString()).toMatchInlineSnapshot(`
      "A,B,C
      D,E,F
      A,B,C
      D,E,F
      G,H,I"
    `);
  });

  test('tile', () => {
    const a = StridedView.of(S6, [2, 3]);
    expect(a.tile([3, 2]).toString()).toMatchInlineSnapshot(`
      "A,B,A,B,A,B
      C,D,C,D,C,D
      E,F,E,F,E,F
      A,B,A,B,A,B
      C,D,C,D,C,D
      E,F,E,F,E,F"
    `);
  });
});

test('zipWith', () => {
  const a = StridedView.of(A6, [2, 3]);
  const b = StridedView.of(S6, [2, 3]);

  expect(StridedView.zipWith(a, b, (x, y) => x + y).toString())
    .toMatchInlineSnapshot(`
    "1A,2B
    3C,4D
    5E,6F"
  `);
});

describe('stress tests', () => {
  const sx = 30;
  const sy = 50;
  const a = StridedView.random([sx, sy]);

  test('identities', () => {
    expect(a).toEqual(a.flip().flip());
    expect(a).toEqual(a.transpose().transpose());
    expect(a.reshape([sy, sx]).reshape([sx, sy])).toEqual(a);
    expect(a.reshape([1, sx * sy]).reshape([sx, sy])).toEqual(a);
    expect(a.reshape([sx * sy, 1]).reshape([sx, sy])).toEqual(a);
    expect(a.reshape([sx * sy, 1])).toEqual(a.flat());
  });

  test('strides vs copy', () => {
    expect(a.shape).toEqual(a.copy().shape);
    expect(a.stride).toEqual(a.copy().stride);
    expect(a.offset).toEqual(a.copy().offset);
    expect(a !== a.copy());
    expect(a.toArrays()).toEqual(a.copy().toArrays());
    expect(a.toArray()).toEqual(a.copy().toArray());
  });

  test('flat', () => {
    expect(a.flat().toArrays()[0]).toEqual(a.toArray());
  });

  test('flip/transpose', () => {
    expect(a.transpose().toArray()).toEqual(a.copy().transpose().toArray());
    expect(a.transpose().flip().toArrays()).toEqual(
      a.transpose().copy().flip().toArrays()
    );
    expect(a.flip().transpose().toArrays()).toEqual(
      a.flip().copy().transpose().toArrays()
    );
    expect(a.flat().toArrays()[0]).toEqual(a.toArray());
    expect(a.flip().transpose().flat().toArrays()[0]).toEqual(
      a.flip().transpose().toArray()
    );
  });

  test('reshape', () => {
    expect(a.reshape([sy, sx]).toArray()).toEqual(
      a.copy().reshape([sy, sx]).toArray()
    );
    expect(a.reshape([sy, sx]).copy().reshape([sx, sy]).toArray()).toEqual(
      a.toArray()
    );

    expect(a.transpose().reshape([sy, sx]).toArrays()).toEqual(
      a.transpose().copy().reshape([sy, sx]).toArrays()
    );
    expect(a.reshape([sx * sy, 1]).toArrays()[0]).toEqual(a.toArray());
    expect(
      a
        .flip(1)
        .reshape([sx * sy, 1])
        .toArrays()[0]
    ).toEqual(a.flip(1).toArray());
    expect(
      a
        .transpose()
        .reshape([sx * sy, 1])
        .toArrays()[0]
    ).toEqual(a.transpose().toArray());
  });

  test('rotate90', () => {
    expect(a.rotate90().toArray()).toEqual(a.copy().rotate90().toArray());
    expect(a.rotate90().rotate90().rotate90().rotate90().toArray()).toEqual(
      a.toArray()
    );
  });
});

test('image', () => {
  const a = StridedView.empty([10, 10]).update((_, [x, y]) =>`[${x},${y}]`);
  expect(a.inspect()).toMatchInlineSnapshot(`
    "[
      [[0,0],[1,0],...,[8,0],[9,0]]
      [[0,1],[1,1],...,[8,1],[9,1]]
      ...
      [[0,8],[1,8],...,[8,8],[9,8]]
      [[0,9],[1,9],...,[8,9],[9,9]]
    ]"
  `);

  expect(a.hi([2,4]).inspect()).toMatchInlineSnapshot(`
    "[
      [[0,0],[1,0]]
      [[0,1],[1,1]]
      [[0,2],[1,2]]
      [[0,3],[1,3]]
    ]"
  `);
  expect(a.lo([7,8]).inspect()).toMatchInlineSnapshot(`
    "[
      [[7,8],[8,8],[9,8]]
      [[7,9],[8,9],[9,9]]
    ]"
  `);

  expect(a.row(6).inspect()).toMatchInlineSnapshot(`
    "[
      [[0,6],[1,6],...,[8,6],[9,6]]
    ]"
  `);
  expect(a.col(4).inspect()).toMatchInlineSnapshot(`
    "[
      [[4,0]]
      [[4,1]]
      ...
      [[4,8]]
      [[4,9]]
    ]"
  `);

  expect(a.slice([6,2], [3,2]).inspect()).toMatchInlineSnapshot(`
    "[
      [[6,2],[7,2],[8,2]]
      [[6,3],[7,3],[8,3]]
    ]"
  `);
});