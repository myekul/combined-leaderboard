# SRC Combined Leaderboard
A tool that organizes and ranks speedrunners based on their overall domination of a game's leaderboards.

## How it works
Speedrun.com API is used to extract data from the SRC database.

## Rank calculation
Each player recieves a score (out of 100) and a letter grade, which are determined by a few things:
- Run times compared to world record times
    - Early implementations used place rankings and unweighed percentile averages. Comparing times keeps things fair and competitive.
    - e.g. In 1.1+, myekul has a 31:30 and Grondious has a 27:33.
        - The calculation would be 27:33/31:30.
        - myekul would recieve an 87.5% (B+) for this category.
- Category weight
    - When overall scores are computed, runs are weighed by how many players run each category relative to other categories.
    - e.g. 1.1+ is a more competitive category than DLC+Base. 
        - Therefore, 1.1+ runs will contribute more to the score.
- Missing categories
    - If a player is missing categories, they will recieve a score penalty.
    - Here is the formula for this penalty:
        - For each missing run, subtract (score * [weight of missing category]) / [# of categories]

## Planned features
- Support for SM64