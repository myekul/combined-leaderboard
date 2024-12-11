function generateSort() {
    sortCategoryIndex = -1
    const sortCriteria = document.getElementById('dropdown_sortCriteria').value
    HTMLContent = ''
    if (sortCriteria == 'player') {
        HTMLContent += `<table class='bigShadow'>`
        players.forEach((player, playerIndex) => {
            HTMLContent += parsePlayer(player, playerIndex)
        })
        HTMLContent += `</table>`
    } else {
        HTMLContent += sortRuns(sortCriteria)
    }
    document.getElementById('sort').innerHTML = HTMLContent
}
function sortRuns(sortCriteria) {
    const everyRun = []
    players.slice(0, 300).forEach((player, playerIndex) => {
        player.runs.forEach((run, runIndex) => {
            if (run) {
                everyRun.push({ run: run, playerIndex: playerIndex, categoryIndex: runIndex })
            }
        })
    })
    everyRun.sort((a, b) => {
        const aRun = a.run;
        const bRun = b.run;
        if (aRun && bRun) {
            if (sortCriteria == 'score') {
                return bRun.percentage - aRun.percentage
            }
            if (sortCriteria == 'date') {
                const aDate = new Date(aRun.date);
                const bDate = new Date(bRun.date);
                return bDate - aDate;
            }
            if (sortCriteria == 'time') {
                return aRun.score - bRun.score
            }
        }
        if (aRun) return -1;
        if (bRun) return 1;
        return 0;
    });
    let HTMLContent = `<table class='bigShadow'>`
    everyRun.slice(0, getNumDisplay()).forEach((run, runIndex) => {
        HTMLContent += `<tr class='${getRowColor(runIndex)}'>`
        HTMLContent += `<td>${runIndex + 1}</td>`
        const player = players[run.playerIndex]
        const category = categories[run.categoryIndex]
        let className = category.info ? category.info.id : category.className
        if (big5()) {
            className = category.difficulty
        }
        if (sortCriteria == 'date') {
            if (runIndex < everyRun.length - 1) {
                const date1 = new Date(run.run.date)
                const date2 = new Date(everyRun[runIndex + 1].run.date)
                const dateDif = (date1 - date2) / (100 * 60 * 60 * 24) / 10
                HTMLContent += `<td>${dateDif}</td>`
            } else {
                HTMLContent += `<td></td>`
            }
            HTMLContent += `<td>${run.run.date}</td>`
        } else if (sortCriteria == 'score') {
            const percentage = getPercentage(run.run.percentage)
            const grade = getLetterGrade(percentage)
            HTMLContent += `<td class='${grade.className}'>${displayPercentage(percentage)}</td>`
        }
        HTMLContent += `<td class='${className}'>${category.name}</td>`
        HTMLContent += category.info ? `<td class='container ${category.info.id}'>${getImage(category.info.id, 20)}</td>` : ''
        HTMLContent += parseRun(player, run.playerIndex, category, run.categoryIndex)
        HTMLContent += getPlayerDisplay(player)
        HTMLContent += `</tr>`
    })
    HTMLContent += `</table>`
    if (!showMore && everyRun.length > getNumDisplay()) {
        HTMLContent += `<div onclick="showMorePlayers()" class='button' style='margin:0 auto;margin-top:15px'>Show More</div>`
    } else {
        showMore = false
    }
    return HTMLContent
}