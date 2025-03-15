type MapCallback<T, R> = (
  value: T,
  pos: [number, number],
  thisArg: StridedView<T>
) => R;

type ReduceCallback<T, R> = (
  acc: R,
  value: T,
  pos: [number, number],
  thisArg: StridedView<T>
) => R;

enum Dim {
  X = 0,
  Y = 1
}

const enum Topology {
  Four = 4,
  Eight = 8
}

type NumericTypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

// Type for a writable array-like object
// Accepts any arrays and typed arrays (e.g. Int8Array, Uint8Array, etc.)
type WritableArrayLike<T> = {
  readonly length: number;
  readonly [n: number]: T;
} & (Array<T> | NumericTypedArray);

type Data<T> = WritableArrayLike<T> | StridedView<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isWritableArrayLike<T>(obj: any): obj is WritableArrayLike<T> {
  return obj.length !== undefined;
}

export class StridedView<T> {
  protected data!: Data<T>;

  stride!: [number, number];
  shape!: [number, number];
  offset: number = 0;

  // These are private methods that are used to access the underlying data
  // They are defined in the constructor
  // They may be different depending on the type of the data
  readonly #get!: (i: number) => T | undefined;
  readonly #set!: (i: number, value: T) => void;
  readonly #length!: () => number;

  /***
   * @param data - The underlying 1D storage for the multidimensional array
   * @param shape - The shape of the array (Default: `[data.length, 1]`)
   * @param stride - The stride of the array (Default: row major, `[1, shape[0]`)
   * @param offset - The offset of the array (Default: `0`)
   */
  constructor(
    data: Data<T>,
    shape?: [number, number],
    stride?: [number, number],
    offset: number = 0
  ) {
    this.data = data;
    this.offset = offset;

    if (isWritableArrayLike(data)) {
      this.#length = () => data.length;
      this.#get = (i: number) => data[i];
      this.#set = (i: number, value: T) => (data[i] = value);
    } else if (StridedView.isStridedView<T>(data)) {
      this.#length = () => data.size;
      this.#get = (i: number) => data.iGet(i);
      this.#set = (i: number, value: T) => data.iSet(i, value);
    } else {
      throw new TypeError('Invalid data type');
    }

    this.shape = shape ? [...shape] : [this.#length(), 1];
    this.stride = stride ? [...stride] : [1, this.shape[0]];

    Object.freeze(this);
  }

  /**
   * ## Properties
   */

  /**
   * @property width - The width of the view (`shape[0]`)
   */
  get width() {
    return this.shape[0];
  }

  /**
   * @property height - The height of the view (`shape[1]`)
   */
  get height() {
    return this.shape[1];
  }

  /**
   * @property size - The size of the view (`shape[0] * shape[1]`)
   */
  get size() {
    return this.shape[0] * this.shape[1];
  }

  private get isRowMajor() {
    return (
      this.stride[0] === 1 &&
      this.stride[1] === this.shape[0] &&
      this.offset === 0
    );
  }

  protected unboundIndex(x: number, y: number): number {
    return this.offset + x * this.stride[0] + y * this.stride[1];
  }

  protected index(x: number, y: number): number | undefined {
    if (x < 0 || x >= this.shape[0] || y < 0 || y >= this.shape[1]) {
      return undefined;
    }
    const idx = this.unboundIndex(x, y);
    return idx;
  }

  /**
   * ## Element Access
   */

  protected iGet(i: number): T | undefined {
    const x = i % this.shape[0];
    const y = ~~(i / this.shape[0]);

    return this.get(x, y);
  }

  protected iSet(i: number, value: T): void {
    const x = i % this.shape[0];
    const y = ~~(i / this.shape[0]);

    this.set(x, y, value);
  }

  /**
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @returns - The element at the given coordinates
   */
  get(x: number, y: number): T | undefined {
    // CHECK: Rename at?
    const idx = this.index(x, y);
    if (idx === undefined) return undefined;
    return this.#get(idx);
  }

  /**
   * @param x - The x coordinate
   * @param y - The y coordinate
   * @param value - The value to set
   */
  set(x: number, y: number, value: T): void {
    const idx = this.index(x, y);
    if (idx === undefined) {
      throw new RangeError(`Invalid index : ${x}, ${y}`);
    }
    this.#set(idx!, value);
  }

  /**
   * ## Iteration
   */

  /**
   * @param callbackFn - The function to execute on each element
   */
  forEach(callbackFn: MapCallback<T, void>): void {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        callbackFn.call(this, this.get(x, y)!, [x, y], this);
      }
    }
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        yield this.get(x, y);
      }
    }
  }

  /**
   * @returns - An iterator of the entries of the view
   */
  *entries(): IterableIterator<[T, [number, number]]> {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        yield [this.get(x, y)!, [x, y]];
      }
    }
  }

  /**
   * @returns - An iterator of the values of the view
   */
  *values(): IterableIterator<T> {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        yield this.get(x, y)!;
      }
    }
  }

  /**
   * @returns - An iterator of the keys of the view
   */
  *keys(): IterableIterator<[number, number]> {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        yield [x, y];
      }
    }
  }

  /**
   * @param callbackFn - The function to execute on each element, returning the new accumulator value
   * @param initialValue - The initial value of the accumulator
   * @returns {R} - The reduced value
   */
  reduce<R>(callbackFn: ReduceCallback<T, R>, initialValue: R): R {
    let acc = initialValue;
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        acc = callbackFn.call(this, acc, this.get(x, y)!, [x, y], this);
      }
    }
    return acc;
  }

  /**
   * @param value - The value to fill the view with
   */
  fill(value: T): this {
    this.forEach((_, [x, y]) => this.set(x, y, value));
    return this;
  }

  /**
   * @param pos - Position to start the flood fill
   * @param value - The value to fill the view with
   * @param topology - The topology of the flood fill (4 or 8)
   * @param predicate - The predicate to determine if a cell should be filled
   * @returns - The view
   */
  floodFill(
    pos: [number, number],
    value: T,
    topology: Topology = 4,
    predicate?: (target: T, current: T) => boolean
  ): this {
    const target = this.get(...pos);
    const queue = [pos];
    while (queue.length > 0) {
      const p = queue.pop()!;
      const idx = this.index(...p)!;
      const current = this.#get(idx);
      const r = predicate ? predicate(target!, current!) : current === target;
      if (r) {
        this.#set(idx, value);
        queue.push(...this.findNeighborIndices(p, topology));
      }
    }
    return this;
  }

  /**
   * @param callbackFn - The function to execute on each element, returning the new value
   * @returns - The view
   */
  update(callbackFn: MapCallback<T, T>): this {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        this.set(x, y, callbackFn.call(this, this.get(x, y)!, [x, y], this));
      }
    }
    return this;
  }

  /**
   * @param sub - The subview to place
   * @param pos - The position to place the subview
   * @returns {R} - The view with the subview placed at the given position
   */
  place(sub: StridedView<T>, [x, y]: [number, number]): this {
    if (
      x < 0 ||
      y < 0 ||
      x + sub.shape[0] > this.shape[0] ||
      y + sub.shape[1] > this.shape[1]
    ) {
      throw new RangeError(`Invalid position : ${x}, ${y}`);
    }
    sub.forEach((value, [dx, dy]) => this.set(x + dx, y + dy, value));
    return this;
  }

  /**
   * @param sub - The subview to place
   * @param pos - The position to place the subview
   * @param callbackFn - The function to execute on each element, returning the new value
   * @returns - The view with the subview placed at the given position
   */
  placeWith<R>(
    sub: StridedView<R>,
    pos: [number, number],
    callbackFn: MapCallback<R, T>
  ): this {
    const [x, y] = pos;
    sub.forEach((value, [dx, dy]) => {
      const v = callbackFn.call(this, value, [x + dx, y + dy], sub);
      this.set(x + dx, y + dy, v);
    });
    return this;
  }

  /**
   * @param callbackFn - The function to execute on each element, returning the new value
   * @returns - A new view with the mapped values
   */
  map<R>(callbackFn: MapCallback<T, R>): StridedView<R> {
    const view = new StridedView<R>([], this.shape);
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        view.set(x, y, callbackFn.call(this, this.get(x, y)!, [x, y], this));
      }
    }
    return view;
  }

  /**
   * @returns - A copy of the view, detached from the original data
   */
  copy(): StridedView<T> {
    const size = this.shape[0] * this.shape[1];
    return new StridedView<T>(Array(size), this.shape).map<T>(
      (_, [x, y]) => this.get(x, y)!
    );
  }

  /**
   * @param shape - The new shape of the array
   * @returns - A reshaped view of the array
   */
  reshape(shape: [number, number]): StridedView<T> {
    if (shape[0] * shape[1] !== this.size) {
      throw new RangeError(`Invalid shape : ${shape}`);
    }
    if (this.isRowMajor) {
      return new StridedView<T>(this.data, shape);
    }

    const data = this.flat();
    return new StridedView<T>(data, shape);
  }

  /**
   * ## Slicing
   */

  /**
   * @returns - A transposed view of the array
   */
  transpose(): StridedView<T> {
    const stride = [this.stride[1], this.stride[0]] as [number, number];
    const shape = [this.shape[1], this.shape[0]] as [number, number];
    return new StridedView<T>(this.data, shape, stride, this.offset);
  }

  /**
   * @param pos - The position of the lower bound
   * @returns - A view of the array from the lower bound to the end
   */
  lo([x, y]: [number, number]): StridedView<T> {
    const idx = this.index(x, y);
    if (idx === undefined) {
      throw new RangeError(`Invalid index : ${[x, y]}`);
    }
    const offset = this.offset + idx;
    const shape = [this.shape[0] - x, this.shape[1] - y];
    return new StridedView<T>(
      this.data,
      shape as [number, number],
      this.stride,
      offset
    );
  }

  /**
   * @param shape - The shape of the upper bound
   * @returns - A view of the array from the beginning to the upper bound
   */
  hi(shape: [number, number]): StridedView<T> {
    return new StridedView<T>(this.data, shape, this.stride, this.offset);
  }

  /**
   * @param begin - The coordinates to start the slice from
   * @param shape  - The size of the slice (Default: [shape[0] - begin[0], shape[1] - begin[1])
   * @returns - A view of the array from the beginning to the upper bound
   */
  slice([x, y]: [number, number], shape?: [number, number]): StridedView<T> {
    const idx = this.unboundIndex(x, y);
    const offset = this.offset + idx!;
    shape ??= [this.shape[0] - x, this.shape[1] - y];
    return new StridedView<T>(this.data, shape, this.stride, offset);
  }

  /**
   * @param col - The index of the column
   * @returns - A view of the column at the given index
   */
  col(col: number): StridedView<T> {
    const idx = this.index(col, 0);
    if (idx === undefined) {
      throw new RangeError(`Invalid index : ${col}`);
    }
    const offset = this.offset + idx;
    const shape = [1, this.shape[1]];
    return new StridedView<T>(
      this.data,
      shape as [number, number],
      this.stride,
      offset
    );
  }

  /**
   * @param row - The index of the row
   * @returns - A view of the row at the given index
   */
  row(row: number): StridedView<T> {
    const idx = this.index(0, row);
    if (idx === undefined) {
      throw new RangeError(`Invalid index : ${row}`);
    }
    const offset = this.offset + idx;
    const shape = [this.shape[0], 1];
    return new StridedView<T>(
      this.data,
      shape as [number, number],
      this.stride,
      offset
    );
  }

  /**
   * @param dim - The dimension of the axis (Default: 0, 0 = x, 1 = y)
   * @returns - A view of the array flipped along the given axis
   */
  flip(dim: Dim = Dim.X): StridedView<T> {
    if (dim > 1 || dim < 0) {
      throw new RangeError(`Invalid dimension : ${dim}`);
    }
    const offset = this.offset + (this.shape[dim] - 1) * this.stride[dim];
    const stride = [...this.stride];
    stride[dim] = -stride[dim];
    return new StridedView<T>(
      this.data,
      this.shape,
      stride as [number, number],
      offset
    );
  }

  scale(scale: [number, number]): StridedView<T> {
    const stride = [
      ~~(this.stride[0] * scale[0]),
      ~~(this.stride[1] * scale[1])
    ];
    const shape = [~~(this.shape[0] / scale[0]), ~~(this.shape[1] / scale[1])];
    return new StridedView<T>(
      this.data,
      shape as [number, number],
      stride as [number, number]
    );
  }

  /**
   * @returns - A view of the array with the elements reversed
   */
  reverse(): StridedView<T> {
    const offset =
      this.offset +
      (this.shape[0] - 1) * this.stride[0] +
      (this.shape[1] - 1) * this.stride[1];

    const stride = [-this.stride[0], -this.stride[1]] as [number, number];
    return new StridedView<T>(
      this.data,
      this.shape,
      stride as [number, number],
      offset
    );
  }

  /**
   * @returns - A view of the array rotated 90 degrees
   */
  rotate90(): StridedView<T> {
    return this.flip().transpose();
  }

  /**
   * @param pos - The position of the center of the neighborhood
   * @param distance - The distance from the center of the neighborhood
   * @returns - A view of the neighborhood around the given position
   */
  neighborhood(pos: [number, number], distance: number = 1): StridedView<T> {
    if (distance < 0) {
      throw new RangeError(`Invalid distance : ${distance}`);
    }
    if (
      pos[0] < 0 ||
      pos[0] >= this.shape[0] ||
      pos[1] < 0 ||
      pos[1] >= this.shape[1]
    ) {
      throw new RangeError(`Invalid position : ${pos}`);
    }

    const x0 = Math.max(0, pos[0] - distance);
    const y0 = Math.max(0, pos[1] - distance);
    const x1 = Math.min(this.shape[0], pos[0] + distance + 1);
    const y1 = Math.min(this.shape[1], pos[1] + distance + 1);

    return this.slice([x0, y0], [x1 - x0, y1 - y0]);
  }

  /**
   * Find the indices of the neighbors of a given position
   *
   * @param pos - The position to find the neighbors of
   * @param topology - The topology of the neighborhood (4 or 8)
   * @returns - The indices of the neighbors
   */
  findNeighborIndices([x, y]: [number, number], topology: Topology = 8) {
    const neighbors: [number, number][] = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < this.shape[0] - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < this.shape[1] - 1) neighbors.push([x, y + 1]);
    if (topology === 8) {
      if (x > 0 && y > 0) neighbors.push([x - 1, y - 1]);
      if (x < this.shape[0] - 1 && y > 0) neighbors.push([x + 1, y - 1]);
      if (x > 0 && y < this.shape[1] - 1) neighbors.push([x - 1, y + 1]);
      if (x < this.shape[0] - 1 && y < this.shape[1] - 1) {
        neighbors.push([x + 1, y + 1]);
      }
    }
    return neighbors;
  }

  /**
   * @returns - A flattened view of the array (as a Mx1 view)
   */
  flat(): StridedView<T> {
    if (this.isRowMajor) {
      return new StridedView<T>(this.data, [this.size, 1]);
    }

    // TODO: avoid intermediate array if possible
    return new StridedView<T>(this);
  }

  /**
   * @param value - The value to search for
   * @returns - The coordinates of the first occurrence of the value
   */
  indexOf(value: T): [number, number] {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        if (this.get(x, y) === value) {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  /**
   * @param value - The value to search for
   * @returns - Whether the value is included in the view
   */
  includes(value: T): boolean {
    const pos = this.indexOf(value);
    return pos[0] !== -1 && pos[1] !== -1;
  }

  /**
   * @param callbackFn -
   * @returns - Whether at least one element satisfies the condition
   */
  some(callbackFn: MapCallback<T, boolean>): boolean {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        if (callbackFn.call(this, this.get(x, y)!, [x, y], this)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * @param callbackFn -
   * @returns - Whether all elements satisfy the condition
   */
  every(callbackFn: MapCallback<T, boolean>): boolean {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        if (!callbackFn.call(this, this.get(x, y)!, [x, y], this)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @param callbackFn -
   * @returns - The first element that satisfies the condition
   */
  findIndex(callbackFn: MapCallback<T, boolean>): [number, number] {
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        if (callbackFn.call(this, this.get(x, y)!, [x, y], this)) {
          return [x, y];
        }
      }
    }
    return [-1, -1];
  }

  /**
   * @param callbackFn
   * @returns - The coordinates of all elements that satisfy the condition
   */
  findIndices(callbackFn?: MapCallback<T, boolean>): [number, number][] {
    const indecies: [number, number][] = [];
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        if (
          !callbackFn ||
          callbackFn.call(this, this.get(x, y)!, [x, y], this)
        ) {
          indecies.push([x, y]);
        }
      }
    }
    return indecies;
  }

  /**
   *
   * @param k - The number of elements to sample
   * @param callbackFn - The function to execute on each element, returning whether to include the element in the sample
   * @returns - The indices of the sampled elements
   */
  sample(k = 1, callbackFn?: MapCallback<T, boolean>) {
    const indecies = this.findIndices(callbackFn);

    // Fisher-Yates shuffle
    for (let i = indecies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indecies[i], indecies[j]] = [indecies[j], indecies[i]];
    }
    return indecies.slice(0, k);
  }

  /**
   *
   * @param view - The view to stack
   * @returns - A view of the two views stacked on top of each other
   */
  stack(view: StridedView<T>): StridedView<T> {
    return StridedView.combine([[this], [view]]);
  }

  /**
   *
   * @param view - The view to concatenate
   * @returns - A view of the two views concatenated
   */
  concat(view: StridedView<T>): StridedView<T> {
    return StridedView.combine([[this, view]]);
  }

  /**
   *
   * @param p - The shape of the tiling
   * @returns - A new view tiled with the given shape
   */
  tile([nx, ny]: [number, number]): StridedView<T> {
    const views = Array.from({ length: ny }, () =>
      Array.from({ length: nx }, () => this)
    );
    return StridedView.combine(views);
  }

  /**
   * ## Inspection
   */

  /**
   * @returns - A serialized representation of the view
   */
  serialize(): {
    shape: [number, number];
    stride: [number, number];
    offset: number;
    data: Data<T>;
  } {
    return {
      shape: this.shape,
      stride: this.stride,
      offset: this.offset,
      data: this.data
    } as const;
  }

  /**
   * @returns - A string representation of the view,
   * with rows separated by newlines and columns separated by commas
   */
  toString(): string {
    return this.join();
  }

  /**
   * @param colSep - The separator between columns (default: ",")
   * @param rowSep - The separator between rows (default: "\n")
   * @returns - A string representation of the view
   */
  join(colSep: string = ',', rowSep: string = '\n'): string {
    const arr: string[] = [];
    for (let y = 0; y < this.shape[1]; y++) {
      const row: string[] = [];
      for (let x = 0; x < this.shape[0]; x++) {
        row.push(String(this.get(x, y)));
      }
      arr.push(row.join(colSep));
    }
    return arr.join(rowSep);
  }

  inspect(): string {
    const colSep: string = ',';
    const rowSep: string = '\n';
    const th = 5;
    const hth = (th / 2) | 0;
    const arr: string[] = [];
    for (let y = 0; y < this.shape[1]; y++) {
      const row: string[] = [];
      for (let x = 0; x < this.shape[0]; x++) {
        row.push(String(this.get(x, y)));
      }
      if (row.length > th) {
        row.splice(hth, row.length - th + 1, '...');
      }
      arr.push('  [' + row.join(colSep) + ']');
    }
    if (arr.length > th) {
      arr.splice(hth, arr.length - th + 1, '  ...');
    }
    return '[\n' + arr.join(rowSep) + '\n]';
  }

  /**
   * @returns - A 2D array representation of the view, detached from the original data
   */
  toArrays(): T[][] {
    const arr: T[][] = [];
    for (let y = 0; y < this.shape[1]; y++) {
      const row: T[] = [];
      for (let x = 0; x < this.shape[0]; x++) {
        row.push(this.get(x, y)!);
      }
      arr.push(row);
    }
    return arr;
  }

  /**
   * @returns - A 1D array representation of the view, detached from the original data
   */
  toArray(): T[] {
    const arr: T[] = [];
    for (let y = 0; y < this.shape[1]; y++) {
      for (let x = 0; x < this.shape[0]; x++) {
        arr.push(this.get(x, y)!);
      }
    }
    return arr;
  }

  // TODO:
  // - tile/placeTiled
  // - split
  // - find
  // - some
  // - Symbol.iterator?
  // - pick/slice (vs col/row)
  // - filter
  // - roll
  // - concat

  /**
   * ## Static Methods
   */

  /**
   * @param array - The underlying 1D storage for the multidimensional array
   * @param shape - The shape of the view
   * @returns - A new view of the array
   */
  static of<T>(array: Data<T>, shape?: [number, number]): StridedView<T> {
    return new StridedView<T>(array, shape);
  }

  /**
   * @param array - A 2D array to create a view from
   * @returns - A new view of the array detyached from the original data
   */
  static from<T>(array: T[][]): StridedView<T> {
    // TODO: Support strings?
    // TODO: verify type and shape?
    const height = array.length;
    const width = array[0].length;
    return new StridedView<T>(array.flat(), [width, height]);
  }

  /**
   * @param shape - The shape of the range
   * @param start - The starting value of the range (Default: 0)
   * @param step - The step between values in the range (Default: 1)
   * @returns - A view of the range with the given shape and values
   */
  static range(
    shape: [number, number],
    start: number = 0,
    step: number = 1
  ): StridedView<number> {
    const size = shape[0] * shape[1];
    const data = new Float64Array(size);
    let index = -1;
    while (index++ < size) {
      data[index] = start;
      start += step;
    }
    return new StridedView(data, shape);
  }

  /**
   * @param shape - The shape of the array
   * @returns - A view of the array filled with zeros
   */
  static zeros(shape: [number, number]): StridedView<number> {
    const size = shape[0] * shape[1];
    return new StridedView<number>(new Float64Array(size).fill(0), shape);
  }

  /**
   * @param shape - The shape of the array
   * @returns - A view of the array filled with ones
   */
  static ones(shape: [number, number]): StridedView<number> {
    const size = shape[0] * shape[1];
    return new StridedView(new Float64Array(size).fill(1), shape);
  }

  /**
   * @param length - The length of the identity matrix
   * @returns - A view of the identity matrix with the given length
   */
  static identity(length: number): StridedView<number> {
    const data = new Float64Array(length * length);
    return new StridedView(data, [length, length]).update(
      (_, [x, y]) => (x === y ? 1 : 0)
    );
  }

  /**
   * @param array - The array to create a diagonal matrix from (i.e. the diagonal values)
   * @returns - A view of the diagonal matrix with the given values
   */
  static diagonal(array: number[]): StridedView<number> {
    const length = array.length;
    const data = new Float64Array(length * length);
    return new StridedView(data, [length, length]).update(
      (_, [x, y]) => (x === y ? array[x] : 0)
    );
  }

  /**
   * @param shape - The shape of the view
   * @param value - The value to fill the array with
   * @returns - A view filled with the given value
   */
  static fill<T>(shape: [number, number], value: T): StridedView<T> {
    const size = shape[0] * shape[1];
    return new StridedView<T>(Array(size).fill(value), shape);
  }

  /**
   * @param shape - The shape of the view
   * @param randFn - Mapping function to generate random values
   * @returns - A view filled with random values
   */
  static random(
    shape: [number, number],
    randFn?: (v: number) => number
  ): StridedView<number> {
    const length = shape[0] * shape[1];
    const data = new Float64Array(length).map(() => Math.random());
    if (randFn) {
      data.forEach((v, i) => (data[i] = randFn!(v)));
    }
    return new StridedView<number>(data, shape);
  }

  /**
   * @param shape
   * @returns - An empty view of the given shape
   */
  static empty<T>(shape: [number, number]): StridedView<T> {
    return new StridedView<T>([], shape);
  }

  /**
   *
   * @param views - The views to combine
   * @returns - A new view with the views combined
   */
  static combine<T>(views: StridedView<T>[][]): StridedView<T> {
    const widths = views[0].map(view => view.shape[0]);
    const heights = views.map(row => row[0].shape[1]);

    const width = widths.reduce((acc, v) => acc + v, 0);
    const height = heights.reduce((acc, v) => acc + v, 0);

    const result = new StridedView<T>(Array(width * height), [width, height]);

    let yy = 0;
    for (let y = 0; y < views.length; y++) {
      let xx = 0;
      for (let x = 0; x < views[y].length; x++) {
        const view = views[y][x];
        if (view.shape[0] !== widths[x]) {
          throw new RangeError('Invalid shape');
        }
        if (view.shape[1] !== heights[y]) {
          throw new RangeError('Invalid shape');
        }
        view.forEach((value, [dx, dy]) => {
          result.set(dx + xx, dy + yy, value);
        });

        xx += widths[x];
      }
      yy += heights[y];
    }
    return result;
  }

  /**
   * @static
   * @param obj - The object to check
   * @returns - Whether the object is a StridedView
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isStridedView<T>(obj: any): obj is StridedView<T> {
    return obj instanceof StridedView;
  }

  // TODO:
  // - fromAsync??
}
