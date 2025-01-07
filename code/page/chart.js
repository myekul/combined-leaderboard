function drawChart() {
    sortPlayers(players)
    let normalized = document.getElementById('checkbox_charts_normalized').checked
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
        } else if (gameID == 'titanfall_2') {
            maxValue = 600
        } else if (gameID == 'smb1') {
            maxValue = 1200
        } else if (gameID == 'smb2') {
            maxValue = 1800
        } else {
            maxValue = 3600
        }
    }
    if (mode == 'fullgameILs') {
        normalized = false
    }
    if (normalized) {
        maxValue = 100
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
                const color = mode == 'fullgameILs' ? getColorFromClass(fullgameILsCategory.className) : getColorFromClass(getColorClass())
                const newPlayer = [player.name, numRuns, color]
                annotation ? newPlayer.push(numRuns) : ''
                rows.push(newPlayer)
            } else {
                const newPlayer = [player.name, player.score, getColorFromClass(getLetterGrade(player.score).className)]
                annotation ? newPlayer.push(player.score.toFixed(2)) : ''
                rows.push(newPlayer)
            }
        })
    } else {
        category = categories[sortCategoryIndex]
        const categoryRuns = category.runs.slice(0, numBars)
        categoryRuns.forEach(run => {
            let score = run.score
            if (!fixed || (!normalized && fixed && score < maxValue) || normalized) {
                const convertedTime = gameID == 'tetris' ? score : secondsToHMS(score)
                if (!(!normalized && gameID == 'cuphead' && mode == 'levels' && score > 120)) {
                    const colorClass = mode == 'fullgameILs' ? categories[sortCategoryIndex].info.id : getLetterGrade(getPercentage(run.percentage)).className
                    let rowContent = Math.round(score)
                    if (normalized) {
                        rowContent = parseFloat(getPercentage(run.percentage))
                    }
                    const newRun = [run.playerName, rowContent, getColorFromClass(colorClass)]
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
        backgroundColor: getBackgroundColor(),
        hAxis: {
            // title: 'Time',
            textStyle: {
                color: 'white',
                fontName: getFont()
            },
            // titleTextStyle: {
            //     color: 'white',
            //     fontName: getFont()
            // },
            // color: getBackgroundColor(),
            // position: 'none',
            minValue: document.getElementById('checkbox_charts_50').checked && mode != 'fullgameILs' ? 50 : 0,
            maxValue: maxValue
        },
        vAxis: {
            textPosition: annotation ? '' : 'none',
            textStyle: {
                color: 'white',
                fontName: getFont(),
                fontSize: 12
            },
        },
        tooltip: {
            textStyle: {
                fontName: getFont()
            }
        },
        annotations: {
            style: 'none',
            textStyle: {
                fontName: getFont()
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