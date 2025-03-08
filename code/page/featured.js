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
        if (mode != 'commBestILs') {
            const date = run.run.date
            const dateDif = daysAgo(getDateDif(new Date(), new Date(date)))
            HTMLContent += `<td style='padding:0 5px'>
            <div style='font-size:90%'>${date}</div>
            <div style='font-size:70%'>${dateDif}</div>
            </td>`
        }
        const category = categories[run.categoryIndex]
        if (sortCategoryIndex == -1) {
            HTMLContent += `<td style='padding:0 2px'><div>`
            HTMLContent += category.info?.id && bossILindex == -1 ? `<div class='container ${category.info.id}' style='border-radius:5px;width:50px;height:50px'>${getImage(category.info.id)}</div>` : ''
            HTMLContent += sortCategoryIndex == -1 && mode != 'commBestILs' ? `${categorySpan(category)}` : ''
            HTMLContent += `</td>`
        }
        HTMLContent += `<td style='padding:0 5px'>
        <div class='${category.className}' style='font-size:140%;border-radius:5px'>${secondsToHMS(run.run.score)}</div>
        <div style='font-size:80%;padding-top:5px'>${scoreGradeSpan(run.run.percentage)}</div>
        <div style='padding-top:2px'>${getTrophy(run.run.place)}</div>
        </td>`
        const link = run.run.videos ? run.run.videos.links[0].uri : ''
        HTMLContent += `<td>${getThumbnail(link, getYouTubeID(link))}</td>`
        const player = players[run.playerIndex]
        HTMLContent += `<td style='padding-left:5px'>${getPlayerFlag(player, 20)}</td>`
        HTMLContent += `<td style='padding:0 5px'>${getPlayerIcon(player, 48)}</td>`
        HTMLContent += `<td ${sortCategoryIndex == -1 ? `class='clickable' onclick="openModal(${run.playerIndex},'up')"` : ''} style='font-size:120%;text-align:left;padding-right:8px'>${getPlayerName(player)}</td>`
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table></div>`
    if (gameID == 'mtpo' && sortCategoryIndex == 0) {
        HTMLContent = `<div class='container'>This leaderboard assumes everyone has a 42 Glass Joe.</div>`
    }
    document.getElementById('featured').innerHTML = HTMLContent
}
// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}