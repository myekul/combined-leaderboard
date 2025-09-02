const commBestILs = {
    '1.1+': {
        name: '1.1+',
        tabName: '1.1+',
        markin: '1.1+ Any%',
        className: 'onePointOne',
        category: 0,
        numRuns: 10,
        shot1: 'lobber',
        shot2: 'spread'
    },
    Legacy: {
        name: 'Legacy',
        tabName: 'Legacy',
        markin: '1.0 Any%',
        className: 'legacy',
        category: 1,
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'roundabout'
    },
    NMG: {
        name: 'NMG',
        tabName: 'NMG',
        markin: 'NMG Any%',
        className: 'nmg',
        category: 2,
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread'
    },
    'NMG P/S': {
        name: 'NMG',
        tabName: 'NMG P/S',
        className: 'nmg',
        category: 2,
        numRuns: 1,
        shot1: 'peashooter',
        shot2: 'spread',
        extraRuns: [],
        extraPlayers: [
            'SBDWolf'
        ]
    },
    // DLC
    DLC: {
        name: 'DLC',
        tabName: 'DLC',
        markin: 'DLC Any% (L/S)',
        className: 'dlc',
        category: 3,
        numRuns: 3,
        // shot1: 'lobber',
        // shot2: 'spread'
        subcat: 'Any%'
    },
    'DLC L/S': {
        name: 'DLC',
        tabName: 'DLC',
        markin: 'DLC Any% (L/S)',
        className: 'dlc',
        category: 3,
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2024-03-14',
                score: '10:55.08',
                playerName: 'myekul',
                url: 'https://youtu.be/uB7fOkPIMDc'
            }
        ],
        extraPlayers: [
            'BlackTower',
            'ExclamationMarkYT',
            'GamerAttack27',
            'Grondious',
            'HappyWolf',
            'holrre',
            'jaan_971',
            'JimiconNeedsYT',
            'KalaveritaTV',
            'KO_Kiss_087',
            'Lewzr',
            'MarkinSws',
            'Quincely0',
            'Rapho',
            'SBDWolf',
            'TitoOscarXxYT'
        ]
    },
    'DLC C/S': {
        name: 'DLC',
        tabName: 'DLC C/S',
        markin: 'DLC Any% (C/S)',
        className: 'dlc',
        category: 3,
        numRuns: 3,
        shot1: 'charge',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2025-08-01',
                score: '10:49.22',
                playerName: 'GamerAttack27',
                url: 'https://youtu.be/ELZcRtoi76E'
            },
            {
                date: '2024-08-07',
                score: '10:50.69',
                playerName: 'Quincely0',
                url: 'https://youtu.be/9NmKTKqQUdg'
            },
            {
                date: '2022-08-25',
                score: '11:10.13',
                playerName: 'MarkinSws',
                url: 'https://youtu.be/1I2Ltq9eqtA'
            },
            {
                date: '2025-03-23',
                score: '11:05.10',
                playerName: 'Lewzr',
                url: 'https://youtu.be/XmWhrdAQiT8'
            }
        ],
        extraPlayers: [
            'Aspiringdyke',
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
            'WoskiBoy',
            'Mine_',
            'nomit'
        ]
    },
    'DLC C/T': {
        name: 'DLC',
        tabName: 'DLC C/T',
        className: 'dlc',
        category: 3,
        numRuns: 3,
        shot1: 'charge',
        shot2: 'twistup',
        extraRuns: [
            {
                date: '2025-05-09',
                score: '10:54.25',
                playerName: 'GamerAttack27',
                url: 'https://youtu.be/bgWwOKoOouU'
            },
            {
                date: '2025-03-08',
                score: '10:59.66',
                playerName: 'myekul',
                url: 'https://youtu.be/HRwuUPAstSc'
            },
            {
                date: '2023-07-02',
                score: '11:17.31',
                playerName: 'Quincely0',
                url: 'https://youtu.be/brsxI8S5ZiM'
            }
        ]
    },
    'DLC Low%': {
        name: 'DLC',
        tabName: 'DLC Low%',
        className: 'dlc',
        category: dlcLow,
        numRuns: 3,
        subcat: 'Low%',
    },
    // 'DLC C-less': {
    //     name: 'DLC',
    //     tabName: 'DLC C-less',
    //     className: 'dlc',
    //     range: 'C1:Z6',
    //     category: cuphead['main'][3],
    //     numRuns: 1,
    //     subcat: 'C-less',
    //     extraRuns: [
    //         {
    //             date: '2023-05-15',
    //             score: '11:41.29',
    //             playerName: 'Quincely0',
    //             videos: { links: [{ uri: 'https://youtu.be/D8th-Wm4W0o' }] }
    //         }
    //     ]
    // },
    'DLC Expert': {
        name: 'DLC',
        tabName: 'DLC Expert',
        className: 'dlc',
        category: dlcExpert,
        numRuns: 3,
        subcat: 'Expert'
    },
    // DLC+Base
    'DLC+Base': {
        name: 'DLC+Base',
        tabName: 'DLC+Base',
        markin: 'DLC+BG Any% (L/S)',
        className: 'dlcbase',
        category: 4,
        numRuns: 1,
        // shot1: 'lobber',
        // shot2: 'spread'
        subcat: 'Any%'
    },
    'DLC+Base L/S': {
        name: 'DLC+Base',
        tabName: 'DLC+Base',
        markin: 'DLC+BG Any% (L/S)',
        className: 'dlcbase',
        category: 4,
        numRuns: 1,
        shot1: 'lobber',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2025-01-03',
                score: '38:16.45',
                playerName: 'GamerAttack27',
                url: 'https://youtu.be/LvZxBu8y4rk'
            }
        ],
        extraPlayers: [
            'BlackTower',
            'ExclamationMarkYT',
            'Grondious',
            'HappyWolf',
            'jaan_971',
            'KalaveritaTV',
            'MarkinSws',
            'Quincely0',
            'Taylz'
        ]
    },
    'DLC+Base C/S': {
        name: 'DLC+Base',
        tabName: 'DLC+Base C/S',
        markin: 'DLC+BG Any% (C/S)',
        className: 'dlcbase',
        category: 4,
        numRuns: 3,
        shot1: 'charge',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2024-06-21',
                score: '38:53.36',
                playerName: 'Quincely0',
                url: 'https://youtu.be/u_w4cHV-rqU'
            },
        ],
        extraPlayers: [
            "myekul",
            'GamerAttack27',
            "Kirthar",
            "Musically_dECLINED",
            "Jason2890",
            "Yuka",
            "Kaleva",
            'Lewzr',
            "halfword",
            "PorcoBrabo",
            "minamikori",
            'nomit',
            "alex92Tcordobes",
            'Uramatsu',
            'PorcoBrabo',
        ]
    },
}