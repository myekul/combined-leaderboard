function fancyRun(run, categoryIndex, extra) {
    const category = categories[categoryIndex]
    let HTMLContent = ''
    if (mode != 'commBestILs') {
        HTMLContent += fancyDate(run)
    }
    if (sortCategoryIndex == -1 && mode != 'fullgame') {
        HTMLContent += `<td style='padding:0 5px'>`
        HTMLContent += category?.info?.id && bossILindex == -1 ? `<div class='container ${category.info.id}' style='border-radius:5px;width:50px;height:50px'>${getImage(category.info.id)}</div>` : ''
        HTMLContent += sortCategoryIndex == -1 && mode != 'commBestILs' ? categorySpan(category) : ''
        HTMLContent += `</td>`
    }
    HTMLContent += fancyTime(run, categoryIndex, extra)
    HTMLContent += fancyThumbnail(run)
    return HTMLContent
}
function fancyThumbnail(run, size) {
    return `<td>${getThumbnail(run.url, getYouTubeID(run.url), size)}</td>`
}
function fancyDate(run) {
    const date = run.date
    const dateDif = daysAgo(getDateDif(new Date(), new Date(date)))
    return `<td style='padding:0 8px'>
        <div style='font-size:90%'>${date}</div>
        <div style='font-size:70%'>${dateDif}</div>
        </td>`
}
function fancyTime(run, categoryIndex, extra) {
    const category = categories[categoryIndex]
    let HTMLContent = ''
    HTMLContent += `<td style='padding:0 5px'>`
    HTMLContent += sortCategoryIndex == -1 && mode == 'fullgame' ? `<div style='font-size:80%;padding-bottom:4px'>${categorySpan(category)}</div>` : ''
    const trophy = getTrophy(run.place)
    HTMLContent += `<div class='container' ${trophy ? `style='gap:5px'` : ''}>
    <div>${trophy}</div>
    <div class='${category?.className}' style='font-size:140%;border-radius:5px;padding:0 4px'>${secondsToHMS(run.score)}</div>
    </div>`
    HTMLContent += !extra ? `<div style='font-size:80%;padding-top:4px'>${scoreGradeSpan(run.percentage)}</div>` : ''
    HTMLContent += `</td>`
    return HTMLContent
}
function fancyPlayer(playerIndex) {
    const player = players[playerIndex]
    let HTMLContent = ''
    HTMLContent += `<td style='padding-left:8px'>${getPlayerFlag(player, 20)}</td>`
    HTMLContent += `<td style='padding:0 5px'>${getPlayerIcon(player, 48)}</td>`
    HTMLContent += `<td ${sortCategoryIndex == -1 ? `class='clickable' onclick="openModal('player','up','${player.name}')"` : ''} style='font-size:120%;text-align:left;padding-right:8px'>${getPlayerName(player)}</td>`
    return HTMLContent
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