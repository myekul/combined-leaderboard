const rootStyles = getComputedStyle(document.documentElement)
const backgroundColor = rootStyles.getPropertyValue('--background')
const bannerColor = rootStyles.getPropertyValue('--banner')
const font = rootStyles.getPropertyValue('--font')
function drawChart(categoryIndex) {
    if (categoryIndex == undefined || categoryIndex >= categories.length) {
        categoryIndex = 0
    } else {
        if (fullgame) {
            fullgameCategoryIndex = categoryIndex
        } else {
            levelCategoryIndex = categoryIndex
        }
    }
    categoryIndex = categoryIndex ? categoryIndex : 0
    updateChartCategories()
    let maxValue = 0
    if (gameID == 'cuphead') {
        maxValue = fullgame ? 3000 : 120
    } else if (gameID == 'sm64') {
        maxValue = fullgame ? 6000 : 400
    }
    category = categories[categoryIndex]
    const runs = [['Player', 'PB', { role: 'style' }, { role: 'annotation' }]]
    const categoryRuns = category.runs.runs.slice(0, 30)
    categoryRuns.forEach(run => {
        let runTime = 0
        runTime = gameID == 'tetris' ? run.run.score : run.run.times.primary_t
        convertedTime = gameID == 'tetris' ? runTime : secondsToHMS(runTime)
        if (!(gameID == 'cuphead' && !fullgame && runTime > 120)) {
            runs.push([run.run.player.name, Math.round(runTime), getClassColor(getLetterGrade(getPercentage(run.percentage)).className), convertedTime])
        }
    })
    while (runs.length < 31) {
        runs.push(['', '', '', ''])
    }
    const data = google.visualization.arrayToDataTable(runs);
    const options = {
        title: category.name,
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
            position: 'none',
            minValue: 0,
            maxValue: maxValue
        },
        vAxis: {
            title: 'Player',
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
function showCharts() {
    charts = true
    document.querySelectorAll('.tabs').forEach(elem => {
        elem.style.display = 'none'
    })
    document.getElementById('chartsTab').style.display = ''
    document.querySelectorAll('#tabs button').forEach(elem => {
        elem.classList.remove('active2')
    })
    document.getElementById('chartsButton').classList.add('active2')
    fullgame ? drawChart(fullgameCategoryIndex) : drawChart(levelCategoryIndex)
}
function updateChartCategories() {
    let HTMLContent = `<table><tr><td>&#9664</td>`
    categories.forEach((category, categoryIndex) => {
        let selected = ''
        if (fullgame) {
            if (categoryIndex == fullgameCategoryIndex) {
                selected = 'selected'
            }
            HTMLContent += `<th class='${category.class} clickable ${selected}' style='padding:5px' onclick="playSound('equip_move');drawChart(${categoryIndex})">${category.name}</th>`
        } else {
            if (categoryIndex == levelCategoryIndex) {
                selected = 'selected'
            }
            let colorClass = ''
            if (gameID == 'cuphead') {
                colorClass = DLCnoDLC == 0 ? 'cuphead' : 'dlc'
            }
            HTMLContent += `<th class='${colorClass} clickable ${selected}'><image src='images/${gameID}/${category.info.id}.png' onclick="playSound('equip_move');drawChart(${categoryIndex})"></th>`
        }
    })
    HTMLContent += `<td>&#9654</td></tr></table>`
    const chartCategories = document.getElementById('chartCategories')
    chartCategories.innerHTML = HTMLContent
}