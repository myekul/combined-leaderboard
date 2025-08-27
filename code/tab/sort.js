function generateSort() {
    const sortCriteria = document.getElementById('dropdown_sortCriteria')
    if (mode == 'commBestILs' && globalTab == 'sort') {
        sortCriteria.value = 'player'
        hide('sort_options')
    } else if (['tetris', 'ssbm'].includes(gameID)) {
        sortCriteria.value = 'score'
        hide('sort_options')
    } else {
        show('sort_options')
    }
    const sortRange = document.getElementById('dropdown_sortRange').value
    if (gameID == 'cuphead' && mode == 'levels' || mode == 'commBestILs') {
        show('extraSortCriteria')
        show('sortDPS')
    } else {
        if (sortCriteria.value == 'dps') sortCriteria.value = 'score'
    }
    if (sortCriteria.value == 'date') show('sortDateOptions')
    let HTMLContent = ''
    if (['player', 'joindate', 'bestScore'].includes(sortCriteria.value)) {
        hide('sortChartDiv')
        HTMLContent += `<div class='container'><table class='bigShadow'>`
        const playersCopy = [...players]
        if (sortCriteria.value == 'joindate') {
            playersCopy.sort((a, b) => {
                const aDate = new Date(a.signup);
                const bDate = new Date(b.signup);
                return bDate - aDate;
            })
        } else if (sortCriteria.value == 'bestScore') {
            playersCopy.sort((a, b) => {
                return b.bestScore - a.bestScore;
            })
        }
        playersCopy.forEach((player, playerIndex) => {
            if (sortCategoryIndex == -1) {
                goated = false
                player.runs.forEach(run => {
                    if (run) {
                        if (sortLogic(run, sortRange)) goated = true
                    }
                })
                HTMLContent += goated ? parsePlayer(player, playerIndex) : ''
            } else if (player.runs[sortCategoryIndex]) {
                if (sortLogic(player.runs[sortCategoryIndex], sortRange)) {
                    HTMLContent += parsePlayer(player, playerIndex)
                }
            }
        })
        HTMLContent += `</table></div>`
    } else {
        HTMLContent += sortRuns(sortRange)
    }
    document.getElementById('sort').innerHTML = HTMLContent
}
function sortLogic(run, sortRange) {
    return (sortRange == 'trophies' && run.place <= 3) || (sortRange == 'WRs' && run.place == 1) || (sortRange == 'firstWR') && run.first || (sortRange == 'untiedWR') && run.untied || !['trophies', 'WRs', 'firstWR', 'untiedWR'].includes(sortRange)
}
function sortRuns(sortRange) {
    const sortCriteria = document.getElementById('dropdown_sortCriteria').value
    let minDate = new Date().getFullYear()
    const sortDateOptions = document.getElementById('sortDateOptions')
    if (sortCriteria == 'date') {
        players.forEach(player => {
            player.runs.forEach(run => {
                if (run) {
                    const runDate = new Date(run.date).getFullYear()
                    if (runDate < minDate && runDate > 1969) {
                        minDate = runDate
                    }
                }
            })
        })
    }
    const numRuns = sortRange == 'top100' ? 100 : 300
    const everyRun = getEveryRun(numRuns, sortRange)
    if (sortCriteria == 'dps') {
        assignHP()
    }
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
            if (sortCriteria == 'playerIndex') {
                return players[a.playerIndex].rank - players[b.playerIndex].rank
            }
            if (sortCriteria == 'category') {
                return a.categoryIndex - b.categoryIndex
            }
            if (sortCriteria == 'dps') {
                return getDPS(categories[b.categoryIndex], bRun.score) - getDPS(categories[a.categoryIndex], aRun.score)
            }
        }
        if (aRun) return -1;
        if (bRun) return 1;
        return 0;
    });
    if (['score', 'date'].includes(sortCriteria)) {
        google.charts.setOnLoadCallback(function () {
            drawSortChart(everyRun, sortCriteria, minDate)
        });
        show('sortChartDiv')
    }
    let HTMLContent = `<div class='container'><table class='bigShadow'>`
    everyRun.slice(0, getNumDisplay()).forEach((run, runIndex) => {
        if (!(sortCriteria == 'date' && !run.run.date)) {
            HTMLContent += `<tr class='${getRowColor(runIndex)}'>`
            HTMLContent += `<td>${runIndex + 1}</td>`
            const player = players[run.playerIndex]
            const category = categories[run.categoryIndex]
            const className = big5() ? category.difficulty : classNameLogic(category)
            if (sortCriteria == 'date') {
                // const date = new Date(run.run.date)
                // const date2 = new Date(everyRun[runIndex + 1]?.run.date)
                // if (date2?.getFullYear() > 1969) {
                //     const dateDif = getDateDif(date, date2)
                //     HTMLContent += `<td>${dateDif}</td>`
                // } else {
                //     HTMLContent += `<td></td>`
                // }
                const date = new Date()
                const runDate = new Date(run.run.date)
                HTMLContent += `<td style='font-size:80%'>${daysAgo(getDateDif(date, runDate))}</td>`
                HTMLContent += `<td>${run.run.date}</td>`
                if (sortDateOptions.value == 'dayofweek') {
                    HTMLContent += `<td>${daysOfWeek[runDate.getDay()]}</td>`
                } else if (sortDateOptions.value == 'season') {
                    const season = seasons[getSeason(runDate.getMonth())]
                    HTMLContent += `<td style='background-color:${season.color}'>${season.name}</td>`
                } else if (sortDateOptions.value == 'month') {
                    HTMLContent += `<td>${months[runDate.getMonth()]}</td>`
                }
            } else if (sortCriteria == 'score') {
                const percentage = run.run.percentage
                const grade = getLetterGrade(percentage)
                HTMLContent += `<td class='${grade.className}'>${displayPercentage(percentage)}</td>`
            } else if (sortCriteria == 'dps') {
                const categoryHP = categories[run.categoryIndex].hp
                HTMLContent += `<td style='text-align:right'>${getDPS(category, run.run.score)} DPS</td>`
                HTMLContent += `<td style='text-align:right;font-size:75%'>${categoryHP} HP</td>`
            }
            if (sortCategoryIndex == -1) {
                HTMLContent += `<td class='${className}'>${category.name}</td>`
                HTMLContent += category.info ? `<td class='${category.info.id}'><div class='container'>${getImage(category.info.id, 20)}</div></td>` : ''
            }
            HTMLContent += parseRun(player, run.playerIndex, category, run.categoryIndex)
            HTMLContent += getPlayerDisplay(player)
            HTMLContent += `</tr>`
        }
    })
    HTMLContent += `</table></div>`
    if (!showMore && everyRun.length > getNumDisplay()) {
        HTMLContent += `<div onclick="showMorePlayers()" class='button' style='margin:0 auto;margin-top:15px'>Show More</div>`
    } else {
        showMore = false
    }
    return HTMLContent
}
function drawSortChart(runs, sortCriteria, minDate) {
    const fullData = []
    let min = sortCriteria == 'date' ? minDate : 0
    let max = sortCriteria == 'date' ? new Date().getFullYear() : 100
    const sortDateOptions = document.getElementById('sortDateOptions').value
    let units
    const frequencyData = runs.reduce((acc, item) => {
        let runData
        if (sortCriteria == 'score') {
            runData = Math.floor(item.run.percentage)
        } else if (sortCriteria == 'date') {
            const date = new Date(item.run.date)
            if (sortDateOptions == 'year') {
                runData = date.getFullYear()
            } else if (sortDateOptions == 'month') {
                units = months
                runData = units[date.getMonth()]
            } else if (sortDateOptions == 'dayofyear') {
                runData = getDayOfYear(date)
            } else if (sortDateOptions == 'dayofmonth') {
                runData = date.getDate()
            } else if (sortDateOptions == 'dayofweek') {
                units = daysOfWeek
                runData = units[date.getDay()]
            } else if (sortDateOptions == 'season') {
                units = seasons
                runData = seasons[getSeason(date.getMonth())].name
            }
        }
        acc[runData] = (acc[runData] || 0) + 1;
        return acc;
    }, {});
    const labels = ['Percentage', 'Count']
    if (sortCriteria == 'score' || (sortCriteria == 'date' && sortDateOptions == 'season')) {
        labels.push({ role: 'style' })
    }
    if (sortCriteria == 'date' && ['month', 'dayofweek', 'season'].includes(sortDateOptions)) {
        units.forEach(unit => {
            let unitName = unit
            if (sortDateOptions == 'season') unitName = unit.name
            const newEntry = [unitName, frequencyData[unitName]]
            if (sortDateOptions == 'season') newEntry.push(unit.color)
            fullData.push(newEntry)
        })
    } else {
        if (sortDateOptions == 'dayofyear') {
            min = 1
            max = 365
        } else if (sortDateOptions == 'dayofmonth') {
            min = 1
            max = 31
        }
        for (let i = min; i <= max; i++) {
            const newEntry = [i.toString(), frequencyData[i] || Infinity]
            if (sortCriteria == 'score') {
                newEntry.push(getColorFromClass(getLetterGrade(i).className))
            }
            fullData.push(newEntry);
        }
    }
    const chartData = [labels, ...fullData]
    const sortPieChart = document.getElementById('sortPieChart')
    if (sortCriteria == 'date' && ['season', 'month', 'dayofweek'].includes(sortDateOptions)) {
        show(sortPieChart)
        drawSortPieChart(chartData)
    }
    var data = google.visualization.arrayToDataTable(chartData);
    var options = {
        chartArea: { width: '80%' },
        hAxis: {
            title: sortCriteria == 'score' ? 'Score' : 'Date',
            titleTextStyle: {
                color: 'white',
                fontName: getFont()
            },
            textStyle: {
                color: 'white',
                fontName: getFont(),
                fontSize: 10
            },
            // slantedText: true,
            // slantedTextAngle: 'auto',
            minValue: 0,
            maxValue: 100
        },
        vAxis: {
            title: '# of Runs',
            titleTextStyle: {
                color: 'white',
                fontName: getFont()
            },
            textStyle: {
                color: 'white',
                fontName: getFont(),
                fontSize: 12
            },
            minValue: 0,
            maxValue: 100
        },
        tooltip: {
            textStyle: {
                fontName: getFont()
            }
        },
        legend: {
            position: 'none',
            textStyle: {
                fontName: getFont(),
                fontSize: 12,
                color: 'white'
            }
        },
        isStacked: true,
        colors: sortCategoryIndex == -1 ? [getColorFromClass('banner')] : [getColorFromClass(classNameLogic(categories[sortCategoryIndex]))],
        backgroundColor: getBackgroundColor()
    };
    var chart
    chart = new google.visualization.ColumnChart(document.getElementById('sortChart'));
    chart.draw(data, options);
}
function drawSortPieChart(chartData) {
    let slices = {}
    if (document.getElementById('sortDateOptions').value == 'season') {
        seasons.forEach((season, seasonIndex) => {
            slices[seasonIndex] = { color: season.color }
        })
    }
    const data = google.visualization.arrayToDataTable(chartData);
    const options = {
        backgroundColor: getBackgroundColor(),
        legend: { position: 'none' },
        tooltip: {
            textStyle: {
                fontName: getFont(),
                color: 'black'
            }
        },
        annotations: {
            style: 'none',
            textStyle: {
                fontName: getFont()
            },
        },
        pieSliceText: 'label',
        pieSliceTextStyle: {
            fontName: getFont(),
        },
        chartArea: {
            width: '90%',
            height: '90%'
        },
        slices: slices
    };
    const chart = new google.visualization.PieChart(document.getElementById('sortPieChart'));
    chart.draw(data, options);
}