function generateCommBest() {
    let HTMLContent = ''
    if (commBestILsCategory.markin) {
        HTMLContent += `<div>`
        HTMLContent += `<div class='container' style='padding-bottom:10px;gap:10px'>
        <div class='button cuphead' style='width:180px' onclick="processSavFile(0,true);playSound('ready')">View World Record</div>
        <div class='grow'><a href="https://docs.google.com/spreadsheets/d/1JgTjjonfC7bh4976NI4pCPeFp8LbA3HMKdvS_47-WtQ" target="_blank" style='height:25px'>${sharedAssetsImg('sheets')}</a></div>
        </div>`
        HTMLContent += `<div class='container' style='gap:30px'>`
        HTMLContent += `<table>`
        HTMLContent += `<tr>
        <th style='color:var(--gray)'>WR</th>
        <th colspan=4 class='gray'>Comm Best Splits</th>
        </tr>`
        splitInfo.forEach((split, index) => {
            const player = players.find(player => player.name == runRecap_markin.bestSplitsPlayers[index].split('/')[0])
            const wrSplit = runRecap_markin.wrSplits[index]
            HTMLContent += `<tr class='${getRowColor(index)}'>`
            HTMLContent += `<td style='font-size:70%;color:var(--gray)'>${secondsToHMS(wrSplit, true)}</td>`
            HTMLContent += `<td class='container ${split.id}'>${getImage(split.id, 24)}</td>`
            HTMLContent += `<td class='${split.id}' style='padding:0 5px'>${secondsToHMS(runRecap_markin.bestSplits[index], true)}</td>`
            HTMLContent += getPlayerDisplay(player)
            HTMLContent += `</tr>`
            const nextIsle = splitInfo[index + 1]?.isle
            if (nextIsle != split.isle) {
                HTMLContent += `<tr style='height:16px'></tr>`
            }
        })
        HTMLContent += `</table>`
        // Segments
        HTMLContent += `<table>`
        HTMLContent += `<tr>
        <th style='color:var(--gray)'>WR</th>
        <th colspan=4 class='gray'>Comm Best Segments</th>
        </tr>`
        let sum = 0
        splitInfo.forEach((split, index) => {
            const playerName = runRecap_markin.bestSegmentsPlayers[index].split('/')[0]
            const player = players.find(player => player.name == playerName)
            const bestSegment = runRecap_markin.bestSegments[index]
            const wrSegment = runRecap_markin.wrSegments[index]
            sum += bestSegment
            HTMLContent += `<tr class='${getRowColor(index)}'>`
            HTMLContent += `<td style='font-size:70%;color:var(--gray)'>${secondsToHMS(wrSegment, true)}</td>`
            HTMLContent += `<td class='container ${split.id}'>${getImage(split.id, 24)}</td>`
            HTMLContent += `<td class='${split.id}' style='padding:0 5px'>${secondsToHMS(bestSegment, true)}</td>`
            HTMLContent += getPlayerDisplay(player ? player : playerName)
            HTMLContent += `</tr>`
            const nextIsle = splitInfo[index + 1]?.isle
            if (nextIsle != split.isle) {
                const content = index > 0 ? secondsToHMS(sum, true) : ''
                HTMLContent += `<tr style='height:16px'><td></td><td></td><td style='font-size:70%;color:var(--gray)'>${content}</td></tr>`
            }
        })
        HTMLContent += `</table>`
        HTMLContent += `</div>`
        HTMLContent += `</div>`
    } else {
        HTMLContent += `<div>Category not supported!</div>`
    }
    document.getElementById('commBest').innerHTML = HTMLContent
}