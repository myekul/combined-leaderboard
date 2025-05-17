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

## Tabs
### Leaderboard
- Ranks players based on a number of criteria (see info section)

### World records
- Displays the world records for each category

### Featured
- Shows the 5 most recent runs with an A- or better

### Chart
- Visualizes the competition 
- Compares player scores and run scores

### Map
- Displays where in the world the top players are from

### Sort
- Sort players or runs by rank, score, time, etc.

## Planned features
- Convert bosses array to a set?
- Linear color scale for dates
- Categories for date charts
- Score chart should be grades, not 0-100?
- Cuphead one gun?
- 1.1 ILs (Goopy, Ribby, Sally, Werner)
- Chalice Tutorial toggle?
- Run Recap LSS - # of attempts
- Run Recap LSS - Segment Analysis
- SPO Leaderboard

## Known bugs
- Leaderboard squish and stretch
- Legacy IL loadouts are unfinished
- Boss HP is inaccurate
- Map color logic is weird
- Some YouTube channel links are broken (SRC fault)
- Date sort is off by 1 day
- Calculator uses real percentages instead of balanced percentages
- Tetris is broken