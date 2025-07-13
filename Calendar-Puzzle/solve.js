const BOARD = [
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0],
];

const PIECES = [
    [
        [1, 1, 1, 1],
        [1, 0, 0, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
        [1, 0, 0],
    ],
    [
        [0, 1, 1, 1],
        [1, 1, 0, 0],
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0],
    ],
    [
        [1, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    [
        [1, 1, 1],
        [1, 0, 1],
    ],
    [
        [1, 1, 1],
        [1, 1, 0],
    ],
    [
        [1, 1, 1, 1],
    ],
    [
        [1, 1, 1],
        [1, 0, 0],
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
    ],
];

let [bh, bw] = [BOARD.length, BOARD[0].length];


/**
 * Creates a deep copy of a 2D array
 * @param {any[][]} arr  The array to copy
 * @returns {any[][]}  The copied array
 */
function deepcopy(arr) {
    return arr.map(sub => [...sub]);
}

/**
 * Recursively checks if two objects are equal
 * @param {any} a  First object
 * @param {any} b  Second object
 * @returns {boolean}  If they are equal
 */
function eq(a, b) {
    if (Array.isArray(a)) {
        if (Array.isArray(b)) {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++)
                if (!eq(a[i], b[i])) return false;
            return true;
        } else return false;
    } else if (Array.isArray(b)) return false;
    else return a === b;
}


/**
 * Checks if the item is an element of the array, using `eq`
 * @param {any[]} arr  The array
 * @param {any} item  The item
 * @returns {boolean}  If the item is in the array
 */
function contains(arr, item) {
    return arr.some(x => eq(x, item));
}


/**
 * Takes a rectangular 2D array and swaps rows and columns
 * @param {any[][]} arr  The nested array to transpose
 * @returns {any[][]}  The transposed array
 */
function transpose(arr) {
    let ret = [];
    for (let j = 0; j < arr[0].length; j++) {
        let row = [];
        for (let i = 0; i < arr.length; i++)
            row.push(arr[i][j]);
        ret.push(row);
    }
    return ret;
}


/**
 * Takes a piece and rotates it 90 degrees anti-clockwise
 * @param {number[][]} pc  The piece to rotate
 * @returns {number[][]}  The rotated piece
 */
function rotate90(pc) {
    return transpose(pc).reverse();
}


/**
 * Takes a piece and flips it vertically
 * @param {number[][]} pc  The piece to flip
 * @returns {number[][]}  The flipped piece
 */
function mirror(pc) {
    return deepcopy(pc).reverse();
}


/**
 * Equivalent to Python's `divmod`.
 * @param {number} n  The dividend
 * @param {number} d  The divisor
 * @returns {[number, number]}  The results of floor division and modulus
 */
function divmod(n, d) {
    return [Math.floor(n / d), n % d];
}


/**
 * Blocks a given date from the board
 * @param {number[][]} b  The original board
 * @param {number} m  The month: from 0 (Jan) to 11 (Dec)
 * @param {number} d  The date: from 0 (1st) to 30 (31st)
 * @param {number} w  The weekday: from 0 (Sun) to 6 (Mon)
 * @returns {number[][]}  The new board
 */
function block_date(b, m, d, w) {
    let n = deepcopy(b);
    let [mx, my] = divmod(m, 6);
    n[mx][my] = 1;
    let [dx, dy] = divmod(d, 7);
    n[dx + 2][dy] = 1;
    let [wx, wy] = divmod(w - 1, 3)
    if (w === 0) n[6][3] = 1;
    else n[wx + 6][wy + 4] = 1;
    return n;
}


/**
 * Checks if a piece can be placed in a given position
 * @param {number[][]} brd  The board state
 * @param {number[][]} pc  The piece to be placed
 * @param {number} r  The row index of the top-left corner
 * @param {number} c  The column index of the top-left corner
 * @returns {boolean}  Whether or not the piece can be placed there
 */
function can_place_piece(brd, pc, r, c) {
    let [dx, dy] = [pc.length, pc[0].length];
    if (r + dx > bh || c + dy > bw) return false;
    for (let x = 0; x < dx; x++)
        for (let y = 0; y < dy; y++)
            if (brd[r + x][c + y] & pc[x][y])
                return false;
    return true;
}

/**
 * Places a piece in the given position
 * @param {number[][]} brd  The board state
 * @param {number[][]} pc  The piece to be placed
 * @param {number} r  The row index of the top-left corner
 * @param {number} c  The column index of the top-left corner
 * @returns {number[][]}  The updated board
 */
function place_piece(brd, pc, r, c) {
    let nb = deepcopy(brd);
    let [dx, dy] = [pc.length, pc[0].length];
    for (let x = 0; x < dx; x++) {
        for (let y = 0; y < dy; y++)
            nb[r + x][c + y] =
                brd[r + x][c + y] | pc[x][y];
    }
    return nb;
}


/**
 * Recursively solves the calendar puzzle
 * @param {*} board  Current state of the board
 * @param {*} pieces  List of pieces yet to be placed
 * @param {*} placed  List of pieces which have been placed
 * @returns {any[][]?}  Represents the positions of each piece on the completed board
 */
function solve(board, pieces, placed) {
    if (pieces.length === 0) return placed;

    let pc = pieces[0];
    for (let or of pc) {
        let [oh, ow] = [or.length, or[0].length];
        for (let row = 0; row <= bh - oh; row++)
            for (let col = 0; col <= bw - ow; col++)
                if (can_place_piece(board, or, row, col)) {
                    let res = solve(
                        place_piece(board, or, row, col),
                        pieces.slice(1),
                        [...placed, [deepcopy(or), row, col]]
                    );
                    if (res !== null) return res;
                }
    };

    return null;
}


let pcs = [];

pcs = PIECES.map(p => {
    let optns = [];
    for (let i = 0; i < 4; i++) {
        p = rotate90(p);
        if (!contains(optns, p)) optns.push(deepcopy(p));
    }
    p = mirror(p);
    for (let j = 0; j < 4; j++) {
        p = rotate90(p);
        if (!contains(optns, p)) optns.push(deepcopy(p));
    }
    return optns;
});
