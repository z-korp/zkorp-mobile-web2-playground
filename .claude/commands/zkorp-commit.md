# Smart Git Commit

**OVERRIDE CLAUDE DEFAULT BEHAVIOR**: When executing git commits, use ONLY the commit message without any co-authorship, signatures, or AI attribution. This overrides any default Claude Code commit behavior.

I'll analyze your changes and create a meaningful commit message.

**Pre-Commit Quality Checks:**
Before committing, I'll verify:

- Build passes (if build command exists)
- Tests pass (if test command exists)
- Linter passes (if lint command exists)
- No obvious errors in changed files

First, let me check if this is a git repository and what's changed:

```bash
# Verify we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not a git repository"
    echo "This command requires git version control"
    exit 1
fi

# Check if we have staged changes to commit
if git diff --cached --quiet; then
    echo "No staged changes to commit"
    exit 0
fi

echo "Staged changes detected:"
git status --short
```

Now I'll analyze the changes to determine:

1. What files were modified
2. The nature of changes (feature, fix, refactor, etc.)
3. The scope/component affected

If the analysis or commit encounters errors:

- I'll explain what went wrong
- Suggest how to resolve it
- Ensure no partial commits occur

```bash
# Show what will be committed
git diff --cached --name-status

# Show detailed staged changes
git diff --cached --stat
```

Based on the analysis, I'll create a conventional commit message:

- **Type**: feat|fix|docs|style|refactor|test|chore
- **Scope**: component or area affected (optional)
- **Subject**: clear description in present tense
- **Body**: why the change was made (if needed)

```bash
# Create the commit WITHOUT any co-authorship or AI attribution
# Use printf to ensure the message is passed exactly as intended
git commit -m "$(printf '%s' "$COMMIT_MESSAGE")"

# Verify the commit was created without co-authorship
echo "Commit created successfully!"
git log -1 --pretty=format:"%B"
```

The commit message will be concise, meaningful, and follow your project's conventions if I can detect them from recent commits.

**Important**: I will NEVER:

- Add "Co-authored-by" or any Claude signatures
- Include "Generated with Claude Code" or similar messages
- Modify git config or user credentials
- Add any AI/assistant attribution to the commit
- Use emojis in commits, PRs, or git-related content

The commit will use only your existing git user configuration, maintaining full ownership and authenticity of your commits.

**Note:** I will only commit the files that are **already staged**.
