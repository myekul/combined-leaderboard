let players = new Set()
let processedCategories = 0
function getLeaderboard(gameId, categories, category) {
    const url = `https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${category.id}?var-${category.var}=${category.subcat}&top=100&embed=players&embed=players,category`;
    // const url = `https://www.speedrun.com/api/v1/games/sm64?embed=categories.variables`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.data.players.data.forEach(player => {
                player.runs = []
                players.add(player)
            })
            category.runs = data.data
            processedCategories++
            if (processedCategories == cuphead.length) {
                generatePlaces(categories)
                generateRanks()
                generateHTML(categories)
            }
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}
const cuphead = [
    {
        name: '1.1+',
        class: 'onePointOne',
        id: '9d8lxv62',
        var: '0nwpgqr8',
        subcat: '013kjprq'
    },
    {
        name: 'Legacy',
        class: 'legacy',
        id: '82481pmk',
        var: 'onvv9m0n',
        subcat: '5lm3ep81'
    },
    {
        name: 'NMG',
        class: 'nmg',
        id: 'zd38jgek',
        var: 'kn0z0do8',
        subcat: 'klr0d5ol'
    },
    {
        name: 'DLC',
        class: 'dlc',
        id: '7kjl0wz2',
        var: 'wl3ddqo8',
        subcat: '8104dd5l'
    },
    {
        name: 'DLC+Base',
        class: 'dlcbase',
        id: 'xk95z7g2',
        var: 'wlekk5el',
        subcat: 'jq6dee71'
    }
]
const sm64 = [
    {
        id: 'wkpoo02r', // 120
        // difficulties: '0nwpgqr8',
        // regular: '013kjprq'
    },
    {
        id: '7dgrrxk4', // 70
        // difficulties: 'onvv9m0n',
        // regular: '5lm3ep81'
    },
    {
        id: 'n2y55mko', // 16
        // difficulties: 'kn0z0do8',
        // regular: 'klr0d5ol'
    },
    {
        id: '7kjpp4k3', // 1
        // difficulties: 'wl3ddqo8',
        // regular: '8104dd5l'
    },
    {
        id: 'xk9gg6d0', // 0
        // difficulties: 'wlekk5el',
        // regular: 'jq6dee71'
    }
]
cuphead.forEach(category => {
    getLeaderboard('cuphead', cuphead, category)
})
function generatePlaces(categories) {
    categories.forEach(category => {
        category.runs.runs.forEach(run => {
            const runPlayer = run.run.players[0].id
            let thePlayer = ''
            for (const player of players) {
                if (player.id === runPlayer) {
                    thePlayer = player;
                    break;
                }
            }
            thePlayer.runs.push(run)
            run.run.player = thePlayer
        })
    })
}
function generateRanks() {
    for (const player of players) {
        let placeSum = 0
        player.runs.forEach(run => {
            placeSum += parseInt(run.place)
        })
        let rank = placeSum / player.runs.length
        rank = rank.toFixed(1)
        player.rank = rank
    }
}
function generateHTML(categories) {
    categories.forEach(category => {
        let HTMLContent = `<table>
        <tr><td colspan=3>${category.runs.category.data.name}</td></tr>`
        category.runs.runs.forEach(run => {
            const thePlayer = run.run.player
            if (thePlayer.rel == 'user') {
                thePlayer.name = thePlayer.names.international
            }
            HTMLContent += `<tr>
            <td>${run.place}</td>
            <td>${thePlayer.name}</td>
            <td>${run.run.times.primary.substring(2).toLowerCase()}</td>
            <td>${thePlayer.runs.length}</td>
            <td>${thePlayer.rank}</td>
            </tr>`
        })
        const theTable = document.getElementById('theTable')
        theTable.innerHTML += HTMLContent
    })
    generateRankTable(categories)
}
function generateRankTable(categories) {
    const playersArray = Array.from(players)
    playersArray.sort((a, b) => {
        if (b.runs.length != a.runs.length) {
            return b.runs.length - a.runs.length;
        }
        return a.rank - b.rank;
    });
    let HTMLContent = `<table>
    <tr style='font-size:12px'>
    <td></td>
    <td>Runner</td>
    <td>Avg Rank</td>
    <td>Time</td>`
    categories.forEach(category => {
        HTMLContent += `<td colspan=2>${category.name}</td>`
    })
    HTMLContent += `<td>Runs Missing</td>
    <td>Best Rank</td>
    <td>Worst Rank</td>
    </tr>`
    playersArray.slice(0, 300).forEach((player, index) => {
        let places = [];
        let times = [];
        let sum = ''
        player.runs.forEach(run => {
            places.push(run.place)
            times.push(run.run.times.primary_t)
        })
        if (player.runs.length == categories.length) {
            sum = 0;
            times.forEach(time => {
                sum += time
            })
            sum = secondsToHMS(sum)
        }
        HTMLContent += `<tr>
        <td>${index + 1}</td>
        <td style='text-align:left'>${player.name}</td>
        <td>${player.rank}</td>
        <td>${sum}</td>`
        categories.forEach(category => {
            let time = ''
            let place = ''
            player.runs.forEach(run => {
                if (category.id == run.run.category) {
                    time = secondsToHMS(run.run.times.primary_t)
                    place = run.place
                }
            })
            let theClass = category.class
            if (place == 1) {
                theClass = 'first'
            } else if (place == 2) {
                theClass = 'second'
            } else if (place == 3) {
                theClass = 'third'
            }
            HTMLContent += `<td style='font-size:12px;width:20px' class=${theClass}>${place}</td>`
            HTMLContent += `<td style='width:50px' class=${theClass}>${time}</td>`
        })
        HTMLContent += `<td>${categories.length - player.runs.length}</td>
        <td>${Math.min(...places)}</td>
        <td>${Math.max(...places)}</td>
        </tr>`
    })
    const theTable = document.getElementById('theTable')
    theTable.innerHTML = HTMLContent
}
function secondsToHMS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}