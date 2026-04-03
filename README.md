# Buddy Reroll for Claude Code

A Claude Code skill for inspecting, re-rolling, and switching your Claude Code Buddy.

## What This Project Does

Claude Code has a hidden Buddy system. This project helps you:

- inspect the Buddy tied to a `userID`
- search for Buddies matching your preferences
- switch to a selected Buddy more safely

Supported filters include species, rarity, shiny status, eyes, hats, and minimum stats.

## Can Other People Use It Right Away?

Yes, other people can clone or download this repository and use it.

It is not fully "download and magically works" though. Users still need:

- Claude Code with skill support
- Node.js in `PATH`
- to register the skill in `~/.claude/settings.json`
- a compatible environment for Buddy switching

Important:

- The reroll and check functions can still be used as a script.
- Automatic Buddy switching is intentionally conservative and is meant for compatible non-official or proxy-based setups.
- If the environment looks official or unclear, the skill should stop rather than modify `~/.claude.json`.

## Requirements

- Claude Code with skill support
- Node.js 18+ recommended
- Access to `~/.claude.json`
- A compatible setup if you want to actually switch the Buddy automatically

## Installation

### Option 1: Install into the default Claude skills directory

```bash
git clone https://github.com/crisxuan/buddy-reroll.git ~/.claude/skills/buddy-reroll
```

Then add this to `~/.claude/settings.json`:

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

If you already have a `skills` array, add the object above to the existing array.

Restart Claude Code after saving the settings file.

### Option 2: Install to any custom directory

Clone the repository anywhere you want:

```bash
git clone https://github.com/crisxuan/buddy-reroll.git /path/to/buddy-reroll
```

Then point `filePath` at that local `SKILL.md`:

```json
{
  "skills": [
    {
      "name": "buddy-reroll",
      "type": "file",
      "filePath": "/path/to/buddy-reroll/SKILL.md"
    }
  ]
}
```

If `~` does not expand correctly in your environment, use an absolute path instead.

## Ways to Use It

### 1. Talk to Claude Code naturally

After the skill is installed, you can simply ask Claude Code things like:

- `换 Claude Buddy`
- `刷 Claude 宠物`
- `查看当前 buddy`
- `reroll buddy`
- `find a legendary dragon buddy`
- `show me my current buddy`
- `get me a shiny capybara`

This is the easiest way to use the project. The skill should:

1. check whether your environment looks compatible
2. interpret your request
3. run the search script
4. show matching results
5. ask for confirmation before applying a change

### 2. Manual skill configuration plus natural-language use

If you prefer a more explicit setup flow:

1. clone the repository
2. add the `skills` entry in `~/.claude/settings.json`
3. restart Claude Code
4. ask for what you want in plain language

Example requests:

- `给我找一个 legendary dragon buddy`
- `帮我刷一个 shiny capybara`
- `看看我当前的 Claude Buddy`

### 3. Run the script directly from the command line

You can use the bundled script even without going through skill triggering.

Examples:

```bash
node ~/.claude/skills/buddy-reroll/scripts/buddy-reroll.js --check <userID>
node ~/.claude/skills/buddy-reroll/scripts/buddy-reroll.js --species dragon --rarity legendary
node ~/.claude/skills/buddy-reroll/scripts/buddy-reroll.js --species cat --rarity epic --count 3
node ~/.claude/skills/buddy-reroll/scripts/buddy-reroll.js --species capybara --shiny --json
```

If you installed the repo somewhere else, replace the path with your actual local path.

### 4. Use it as an inspection-only tool

If you do not want the skill to modify anything automatically, you can still use it to:

- inspect your current Buddy
- inspect a known `userID`
- search for candidate Buddies

This is useful if you want to manually review the output first.

## Script Options

```bash
node scripts/buddy-reroll.js [options]
```

Options:

- `--species <name>`
- `--rarity <name>`
- `--eye <char>`
- `--hat <name>`
- `--shiny`
- `--min-stats [value]`
- `--max <number>`
- `--count <number>`
- `--check <uid>`
- `--json`

## Supported Values

### Species

`duck`, `goose`, `blob`, `cat`, `dragon`, `octopus`, `owl`, `penguin`, `turtle`, `snail`, `ghost`, `axolotl`, `capybara`, `cactus`, `robot`, `rabbit`, `mushroom`, `chonk`

### Rarities

`common`, `uncommon`, `rare`, `epic`, `legendary`

### Hats

`none`, `crown`, `tophat`, `propeller`, `halo`, `wizard`, `beanie`, `tinyduck`

### Eye Styles

`·`, `✦`, `×`, `◉`, `@`, `°`

## Safety Notes

- The project should back up `~/.claude.json` before applying a Buddy change.
- It should only replace the `userID` field when applying a selected result.
- It should validate that the updated file is still valid JSON.
- It should stop if the environment looks official or ambiguous.

This is intentional. Refusing to modify an unclear setup is safer than risking account or config breakage.

## Repository Layout

```text
.
├── README.md
├── SKILL.md
└── scripts/
    └── buddy-reroll.js
```

## License

MIT
