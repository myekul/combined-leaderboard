function getDailyRandomIndex() {
    const today = new Date().toISOString().slice(0, 10);
    // Get eligible players
    const eligible = players.filter(p => p.score >= 90);
    if (eligible.length === 0) return 0;
    // Create a seed from the date
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) % 2147483647;
    }
    // Deterministically shuffle eligible players using the hash as a seed
    function seededRandom(seed) {
        return function () {
            seed = (seed * 9301 + 49297) % 233280;
            return seed / 233280;
        };
    }
    const rand = seededRandom(hash);
    // Fisher-Yates shuffle
    for (let i = eligible.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }
    // Find the index of the selected player in the original players array
    const selected = eligible[0];
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