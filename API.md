## :factory: StridedView

### Constructors

`public`: *

Parameters:

* `data`: - The underlying 1D storage for the multidimensional array
* `shape`: - The shape of the array (Default: `[data.length, 1]`)
* `stride`: - The stride of the array (Default: row major, `[1, shape[0]`)
* `offset`: - The offset of the array (Default: `0`)


### Methods

- [get](#gear-get)
- [set](#gear-set)
- [forEach](#gear-foreach)
- [__@iterator@19](#gear-__@iterator@19)
- [entries](#gear-entries)
- [values](#gear-values)
- [keys](#gear-keys)
- [reduce](#gear-reduce)
- [fill](#gear-fill)
- [floodFill](#gear-floodfill)
- [update](#gear-update)
- [place](#gear-place)
- [placeWith](#gear-placewith)
- [map](#gear-map)
- [copy](#gear-copy)
- [reshape](#gear-reshape)
- [transpose](#gear-transpose)
- [lo](#gear-lo)
- [hi](#gear-hi)
- [slice](#gear-slice)
- [col](#gear-col)
- [row](#gear-row)
- [flip](#gear-flip)
- [scale](#gear-scale)
- [reverse](#gear-reverse)
- [rotate90](#gear-rotate90)
- [neighborhood](#gear-neighborhood)
- [findNeighborIndices](#gear-findneighborindices)
- [getNeighbors](#gear-getneighbors)
- [flat](#gear-flat)
- [indexOf](#gear-indexof)
- [includes](#gear-includes)
- [some](#gear-some)
- [every](#gear-every)
- [findIndex](#gear-findindex)
- [findIndices](#gear-findindices)
- [sample](#gear-sample)
- [stack](#gear-stack)
- [concat](#gear-concat)
- [tile](#gear-tile)
- [serialize](#gear-serialize)
- [toString](#gear-tostring)
- [join](#gear-join)
- [inspect](#gear-inspect)
- [toArrays](#gear-toarrays)
- [toArray](#gear-toarray)
- [of](#gear-of)
- [from](#gear-from)
- [range](#gear-range)
- [zeros](#gear-zeros)
- [ones](#gear-ones)
- [identity](#gear-identity)
- [diagonal](#gear-diagonal)
- [fill](#gear-fill)
- [random](#gear-random)
- [empty](#gear-empty)
- [combine](#gear-combine)
- [cwise](#gear-cwise)
- [isStridedView](#gear-isstridedview)

#### :gear: get

| Method | Type |
| ---------- | ---------- |
| `get` | `(x: number, y: number) => T or undefined` |

Parameters:

* `x`: - The x coordinate
* `y`: - The y coordinate


#### :gear: set

| Method | Type |
| ---------- | ---------- |
| `set` | `(x: number, y: number, value: T) => void` |

Parameters:

* `x`: - The x coordinate
* `y`: - The y coordinate
* `value`: - The value to set


#### :gear: forEach

| Method | Type |
| ---------- | ---------- |
| `forEach` | `(callbackFn: MapCallback<T, void>) => void` |

Parameters:

* `callbackFn`: - The function to execute on each element


#### :gear: __@iterator@19

| Method | Type |
| ---------- | ---------- |
| `__@iterator@19` | `() => Generator<T or undefined, void, unknown>` |

#### :gear: entries

| Method | Type |
| ---------- | ---------- |
| `entries` | `() => IterableIterator<[T, [number, number]]>` |

#### :gear: values

| Method | Type |
| ---------- | ---------- |
| `values` | `() => IterableIterator<T>` |

#### :gear: keys

| Method | Type |
| ---------- | ---------- |
| `keys` | `() => IterableIterator<[number, number]>` |

#### :gear: reduce

| Method | Type |
| ---------- | ---------- |
| `reduce` | `<R>(callbackFn: ReduceCallback<T, R>, initialValue: R) => R` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning the new accumulator value
* `initialValue`: - The initial value of the accumulator


#### :gear: fill

| Method | Type |
| ---------- | ---------- |
| `fill` | `(value: T) => this` |

Parameters:

* `value`: - The value to fill the view with


#### :gear: floodFill

| Method | Type |
| ---------- | ---------- |
| `floodFill` | `(pos: [number, number], value: T, topology?: Topology, predicate?: ((target: T, current: T) => boolean) or undefined) => this` |

Parameters:

* `pos`: - Position to start the flood fill
* `value`: - The value to fill the view with
* `topology`: - The topology of the flood fill (4 or 8)
* `predicate`: - The predicate to determine if a cell should be filled


#### :gear: update

| Method | Type |
| ---------- | ---------- |
| `update` | `(callbackFn: MapCallback<T, T>) => this` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning the new value


#### :gear: place

| Method | Type |
| ---------- | ---------- |
| `place` | `(sub: StridedView<T>, [x, y]: [number, number]) => this` |

Parameters:

* `sub`: - The subview to place
* `pos`: - The position to place the subview


#### :gear: placeWith

| Method | Type |
| ---------- | ---------- |
| `placeWith` | `<R>(sub: StridedView<R>, pos: [number, number], callbackFn: MapCallback<R, T>) => this` |

Parameters:

* `sub`: - The subview to place
* `pos`: - The position to place the subview
* `callbackFn`: - The function to execute on each element, returning the new value


#### :gear: map

| Method | Type |
| ---------- | ---------- |
| `map` | `<R>(callbackFn: MapCallback<T, R>) => StridedView<R>` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning the new value


#### :gear: copy

| Method | Type |
| ---------- | ---------- |
| `copy` | `() => StridedView<T>` |

#### :gear: reshape

| Method | Type |
| ---------- | ---------- |
| `reshape` | `(shape: [number, number]) => StridedView<T>` |

Parameters:

* `shape`: - The new shape of the array


#### :gear: transpose

| Method | Type |
| ---------- | ---------- |
| `transpose` | `() => StridedView<T>` |

#### :gear: lo

| Method | Type |
| ---------- | ---------- |
| `lo` | `([x, y]: [number, number]) => StridedView<T>` |

Parameters:

* `pos`: - The position of the lower bound


#### :gear: hi

| Method | Type |
| ---------- | ---------- |
| `hi` | `(shape: [number, number]) => StridedView<T>` |

Parameters:

* `shape`: - The shape of the upper bound


#### :gear: slice

| Method | Type |
| ---------- | ---------- |
| `slice` | `([x, y]: [number, number], shape?: [number, number] or undefined) => StridedView<T>` |

Parameters:

* `begin`: - The coordinates to start the slice from
* `shape`: - The size of the slice (Default: [shape[0] - begin[0], shape[1] - begin[1])


#### :gear: col

| Method | Type |
| ---------- | ---------- |
| `col` | `(col: number) => StridedView<T>` |

Parameters:

* `col`: - The index of the column


#### :gear: row

| Method | Type |
| ---------- | ---------- |
| `row` | `(row: number) => StridedView<T>` |

Parameters:

* `row`: - The index of the row


#### :gear: flip

| Method | Type |
| ---------- | ---------- |
| `flip` | `(dim?: Dim) => StridedView<T>` |

Parameters:

* `dim`: - The dimension of the axis (Default: 0, 0 = x, 1 = y)


#### :gear: scale

| Method | Type |
| ---------- | ---------- |
| `scale` | `(scale: [number, number]) => StridedView<T>` |

#### :gear: reverse

| Method | Type |
| ---------- | ---------- |
| `reverse` | `() => StridedView<T>` |

#### :gear: rotate90

| Method | Type |
| ---------- | ---------- |
| `rotate90` | `() => StridedView<T>` |

#### :gear: neighborhood

| Method | Type |
| ---------- | ---------- |
| `neighborhood` | `(pos: [number, number], distance?: number) => StridedView<T>` |

Parameters:

* `pos`: - The position of the center of the neighborhood
* `distance`: - The distance from the center of the neighborhood


#### :gear: findNeighborIndices

Find the indices of the neighbors of a given position

| Method | Type |
| ---------- | ---------- |
| `findNeighborIndices` | `([x, y]: [number, number], topology?: Topology) => [number, number][]` |

Parameters:

* `pos`: - The position to find the neighbors of
* `topology`: - The topology of the neighborhood (4 or 8)


#### :gear: getNeighbors

| Method | Type |
| ---------- | ---------- |
| `getNeighbors` | `([x, y]: [number, number], topology?: Topology) => IterableIterator<[T, [number, number]]>` |

#### :gear: flat

| Method | Type |
| ---------- | ---------- |
| `flat` | `() => StridedView<T>` |

#### :gear: indexOf

| Method | Type |
| ---------- | ---------- |
| `indexOf` | `(value: T) => [number, number]` |

Parameters:

* `value`: - The value to search for


#### :gear: includes

| Method | Type |
| ---------- | ---------- |
| `includes` | `(value: T) => boolean` |

Parameters:

* `value`: - The value to search for


#### :gear: some

| Method | Type |
| ---------- | ---------- |
| `some` | `(callbackFn: MapCallback<T, boolean>) => boolean` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning whether to include the element in the result


#### :gear: every

| Method | Type |
| ---------- | ---------- |
| `every` | `(callbackFn: MapCallback<T, boolean>) => boolean` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning whether to include the element in the result


#### :gear: findIndex

| Method | Type |
| ---------- | ---------- |
| `findIndex` | `(callbackFn: MapCallback<T, boolean>) => [number, number]` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning whether to include the element in the result


#### :gear: findIndices

| Method | Type |
| ---------- | ---------- |
| `findIndices` | `(callbackFn?: MapCallback<T, boolean> or undefined) => [number, number][]` |

Parameters:

* `callbackFn`: - The function to execute on each element, returning whether to include the element in the result


#### :gear: sample

| Method | Type |
| ---------- | ---------- |
| `sample` | `(k?: number, callbackFn?: MapCallback<T, boolean> or undefined) => [number, number][]` |

Parameters:

* `k`: - The number of elements to sample
* `callbackFn`: - The function to execute on each element, returning whether to include the element in the sample


#### :gear: stack

| Method | Type |
| ---------- | ---------- |
| `stack` | `(view: StridedView<T>) => StridedView<T>` |

Parameters:

* `view`: - The view to stack


#### :gear: concat

| Method | Type |
| ---------- | ---------- |
| `concat` | `(view: StridedView<T>) => StridedView<T>` |

Parameters:

* `view`: - The view to concatenate


#### :gear: tile

| Method | Type |
| ---------- | ---------- |
| `tile` | `([nx, ny]: [number, number]) => StridedView<T>` |

Parameters:

* `p`: - The shape of the tiling


#### :gear: serialize

| Method | Type |
| ---------- | ---------- |
| `serialize` | `() => { shape: [number, number]; stride: [number, number]; offset: number; data: Data<T>; }` |

#### :gear: toString

| Method | Type |
| ---------- | ---------- |
| `toString` | `() => string` |

#### :gear: join

| Method | Type |
| ---------- | ---------- |
| `join` | `(colSep?: string, rowSep?: string) => string` |

Parameters:

* `colSep`: - The separator between columns (default: ",")
* `rowSep`: - The separator between rows (default: "\n")


#### :gear: inspect

| Method | Type |
| ---------- | ---------- |
| `inspect` | `() => string` |

#### :gear: toArrays

| Method | Type |
| ---------- | ---------- |
| `toArrays` | `() => T[][]` |

#### :gear: toArray

| Method | Type |
| ---------- | ---------- |
| `toArray` | `() => T[]` |

#### :gear: of

| Method | Type |
| ---------- | ---------- |
| `of` | `<T>(array: Data<T>, shape?: [number, number] or undefined) => StridedView<T>` |

Parameters:

* `array`: - The underlying 1D storage for the multidimensional array
* `shape`: - The shape of the view


#### :gear: from

| Method | Type |
| ---------- | ---------- |
| `from` | `<T>(array: T[][]) => StridedView<T>` |

Parameters:

* `array`: - A 2D array to create a view from


#### :gear: range

| Method | Type |
| ---------- | ---------- |
| `range` | `(shape: [number, number], start?: number, step?: number) => StridedView<number>` |

Parameters:

* `shape`: - The shape of the range
* `start`: - The starting value of the range (Default: 0)
* `step`: - The step between values in the range (Default: 1)


#### :gear: zeros

| Method | Type |
| ---------- | ---------- |
| `zeros` | `(shape: [number, number]) => StridedView<number>` |

Parameters:

* `shape`: - The shape of the array


#### :gear: ones

| Method | Type |
| ---------- | ---------- |
| `ones` | `(shape: [number, number]) => StridedView<number>` |

Parameters:

* `shape`: - The shape of the array


#### :gear: identity

| Method | Type |
| ---------- | ---------- |
| `identity` | `(length: number) => StridedView<number>` |

Parameters:

* `length`: - The length of the identity matrix


#### :gear: diagonal

| Method | Type |
| ---------- | ---------- |
| `diagonal` | `(array: number[]) => StridedView<number>` |

Parameters:

* `array`: - The array to create a diagonal matrix from (i.e. the diagonal values)


#### :gear: fill

| Method | Type |
| ---------- | ---------- |
| `fill` | `<T>(shape: [number, number], value: T) => StridedView<T>` |

Parameters:

* `shape`: - The shape of the view
* `value`: - The value to fill the array with


#### :gear: random

| Method | Type |
| ---------- | ---------- |
| `random` | `(shape: [number, number], randFn?: ((v: number) => number) or undefined) => StridedView<number>` |

Parameters:

* `shape`: - The shape of the view
* `randFn`: - Mapping function to generate random values


#### :gear: empty

| Method | Type |
| ---------- | ---------- |
| `empty` | `<T>(shape: [number, number]) => StridedView<T>` |

#### :gear: combine

| Method | Type |
| ---------- | ---------- |
| `combine` | `<T>(views: StridedView<T>[][]) => StridedView<T>` |

Parameters:

* `views`: - The views to combine


#### :gear: cwise

| Method | Type |
| ---------- | ---------- |
| `cwise` | `<A, B, R>(view1: StridedView<A>, view2: StridedView<B>, callbackFn: (value: A, other: B, pos: [number, number]) => R) => StridedView<R>` |

Parameters:

* `view1`: - The first view to combine elements from
* `view2`: - The second view to combine elements from
* `callbackFn`: - The function to execute on each element, returning the new value


#### :gear: isStridedView

| Method | Type |
| ---------- | ---------- |
| `isStridedView` | `<T>(obj: any) => obj is StridedView<T>` |

Parameters:

* `obj`: - The object to check


### Properties

- [stride](#gear-stride)
- [shape](#gear-shape)
- [offset](#gear-offset)

#### :gear: stride

| Property | Type |
| ---------- | ---------- |
| `stride` | `[number, number]` |

#### :gear: shape

| Property | Type |
| ---------- | ---------- |
| `shape` | `[number, number]` |

#### :gear: offset

| Property | Type |
| ---------- | ---------- |
| `offset` | `number` |
