function ballpit() {
    let HTMLContent = ''
    let playerIndex = 0
    let count = 0
    const max = 50
    while (count < max && count < players.length && playerIndex < players.length) {
        const player = players[playerIndex]
        const playerValue = mode == 'commBestILs' ? player.extra?.percentage : player.score
        if (playerValue >= 90 && player?.links?.img) {
            HTMLContent += `<div class='ball' data-size=${normalizePlayerValue(playerValue)}>${getPlayerIcon(player, normalizePlayerValue(playerValue))}</div>`
            count++
        }
        playerIndex++
    }
    setBallpit(HTMLContent)
}
function normalizePlayerValue(value) {
    const min = 90, max = 100;
    const newMin = 50, newMax = 150;
    return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
}