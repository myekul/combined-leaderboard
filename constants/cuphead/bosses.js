const bosses = [
    {
        id: 'therootpack',
        name: 'The Root Pack',
        isle: 1,
        order: 7
    },
    {
        id: 'goopylegrande',
        name: 'Goopy Le Grande',
        isle: 1,
        order: 9
    },
    {
        id: 'hildaberg',
        name: 'Hilda Berg',
        isle: 1,
        order: 10
    },
    {
        id: 'cagneycarnation',
        name: 'Cagney Carnation',
        isle: 1,
        order: 11
    },
    {
        id: 'ribbyandcroaks',
        name: 'Ribby and Croaks',
        isle: 1,
        order: 8
    },
    {
        id: 'baronessvonbonbon',
        name: 'Baroness Von Bon Bon',
        isle: 2,
        order: 12
    },
    {
        id: 'beppitheclown',
        name: 'Beppi The Clown',
        isle: 2,
        order: 15
    },
    {
        id: 'djimmithegreat',
        name: 'Djimmi The Great',
        isle: 2,
        order: 14
    },
    {
        id: 'grimmatchstick',
        name: 'Grim Matchstick',
        isle: 2,
        order: 16
    },
    {
        id: 'wallywarbles',
        name: 'Wally Warbles',
        isle: 2,
        order: 13
    },
    {
        id: 'rumorhoneybottoms',
        name: 'Rumor Honeybottoms',
        isle: 3,
        order: 17
    },
    {
        id: 'captainbrineybeard',
        name: 'Captain Brineybeard',
        isle: 3,
        order: 21
    },
    {
        id: 'sallystageplay',
        name: 'Sally Stageplay',
        isle: 3,
        order: 19
    },
    {
        id: 'wernerwerman',
        name: 'Werner Werman',
        isle: 3,
        order: 20
    },
    {
        id: 'drkahlsrobot',
        name: "Dr. Kahl's Robot",
        isle: 3,
        order: 18
    },
    {
        id: 'calamaria',
        name: 'Cala Maria',
        isle: 3,
        order: 22
    },
    {
        id: 'phantomexpress',
        name: 'Phantom Express',
        isle: 3,
        order: 23
    },
    {
        id: 'kingdice',
        name: 'King Dice',
        isle: 4,
        order: 24
    },
    {
        id: 'thedevil',
        name: 'The Devil',
        isle: 4,
        order: 25
    },
    {
        id: 'glumstonethegiant',
        name: 'Glumstone The Giant',
        isle: 5,
        order: 1
    },
    {
        id: 'moonshinemob',
        name: 'Moonshine Mob',
        isle: 5,
        order: 5
    },
    {
        id: 'thehowlingaces',
        name: 'The Howling Aces',
        isle: 5,
        order: 3
    },
    {
        id: 'mortimerfreeze',
        name: 'Mortimer Freeze',
        isle: 5,
        order: 2
    },
    {
        id: 'estherwinchester',
        name: 'Esther Winchester',
        isle: 5,
        order: 4
    },
    {
        id: 'chefsaltbaker',
        name: 'Chef Saltbaker',
        isle: 5,
        order: 6
    }
];
bosses.forEach(boss => {
    if (boss.name == 'King Dice') {
        boss.time = 259
    } else if (['The Devil', 'Chef Saltbaker'].includes(boss.name)) {
        boss.time = 194
    } else {
        boss.time = 129
    }
    if (['Hilda Berg', 'Wally Warbles', 'Djimmi The Great', "Dr. Kahl's Robot", 'Cala Maria', 'Esther Winchester'].includes(boss.name)) {
        boss.plane = true
    } else {
        boss.plane = false
    }
})