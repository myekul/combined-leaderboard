function generateMap() {
    countries = {}
    const mapMode = document.getElementById('dropdown_mapMode').value
    const mapValue = document.getElementById('dropdown_mapValue').value
    categories.forEach(category => {
        category.countries = {}
    })
    let playersCopy = [...players.slice(0, 300)]
    if (mapMode == 'top30') {
        playersCopy = players.slice(0, 30)
    } else if (mapMode == 'top100') {
        playersCopy = players.slice(0, 100)
    }
    playersCopy.forEach(player => {
        let goated = false
        let country
        player.runs.forEach(run => {
            if (run) {
                if (mapMode == 'WRs') {
                    if (run.place == 1) {
                        goated = true
                    }
                } else if (mapMode == 'trophies') {
                    if ([1, 2, 3].includes(run.place)) {
                        goated = true
                    }
                } else {
                    goated = true
                }
            }
        })
        if (goated) {
            country = countries[getLocation(player, countries)]
        }
        categories.forEach((category, categoryIndex) => {
            goated = false
            const run = player.runs[categoryIndex]
            if (run) {
                if (mapMode == 'WRs') {
                    if (run.place == 1) {
                        goated = true
                    }
                } else if (mapMode == 'trophies') {
                    if ([1, 2, 3].includes(run.place)) {
                        goated = true
                    }
                } else {
                    goated = true
                }
            }
            if (goated) {
                getLocation(player, category.countries)
                if (country && mapValue == 'runs') {
                    country.count++
                }
            }
        })
        if (country && mapValue == 'runs') {
            country.count--
        }
    })
    document.getElementById('countryTable').innerHTML = countryCount()
    createMap()
    flagArmy()
    // google.charts.setOnLoadCallback(function () {
    //     pieChart()
    // });
}
function getLocation(player, countriesObject) {
    if (player.location) {
        let countryName = player.location.country.names.international
        let code = player.location.country.code
        if (['England', 'Northern Ireland', 'Scotland', 'Wales'].includes(countryName)) {
            countryName = 'United Kingdom'
        }
        // if (['Québec'].includes(countryName)) {
        //     countryName = 'Canada'
        //     code = 'ca'
        // }
        if (countryName == 'Puerto Rico') {
            countryName = 'United States'
            code = 'us'
        }
        if (!['Antarctica', 'North Korea', 'Valhalla', 'British Indian Ocean Territory'].includes(countryName)) {
            const country = countriesObject[countryName]
            if (country) {
                country.players.push(player)
                country.count++
            } else {
                const newCountry = {
                    players: [player],
                    name: countryName,
                    code: code.slice(0, 2),
                    count: 1
                }
                countriesObject[countryName] = newCountry
            }
            return countryName
        }
    }
}
function countryCount() {
    countriesObject = sortCategoryIndex > -1 ? categories[sortCategoryIndex].countries : countries
    const countriesArray = createArray(countriesObject)
    countriesArray.sort((a, b) => {
        return b.count - a.count
    });
    let total = 0
    countriesArray.forEach(country => {
        total += country.count
        country.count1 = 0
        country.count2 = 0
        country.count3 = 0
        country.players.forEach(player => {
            if (sortCategoryIndex > -1) {
                const run = player.runs[sortCategoryIndex]
                if (run) {
                    if (run.place == 1) {
                        country.count1++
                    } else if (run.place == 2) {
                        country.count2++
                    } else if (run.place == 3) {
                        country.count3++
                    }
                }
            } else {
                player.runs.forEach(run => {
                    if (run) {
                        if (run.place == 1) {
                            country.count1++
                        } else if (run.place == 2) {
                            country.count2++
                        } else if (run.place == 3) {
                            country.count3++
                        }
                    }
                })
            }
        })
    })
    let HTMLContent = ''
    HTMLContent += `<div style='margin:0'><div class='container'>${generateBoardTitle(1)}</div>`
    HTMLContent += `<table class='bigShadow'>`
    countriesArray.forEach((country, countryIndex) => {
        HTMLContent +=
            `<tr class='${getRowColor(countryIndex)}'>
                <td style='text-align:right;font-size:75%'>${displayPercentage(getPercentage(country.count / total, 1))}%</td>
                <td>${country.count}</td>
                <td>${getFlag(country.code, country.name, 15)}</td>
                <td onclick="openModal('${country.name}','up')" class='clickable' style='text-align:left'>${country.name}</td>
                ${trophyCase(country)}
                </tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function flagArmy() {
    countriesObject = sortCategoryIndex > -1 ? categories[sortCategoryIndex].countries : countries
    const countriesArray = createArray(countriesObject)
    countriesArray.sort((a, b) => {
        return b.count - a.count
    });
    HTMLContent = ''
    countriesArray.forEach(country => {
        for (i = 0; i < country.count; i++) {
            HTMLContent += `<div onclick="openModal('${country.name}','up')" class='container clickable'>${getFlag(country.code, country.name, 20)}</div>`
        }
    })
    document.getElementById('flagArmy').innerHTML = HTMLContent
}
// function pieChart() {
//     const rows = [['Country', '# of Players', { role: 'tooltip', p: { html: true } }]]
//     countriesObject = sortCategoryIndex > -1 ? categories[sortCategoryIndex].countries : countries
//     const countriesArray = createArray(countriesObject)
//     countriesArray.sort((a, b) => {
//         return b.count - a.count
//     });
//     countriesArray.forEach(country => {
//         const flag = getFlag(country.code, country.name, 30)
//         const label = country.name
//         rows.push([
//             country.code.toUpperCase(),
//             country.count,
//             getTooltip(flag, label)
//         ])
//     })
//     const data = google.visualization.arrayToDataTable(rows);
//     const options = {
//         backgroundColor: 'transparent',
//         legend: { position: 'none' },
//         width: 600,
//         height: 600,
//         tooltip: {
//             textStyle: {
//                 fontName: getFont(),
//                 color: 'black'
//             },
//             isHtml: true
//         },
//         annotations: {
//             style: 'none',
//             textStyle: {
//                 fontName: getFont()
//             },
//         },
//         pieSliceText: 'label',
//         pieSliceTextStyle: {
//             fontName: getFont(),
//         },
//     };
//     const chart = new google.visualization.PieChart(document.getElementById('countryChart'));
//     chart.draw(data, options);
// }
function createMap() {
    countriesObject = sortCategoryIndex > -1 ? categories[sortCategoryIndex].countries : countries
    countriesArray = createArray(countriesObject)
    mapData = []
    const isoMap23 = {};
    const isoMap32 = {};
    d3.csv("resources/country-codes.csv").then(data => {
        data.forEach(row => {
            isoMap23[row["ISO3166-1-Alpha-2"]] = row["ISO3166-1-Alpha-3"];
            isoMap32[row["ISO3166-1-Alpha-3"]] = row["ISO3166-1-Alpha-2"];
        });
        countriesArray.forEach(country => {
            mapData.push({ name: country.name, country: isoMap23[country.code.toUpperCase()], code: country.code, value: country.count })
        })
        const dataMap = Object.fromEntries(mapData.map(d => [d.country, d.value, d.code]));
        const values = mapData.map(d => d.value);
        const maxValue = Math.max(...values);
        const colorChecked = document.getElementById('checkbox_map_color').checked
        let color = '#fff'
        // let color = rootStyles.getPropertyValue('--banner')
        if (colorChecked && gameID == 'cuphead') {
            color = sortCategoryIndex > -1 && !(gameID == 'sm64' && mode == 'levels')
                ? gameID == 'cuphead' && categories[sortCategoryIndex].info
                    ? getComputedStyle(document.getElementsByClassName(categories[sortCategoryIndex].info.id)[0]).backgroundColor
                    : getComputedStyle(document.getElementsByClassName(categories[sortCategoryIndex].className)[0]).backgroundColor
                : rootStyles.getPropertyValue('--banner')
        }
        const colorScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([addOpacityToCSSVar(color), color]);
        const width = 800;
        const height = 400;
        const svg = d3.select("#world-map");
        const tooltip = d3.select("#mapTooltip");
        const projection = d3.geoNaturalEarth1()
            .scale(150)
            .translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
            data.features.forEach(function (d) {
                d.properties.value = mapData.find(c => c.country == d.id)
            });
            svg.selectAll("path")
                .data(data.features)
                .join("path")
                .attr("d", path)
                .attr("fill", d => {
                    const value = dataMap[d.id];
                    return value ? colorScale(value) : "transparent";
                })
                .attr("stroke", 'black')
                .on("mouseover", function (event, d) {
                    if (d.properties.value) {
                        const label = d.properties.value.name
                        const flag = getFlag(isoMap32[d.id].toLowerCase(), d.properties.name, 20)
                        const currentColor = d3.select(this).attr("fill");
                        d3.select(this).classed("cursor", true);
                        d3.select(this).attr("fill", "var(--banner)").attr("data-original-color", currentColor);
                        tooltip.style("display", "block")
                            .html(getTooltip(flag, label));
                    }
                })
                .on("mousemove", (event) => {
                    tooltip.style("left", `${event.pageX + 10}px`)
                        .style("top", `${event.pageY + 10}px`);
                })
                .on("mouseout", function (event, d) {
                    if (d.properties.value) {
                        tooltip.style("display", "none");
                        const originalColor = d3.select(this).attr("data-original-color");
                        d3.select(this).classed("cursor", false);
                        d3.select(this).attr("fill", originalColor);
                    }
                })
                .on("click", (event, d) => {
                    if (d.properties.value) {
                        openModal(d.properties.value.name, 'up')
                    }
                })
        });
    });
}
function getTooltip(flag, label) {
    return `<div class='container'>${flag}<div class='chartLabel'>${label}</div></div>`
}