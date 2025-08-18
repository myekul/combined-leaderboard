function generateFeatured() {
    let everyRun = getEveryRun(300)
    if (gameID == 'mtpo') {
        everyRun = everyRun.filter(run => run.categoryIndex != 0)
    }
    everyRun.sort((a, b) => new Date(b.run.date) - new Date(a.run.date))
    everyRun = everyRun.filter(run => run.run.percentage >= 90)
    if (mode == 'commBestILs') {
        everyRun = shuffleArray(everyRun)
    }
    let HTMLContent = ''
    HTMLContent += `<div class='container'>${fancyTable(everyRun)}</div>`
    if (gameID == 'mtpo' && sortCategoryIndex == 0) {
        HTMLContent = `<div class='container'>This leaderboard assumes everyone has a 42 Glass Joe.</div>`
    }
    document.getElementById('featured').innerHTML = HTMLContent
}
// Fisher-Yates Shuffle Algorithm
// FIND LIBRARY
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}