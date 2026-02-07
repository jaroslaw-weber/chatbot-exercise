# Comment Guidelines

## Purpose
Comments should explain *why* code exists or does something complex, not just *what* it does. Code should be self-documenting.

## When to Add Comments

### Add comments when:
- Code is complex or non-obvious
- Business logic requires explanation
- There are multiple approaches and a specific one was chosen
- Workarounds or hacks are necessary
- Public API boundaries (classes, exported functions, interfaces)

### Avoid comments for:
- Obvious code (e.g., `return x + y` // adds x and y)
- Repeating what the code already says
- Commented-out code (remove it instead)
- End-line comments unless very brief

## Comment Style

### Classes
Use `/** */` JSDoc-style comments for classes to enable VS Code hover previews.

```ts
/** Handles webhook requests and routes messages to appropriate handlers */
class FinanceController {}
```

### Methods/Functions
Use `/** */` JSDoc-style comments for public classes and exported functions.
- **Public methods**: Brief comment if not obvious from name
- **Private methods**: Only if complex or doing something non-obvious
- No `@param` or `@returns` tags unless necessary for clarity

```ts
/** Parse natural language transaction description using AI */
async parseTransaction(text: string): Promise<ParsedTransaction | null> {}
```

### Interfaces/Types
Use `/** */` JSDoc-style comments if the purpose isn't clear from the name.

```ts
/** Transaction data extracted from natural language */
interface ParsedTransaction {}
```

### Inline Comments
Use `//` for inline comments, sparingly, only to explain *why*, not *what*.

```ts
// Fallback to transaction command if no command found
return commandRegistry.getTransactionCommand().execute(message);
```

## Principles
1. Code should be self-documenting through good naming
2. Comments have a maintenance cost - keep them minimal
3. Prefer refactoring confusing code over adding comments
4. Delete comments that become outdated
5. One line is usually enough
