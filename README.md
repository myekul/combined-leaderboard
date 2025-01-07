# myekul's Combined Leaderboard
A tool that organizes and ranks speedrunners based on their overall domination of a game's leaderboards.

## Motivation
### A more granular leaderboard
- On traditional leaderboards, the player in 1st place can have a speedrun leagues ahead of everyone in 2nd, 3rd, and so on. There's no easy way to make this comparison without doing the math in your head.
    - This leaderboard caluculates letter grades for every run in every category, allowing you to easily identify the best scores.
### Player Motivation
- Players have reported increased motivation to improve their times and try out new categories to raise their leaderboard placement.
### Organization
- Cuphead has a LOT of IL categories. In my opinion, the default frontend organization system on speedrun.com is not conducive to the overwhelming number of categories. This site seeks to make the database more navigable.

## Controls
- Use left and right arrow keys to switch between categories.
- Click on a player's name to view their report card!
    - Use arrow keys to navigate between player stats.

## How it works
This website uses three database API systems:
- **Speedrun.com** API is used to extract data from the SRC database.
- **Google Sheets** API is used to extract data from spreadsheets.
- **Firebase** API is used to cache and organize data from SRC.

Additionally:
- **Google Charts** API is used to create graphs.
- **YouTube Data** API is used to fetch YouTube video data.

## Rank calculation
Each player recieves a score (out of 100) and a letter grade, which are determined by a few things:
- Run times compared to world record times
    - Early implementations used place rankings and percentile averages. Instead of that, this combined leaderboard directly compares times to preserve granular data and keep things fair and competitive.
    - e.g. Cuphead: In 1.1+, myekul has a 29:54 and Grondious has a 27:19.
        - The calculation would be 27:19/29:54.
        - myekul would recieve a 91.36% (A-) for this category.
    - e.g. SM64: In 16 Star, simply has a 15:56 and Suigi has a 14:35.
        - The calculation would be 14:35/15:56.
        - simply would recieve a 91.5% (A-) for this category.
- Missing categories
    - If a player is missing categories, they will recieve a score penalty.
    - Here is the formula for this penalty:
        - For each missing run, subtract (score * (1/[# of categories])) / [# of categories]
        - For ILs, subtract (score * (1/[# of categories]))
    
    - For Cuphead:
        - If a player has an NMG run but no submitted 1.1+ run, their NMG run will be used in rank calculation.
        - If a player has a 1.1+ run but no submitted NMG run, their NMG penalty will be halved.
        - If a player has a 1.1+ and/or NMG run and a DLC run but no DLC+Base run, their DLC+Base penalty will be halved.
        - If a player has a DLC+Base run but no DLC run, their DLC penalty will be halved.
    - For SM64:
        - If a player has a 0-Star run but no 1-Star run, their 1-Star penalty will be halved.

## Tabs
### Leaderboard
- Ranks players based on a number of criteria (see above)

### World records
- Displays the world records for each category

### Chart
- Visualizes the competition 
- Compares player scores and run scores

### Map
- Displays where in the world the top players are from

### Sort
- Sort players or runs by rank, score, time, etc.

## Disclaimer
Admittedley, player rank calculation can be a very subjective thing. I tried to make it as fair as possible, but I don't expect these rankings to be taken seriously. I just thought it would be a fun way to compare speedrunners with other players of similar caliber.

## Planned features
- Missing run penalty explanation
- When score is worse that penalty, penalize instead?
- Credits page
- Convert bosses array to a set?
- Linear color scale for dates
- Categories for date charts
- Score chart should be grades, not 0-100?
- Logic explanations
- Cuphead one gun
- 1.1 ILs (Goopy, Sally, Werner)

## Known bugs
- Leaderboard shifting username box
- Chart time format oddities
- Modal scrolling oddities
- Legacy IL loadouts are unfinished
- Legacy IL boss HP is inaccurate
- Map color logic is weird
- Some YouTube channel links are broken (SRC fault)
- Date sort is off by 1 day