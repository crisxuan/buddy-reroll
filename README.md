# Buddy Reroll for Claude Code

A Claude Code skill to re-roll, inspect, or switch your Claude Code Buddy.

## What is this?

Claude Code has a hidden feature where you get a cute "Buddy" (pet/companion) that displays in the status bar. This skill helps you search for and switch to a different Buddy based on your preferences.

## Features

- 🔍 **Inspect** your current Buddy
- 🔄 **Re-roll** for new Buddies matching your criteria
- 🎨 Filter by species, rarity, shiny status, eyes, hats, and minimum stats
- ✅ Safe workflow with backups and validation

## Supported Species

`duck`, `goose`, `blob`, `cat`, `dragon`, `octopus`, `owl`, `penguin`, `turtle`, `snail`, `ghost`, `axolotl`, `capybara`, `cactus`, `robot`, `rabbit`, `mushroom`, `chonk`

## Supported Rarities

`common`, `uncommon`, `rare`, `epic`, `legendary`

## Supported Hats

`none`, `crown`, `tophat`, `propeller`, `halo`, `wizard`, `beanie`, `tinyduck`

## Supported Eye Styles

`·`, `✦`, `×`, `◉`, `@`, `°`

## Usage

In Claude Code, just ask naturally:

- "换 Claude Buddy"
- "刷 Claude 宠物"
- "reroll buddy"
- "find a legendary dragon buddy"
- "show me my current buddy"
- "get me a shiny capybara"

The skill will automatically:

1. Check if your environment is compatible
2. Search for Buddies matching your preferences
3. Show you the results
4. Apply the change safely after your confirmation

## Safety Guarantees

- Creates a backup of `~/.claude.json` before modifying
- Only works in non-official/third-party proxy setups (won't modify official OAuth accounts automatically)
- Only changes the `userID` field — everything else stays the same
- Validates JSON after modification

## Installation

Clone this repository and add as a skill in your Claude Code setup.

## License

MIT
