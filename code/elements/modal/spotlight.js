function seededShuffle(array, seed) {
    const rng = new Math.seedrandom(seed);
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
function getDailyRandomIndex(array) {
    const today = new Date().toISOString().slice(0, 10);
    const shuffled = seededShuffle(array, today);
    const selected = shuffled[0];
    return array.indexOf(selected);
}
function generateSpotlightPlayer() {
    aMinusPlayers = players.filter(p => p.score >= 90)
    aMinusPlayers = aMinusPlayers.filter(p => p.links.img)
    spotlightPlayerIndex = getDailyRandomIndex(aMinusPlayers)
    const player = players[spotlightPlayerIndex]
    document.getElementById('spotlightDiv').innerHTML = getPlayerIcon(player, 64)
}
function generateROTDrun() {
    aPlusRuns = getEveryRun().filter(run => run.run.percentage >= 97 && players[run.playerIndex].links.img)
    ROTDindex = getDailyRandomIndex(aPlusRuns)
    const run = aPlusRuns[ROTDindex]
    let HTMLContent = ''
    HTMLContent += `
    <div class='button ${categories[run.categoryIndex].className}' style='width:94px;height:28px;justify-content:left'>
        <div>${getPlayerIcon(players[run.playerIndex], 32)}</div>
        <div class='container' style='font-size:150%'>${secondsToHMS(run.run.score)}</div>
    </div>`
    document.getElementById('ROTDdiv').innerHTML = HTMLContent
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
            const rowColor = getRowColor(rowCount)
            HTMLContent += `
            <table>
                <tr class='${rowColor}'>${fancyTime(run, runIndex)}</tr>
                <tr class='${rowColor}'>${fancyThumbnail(run, true)}</tr>
                <tr class='${rowColor}' style='height:40px'>${fancyDate(run)}</tr>
            </table>`
        }
    })
    HTMLContent += `</div></div>`
    const myekulSaysText = myekulSays[player.name]
    if (myekulSaysText) {
        HTMLContent += `
        <div style='width:500px;margin:20px auto;'>
            ${myekulSaysDiv()}
            <div class='container textBlock' style='font-size:80%'>${myekulSaysText}</div>
        </div>`
    }
    return HTMLContent
}
function generateROTD() {
    let HTMLContent = ''
    const run = aPlusRuns[ROTDindex]
    HTMLContent += `
    <table>
    <tr>
    ${fancyRun(run.run, run.categoryIndex)}
    ${fancyPlayer(run.playerIndex)}
    </tr>
    </table>`
    return HTMLContent
}