const commBestILs = {
    '1.1+': {
        name: '1.1+',
        tabName: '1.1+',
        markin: '1.1+ Any%',
        className: 'onePointOne',
        range: 'C:Z',
        category: categorySet['main'][0],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread'
    },
    Legacy: {
        name: 'Legacy',
        tabName: '1.0',
        markin: '1.0 Any%',
        className: 'legacy',
        range: 'C:Z',
        category: categorySet['main'][1],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'roundabout'
    },
    NMG: {
        name: 'NMG',
        tabName: 'NMG',
        markin: 'NMG Any%',
        className: 'nmg',
        range: 'C:Z',
        category: categorySet['main'][2],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread'
    },
    // DLC
    DLC: {
        name: 'DLC',
        tabName: 'DLC',
        markin: 'DLC Any% (L/S)',
        className: 'dlc',
        range: 'C1:Z6',
        category: categorySet['main'][3],
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
        range: 'C1:Z6',
        category: categorySet['main'][3],
        numRuns: 3,
        shot1: 'lobber',
        shot2: 'spread',
        extraRuns: [
            {
                date: '2024-03-14',
                score: '10:55.08',
                playerName: 'myekul',
                videos: { links: [{ uri: 'https://youtu.be/uB7fOkPIMDc' }] }
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
        range: 'C1:Z6',
        category: categorySet['main'][3],
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
                date: '2022-08-25',
                score: '11:10.13',
                playerName: 'MarkinSws',
                videos: { links: [{ uri: 'https://youtu.be/1I2Ltq9eqtA' }] }
            },
            {
                date: '2025-03-23',
                score: '11:10.84',
                playerName: 'Lewzr',
                videos: { links: [{ uri: 'https://youtu.be/-WovGm8jCSI' }] }
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
            "Rookie_Gamer_Tlax",
            'WoskiBoy',
            'Mine_',
            'nomit'
        ]
    },
    'DLC C/T': {
        name: 'DLC',
        tabName: 'DLC C/T',
        className: 'dlc',
        range: 'C1:Z6',
        category: categorySet['main'][3],
        numRuns: 2,
        shot1: 'charge',
        shot2: 'twistup',
        extraRuns: [
            {
                date: '2025-05-09',
                score: '10:54.25',
                playerName: 'GamerAttack27',
                videos: { links: [{ uri: 'https://youtu.be/bgWwOKoOouU' }] }
            },
            {
                date: '2025-03-08',
                score: '10:59.66',
                playerName: 'myekul',
                videos: { links: [{ uri: 'https://youtu.be/HRwuUPAstSc' }] }
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
        markin: 'DLC+BG Any% (L/S)',
        className: 'dlcbase',
        range: 'C:Z',
        category: categorySet['main'][4],
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
        range: 'C:Z',
        category: categorySet['main'][4],
        numRuns: 1,
        shot1: 'lobber',
        shot2: 'spread',
        extraPlayers: [
            'BlackTower',
            'ExclamationMarkYT',
            'GamerAttack27',
            'Grondious',
            'HappyWolf',
            'jaan_971',
            'KalaveritaTV',
            'MarkinSws',
            'Quincely0',
            'Rapho'
        ]
    },
    'DLC+Base C/S': {
        name: 'DLC+Base',
        tabName: 'DLC+Base C/S',
        className: 'dlcbase',
        range: 'C1:Z25',
        category: categorySet['main'][4],
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
            "Yuka",
            "Kaleva",
            'Lewzr',
            "halfword",
            "PorcoBrabo",
            "minamikori",
            "alex92Tcordobes",
            "Huawai",
            'Uramatsu'
        ]
    },
}