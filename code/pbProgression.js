async function fetchTopRuns() {
    const category = categories[sortCategoryIndex]
    const topPlayers = category.players.slice(0, 10).filter(player => player?.id)

    const promises = topPlayers.map(player => {
        const params = new URLSearchParams({
            category: category.id,
            user: player.id,
            max: '50',
            status: 'verified',
            orderby: 'date',
            direction: 'desc'
        })
        return fetch(`https://www.speedrun.com/api/v1/runs?${params}`)
            .then(response => {
                if (!response.ok) throw new Error(`Speedrun API error ${response.status}`)
                return response.json()
            })
            .then(json => {
                const wr = category.runs?.[0]?.score
                const runs = (json.data || [])
                    .filter(run => {
                        const t = run.times?.primary_t
                        if (typeof t !== 'number' || Number.isNaN(t)) return false
                        if (wr && t > wr * 1.2) return false
                        if (category.vars && category.vars.length) {
                            return category.vars.every(varPair => run.values[varPair[0]] == varPair[1])
                        }
                        return true
                    })
                return { player, runs }
            })
            .catch(error => {
                console.error(`Error fetching runs for ${player.name} (${player.id}):`, error)
                return { player, runs: [] }
            })
    })
    topPlayerHistories = await Promise.all(promises)
    srcLoaded = true
    pbProgression()
}

function pbProgression() {
    const histories = getPBHistories();
    if (!histories?.length) return;
    const chartData = pbProgressionChartData(histories);
    if (!chartData) return;
    const font = getComputedStyle(document.documentElement).getPropertyValue('--font')

    const category = categories[sortCategoryIndex]
    const minY = category.runs?.[0]?.score

    const yearTicks = [];
    const seenYears = new Set();
    for (let row = 0; row < chartData.getNumberOfRows(); row++) {
        const date = chartData.getValue(row, 0);
        if (!(date instanceof Date)) continue;
        const year = date.getFullYear();
        if (!seenYears.has(year)) {
            seenYears.add(year);
            yearTicks.push(new Date(year, 0, 1));
        }
    }

    const yTicks = buildSecondsTicks(chartData);

    const title = `${category.name} Top ${histories.length} Progression`

    const options = {
        title: title,
        titleTextStyle: { color: 'gray', fontSize: 16 },
        chartArea: { height: '70%', width: '80%' },
        fontName: font,
        focusTarget: 'datum',
        hAxis: {
            title: 'Year',
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            format: 'yyyy',
            gridlines: { color: 'dimgray' },
            ticks: yearTicks
        },
        vAxis: {
            title: 'PB',
            textStyle: { color: 'gray' },
            titleTextStyle: { color: 'gray' },
            gridlines: { color: 'dimgray' },
            minorGridlines: { count: 1, color: 'rgba(255,255,255,0.12)' },
            viewWindowMode: minY !== undefined ? 'pretty' : undefined,
            viewWindow: minY !== undefined ? { min: minY } : undefined,
            ticks: yTicks
        },
        legend: { position: 'none' },
        lineWidth: 2,
        pointSize: 0,
        series: historiesToSeries(),
        backgroundColor: '#343434',
        tooltip: { isHtml: true, trigger: 'focus' },
        areaOpacity: 0,
        interpolateNulls: true
    };
    const chart = new google.visualization.LineChart(document.getElementById('pbProgressionChart'));
    chart.draw(chartData, options);
}

function getPBHistories() {
    const histories = topPlayerHistories?.filter(history => history?.runs?.length)
    if (!histories?.length) return null
    return histories.slice(0, 10).map(history => {
        const sortedRuns = history.runs
            .map(run => ({
                run,
                date: getPBRunDate(run),
                displayDate: run.date,
                seconds: run.times?.primary_t
            }))
            .filter(entry => entry.date && !Number.isNaN(entry.seconds))
            .sort((a, b) => a.date - b.date)

        const pbHistory = []
        let bestTime = Infinity
        sortedRuns.forEach(entry => {
            if (entry.seconds < bestTime) {
                bestTime = entry.seconds
                pbHistory.push({ date: entry.date, displayDate: entry.displayDate, pbSeconds: entry.seconds, run: entry.run })
            }
        })

        return {
            player: history.player,
            pbHistory
        }
    }).filter(history => history.pbHistory.length)
}

function getPBRunDate(run) {
    const date = new Date(run.date || run.submitted)
    return isNaN(date) ? null : date
}

