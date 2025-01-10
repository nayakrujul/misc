// This file contains implementations of sorting algorithms
// which return arrays of states for visualisation

class ArrayState {
    /**
     * A custom class to store a single array state
     * @param {number[]} arr  An array of integers
     * @param {number[]} comps  An array of indices in `arr`
     */
    constructor(arr, comps) {
        this.arr = [...arr];
        this.comps = [...comps];
    }

    toString() {
        return this.arr.toString() + " (" + this.comps.join(",") + ")";
    }
}

function swap(lst, ix, jx) {
    let temp = lst[jx];
    lst[jx] = lst[ix];
    lst[ix] = temp;
}

function bubble_sort(arr) {
    let ret = [new ArrayState(arr, [])];
    for (let i = 0; i < arr.length; i++) 
    for (let j = 1; j < arr.length; j++) {
        if (arr[j - 1] > arr[j]) swap(arr, j - 1, j);
        ret.push(new ArrayState(arr, [j - 1, j]));
    }
    ret.push(new ArrayState(arr, []));
    return ret;
}

function optimised_bubble_sort(arr) {
    let ret = [new ArrayState(arr, [])];
    for (let i = 0; i < arr.length; i++) {
        let flag = true;
        for (let j = 1; j < arr.length - i; j++) {
            if (arr[j - 1] > arr[j]) {
                swap(arr, j - 1, j);
                flag = false;
            }
            ret.push(new ArrayState(arr, [j - 1, j]));
        }
        if (flag) {
            ret.push(new ArrayState(arr, []));
            return ret;
        }
    }
    ret.push(new ArrayState(arr, []));
    return ret;
}

function insertion_sort(arr) {
    let ret = [new ArrayState(arr, [])];
    for (let i = 1; i < arr.length; i++) {
        let item = arr[i];
        let j = i - 1;
        while (arr[j] > item) {
            arr[j + 1] = arr[j];
            ret.push(new ArrayState(arr, [j, j + 1]));
            j--;
        }
        arr[j + 1] = item;
        ret.push(new ArrayState(arr, [j]));
    }
    ret.push(new ArrayState(arr, []));
    return ret;
}

function selection_sort(arr) {
    let ret = [new ArrayState(arr, [])];
    for (let i = 0; i < arr.length; i++) {
        let mx = i;
        for (let j = i + 1; j < arr.length; j++) {
            ret.push(new ArrayState(arr, [mx, j]));
            if (arr[j] < arr[mx]) mx = j;
        }
        swap(arr, mx, i);
        ret.push(new ArrayState(arr, [mx, i]));
    }
    ret.push(new ArrayState(arr, []));
    return ret;
}
