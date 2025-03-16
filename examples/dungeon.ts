import { StridedView } from '../src/index';

const HEIGHT = 40;
const WIDTH = 80;

const enum Type {
  VOID = 0,
  FLOOR = 1,
  WALL = 2,
  CORRIDOR = 3,
  TEST = 4
}

const charMap = {
  [Type.VOID]: '_',
  [Type.FLOOR]: '.',
  [Type.WALL]: '#',
  [Type.CORRIDOR]: 'C',
  [Type.TEST]: 'T'
};

const enum RoomType {
  RECT = 0,
  CIRCLE = 1,
  CA = 2
}

interface Room {
  type: RoomType;
  x: number;
  y: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

const map = StridedView.fill([WIDTH, HEIGHT], Type.VOID);
const rooms: Array<Room> = [];

const maxRooms = 10;
let maxIterations = 1000;
while (rooms.length < maxRooms && maxIterations--) {
  const room = findRoom();
  if (room) {
    placeRoom(room);
    rooms.push(room);
  }
}

const connected: number[] = [];
for (let i = 0; i < rooms.length; i++) {
  const a = rooms[i];
  const list: [number, number][] = [];

  for (let j = 0; j < rooms.length; j++) {
    if (i === j) continue;
    if (connected.includes(j)) continue;

    const d =
      Math.abs(rooms[i].cx - rooms[j].cx) + Math.abs(rooms[i].cy - rooms[j].cy);
    list.push([j, d]);
  }

  if (!list.length) continue;

  list.sort((a, b) => a[1] - b[1]);
  const b = rooms[list[0][0]];
  placeCorridor(a, b);
  connected.push(i);
}

map.update(v => {
  if (v === Type.VOID) return Type.WALL;
  if (v === Type.CORRIDOR) return Type.FLOOR;
  return v;
});
console.log(map.map(v => charMap[v]).join(''));

function findRoom(): Room | null {
  let n = 100;
  while (n--) {
    const type = ~~(Math.random() * 3) as RoomType;
    const width = ~~(Math.random() * 10) + 8;
    const height = ~~(Math.random() * 10) + 8;
    const x = ~~(Math.random() * (WIDTH - width));
    const y = ~~(Math.random() * (HEIGHT - height));
    const rect = map.slice([x, y], [width, height]);
    if (rect.every(v => v === Type.VOID)) {
      const [cx, cy] = [~~(x + width / 2), ~~(y + height / 2)];
      return { type, x, y, width, height, cx, cy };
    }
  }
  return null;
}

function placeRoom(room: Room) {
  const rect = map.slice([room.x, room.y], [room.width, room.height]);
  switch (room.type) {
    case RoomType.RECT:
      rect.update(placeRectRoom);
      break;
    case RoomType.CIRCLE:
      rect.update(placeOvalRoom);
      break;
    case RoomType.CA:
      placeCARoom(room);
      break;
  }

  function placeRectRoom(
    v: Type,
    [x, y]: [number, number],
    room: StridedView<number>
  ) {
    if (x < 1 || y < 1 || x >= room.width - 1 || y >= room.height - 1) {
      return v;
    }
    return Type.FLOOR;
  }

  function placeOvalRoom(
    v: Type,
    [x, y]: [number, number],
    room: StridedView<number>
  ) {
    const rx = room.width / 2;
    const ry = room.height / 2;
    const d = Math.sqrt((x - rx) ** 2 / rx ** 2 + (y - ry) ** 2 / ry ** 2);
    if (d <= 1) {
      return Type.FLOOR;
    }
    return v;
  }

  function placeCARoom(room: Room) {
    let field: StridedView<number>;

    const born = [5, 6, 7, 8];
    const survive = [4, 5, 6, 7, 8];

    let n = 100;
    while (n--) {
      field = StridedView.random([room.width, room.height], () =>
        Math.random() < 0.4 ? 1 : 0
      );

      let i = 0;
      while (i < 10) {
        i++;
        next();
      }

      const [cx, cy] = [room.cx - room.x, room.cy - room.y];
      field.set(...[cx, cy], 1);
      field.floodFill([cx, cy], 4, 4);
      const c = field.reduce((acc, v) => (v === 4 ? acc + 1 : acc), 0);
      if (c > 9) break;
    }

    map.placeWith(field!, [room.x, room.y], v =>
      v === 4 ? Type.FLOOR : Type.VOID
    );

    function next() {
      field = field.map((c, [x, y]) => {
        let n = 0;
        for (const [v] of field.getNeighbors([x, y])) {
          if (v) n++;
        }

        if (c) {
          if (survive.includes(n)) return 1;
        } else {
          if (born.includes(n)) return 1;
        }
        return c;
      });
    }
  }
}

function placeCorridor(a: Room, b: Room) {
  if (Math.random() > 0.5) {
    addSegment([b.cx, b.cy], [a.cx, b.cy]);
    addSegment([a.cx, b.cy], [a.cx, a.cy]);
  } else {
    addSegment([b.cx, b.cy], [b.cx, a.cy]);
    addSegment([b.cx, a.cy], [a.cx, a.cy]);
  }

  function addSegment(a: [number, number], b: [number, number]) {
    const [x, y] = a;
    const [px, py] = b;
    const corridor = map.slice(
      [Math.min(x, px), Math.min(y, py)],
      [Math.abs(x - px) + 1, Math.abs(y - py) + 1]
    );
    corridor.fill(Type.CORRIDOR);
  }
}
