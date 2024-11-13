function updateStats() {
    if (gameID != 'tetris') {
        players.forEach(player => {
            if (player.location) {
                const countryName = player.location.country.names.international
                const country = countries[countryName]
                if (country) {
                    country.count += 1;
                    country.players.push(player)
                } else {
                    countries[countryName] = {}
                    countries[countryName].count = 1;
                    countries[countryName].players = [player]
                    countries[countryName].name = countryName
                    countries[countryName].code = player.location.country.code
                }
            }
        })
    }
    let HTMLContent = `<table>`
    let countryArray = []
    for (let countryKey in countries) {
        countryArray.push(countries[countryKey])
    }
    countryArray.sort((a, b) => {
        return b.count - a.count
    });
    countryArray.forEach(country => {
        HTMLContent +=
            `<tr>
            <td style='text-align:right'>${getPercentage(country.count / players.length)}%</td>
            <td>${country.count}</td>
            <td>${getFlag(country.code, country.name, 15)}</td>
            <td style='text-align:left'>${country.name}</td>
            </tr>`
    })
    HTMLContent += `</table>`
    countries = {}
    countryArray = []
    const stats = document.getElementById('stats')
    stats.innerHTML = HTMLContent
}