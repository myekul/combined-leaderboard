function generateFeatured() {
    let everyRun = getEveryRun(300)
    everyRun.sort((a, b) => new Date(b.run.date) - new Date(a.run.date))
    everyRun = everyRun.filter(run => run.run.percentage >= 90)
    if (gameID == 'mtpo') {
        everyRun = everyRun.filter((run, runIndex) => runIndex != 0)
    }
    let HTMLContent = `<div class='container' style='padding-top:8px'><table class='bigShadow' style='border-collapse:collapse'>`
    if (mode == 'commBestILs') {
        everyRun = shuffleArray(everyRun)
    }
    everyRun.slice(0, 5).forEach((run, runIndex) => {
        HTMLContent += `<tr class='${getRowColor(runIndex)}'>`
        HTMLContent += fancyRun(run.run, run.categoryIndex)
        HTMLContent += fancyPlayer(run.playerIndex)
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    if (gameID == 'mtpo' && sortCategoryIndex == 0) {
        HTMLContent = `<div class='container'>This leaderboard assumes everyone has a 42 Glass Joe.</div>`
    }
    document.getElementById('featured').innerHTML = HTMLContent
}
function fancyRun(run, categoryIndex, extra) {
    const category = categories[categoryIndex]
    let HTMLContent = ''
    if (mode != 'commBestILs') {
        const date = run.date
        const dateDif = daysAgo(getDateDif(new Date(), new Date(date)))
        HTMLContent += `<td style='padding:0 8px'>
        <div style='font-size:90%'>${date}</div>
        <div style='font-size:70%'>${dateDif}</div>
        </td>`
    }
    if (sortCategoryIndex == -1 && mode != 'fullgame') {
        HTMLContent += `<td style='padding:0 5px'>`
        HTMLContent += category.info?.id && bossILindex == -1 ? `<div class='container ${category.info.id}' style='border-radius:5px;width:50px;height:50px'>${getImage(category.info.id)}</div>` : ''
        HTMLContent += sortCategoryIndex == -1 && mode != 'commBestILs' ? categorySpan(category) : ''
        HTMLContent += `</td>`
    }
    HTMLContent += `<td style='padding:0 5px'>`
    HTMLContent += sortCategoryIndex == -1 && mode == 'fullgame' ? `<div style='font-size:80%;padding-bottom:4px'>${categorySpan(category)}</div>` : ''
    HTMLContent += `<div class='${category.className}' style='font-size:140%;border-radius:5px;padding:0 2px'>${secondsToHMS(run.score)}</div>`
    HTMLContent += !extra ? `<div style='font-size:80%;padding-top:4px'>${scoreGradeSpan(run.percentage)}</div>` : ''
    HTMLContent += `<div style='padding-top:2px'>${getTrophy(run.place)}</div>`
    HTMLContent += `</td>`
    let runLink = run.videos ? run.videos.links[run.videos.links.length - 1].uri : ''
    if (run.videos.links.length > 1) {
        run.videos.links.forEach(link => {
            if (link.uri.includes('you')) {
                runLink = link.uri
            }
        })
    }
    HTMLContent += `<td>${getThumbnail(runLink, getYouTubeID(runLink))}</td>`
    return HTMLContent
}
function fancyPlayer(playerIndex) {
    const player = players[playerIndex]
    let HTMLContent = ''
    HTMLContent += `<td style='padding-left:8px'>${getPlayerFlag(player, 20)}</td>`
    HTMLContent += `<td style='padding:0 5px'>${getPlayerIcon(player, 48)}</td>`
    HTMLContent += `<td ${sortCategoryIndex == -1 ? `class='clickable' onclick="openModal(${playerIndex},'up')"` : ''} style='font-size:120%;text-align:left;padding-right:8px'>${getPlayerName(player)}</td>`
    return HTMLContent
}
// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}