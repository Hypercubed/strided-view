## StridedView

StridedView is a library for creating and manipulating 2-dimensional arrays in JavaScript/TypeScript. It is designed to be fast and memory efficient by using a strided view of a 1D array as the underlying storage for the 2-dimensional array. This allows for efficient element access and slicing operations.

## Feature highlights

- Create a 2D array-like view backed by a 1D array
- Type-agnostic, works with any type of data, it's not just for numbers
- Access and manipulate elements of the array using `get`, `set`, and `forEach`
- Create new views of the array using `transpose`, `lo`, `hi`, etc without copying the data (constant time)
- Output the array using `toString`, `toArrays`, and `toArray`

## Introduction

StridedView starts with a 1D array of data and provides a 2D view of the data with a given shape, stride, and offset. The shape of the array is the number of rows and columns, the stride is the number of elements to skip to get to the next row or column, and the offset is the starting index of the array.

More often than not you will use the StridedView static methods to create a StridedView instance from an existing array. In the example below we create a StridedView instance from a 1D array of data and specify the shape of the array.

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const view = StridedView.of(data, [2, 5]);

console.log(view.toArrays());
// [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9, 10 ] ]
```

Using `StridedView.from` input array is flattened and the shape of the array is inferred from the input array. This StridedView data is diconnected from the original input array, so any changes you make to the view will not be reflected in the original data array.

```typescript
const data = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
];
const view = StridedView.from(data);

console.log(view.toArrays());
// [ [ 1, 2, 3, 4, 5 ], [ 6, 7, 8, 9, 10 ] ]
```

Once you have a StridedView instance you can access and manipulate the elements of the array using the `get`, `set`, and `forEach` methods. Any changes you make to the view will be reflected in the underlying data array if the view is backed by the original data array.

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const view = StridedView.of(data, [2, 5]);

view.set(0, 0, 100);
view.forEach((value, [x, y]) => {
  console.log(`view[${x}, ${y}] = ${value}`);
});
// view[0, 0] = 100
// view[1, 0] = 2
// view[0, 1] = 3
// view[1, 1] = 4
// view[0, 2] = 5
// view[1, 2] = 6
// view[0, 3] = 7
// view[1, 3] = 8
// view[0, 4] = 9
// view[1, 4] = 10
```

You can also create new views of the array using the `transpose`, `lo`, `hi`, etc. These methods allow you to create views of the array in constant time. Again, any changes you make to the view will be reflected in the underlying data array.

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const view = StridedView.of(data, [2, 5]);

const transposed = view.transpose();
const lo = view.lo([1, 2]);
const hi = view.hi([1, 2]);
```

You can also inspect or output the array using the `toString`, `toArrays`, and `toArray` methods.

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const view = StridedView.from(data, [2, 5]);

console.log(view.flip().toString());
// 2,1
// 4,3
// 6,5
// 8,7
// 10,9
```

To create a new StridedView not backed by the original data array, you can use the `copy` or `map` methods.

```typescript
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const view = StridedView.of(data, [2, 5]);

const copy = view.copy();
const mapped = view.map((value, [x, y]) => value * 2);
```

StridedView also provides static methods for creating new StridedView instances. These methods include `range`, `zeros`, `ones`, `identity`, `diagonal`, `fill`, and `random`.

```typescript
const range = StridedView.range([2, 5]);
const zeros = StridedView.zeros([2, 5]);
const ones = StridedView.ones([2, 5]);
const identity = StridedView.identity(5);
const diagonal = StridedView.diagonal([1, 2, 3, 4, 5]);
const fill = StridedView.fill([2, 5], 42);
const random = StridedView.random([2, 5]);
```

## Installation

```sh
npm i strided-view
```

## API

See the [API documentation](./API.md) for more information.

## More information

- https://en.wikipedia.org/wiki/Stride_of_an_array
- http://mikolalysenko.github.io/ndarray-presentation/

## License

Licensed under MIT License

Copyright (c) 2024 Jayson Harshbarger

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.