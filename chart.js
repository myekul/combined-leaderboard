function drawChart(categoryIndex) {
    const rootStyles = getComputedStyle(document.documentElement)
    const backgroundColor = rootStyles.getPropertyValue('--background')
    const font = rootStyles.getPropertyValue('--font')
    player = categoryIndex == 'player'
    if (player) {
        sortByCriteria('averagePercentage')
        fullgame ? fullgameCategoryIndex = -1 : levelCategoryIndex = -1
    } else {
        if (categoryIndex == undefined || categoryIndex >= categories.length || categoryIndex < 0) {
            categoryIndex = 0
        } else {
            if (fullgame) {
                fullgameCategoryIndex = categoryIndex
            } else {
                levelCategoryIndex = categoryIndex
            }
        }
    }
    categoryIndex = categoryIndex ? categoryIndex : 0
    updateChartCategories()
    let capped = document.getElementById('checkbox_capped').checked
    let maxValue = 0
    if (gameID == 'tetris') {
        document.getElementById('capDiv').style.display = 'none'
        capped = false
    } else if (capped) {
        if (player) {
            maxValue = 100
        } else if (gameID == 'cuphead') {
            maxValue = fullgame ? 3600 : 120
        } else if (gameID == 'sm64') {
            maxValue = fullgame ? 6000 : 400
        }
    }
    let numBars = document.getElementById('dropdown_top').value
    let annotation = numBars <= 30
    const rows = []
    if (player) {
        rows.push(['Player', 'Score', { role: 'style' }])
    } else {
        rows.push(['Player', 'PB', { role: 'style' }])
    }
    annotation ? rows[0].push({ role: 'annotation' }) : ''
    if (player) {
        players.slice(0, numBars).forEach(player => {
            const percentage = parseFloat(getPercentage(player.averagePercentage))
            const newPlayer = [player.name, percentage, getClassColor(getLetterGrade(percentage).className)]
            annotation ? newPlayer.push(percentage) : ''
            rows.push(newPlayer)
        })
    } else {
        category = categories[categoryIndex]
        const categoryRuns = category.runs.runs.slice(0, numBars)
        categoryRuns.forEach(run => {
            let runTime = gameID == 'tetris' ? run.run.score : run.run.times.primary_t
            if (!capped || (capped && runTime < maxValue)) {
                convertedTime = gameID == 'tetris' ? runTime : secondsToHMS(runTime)
                if (!(gameID == 'cuphead' && !fullgame && runTime > 120)) {
                    const newRun = [run.run.player.name, Math.round(runTime), getClassColor(getLetterGrade(getPercentage(run.percentage)).className)]
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
        title: player ? 'Players' : category.name,
        titleTextStyle: {
            color: 'white',
            fontName: font,
            fontSize: 18
        },
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
            title: annotation ? 'Player' : '',
            textStyle: {
                color: 'white',
                fontName: font,
                fontSize: 12
            },
            titleTextStyle: {
                color: 'white',
                fontName: font
            }
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
    google.charts.setOnLoadCallback(function () {
        player ? drawChart('player') : fullgame ? drawChart(fullgameCategoryIndex) : drawChart(levelCategoryIndex)
    });
}
function updateChartCategories() {
    const chartPlayer = document.getElementById('chartPlayer')
    player ? chartPlayer.classList.add('selected') : chartPlayer.classList.remove('selected')
    let HTMLContent = `<table><tr><td>&#9664</td>`
    categories.forEach((category, categoryIndex) => {
        let selected = ''
        if (category.info) {
            if (categoryIndex == levelCategoryIndex) {
                selected = 'selected'
            }
            HTMLContent += `<th class='${getColorClass()} clickable ${selected}'><image src='images/${gameID}/${category.info.id}.png' onclick="playSound('equip_move');drawChart(${categoryIndex})"></th>`
        } else {
            if (categoryIndex == fullgameCategoryIndex) {
                selected = 'selected'
            }
            HTMLContent += `<th class='${category.class} clickable ${selected} chartTab' onclick="playSound('equip_move');drawChart(${categoryIndex})">${category.name}</th>`
        }
    })
    HTMLContent += `<td>&#9654</td></tr></table>`
    const chartCategories = document.getElementById('chartCategories')
    chartCategories.innerHTML = HTMLContent
}