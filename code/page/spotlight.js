function seededShuffle(array, seed) {
    const rng = new Math.seedrandom(seed);
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function getDailyRandomIndex() {
    const today = new Date().toISOString().slice(0, 10);
    const eligible = players.filter(p => p.score >= 90);
    if (eligible.length === 0) return 0;
    const shuffled = seededShuffle(eligible, today);
    const selected = shuffled[0];
    return players.indexOf(selected);
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
    HTMLContent += `<div class='container' style='margin-top:20px'><div class='container bigShadow'>`
    let rowCount = 0
    player.runs.forEach((run, runIndex) => {
        if (run) {
            rowCount++
            HTMLContent += `<table>`
            const rowColor = getRowColor(rowCount)
            HTMLContent += `<tr class='${rowColor}'>${fancyTime(run, runIndex)}</tr>`
            HTMLContent += `<tr class='${rowColor}'>${fancyThumbnail(run, 200)}</tr>`
            HTMLContent += `<tr class='${rowColor}' style='height:40px'>${fancyDate(run)}</tr>`
            HTMLContent += `</table>`
        }
    })
    HTMLContent += `</div></div>`
    const myekulSaysText = myekulSays[player.name]
    if (myekulSaysText) {
        HTMLContent += `<div style='width:500px;margin:0 auto;margin-top:20px'>`
        HTMLContent += myekulSaysDiv()
        HTMLContent += `<div class='container textBlock' style='font-size:80%'>${myekulSaysText}</div>`
        HTMLContent += `</div>`
    }
    document.getElementById('spotlight').innerHTML = HTMLContent
}