let d3loaded = false
let mapModeState = 'all'
let mapZoomControl = { svg: null, zoom: null, currentZoom: 1 }
let usStatesGeojson = null
const customPlayerMapCoords = {
    // 'myekul': [250, 88],
}
const usStateAbbrevToName = {
    'al': 'Alabama', 'ak': 'Alaska', 'az': 'Arizona', 'ar': 'Arkansas', 'ca': 'California', 'co': 'Colorado', 'ct': 'Connecticut', 'de': 'Delaware',
    'fl': 'Florida', 'ga': 'Georgia', 'hi': 'Hawaii', 'id': 'Idaho', 'il': 'Illinois', 'in': 'Indiana', 'ia': 'Iowa', 'ks': 'Kansas',
    'ky': 'Kentucky', 'la': 'Louisiana', 'me': 'Maine', 'md': 'Maryland', 'ma': 'Massachusetts', 'mi': 'Michigan', 'mn': 'Minnesota',
    'ms': 'Mississippi', 'mo': 'Missouri', 'mt': 'Montana', 'ne': 'Nebraska', 'nv': 'Nevada', 'nh': 'New Hampshire', 'nj': 'New Jersey',
    'nm': 'New Mexico', 'ny': 'New York', 'nc': 'North Carolina', 'nd': 'North Dakota', 'oh': 'Ohio', 'ok': 'Oklahoma', 'or': 'Oregon',
    'pa': 'Pennsylvania', 'ri': 'Rhode Island', 'sc': 'South Carolina', 'sd': 'South Dakota', 'tn': 'Tennessee', 'tx': 'Texas',
    'ut': 'Utah', 'vt': 'Vermont', 'va': 'Virginia', 'wa': 'Washington', 'wi': 'Wisconsin', 'wv': 'West Virginia', 'wy': 'Wyoming',
    'dc': 'District of Columbia'
}
function generateMap() {
    if (d3loaded) {
        mapMain()
    } else {
        addJSFile('https://d3js.org/d3.v7.min.js', () => {
            mapMain()
        })
    }
}
function mapMain() {
    countries = {}
    const mapMode = document.getElementById('dropdown_mapMode').value
    mapModeState = mapMode
    const mapValue = document.getElementById('dropdown_mapValue').value
    categories.forEach(category => {
        category.countries = {}
    })
    let playersCopy = getMapPlayers(mapMode)
    playersCopy.forEach(player => {
        let goated = false
        let country
        player.runs.forEach(run => {
            if (run) {
                if (mapMode == 'WRs') {
                    goated = run.place == 1
                } else if (mapMode == 'trophies') {
                    goated = [1, 2, 3].includes(run.place)
                } else {
                    goated = true
                }
            }
        })
        if (goated) country = countries[getLocation(player, countries)]
        categories.forEach((category, categoryIndex) => {
            goated = false
            const run = player.runs[categoryIndex]
            if (run) {
                if (mapMode == 'WRs') {
                    goated = run.place == 1
                } else if (mapMode == 'trophies') {
                    goated = [1, 2, 3].includes(run.place)
                } else {
                    goated = true
                }
            }
            if (goated) {
                getLocation(player, category.countries)
                if (country && mapValue == 'runs') country.count++
            }
        })
        if (country && mapValue == 'runs') country.count--
    })
    document.getElementById('countryTable').innerHTML = countryCount()
    createMap(mapMode)
    flagArmy()
}
function getMapPlayers(mapMode) {
    let playersCopy = [...players.slice(0, 300)]
    if (mapMode == 'top30') {
        playersCopy = players.slice(0, 30)
    } else if (mapMode == 'top100') {
        playersCopy = players.slice(0, 100)
    }
    playersCopy.forEach(player => {
        if (player.name == 'Musically_dECLINED') player.location.region = { code: 'us/tn' };
        if (player.name == 'myekul') player.location.region = { code: 'us/ma' };
    })
    return playersCopy
}
function getLocation(player, countriesObject) {
    if (player.location) {
        let countryName = player.location.country.name
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
                <td style='text-align:right;font-size:75%'>${displayPercentage((country.count / total) * 100, 1)}%</td>
                <td>${country.count}</td>
                <td>${getFlag(country.code, country.name, 15)}</td>
                <td onclick="countryModal('${country.name}')" class='clickable' style='text-align:left'>${country.name}</td>
                ${trophyCase(country)}
                </tr>`
    })
    HTMLContent += `</table></div>`
    return HTMLContent
}
function countryModal(countryName) {
    globalCountryName = countryName
    const country = countries[countryName]
    playersCopy = [...country.players].slice(0, 100)
    sortPlayers(playersCopy)
    openModal(`<div class='container'>${playersTable(playersCopy)}</div>`, 'COUNTRY')
    const boardTitle = generateBoardTitle(1)
    let HTMLContent = `
    <div class='container' style='padding-top:10px'>
        <div>${getFlag(country.code, country.name, 24)}</div>
        <div style='font-size:140%;padding-left:10px'>${countryName}</div>
        ${boardTitle ? `<div class='modalBoardTitle' style='padding-left:20px'>${boardTitle}</div>` : ''}
    </div>`
    document.getElementById('modal-subtitle').innerHTML = HTMLContent
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
            HTMLContent += `<div onclick="countryModal('${country.name}')" class='container grow'>${getFlag(country.code, country.name, 20)}</div>`
        }
    })
    document.getElementById('flagArmy').innerHTML = HTMLContent
}
function createMap(mapMode) {
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
        const svg = d3.select("#world-map");
        const previousTransform = mapZoomControl?.svg?.node() ? d3.zoomTransform(mapZoomControl.svg.node()) : d3.zoomIdentity;
        const tooltip = d3.select("#mapTooltip");
        const stateBoundaryZoomThreshold = 2;
        const g = svg.selectAll("g.map-content")
            .data([null])
            .join("g")
            .attr("class", "map-content");
        let stateGroup;
        const width = parseInt(svg.attr("width"), 10);
        const height = parseInt(svg.attr("height"), 10);
        const panMargin = 1;
        const translateExtent = [[-panMargin, -panMargin], [width + panMargin, height + panMargin]];
        const zoom = d3.zoom()
            .scaleExtent([1.4, 8])
            .translateExtent(translateExtent)
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
                mapZoomControl.currentZoom = event.transform.k;
                g.selectAll("g.player-icon-wrapper")
                    .attr("transform", `scale(${1 / event.transform.k})`);
                maybeRenderStateBoundaries();
            });
        svg.call(zoom);
        const defaultZoom = 1.4;
        const defaultYOffset = height * -0.1;
        const initialTransform = (previousTransform.k === 1 && previousTransform.x === 0 && previousTransform.y === 0)
            ? d3.zoomIdentity.translate(width / 2 * (1 - defaultZoom), height / 2 * (1 - defaultZoom) - defaultYOffset).scale(defaultZoom)
            : previousTransform;
        mapZoomControl = { svg, zoom, currentZoom: initialTransform.k };
        svg.call(zoom.transform, initialTransform);
        const projection = d3.geoNaturalEarth1()
            .scale(150)
            .translate([width / 2, height / 2]);
        const path = d3.geoPath().projection(projection);
        const stateUrl = "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";
        const minIconSize = 24;
        const maxIconSize = 46;
        function getMapPlayerIconSize(player) {
            const runPercentage = player.runs?.[sortCategoryIndex]?.percentage;
            if (sortCategoryIndex > -1 && runPercentage != null) {
                const normalized = Math.max(0, Math.min(100, runPercentage));
                const percentageRatio = Math.max(0, Math.min(1, (normalized - 90) / 10));
                return Math.round(minIconSize + (maxIconSize - minIconSize) * percentageRatio);
            }
            const score = Math.max(0, Math.min(100, player.score ?? 90));
            const scoreRatio = Math.max(0, Math.min(1, (score - 90) / 10));
            return Math.round(minIconSize + (maxIconSize - minIconSize) * scoreRatio);
        }
        const filteredMapPlayers = getMapPlayers(mapMode).filter(player => player.links.img);
        const hasStateCodePlayers = filteredMapPlayers.some(player => typeof player.location?.region?.code === 'string' && player.location.region.code.toLowerCase().startsWith('us/'));
        const stateLoader = hasStateCodePlayers
            ? d3.json(stateUrl).then(statesData => { usStatesGeojson = statesData; return statesData; }).catch(() => null)
            : Promise.resolve(null);
        function normalizeUSStateCode(regionCode) {
            if (!regionCode || typeof regionCode !== 'string') return null;
            const parts = regionCode.toLowerCase().split('/');
            return parts.length > 1 ? parts[1].trim() : parts[0].trim();
        }
        function getUSStateNameByCode(regionCode, countryCode) {
            if (!regionCode || typeof regionCode !== 'string') return null;
            const normalized = regionCode.toLowerCase().trim();
            if (normalized.startsWith('us/')) {
                const parts = normalized.split('/');
                const stateCode = parts.length > 1 ? parts[1].trim() : null;
                return stateCode && usStateAbbrevToName[stateCode] ? usStateAbbrevToName[stateCode] : null;
            }
            const rawCountryCode = countryCode?.toLowerCase()?.trim();
            if ((rawCountryCode === 'us' || rawCountryCode === 'usa') && normalized.length === 2) {
                return usStateAbbrevToName[normalized] || null;
            }
            return null;
        }
        function getUSStateCentroid(regionCode, countryCode) {
            const stateName = getUSStateNameByCode(regionCode, countryCode);
            if (!stateName || !usStatesGeojson) return null;
            const feature = usStatesGeojson.features.find(f => f.properties?.name?.toLowerCase() === stateName.toLowerCase());
            if (!feature) return null;
            const centroid = d3.geoCentroid(feature);
            return centroid ? projection(centroid) : null;
        }
        function getProjectedFeatureCentroid(feature) {
            if (!feature || !feature.geometry) return null;
            if (feature.geometry.type === 'MultiPolygon') {
                let largestPolygon = null;
                let largestArea = -Infinity;
                feature.geometry.coordinates.forEach(polygonCoords => {
                    const polygonFeature = { type: 'Feature', geometry: { type: 'Polygon', coordinates: polygonCoords } };
                    const area = d3.geoArea(polygonFeature);
                    if (area > largestArea) {
                        largestArea = area;
                        largestPolygon = polygonFeature;
                    }
                });
                if (largestPolygon) {
                    const centroid = d3.geoCentroid(largestPolygon);
                    return centroid ? projection(centroid) : null;
                }
            }
            const geographicCentroid = d3.geoCentroid(feature);
            return geographicCentroid ? projection(geographicCentroid) : null;
        }
        function maybeRenderStateBoundaries() {
            if (!stateGroup) return;
            if (mapZoomControl.currentZoom >= stateBoundaryZoomThreshold) {
                if (usStatesGeojson) {
                    renderUSStateBoundaries(stateGroup, usStatesGeojson, path)
                } else {
                    d3.json("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json").then(statesData => {
                        usStatesGeojson = statesData
                        if (mapZoomControl.currentZoom >= stateBoundaryZoomThreshold && stateGroup) {
                            renderUSStateBoundaries(stateGroup, usStatesGeojson, path)
                        }
                    });
                }
            } else {
                stateGroup.selectAll("path.state-boundary").remove();
            }
        }
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(data => {
            const filteredFeatures = data.features.filter(feature => feature.properties?.name !== 'Antarctica');
            const featureById = new Map(filteredFeatures.map(feature => [feature.id, feature]));
            filteredFeatures.forEach(function (d) {
                d.properties.value = mapData.find(c => c.country == d.id)
            });
            g.selectAll("path.country-fill")
                .data(filteredFeatures)
                .join("path")
                .attr("class", "country-fill")
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
                        countryModal(d.properties.value.name)
                    }
                })

            stateGroup = g.selectAll("g.us-state-boundaries")
                .data([null])
                .join("g")
                .attr("class", "us-state-boundaries");

            maybeRenderStateBoundaries();
            const showPlayers = document.getElementById('checkbox_map_players')?.checked
            if (showPlayers) {
                stateLoader.then(() => {
                    const markerCounts = {};
                    const markers = [];
                    const mapPlayers = filteredMapPlayers;
                    mapPlayers.forEach(player => {
                        const regionCode = player.location?.region?.code;
                        const countryCodeRaw = player.location?.country?.code;
                        const stateCentroid = regionCode ? getUSStateCentroid(regionCode, countryCodeRaw) : null;
                        const countryCode = countryCodeRaw?.slice(0, 2)?.toUpperCase();
                        const countryName = player.location?.country?.name;
                        const avatar = player.links?.img || null;
                        const iso3 = countryCode ? isoMap23[countryCode] : null;
                        const feature = iso3 ? featureById.get(iso3) : null;
                        const position = stateCentroid || (feature ? getProjectedFeatureCentroid(feature) : null);
                        if (position && position[0] && position[1]) {
                            const positionKey = stateCentroid ? regionCode.toLowerCase() : iso3;
                            const index = (markerCounts[positionKey] = (markerCounts[positionKey] || 0) + 1) - 1;
                            const dx = ((index % 5)) * 6;
                            const dy = Math.floor(index / 5) * 6;
                            const defaultCentroid = [position[0] + dx, position[1] + dy];
                            const manualCentroid = player.mapCoords || customPlayerMapCoords[player.name];
                            markers.push({
                                player,
                                centroid: manualCentroid ? manualCentroid : defaultCentroid,
                                countryCode: countryCode ? countryCode.toLowerCase() : 'us',
                                countryName,
                                avatar,
                                iconSize: getMapPlayerIconSize(player)
                            });
                        }
                    });
                    markers.sort((a, b) => {
                        const scoreA = a.player?.score ?? 0;
                        const scoreB = b.player?.score ?? 0;
                        return scoreA - scoreB || a.player.name.localeCompare(b.player.name);
                    });
                    const groups = g.selectAll("g.player-marker-group")
                        .data(markers, d => d.player.id || d.player.name)
                        .join("g")
                        .attr("class", "player-marker-group")
                        .attr("transform", d => `translate(${d.centroid[0]},${d.centroid[1]})`)
                        .style("cursor", "pointer")
                        .on("click", (event, d) => {
                            openModalCL(false, d.player.name)
                        })
                        .on("mouseover", function (event, d) {
                            const flag = getFlag(d.countryCode, d.countryName, 20)
                            const label = `${d.player.rank}. ${d.player.name}`;
                            tooltip.style("display", "block").html(getTooltip(flag, label, d.player));
                        })
                        .on("mousemove", (event) => {
                            tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY + 10}px`);
                        })
                        .on("mouseout", function () {
                            tooltip.style("display", "none");
                        });
                    groups.raise();
                    const wrappers = groups.selectAll("g.player-icon-wrapper").data(d => [d]).join("g")
                        .attr("class", "player-icon-wrapper")
                        .attr("transform", `scale(${1 / mapZoomControl.currentZoom})`);
                    wrappers.selectAll("foreignObject.player-icon").data(d => [d]).join("foreignObject")
                        .attr("class", "player-icon")
                        .attr("x", d => -d.iconSize / 2)
                        .attr("y", d => -d.iconSize / 2)
                        .attr("width", d => d.iconSize)
                        .attr("height", d => d.iconSize)
                        .html(d => `<div class='clickable'>${getPlayerIcon(d.player, d.iconSize)}</div>`);
                });
            } else {
                g.selectAll("g.player-marker-group").remove();
            }
        });
    });
}
function zoomMap(scaleFactor) {
    if (mapZoomControl.svg && mapZoomControl.zoom) {
        mapZoomControl.svg.transition().duration(300).call(mapZoomControl.zoom.scaleBy, scaleFactor);
    }
}
function renderUSStateBoundaries(container, statesData, path) {
    container.selectAll("path.state-boundary")
        .data(statesData.features)
        .join("path")
        .attr("class", "state-boundary")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "rgba(0,0,0,0.5)")
        .attr("stroke-width", 0.5)
        .attr("pointer-events", "none");
}
function resetMapZoom() {
    if (mapZoomControl.svg && mapZoomControl.zoom) {
        mapZoomControl.svg.transition().duration(300).call(mapZoomControl.zoom.transform, d3.zoomIdentity);
    }
}
function getTooltip(flag, label, player) {
    const image = player ? `<div class='background1 border' style='padding:4px'>${playerDisplay(player.name)}</div>` : ''
    return `<div class='container' style='align-items:center'>${image}${!player ? `<div class='container countryTooltip'>${flag + label}` : ''}</div></div>`
}