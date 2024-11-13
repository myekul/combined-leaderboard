# myekul's Combined Leaderboard
A tool that organizes and ranks speedrunners based on their overall domination of a game's leaderboards.

## Controls
- Click on a player's name to view their report card!
    - Use arrow keys to navigate between player stats.

## How it works
- Speedrun.com API is used to extract data from the SRC database.
- Google Sheets API is used to extract data from other sources.
- Google Charts API is used to create graphs.

## Rank calculation
Each player recieves a score (out of 100) and a letter grade, which are determined by a few things:
- Run times compared to world record times
    - Early implementations used place rankings and percentile averages. Comparing times preserves granular data and keeps things fair and competitive.
    - e.g. Cuphead: In 1.1+, myekul has a 30:52 and Grondious has a 27:33.
        - The calculation would be 27:33/30:52.
        - myekul would recieve an 89.3% (B+) for this category.
    - e.g. SM64: In 16 Star, simply has a 15:56 and Suigi has a 14:35.
        - The calculation would be 14:35/15:56.
        - simply would recieve an 91.5% (A-) for this category.
- Missing categories
    - If a player is missing categories, they will recieve a score penalty.
    - Here is the formula for this penalty:
        - For each missing run, subtract (score * (1/[# of categories])) / [# of categories]
    - For Cuphead:
        - If a player has an NMG run but no submitted 1.1+ run, their NMG run will be used in rank calculation.
        - If a player has a 1.1+ run but no submitted NMG run, their NMG penalty will be halved.
        - If a player has a 1.1+ and/or NMG run and a DLC run but no DLC+Base run, their DLC+Base penalty will be halved.
        - If a player has a DLC+Base run but no DLC run, their DLC penalty will be halved.
        - If a player has a DLC+Base run but no 1.1+ or NMG run, their penalty will be halved for those categories.
    - For SM64:
        - If a player has a 0-Star run but no 1-Star run, their 1-Star penalty will be halved.

## Planned features
- Stats tab
- Player percentiles
- Switching between games
- Missing run penalty explanation
- When score is worse that penalty, penalize instead?

## Known bugs
- IL leaderboard horizontal scrolling visual bugs
    - Shifting username box
- Frequent API crashes when navigating too quickly
- Chart time format issues
- Unknown svg error (internal)
- No error noise for chart index overflow
- No arrow key functionality for leaderboard sorting
- UI buttons can be highlighted sometimes