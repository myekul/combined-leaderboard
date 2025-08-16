function ballpit() {
    let HTMLContent = ''
    let playerIndex = 0
    let count = 0
    const max = 50
    while (count < max && count < players.length && playerIndex < players.length) {
        const player = players[playerIndex]
        if ((player.score >= 90 || (mode == 'commBestILs' && player.extra?.percentage >= 90)) && player?.links?.img) {
            HTMLContent += `<div class='ball'>${getPlayerIcon(player, 100)}</div>`
            count++
        }
        playerIndex++
    }
    document.getElementById('ballpit').innerHTML = HTMLContent
    document.getElementById('ballpitRefresh').innerHTML = ballpitRefresh()
    ballpitEngine();
}