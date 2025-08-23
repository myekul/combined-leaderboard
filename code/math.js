function findSum(arr) {
    return math.sum(arr);
}
function findMean(arr) {
    if (arr.length == 0) return "-";
    const mean = math.mean(arr);
    return secondsToHMS(Math.round(mean));
}
function findMedian(arr) {
    if (arr.length == 0) return "-";
    const median = math.median(arr)
    return secondsToHMS(Math.round(median));
}
function findMode(arr) {
    if (arr.length == 0) return "-";
    const mode = math.mode(arr)
    mode.forEach((num, index) => {
        mode[index] = secondsToHMS(num)
    })
    if (mode.length == arr.length) return '-'
    return mode.join(', ');
}
function findStandardDeviation(arr) {
    if (arr.length == 0) return "-";
    const std = math.std(arr)
    return Math.round(std) + 's';
}
const statTypes = [
    { label: 'Mean', func: findMean },
    { label: 'Median', func: findMedian },
    { label: 'Mode', func: findMode },
    { label: 'Std. dev', func: findStandardDeviation }
]