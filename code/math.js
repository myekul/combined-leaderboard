// Imported from MMA
function findSum(arr) {
    let intArray = arr.map(value => parseInt(value, 10));
    const sum = intArray.reduce((acc, num) => acc + num, 0);
    return sum;
}
function findMean(arr) {
    if (arr.length == 0) {
        return "-";
    }
    const sum = findSum(arr)
    const mean = sum / arr.length;
    return secondsToHMS(Math.round(mean));
}
function findMedian(arr) {
    if (arr.length == 0) {
        return "-";
    }
    let median;
    let intArray = arr.map(value => parseFloat(value));
    intArray.sort((a, b) => a - b);
    const mid = Math.floor(intArray.length / 2);
    if (intArray.length % 2 !== 0) {
        median = intArray[mid];
    } else {
        median = (intArray[mid - 1] + intArray[mid]) / 2;
    }
    return secondsToHMS(Math.round(median));
}
function findMode(arr) {
    if (arr.length == 0) {
        return "-";
    }
    const frequency = {};
    let maxFreq = 0;
    arr.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
        }
    });
    const modes = [];
    for (const num in frequency) {
        if (frequency[num] === maxFreq) {
            modes.push(secondsToHMS(num));
        }
    }
    if (modes.length == arr.length) {
        return '-'
    }
    return modes.join(', ');
}
function findStandardDeviation(arr) {
    if (arr.length == 0) {
        return "-";
    }
    let intArray = arr.map(value => parseInt(value, 10));
    const n = intArray.length;
    if (n === 0) return 0;
    const mean = intArray.reduce((sum, value) => sum + value, 0) / n;
    const variance = intArray.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
    const standardDeviation = Math.sqrt(variance);
    return Math.round(standardDeviation) + 's';
}