function getPBTooltip(entry, playerName) {
    return `
    <div>
        <div class='container' style='font-size:120%'>
        ${getPlayerDisplay(players.find(player => player.name == playerName), null, true)}
        </div>
        <div class='container' style='font-size:150%'>
            <div class='${categories[sortCategoryIndex].className}' style='padding:3px;margin:5px;border-radius:5px'>${secondsToHMS(entry.pbSeconds, true)}</div>
        </div>
        <div class='container'>
            ${entry.displayDate}
        </div>
    </div>`
}

function pbProgressionChartData(histories) {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'Date');

    if (!histories?.length) return null

    histories.forEach((history, index) => {
        dataTable.addColumn('number', `${history.player.name || `Player ${index + 1}`} line`);
        dataTable.addColumn('number', `${history.player.name || `Player ${index + 1}`} point`);
        dataTable.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });
    });

    const pointsPerHistory = histories.map(history => {
        const pts = [];
        const hb = history.pbHistory;
        if (!hb || !hb.length) return pts;
        pts.push({ time: hb[0].date.getTime(), value: hb[0].pbSeconds, tooltip: getPBTooltip(hb[0], history.player.name), isPB: true });
        for (let i = 1; i < hb.length; i++) {
            const prev = hb[i - 1];
            const cur = hb[i];
            const t = cur.date.getTime();
            pts.push({ time: t, value: prev.pbSeconds, tooltip: null, isPB: false });
            pts.push({ time: t, value: cur.pbSeconds, tooltip: getPBTooltip(cur, history.player.name), isPB: true });
        }
        return pts;
    });

    const timeSet = new Set();
    pointsPerHistory.forEach(pts => pts.forEach(p => timeSet.add(p.time)));
    const times = Array.from(timeSet).sort((a, b) => a - b);

    const rows = [];
    const lastValues = new Array(histories.length).fill(null);
    times.forEach(time => {
        const counts = pointsPerHistory.map(pts => pts.filter(p => p.time === time).length);
        const maxCount = Math.max(...counts, 1);
        for (let seq = 0; seq < maxCount; seq++) {
            const row = [new Date(time)];
            for (let h = 0; h < histories.length; h++) {
                const pts = pointsPerHistory[h].filter(p => p.time === time);
                if (pts.length > seq) {
                    const point = pts[seq];
                    row.push(point.value);
                    row.push(point.isPB ? point.value : null);
                    row.push(point.isPB ? point.tooltip : null);
                    lastValues[h] = point.value;
                } else {
                    row.push(lastValues[h]);
                    row.push(null);
                    row.push(null);
                }
            }
            rows.push(row);
        }
    });

    rows.forEach(r => dataTable.addRow(r));
    return dataTable;
}

function buildSecondsTicks(chartData) {
    if (!chartData) return null;
    const numCols = chartData.getNumberOfColumns();
    let min = Infinity;
    let max = -Infinity;
    for (let row = 0; row < chartData.getNumberOfRows(); row++) {
        for (let col = 1; col < numCols; col++) {
            if (chartData.getColumnType(col) !== 'number') continue;
            const value = chartData.getValue(row, col);
            if (typeof value === 'number' && !Number.isNaN(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
            }
        }
    }
    if (min === Infinity || max === -Infinity) return null;
    const interval = 30;
    const start = Math.floor(min / interval) * interval;
    const end = Math.ceil(max / interval) * interval;
    const ticks = [];
    for (let v = start; v <= end; v += interval) {
        const label = (v % 60 === 0) ? formatSeconds(v) : '';
        ticks.push({ v, f: label });
    }
    return ticks;
}

function historiesToSeries() {
    const category = categories[sortCategoryIndex]
    const histories = getPBHistories() || []
    const series = {}
    const usedColors = new Set();
    histories.forEach((history, index) => {
        let color = category.players[index]?.['name-style']?.color2;
        if (usedColors.has(color)) {
            color = category.players[index]?.['name-style']?.color1;
        }
        if (usedColors.has(color)) {
            color = 'lightgreen';
        }
        if (usedColors.has(color)) {
            color = 'salmon';
        }
        usedColors.add(color);
        const lineIndex = index * 2
        const pointIndex = index * 2 + 1
        series[lineIndex] = { color, lineWidth: 2, pointSize: 0, enableInteractivity: false }
        series[pointIndex] = { color, lineWidth: 0, pointSize: 2, visibleInLegend: false }
    })
    return series
}

function pbProgressionSection() {
    return `
    <div class='container' style='gap:10px;margin-top:30px'>
        <div id='pbProgressionChart' class='border shadow' style='width:1000px;height:400px'></div>
    </div>`;
}

function formatSeconds(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
}