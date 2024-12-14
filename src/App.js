import React, { useState } from "react";
import "./App.css";

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(10);
  const [speed, setSpeed] = useState(500);
  const [sortingMethod, setSortingMethod] = useState("bubble");
  const [isSorting, setIsSorting] = useState(false);
  const [activeIndices, setActiveIndices] = useState([]);
  const [swappingIndices, setSwappingIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);

  const generateArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 300) + 20
    );
    setArray(newArray);
    setSortedIndices([]);
    setActiveIndices([]);
    setSwappingIndices([]);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const bubbleSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIndices([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
          await sleep(speed);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
        setSwappingIndices([]);
        await sleep(speed);
      }
      setSortedIndices((prev) => [...prev, arr.length - i - 1]);
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  const insertionSort = async () => {
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let j = i;
      while (j > 0 && arr[j - 1] > arr[j]) {
        setActiveIndices([j - 1, j]);
        setSwappingIndices([j - 1, j]);
        await sleep(speed);
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        setArray([...arr]);
        j--;
        setSwappingIndices([]);
        await sleep(speed);
      }
      setActiveIndices([]);
    }
    setSortedIndices([...Array(arr.length).keys()]);
    setIsSorting(false);
  };

  const selectionSort = async () => {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        setActiveIndices([minIndex, j]);
        await sleep(speed);
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        setSwappingIndices([i, minIndex]);
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        await sleep(speed);
        setSwappingIndices([]);
      }
      setSortedIndices((prev) => [...prev, i]);
    }
    setIsSorting(false);
  };

  const mergeSort = async () => {
    const arr = [...array];
    const merge = async (left, right) => {
      let sortedArray = [];
      let leftIndex = 0;
      let rightIndex = 0;

      while (leftIndex < left.length && rightIndex < right.length) {
        setActiveIndices([leftIndex, rightIndex]);
        await sleep(speed);
        if (left[leftIndex] < right[rightIndex]) {
          sortedArray.push(left[leftIndex]);
          leftIndex++;
        } else {
          sortedArray.push(right[rightIndex]);
          rightIndex++;
        }
      }

      sortedArray = [...sortedArray, ...left.slice(leftIndex), ...right.slice(rightIndex)];
      return sortedArray;
    };

    const sort = async (array) => {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      const left = array.slice(0, mid);
      const right = array.slice(mid);
      const sortedLeft = await sort(left);
      const sortedRight = await sort(right);
      return merge(sortedLeft, sortedRight);
    };

    const sortedArray = await sort(arr);
    setArray([...sortedArray]);
    setSortedIndices([...Array(arr.length).keys()]);
    setIsSorting(false);
  };

  const quickSort = async () => {
    const arr = [...array];
    const partition = async (low, high) => {
      const pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        setActiveIndices([i, j]);
        await sleep(speed);
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      return i + 1;
    };

    const sort = async (low, high) => {
      if (low < high) {
        const pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      }
    };

    await sort(0, arr.length - 1);
    setSortedIndices([...Array(arr.length).keys()]);
    setIsSorting(false);
  };

  const startSorting = () => {
    setIsSorting(true);
    switch (sortingMethod) {
      case "bubble":
        bubbleSort();
        break;
      case "insertion":
        insertionSort();
        break;
      case "selection":
        selectionSort();
        break;
      case "merge":
        mergeSort();
        break;
      case "quick":
        quickSort();
        break;
      default:
        setIsSorting(false);
        break;
    }
  };

  return (
    <div className="container">
      <h1>Sorting Visualizer</h1>
      <div className="controls">
        <div>
          <label>Array Size:</label>
          <input
            type="number"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            disabled={isSorting}
            min="5"
            max="100"
          />
        </div>
        <button onClick={generateArray} disabled={isSorting}>
          Generate Array
        </button>
        <div>
          <label>Sorting Method:</label>
          <select
            value={sortingMethod}
            onChange={(e) => setSortingMethod(e.target.value)}
            disabled={isSorting}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>
        <div>
          <label>Speed:</label>
          <input
            type="range"
            min="50"
            max="2000"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={isSorting}
          />
          <span>{speed} ms</span>
        </div>
        <button onClick={startSorting} disabled={isSorting}>
          Start Sorting
        </button>
      </div>
      <div className="array-container">
        {array.map((value, index) => (
          <div
            key={index}
            className="array-bar"
            style={{
              height: `${value}px`,
              backgroundColor: sortedIndices.includes(index)
                ? "green"
                : swappingIndices.includes(index)
                ? "red"
                : activeIndices.includes(index)
                ? "yellow"
                : "blue",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;
