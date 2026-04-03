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

### Step 1: Clone the repository

Clone this repo to your local machine:

```bash
git clone https://github.com/crisxuan/buddy-reroll.git ~/.claude/skills/buddy-reroll
```

### Step 2: Add to Claude Code skills

Edit your Claude Code settings file at `~/.claude/settings.json` and add the skill to the `skills` array:

```json
{
  "skills": [
    {
      "name": "buddy-reroll",
      "type": "file",
      "filePath": "~/.claude/skills/buddy-reroll/SKILL.md"
    }
  ]
}
```

If you already have other skills, just add this entry to your existing `skills` array.

### Step 3: Restart Claude Code

Restart your Claude Code CLI for the new skill to take effect.

### Alternative: Manual import

If you're using a different directory structure, just point `filePath` to where you cloned `SKILL.md`.

## Requirements

- Claude Code CLI with skill support
- Node.js available in your PATH (for running the reroll script)
- Third-party proxy setup (this skill won't modify official Anthropic OAuth accounts automatically for safety)

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

## License

MIT

MIT
