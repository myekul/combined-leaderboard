function generateFeatured() {
    let everyRun = getEveryRun(300)
    if (gameID == 'mtpo') {
        everyRun = everyRun.filter(run => run.categoryIndex != 0)
    }
    everyRun.sort((a, b) => new Date(b.run.date) - new Date(a.run.date))
    everyRun = everyRun.filter(run => run.run.percentage >= 90)
    let HTMLContent = ''
    HTMLContent += `
    <div class='container' style='gap:50px;align-items:flex-start'>
        ${fancyTable(everyRun)}
        <div id='featuredChart'></div>
    </div>`
    if (gameID == 'mtpo' && sortCategoryIndex == 0) {
        HTMLContent = `<div class='container'>This leaderboard assumes everyone has a 42 Glass Joe.</div>`
    }
    document.getElementById('content').innerHTML = HTMLContent

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - num_recent);

    const recentRuns = everyRun.filter(run => {
        const runDate = new Date(run.run.date);
        return runDate >= thirtyDaysAgo;
    });

    const runsByDay = {};

    recentRuns.forEach(run => {
        const day = run.run.date

        if (!runsByDay[day]) {
            runsByDay[day] = [];
        }

        runsByDay[day].push(run);
    });

    featuredHTML = `
    <table class='bigShadow'>
        <tr>
            <td colspan=10 class='gray bigHeader'>Recents</td>
        </tr>`
    for (let i = 0; i < num_recent; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const day = date.toISOString().slice(0, 10);
        const runs = runsByDay[day] || [];

        featuredHTML += `
        <tr class='${getRowColor(i)}' style='height:24px'>
            <td class='dim' style='font-size:80%;padding:0 5px'>${day}</td>`
        runs.forEach(run => {
            const player = players.find(player => player.name == run.run.playerName)
            featuredHTML += `<td class='${categories[run.categoryIndex].className ?? ''}' onmouseover="featuredToast('${run.run.playerName}','${run.run.score}')">${getPlayerIcon(player, 21)}</td>`
        })
        featuredHTML += `</tr>`
    }
    featuredHTML += `</table>`
    if (num_recent == 15) featuredHTML += `<button class='button' style='margin:10px auto;width:95px' onclick="playSound('category_select');num_recent=90;action()">Show more</button>`
    if (num_recent == 90) num_recent = 15
    document.getElementById('featuredChart').innerHTML = featuredHTML
}
function featuredToast(playerName, time) {
    const player = players.find(player => player.name == playerName)
    toast(getPlayerName(player) + ' - ' + secondsToHMS(time))
}