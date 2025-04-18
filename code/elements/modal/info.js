function modalInfo() {
    let HTMLContent = `<img src='images/external/myekul.png' class='container' style='height:50px;width:50px'><div class='textBlock' style='font-family:"cuphead-memphis"'>`
    HTMLContent += `Hello! My name is ${myekulColor(`myekul`)} and I am a Cuphead speedrunner and web developer.
        This is my ${myekulColor(`Combined Leaderboard`)} project, a tool that organizes and ranks players based on their overall domination of a game's leaderboards.
        <br>
    ${infoTitle('Controls')}
    <br>-Use left and right arrow keys to switch between categories.
    <br>-Click on a player's name to view their report card!
    <br>&nbsp;&nbsp;&nbsp;&nbsp;-Use arrow keys to navigate between player stats.
    <br>`
    if (mode != 'commBestILs' && !(gameID == 'cuphead' && mode == 'levels')) {
        HTMLContent += `${infoTitle('How it works')}
            <br>Each player recieves an overall score (out of 100) and a letter grade, which are determined by a few things.
            First, to calculate a given run score (0-100), ${myekulColor(`the world record is divided by the run time`)}.
            <br><br>
            <div class='container textBox' style='justify-content:left'>
            <div onclick='generateInfoExample()' class='clickable' style='width:25px;text-align:center;padding-right:3px'><i class='fa fa-refresh'></i></div>
            <div id='infoExample'>${infoExample()}</div></div>

            <div class='textBox'><i class='fa fa-exclamation-triangle myekulColor'></i> If a player has a run score worse than the average of their best score and
            ${scoreGradeSpan(getPercentage((categories.length - 1) / categories.length))}
             (${myekulColor(`[# of categories - 1] / [# of categories]`)}),
             but they have another run greater than that, then ${myekulColor(`their bad score will be forgiven`)}.
            This logic ensures that submitting a bad run is better than having no submission at all.
            </div>

            <br>After a player's run scores are determined, missing runs are taken into consideration.
            <span class='myekulColor'>If a player is missing a run, they will recieve an overall score penalty</span>.
            <br><br>For each missing run, the player will recieve a placeholder score to be used in overall score calculation.
            The default placeholder is <span class='myekulColor'>([Player's best score] + (100 * ((1 / [# of categories]) / [# of categories])) / 2</span>.
            <br>To view a player's calculation scores, press the ${fontAwesome('info-circle')} button in the bottom right of their report card.<br>`
        // if (['cuphead', 'sm64'].includes(gameID)) {
        //     HTMLContent += `<br><div class='textBox'><i class='fa fa-exclamation-triangle myekulColor'></i> In some cases, the missing run penalty will be reduced if the player has another run in a similar category.`
        //     if (gameID == 'cuphead') {
        //         HTMLContent += `<br><br>-If a player has an NMG run but no submitted 1.1+ run, their NMG run will be used in 1.1+ score calculation.
        //             <br>-If a player has a 1.1+ run but no NMG run, their NMG penalty will be reduced.
        //             <br>-If a player has a 1.1+ and/or NMG run and a DLC run but no DLC+Base run, their DLC+Base penalty will be reduced.
        //             <br>-If a player has a DLC+Base run but no DLC run, their DLC penalty will be reduced.`
        //     } else if (gameID == 'sm64') {
        //         HTMLContent += `<br><br>-If a player has a 0-Star run but no 1-Star run, their 1-Star penalty will be reduced.`
        //     }
        //     HTMLContent += `</div>`
        // }
    }
    HTMLContent += infoTitle('Disclaimer')
    HTMLContent += `<br>Overall player rank calculation can be a very subjective thing.
    I made this website as a fun hobby project, and it may not reflect the actual skill levels of each player.
    <br><br>
    Personally, I like to think of it as an "overall player relevancy" ranking as opposed to a "player skill" ranking,
    but I encourage you to make your own conclusions.
    <br>`
    HTMLContent += infoTitle('Services Used')
    HTMLContent += `${infoExternal('src')} clickable' style='text-decoration:underline'>${getAnchor('https://github.com/speedruncomorg/api')}Speedrun.com API</a></span>&nbspis used to extract data from the SRC database.
        ${infoExternal('sheets')}'>Google Sheets API</span>&nbspis used to extract data from spreadsheets.
        ${infoExternal('firebase')}'>Firebase API</span>&nbspis used to cache and organize data from SRC.
        ${infoExternal('youtube')}'>YouTube API</span>&nbspis used to retrieve video statistics.
        ${infoExternal('github')}'>GitHub Pages</span>&nbspis used to host this site.
        <br><br>Additionally, <span class='myekulColor'>Google Charts</span> and <span class='myekulColor'>D3.js</span> are used for data visualizations.
        <br><br>This is a static site written entirely in raw HTML / CSS / JavaScript, which makes it extremely lightweight and efficient.
        It was created from scratch, and made specifically for the speedrunning community.
        It is also open source, ad-free, nonprofit, and costs $0 to use, host, and maintain. Enjoy!`
    HTMLContent += `</div><img src='images/external/myekul.png' class='container' style='height:50px;width:50px;padding:10px 0'>`
    return HTMLContent
}
function myekulColor(content) {
    return `<span class='myekulColor'>${content}</span>`
}
function infoTitle(title) {
    return `<br><div style='font-family: var(--font2);font-size: 140%;color: var(--bannerText);padding: 0 10px;background-color: var(--banner);border-radius: 5px;'>${title}</div>`
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
    return `e.g. For ${categorySpan(category)}, ${getPlayerName(examplePlayer)} has a ${tetrisCheck(category, exampleRun.score)} and the world record is ${tetrisCheck(category, getWorldRecord(category))} by ${WRholder}.
    <br>The calculation would be ${tetrisCheck(category, getWorldRecord(category))} / ${tetrisCheck(category, exampleRun.score)}.
    <br>${getPlayerName(examplePlayer)} would recieve ${scoreGradeSpan(exampleRun.percentage)} for this category.`
}
function generateInfoExample() {
    playSound('move')
    document.getElementById('infoExample').innerHTML = infoExample()
}
function infoExternal(external) {
    const white = external == 'github' ? 'filter:brightness(0) invert(1)' : ''
    return `<br><img src='images/external/${external}.png' style='width:20px;height:auto;padding-right:3px;${white}'></img><span class='myekulColor`
}