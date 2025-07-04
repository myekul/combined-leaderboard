function getPlayerName(player) {
    let playerName = player.name ? player.name : player
    if (playerName.charAt(0) == '[') {
        const match = playerName.match(/\(([^)]+)\)/)
        playerName = match ? match[1] : playerName.slice(4)
    }
    const HTMLContent = player['name-style'] ? `<span style='background: linear-gradient(90deg, ${player['name-style'].color1}, ${player['name-style'].color2});-webkit-background-clip: text;color: transparent;'>${player.name}</span>` : playerName
    return HTMLContent
}
function getPlayerFlag(player, size) {
    const playerLocation = player.location
    if (playerLocation) {
        let countryCode = playerLocation.country.code
        let countryName = playerLocation.country.name
        return getFlag(countryCode, countryName, size)
    }
    return ''
}
function getPlayerIcon(player, size) {
    const imgsrc = player?.links?.img ? player.links.img : ''
    const src = imgsrc ? 'https://www.speedrun.com/static/user/' + player.id + '/image?v=' + imgsrc : 'images/null.png'
    return `<div style='width:${size}px;height:${size}px'><img src='${src}' style='width:100%;height:100%;border-radius: 50%;object-fit: cover;object-position:center' title='${player?.name}'></img></div>`
}
function getPlayerDisplay(player, playerIndex) {
    let HTMLContent = ''
    HTMLContent += mode != 'commBestILs' && !isolated ? `<td class='${placeClass(player.rank)}' style='font-size:90%'>${player.rank}</td>` : ''
    if (gameID != 'tetris') {
        if (document.getElementById('checkbox_flags').checked && page != 'commBest') {
            HTMLContent += `<td>${getPlayerFlag(player, 12)}</td>`
        }
        if (document.getElementById('checkbox_icons').checked) {
            HTMLContent += `<td>${getPlayerIcon(player, 18)}</td>`
        }
    }
    const clickable = player?.rank && page != 'map' ? `onclick="openModal('player','up',${playerIndex})" class='clickable'` : ''
    HTMLContent += `<td ${clickable} style='text-align:left;font-weight: bold;font-size:80%;padding-right:5px'>${getPlayerName(player ? player : playerIndex)}</td>`
    return HTMLContent
}
function getPlayerProfile(playerIndex) {
    let HTMLContent = ''
    const player = players[playerIndex]
    HTMLContent += `<div class='container' style='padding-top:8px'>`
    HTMLContent += gameID != 'tetris' ? `<div style='padding-right:10px'>${getPlayerIcon(player, 64)}</div>` : ''
    HTMLContent += `<div>`
    HTMLContent += `<div class='container' style='padding-bottom:2px'>`
    HTMLContent += `<div style='font-size:150%;margin:0'>${getPlayerName(player)}</div>`
    HTMLContent += `</div>`
    if (player.links) {
        HTMLContent += `<div class='container' style='gap:5px;justify-content:flex-start'>`
        const flag = getPlayerFlag(player, 14)
        HTMLContent += `<div>${flag}</div>`
        HTMLContent += flag ? `<div class='container' style='width:10px;margin:0'>&#8226;</div>` : ''
        const socials = ['src', 'twitch', 'youtube']
        socials.forEach(social => {
            const anchor = getAnchor(getSocial(player, social))
            HTMLContent += anchor ? `${anchor}<img src='images/external/${social}.png' class='clickable container' style='height:18px;width:auto'></a>` : ''
        })
        HTMLContent += `</div>`
    }
    HTMLContent += `</div>`
    const boardTitle = generateBoardTitle(2)
    HTMLContent += boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''
    HTMLContent += `</div>`
    return HTMLContent
}