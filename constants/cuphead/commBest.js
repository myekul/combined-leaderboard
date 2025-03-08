const commBestILs = {
    '1.1+': {
        name: '1.1+',
        tabName: '1.1+',
        className: 'onePointOne',
        range: 'C:Z',
        category: cuphead['main'][0],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread'
    },
    Legacy: {
        name: 'Legacy',
        tabName: '1.0',
        className: 'legacy',
        range: 'C:Z',
        category: cuphead['main'][1],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'roundabout'
    },
    NMG: {
        name: 'NMG',
        tabName: 'NMG',
        className: 'nmg',
        range: 'C:Z',
        category: cuphead['main'][2],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread'
    },
    // DLC
    DLC: {
        name: 'DLC',
        tabName: 'DLC',
        className: 'dlc',
        range: 'C1:Z6',
        category: cuphead['main'][3],
        numRuns: 3,
        // shot1: 'lobber',
        // shot2: 'spread'
        subcat: 'Any%'
    },
    'DLC C/S': {
        name: 'DLC',
        tabName: 'DLC C/S',
        className: 'dlc',
        range: 'C1:Z6',
        category: cuphead['main'][3],
        numRuns: 3,
        shot1: 'charge',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2024-08-07',
                score: '10:50.69',
                playerName: 'Quincely0',
                videos: { links: [{ uri: 'https://youtu.be/9NmKTKqQUdg' }] }
            },
            {
                date: '2023-12-24',
                score: '10:59.85',
                playerName: 'GamerAttack27',
                videos: { links: [{ uri: 'https://youtu.be/AKyBN0Hhy0U' }] }
            },
            {
                date: '2025-02-19',
                score: '11:32.85',
                playerName: 'Lewzr07',
                videos: { links: [{ uri: 'https://youtu.be/Opq3XN9TWOQ' }] }
            }
        ],
        extraPlayers: [
            "myekul",
            "Kirthar",
            "Musically_dECLINED",
            "Jason2890",
            "V11GAmeR",
            "Yuka",
            "Kaleva",
            "halfword",
            "AssasinNarga",
            "PorcoBrabo",
            "Rookie_Gamer_Tlax",
            "PanchoFox",
            "2haka",
            "ANE_MMRC",
            "Mine_",
            "nomit",
            'Pizzarolli'
        ]
    },
    'DLC C/T': {
        name: 'DLC',
        tabName: 'DLC C/T',
        className: 'dlc',
        range: 'C1:Z6',
        category: cuphead['main'][3],
        numRuns: 1,
        shot1: 'charge',
        shot2: 'twistup',
        extraRuns: [
            {
                date: '2025-01-15',
                score: '11:10.33',
                playerName: 'myekul',
                videos: { links: [{ uri: 'https://youtu.be/icrWBVHPUI4' }] }
            }
        ]
    },
    'DLC Low%': {
        name: 'DLC',
        tabName: 'DLC Low%',
        className: 'dlc',
        range: 'C1:Z6',
        category: dlcLow,
        numRuns: 3,
        shot1: 'peashooter'
    },
    'DLC C-less': {
        name: 'DLC',
        tabName: 'DLC C-less',
        className: 'dlc',
        range: 'C1:Z6',
        category: cuphead['main'][3],
        numRuns: 1,
        subcat: 'C-less',
        extraRuns: [
            {
                date: '2023-05-15',
                score: '11:41.29',
                playerName: 'Quincely0',
                videos: { links: [{ uri: 'https://youtu.be/D8th-Wm4W0o' }] }
            }
        ]
    },
    'DLC Expert': {
        name: 'DLC',
        tabName: 'DLC E',
        className: 'dlc',
        range: 'C1:Z6',
        category: dlcExpert,
        numRuns: 3,
        subcat: 'Expert'
    },
    // DLC+Base
    'DLC+Base': {
        name: 'DLC+Base',
        tabName: 'DLC+Base',
        className: 'dlcbase',
        range: 'C:Z',
        category: cuphead['main'][4],
        numRuns: 1,
        // shot1: 'lobber',
        // shot2: 'spread'
        subcat: 'Any%'
    },
    'DLC+Base C/S': {
        name: 'DLC+Base',
        tabName: 'DLC+Base C/S',
        className: 'dlcbase',
        range: 'C1:Z25',
        category: cuphead['main'][4],
        numRuns: 3,
        shot1: 'charge',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2024-06-21',
                score: '38:53.36',
                playerName: 'Quincely0',
                videos: { links: [{ uri: 'https://youtu.be/u_w4cHV-rqU' }] }
            },
            {
                date: '2024-12-24',
                score: '39:36.74',
                playerName: 'GamerAttack27',
                videos: { links: [{ uri: 'https://youtu.be/AKyBN0Hhy0U' }] }
            },
        ],
        extraPlayers: [
            "myekul",
            "Kirthar",
            "Musically_dECLINED",
            "Jason2890",
            "V11GAmeR",
            "Yuka",
            "Kaleva",
            "halfword",
            "PorcoBrabo",
            "Rookie_Gamer_Tlax",
            "minamikori",
            "alex92Tcordobes",
            "Huawai",
        ]
    },
}
const commBestExtra = ['DLC C/S', 'DLC C/T', 'DLC C-less', 'DLC+Base C/S']