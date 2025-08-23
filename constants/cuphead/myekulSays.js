function cupheadGods(name) {
    return `<br><br>In my headcanon, ${name} is one of the 4 OG Cuphead gods (Grondious, Kirthar, SBDWolf, Jason2890).`
}
function cupheadProdigies(name) {
    return `<br><br>In my headcanon, ${name} is one of the 3 Cuphead prodigies (Quincely0, GamerAttack27, and ExclamationMarkYT).`
}
const myekulSays = {
    ClipBoardGuy: `ClipBoardGuy is a BEAST at 1.1+, currently in 4th place with a monstrous 27:34. He is also a top Titanfall 2 runner!`,
    Danxi: `Danxi is a dominant IL runner who previously held all 34/34 Simple Whetstone IL world records. As a fellow Whetstone IL runner who started in 2021, Danxi was a big inspiration for me back in the day.`,
    DORNOBZBAC: `DORNOBZBAC is a prominent IL runner with a number of impressive accomplishments. 25 TRIO!!!`,
    ExclamationMarkYT: `ExclamationMarkYT is an accomplished multi-category runner who made an absolute TEAR in DLC, being a former world record holder and one of the early pioneers of the Saltimate Jutsu. He has also been the host of several Cuphead tournaments over the past few years. Shoutouts to him!` + cupheadProdigies('ExclamationMarkYT'),
    fabix531: `fabix531 is an excellent runner from Chile whose expertise shines in base game categories. He is also an accomplished Expert and All Flags runner!`,
    Fintan0: `Fintan0 is a top Legacy runner from Ireland. In fact, he is the LEGACY WORLD RECORD HOLDER! What a feat.`,
    GamerAttack27: `This kid is insane. A former world record holder in DLC and a masterful runner in many other categories, GamerAttack27 is a name you'll find at the top of practically every Cuphead leaderboard. Most importantly, he is the Charge/Twist-Up DLC world record holder. What a MASSIVE achievement.` + cupheadProdigies('GamerAttack27'),
    Grondious: `Does he even need an introduction? Grondious is the undisputed champion of 1.1+. He is leagues ahead of the competition, boasting unparalleled wisdom of the game's inner workings and mechanics. He is also one of the early pioneers of DLC Any% and the Saltimate Jutsu. Also, ever heard of a G-swap? The G stands for Grondious.` + cupheadGods('Grondious'),
    HappyWolf: `#1 in Brazil! HappyWolf is an excellent multi-category runner, demonstrating their prowess across a handful of prestigious categories. 28:XX, 29:XX, 10:XX, and 39:XX are fantastic achievements!`,
    Jason2890: `Jason2890 is a cornerstone of the Cuphead speedrunning community, having been around since the very beginning. He currently holds the 300% world record, and has held world records in some of the most popular categories. Also just a great guy!` + cupheadGods('Jason2890'),
    Kaleva: `Ever heard of a Kaleva swap? Yup, this is THAT Kaleva. Kaleva is an all-around excellent runner, putting up great times in all the main categories.`,
    Kirthar: `Kirthar is one of the undisputed all-time greats, with some of his accomplishments dating back to 2018! Very impressive, considering he's still active and improving his times. He is also a top Low% runner. Kirthar instantly earns my respect for being a DLC Charge/Spread main.` + cupheadGods('Kirthar'),
    Quincely0: `Quincely0 is an absolutely DOMINANT runner who very quickly mastered the game and climbed his way to the top of the leaderboards. He is an extremely accomplished runner who seems to demolish every category he touches. He currently holds the NMG world record!` + cupheadProdigies('Quincely0'),
    Lewzr: `#1 in the UK! Lewzr is a runner who entered the scene and, within a year, managed to get a 10:XX DLC and a 27:XX 1.1+ and become a top runner. Bro CLAWED.`,
    luigi100: `Ever heard of a Luigi swap? Well, they're named after this guy. luigi100 is a longtime runner and a pioneer of Legacy runs.`,
    MarkinSws: 'MarkinSws is an UNSTOPPABLE force in current patch categories, sweeping the competition in NMG, DLC, and DLC+Base. He also holds the NMG All Flags and Full Clear world records. Incredible! An inspiration for many, myself included.',
    minamikori: `See that 28:27? That was played on version 1.2. That's crazy. minamikori is an exceptional runner with a very unique set of skills. He is also a former DLC 100% world record holder.`,
    Mine_: `Hi Fiona`,
    Misterbutter444: `Misterbutter444 is a prolific 1.1+ runner, boasting an incredble time of 27:37. He has also held the record for OG Charge!`,
    Musically_dECLINED: `Musically_dECLINED is a runner who rose to prominence with his NMG and DLC runs. A top Charge/Spread runner, this guy revolutionized Chargimate with the discovery of the eponymously named "M-swap." With it, he's managed to get a 10:4X DLC! That's pretty sick, but it doesn't make him any less of a goon. Ha!`,
    myekul: `Hello! I am runner of many categories, perhaps best known for my dominance of Whetstone ILs. I hold every single ground boss IL world record (108/108). I also hold several fullgame records in various Charge-centric categories, such as DLC Charge/Spread, DLC Expert, and OG Charge. Fun fact, I also discovered the Chargimate Jutsu. Hope you're enjoying the website!`,
    nomit: `#1 in Germany! Holy buns. nomit is a superb multi-category runner, boasting fantasic achievements such as a 28:XX, 24:XX, and an 11:1X. He is also an excellent Splatoon runner!`,
    PorcoBrabo: `YIPPIEEE! PorcoBrabo is a prominent Brazilian Cuphead runner boasting some impressive milestones such as 29:XX 1.1 and an 11:1X DLC. Heh, not bad for an old timer.`,
    SBDWolf: `SBDWolf is one of those runners who decides they want to learn a speedrun, spends hours studying and practicing the optimal strats, and then DOMINATES the competition in the blink of an eye. His Legacy and 1.1+ runs are great examples of this. He also runs some other awesome games such as Castlevania, DKC2, and Gimmick!` + cupheadGods('SBDWolf'),
    SlimsyLeader: `SlimsyLeader is a top IL runner with an impressive resume, perhaps best known for DOMINATING Esther Winchester ILs. In fact, he has all six Esther world records! Also, 25 TRIO!!!`,
    Spaceboy321: `Spaceboy is a MASTERFUL Whetstone IL runner, best known for making an absolute TEAR on several plane bosses. In fact, he holds every world record on Hilda, Djimmi, and Cala. Incredible!`,
    Sublime: `Sublime is an INSANE Legacy runner, having held the world record numerous times throughout the years. He is also a former Hater% world record holder!`,
    Taylz: `Taylz is a runner from Scotland who picked up the game and managed to get a 28:XX in just 3 and a half months. A truly extraordinary feat!`,
    Yuka: `Yuka is a Swiss runner known for his INSANE Legacy skills. He is often refered to as a human TAS.`
}