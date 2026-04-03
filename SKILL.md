---
name: buddy-reroll
description: Re-roll, inspect, or switch a Claude Code Buddy when the user explicitly asks to change their Claude buddy or pet, such as "换 Claude Buddy"、"刷 Claude 宠物"、"reroll buddy"、"查看当前 buddy". Use this skill only for clear buddy-related requests.
---

# Buddy Reroll

Use this skill to inspect the current Claude Code Buddy, search for candidates that match user preferences, and apply a selected Buddy safely.

Keep the workflow conservative. If the environment looks incompatible or ambiguous, stop and explain the risk instead of modifying account files.

## Workflow

### 0. Validate prerequisites first

Before doing anything else:

- Confirm `~/.claude.json` exists and is valid JSON.
- Confirm the bundled script `scripts/buddy-reroll.js` exists before trying to run it.
- If either file is missing, stop and tell the user what is missing.

When invoking the script, resolve the path relative to this skill directory rather than assuming a fixed install location.

Example:

```bash
node scripts/buddy-reroll.js --species dragon --rarity legendary --shiny
```

### 1. Check whether automatic modification is safe

Read `~/.claude.json`. If `~/.claude/settings.json` exists, read that too.

Use a conservative rule:

- If there are strong signs the user is on Claude official authentication or OAuth, do not modify `userID`.
- If there are strong signs the user is using a third-party or proxy backend where `userID` swapping is already expected, continue.
- If the signals are mixed or unclear, do not modify automatically.

Treat the following as warning signs, not perfect proof:

- OAuth-style token fields in `~/.claude.json`
- Official Anthropic base URL or no custom base URL
- Unexpected account metadata that suggests the identifier is managed by the provider

If the setup appears official or ambiguous, stop with a short explanation:

`This skill only safely applies Buddy swaps in non-official or explicitly compatible setups. Your current Claude authentication looks official or unclear, so I won't modify ~/.claude.json automatically.`

Do not try to override this safeguard.

### 2. Interpret the request

Map user preferences to script flags when present:

| User intent | Flag |
| --- | --- |
| Species | `--species <name>` |
| Minimum rarity | `--rarity <name>` |
| Shiny only | `--shiny` |
| Eye style | `--eye <char>` |
| Hat | `--hat <name>` |
| Minimum stat floor | `--min-stats <value>` |

Supported values:

- Species: `duck`, `goose`, `blob`, `cat`, `dragon`, `octopus`, `owl`, `penguin`, `turtle`, `snail`, `ghost`, `axolotl`, `capybara`, `cactus`, `robot`, `rabbit`, `mushroom`, `chonk`
- Rarity: `common`, `uncommon`, `rare`, `epic`, `legendary`
- Eyes: `·`, `✦`, `×`, `◉`, `@`, `°`
- Hats: `none`, `crown`, `tophat`, `propeller`, `halo`, `wizard`, `beanie`, `tinyduck`

If the user does not specify a filter, leave it unrestricted rather than inventing extra constraints.

### 3. Run the search or check command

Use `--check <userID>` when the user asks to inspect a specific Buddy or the current configured `userID`.

Examples:

```bash
node scripts/buddy-reroll.js --check <userID>
node scripts/buddy-reroll.js --species cat --rarity epic
node scripts/buddy-reroll.js --species dragon --rarity legendary --shiny
```

### 4. Present results clearly

Summarize each candidate in a compact, scannable format including:

- uid
- species
- rarity
- shiny status
- eyes
- hat
- stats

If no candidates match, say so plainly and suggest relaxing one or two filters.

### 5. Require explicit user confirmation

Never apply a Buddy change unless the user clearly chooses one candidate.

If multiple results are available, ask the user to select by uid or by numbered option. If the user only asked to preview results, stop after showing them.

### 6. Apply the change safely

When the user confirms a specific candidate:

1. Read `~/.claude.json` again right before editing.
2. Create a backup copy of the file.
3. Replace only the `userID` field with the selected uid.
4. Validate that the updated file is still valid JSON.
5. Re-read the file and confirm the `userID` now matches the chosen uid.

If validation fails, restore the backup and tell the user the change was not applied.

Do not write any other fields unless the user explicitly asks for that.

## Current Buddy Lookup

To inspect the Buddy tied to the currently configured `userID`:

1. Read `~/.claude.json`
2. Extract `userID`
3. Run:

```bash
node scripts/buddy-reroll.js --check <userID>
```

## Guardrails

- Do not modify account files when compatibility is uncertain.
- Do not claim the change is safe unless the prerequisites and validation steps passed.
- Do not hardcode platform-specific tool names in the workflow; use the agent's available file read, write, and confirmation capabilities.
- Prefer stopping with a clear explanation over taking a risky action.
