function getDailyRandomIndex() {
    const today = new Date().toISOString().slice(0, 10)
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) % 2147483647;
    }
    let count = 0;
    for (let i = 0; i < players.length; i++) {
        if (players[i].score >= 90) {
            count++;
        } else {
            break;
        }
    }
    return hash % count;
}
function generateSpotlightPlayer() {
    spotlightPlayerIndex = getDailyRandomIndex()
    const player = players[spotlightPlayerIndex]
    document.getElementById('spotlightDiv').innerHTML = getPlayerIcon(player, 64)
}
function generateSpotlight() {
    const player = players[spotlightPlayerIndex]
    let HTMLContent = ''
    HTMLContent += getPlayerProfile(spotlightPlayerIndex)
    HTMLContent += `<div class='container' style='margin-top:20px'>`
    let rowCount = 0
    player.runs.forEach((run, runIndex) => {
        if (run) {
            rowCount++
            HTMLContent += `<table>`
            const rowColor = getRowColor(rowCount)
            HTMLContent += `<tr class='${rowColor}'>${fancyTime(run, runIndex)}</tr>`
            HTMLContent += `<tr class='${rowColor}'>${fancyThumbnail(run, 200)}</tr>`
            HTMLContent += `<tr class='${rowColor}'>${fancyDate(run)}</tr>`
            HTMLContent += `</table>`
        }
    })
    HTMLContent += `</div>`
    const myekulSaysText = myekulSays[player.name]
    if (myekulSaysText) {
        HTMLContent += `<div style='width:500px;margin:0 auto;margin-top:20px'>`
        HTMLContent += myekulSaysDiv()
        HTMLContent += `<div class='container textBlock' style='font-size:80%'>${myekulSaysText}</div>`
        HTMLContent += `</div>`
    }
    document.getElementById('spotlight').innerHTML = HTMLContent
}