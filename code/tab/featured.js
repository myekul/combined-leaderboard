function generateFeatured() {
    let everyRun = getEveryRun(300)
    if (gameID == 'mtpo') {
        everyRun = everyRun.filter(run => run.categoryIndex != 0)
    }
    everyRun.sort((a, b) => new Date(b.run.date) - new Date(a.run.date))
    everyRun = everyRun.filter(run => run.run.percentage >= 90)
    let HTMLContent = ''
    HTMLContent += `<div class='container'>${fancyTable(everyRun)}</div>`
    if (gameID == 'mtpo' && sortCategoryIndex == 0) {
        HTMLContent = `<div class='container'>This leaderboard assumes everyone has a 42 Glass Joe.</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent
}