function drawChart() {
    const backgroundColor = rootStyles.getPropertyValue('--otherColor')
    const font = rootStyles.getPropertyValue('--font')
    sortPlayers(players)
    let fixed = document.getElementById('checkbox_charts_fixed').checked
    let maxValue = 0
    if (gameID == 'tetris') {
        document.getElementById('fixedDiv').style.display = 'none'
        fixed = false
    } else if (fixed) {
        if (sortCategoryIndex == -1) {
            maxValue = mode == 'fullgameILs' ? categories.length : 100
        } else if (gameID == 'cuphead') {
            maxValue = mode == 'fullgame' ? 3600 : 120
        } else if (gameID == 'sm64') {
            maxValue = mode == 'fullgame' ? 6000 : 400
        }
    }
    const numBars = document.getElementById('dropdown_top').value
    const annotation = numBars <= 30
    const rows = []
    if (sortCategoryIndex == -1) {
        const annotationName = mode == 'fullgameILs' ? 'Runs' : 'Score'
        rows.push(['Player', annotationName, { role: 'style' }])
    } else {
        rows.push(['Player', 'PB', { role: 'style' }])
    }
    annotation ? rows[0].push({ role: 'annotation' }) : ''
    if (sortCategoryIndex == -1) {
        players.slice(0, numBars).forEach(player => {
            if (mode == 'fullgameILs') {
                numRuns = 0
                player.runs.forEach(run => {
                    if (run) {
                        numRuns++
                    }
                })
                const newPlayer = [player.name, numRuns, getClassColor(fullgameILsCategory.className)]
                annotation ? newPlayer.push(numRuns) : ''
                rows.push(newPlayer)
            } else {
                const percentage = parseFloat(getPercentage(player.averagePercentage))
                const newPlayer = [player.name, percentage, getClassColor(getLetterGrade(percentage).className)]
                annotation ? newPlayer.push(percentage) : ''
                rows.push(newPlayer)
            }
        })
    } else {
        category = categories[sortCategoryIndex]
        const categoryRuns = category.runs.slice(0, numBars)
        categoryRuns.forEach(run => {
            let score = run.score
            if (!fixed || (fixed && score < maxValue)) {
                convertedTime = gameID == 'tetris' ? score : secondsToHMS(score)
                if (!(gameID == 'cuphead' && mode == 'levels' && score > 120)) {
                    const newRun = [run.playerName, Math.round(score), getClassColor(getLetterGrade(getPercentage(run.percentage)).className)]
                    annotation ? newRun.push(convertedTime) : ''
                    rows.push(newRun)
                }
            }
        })
    }
    while (rows.length < numBars) {
        const newRun = ['', '', '']
        annotation ? newRun.push('') : ''
        rows.push(newRun)
    }
    const data = google.visualization.arrayToDataTable(rows);
    const options = {
        chartArea: {
            height: '90%'
        },
        legend: {
            position: 'none'
        },
        backgroundColor: backgroundColor,
        hAxis: {
            // title: 'Time',
            // textStyle: {
            //     color: 'white',
            //     fontName: font
            // },
            // titleTextStyle: {
            //     color: 'white',
            //     fontName: font
            // },
            // color: backgroundColor,
            // position: 'none',
            minValue: 0,
            maxValue: maxValue
        },
        vAxis: {
            textPosition: annotation ? '' : 'none',
            textStyle: {
                color: 'white',
                fontName: font,
                fontSize: 12
            },
        },
        tooltip: {
            textStyle: {
                fontName: font
            }
        },
        annotations: {
            style: 'none',
            textStyle: {
                fontName: font
            }
        },
        bars: 'horizontal',
        bar: { groupWidth: '75%' },
    };
    const chart = new google.visualization.BarChart(document.getElementById('chart'));
    // const formatter = new google.visualization.NumberFormat({
    //     pattern: '##:##'
    // });
    // formatter.format(data, 1);
    chart.draw(data, options);
}
function refreshCharts() {
    updateCategories()
    google.charts.setOnLoadCallback(function () {
        drawChart()
    });
}
function drawNewChart(categoryIndex) {
    playSound('equip_move')
    sortCategoryIndex = categoryIndex
    action()
}