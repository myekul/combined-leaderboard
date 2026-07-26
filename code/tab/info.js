async function generateInfo() {
    await setHTML('html/info.html', 'content')
    generateInfoExample(true)
    if (gameID == 'cuphead') document.getElementById('specialThanks').innerHTML = specialThanks
    document.querySelectorAll('.infoImg').forEach(img => {
        const external = img.id.split('_')[1]
        const invert = external == 'github' ? 'invert' : ''
        const underline = external == 'src' ? 'style="text-decoration:underline"' : ''
        let innerHTML = `
        <br>
        <span class='infoImg ${invert}'>${sharedAssetsImg(external)}</span>
        <span class='myekulColor' ${underline}>${externalNames[external]}</span>`
        img.innerHTML = innerHTML
    })
    document.getElementById('info_scoreGradeSpan').innerHTML = scoreGradeSpan(80)
}
function infoExample() {
    const categoryIndex = getRandomNumber(0, categories.length - 1)
    const category = categories[categoryIndex]
    const playersCopy = [...players]
    sortPlayers(playersCopy, categoryIndex)
    let playerIndex = 0
    let score = 100
    while (score > 90 && playerIndex < category.runs.length - 1) {
        playerIndex++
        score = playersCopy[playerIndex].runs[categoryIndex].percentage
    }
    playerIndex--
    const examplePlayer = playersCopy[getRandomNumber(1, playerIndex)]
    const exampleRun = examplePlayer.runs[categoryIndex]
    const WRholder = getPlayerName(playersCopy[0])
    return `
    e.g. For ${categorySpan(category)}, ${getPlayerName(examplePlayer)} has a ${secondsToHMS(exampleRun.score)},
    <br>and the world record is ${secondsToHMS(getWorldRecord(category))} by ${WRholder}.
    <br>The calculation would be ${secondsToHMS(getWorldRecord(category))} / ${secondsToHMS(exampleRun.score)}.
    <br>${getPlayerName(examplePlayer)} would recieve ${scoreGradeSpan(exampleRun.percentage)} for this category.`
}
function generateInfoExample(shh) {
    if (!shh) playSound('move')
    document.getElementById('infoExample').innerHTML = infoExample()
}
const externalNames = {
    'src': 'Speedrun.com API',
    'firebase': 'Firebase API',
    'youtube': 'YouTube API',
    'github': 'GitHub'
}