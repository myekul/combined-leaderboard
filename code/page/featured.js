function generateFeatured() {
    let everyRun = getEveryRun(300)
    const type = document.getElementById('dropdown_featured').value
    if (gameID == 'mtpo') {
        everyRun = everyRun.filter(run => run.categoryIndex != 0)
    }
    if (type == 'recent') {
        everyRun.sort((a, b) => new Date(b.run.date) - new Date(a.run.date))
        everyRun = everyRun.filter(run => run.run.percentage >= 90)
    } else {
        everyRun.sort((a, b) => b.run.percentage - a.run.percentage)
    }
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
function fancyTable(runs, numRuns = 5) {
    let HTMLContent = `<table class='bigShadow' style='border-collapse:collapse;border:4px solid var(--background)'>`
    runs.slice(0, numRuns).forEach((run, runIndex) => {
        HTMLContent += `<tr class='${getRowColor(runIndex)}'>`
        HTMLContent += fancyRun(run.run, run.categoryIndex)
        HTMLContent += fancyPlayer(run.playerIndex)
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    return HTMLContent
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