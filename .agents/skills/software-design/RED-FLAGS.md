# Red flag fixes

The fix move for each flag named in [`SKILL.md`](SKILL.md). Symptoms live there; this file is what to do once one fires.

## Shallow Module

Merge the class or method into its caller, or grow what it hides until the interface earns its cost. A one-line `addNullValueForAttribute(attr)` wrapping `data.put(attr, null)` should be the `put` call. Resist splitting further to "fix" it: more small classes multiply interfaces. Deepening usually means absorbing work callers currently do, not adding methods.

Getters and setters are the standard case: do not expose the variable at all rather than wrapping it.

## Information Leakage

Locate the shared decision (a format, an encoding, a representation), then either merge the modules that both know it, or extract that knowledge into a new module with a genuinely simple interface. Merging two classes into one larger, deeper class is the right answer when the knowledge cannot be separated — an HTTP reader and parser that both understand the request format belong together.

## Temporal Decomposition

Re-decompose around knowledge instead of sequence. "Read the file" and "parse the file" as separate classes both need the file format; one class that reads and parses needs it once. Execution order still exists, but inside the code, not at the module boundary.

## Overexposure

Default the rare feature and hide it behind an override used only by callers who need it, so the common path never mentions it. Buffering, protocol versions, and retry intervals belong in this category.

## Pass-Through Method

Give the classes distinct responsibilities: expose the lower class directly to callers, redistribute functionality so each class owns whole features, or merge them. The interface for a feature belongs in the class that implements it.

Duplicate signatures are fine when the method adds real value: dispatchers that route to handlers, and multiple implementations of one interface. The flag is the absence of new functionality, not the repeated signature.

Before writing a decorator, consider adding the behaviour to the base class, merging it into the one use case, folding it into an existing decorator, or writing a standalone class that wraps nothing.

## Repetition

Factor the block into one method when the resulting signature is simple; the right abstraction has not been found yet if it is not. For cleanup duplicated at several exit points, restructure so the cleanup exists once at the end of the method.

## Special-General Mixture

Move the special-purpose logic up into the layer that owns the use case, leaving the mechanism ignorant of it. A general `History` class holds undo actions and knows nothing about text or selections; each module supplies its own action type; the UI owns the policy of grouping actions.

Within one mechanism only. Text-specific undo actions living in the general-purpose text class are correct — they are special for undo but closely related to text.

## Conjoined Methods

Undo the split: join the pieces back into one method, or move the shared state into one place so each piece stands alone. Length alone never justifies keeping them apart — a long, deep method with a simple signature is fine.

## Comment Repeats Code

Delete it, or replace it with what the code cannot say: units, bounds, meaning of null, ownership, invariants, rationale, or the intent of the block below. Use words that are not already in the name being documented.

## Implementation Documentation Contaminates Interface

Cut the internals out of the interface comment and move them to implementation comments inside the body. If the comment cannot be cut without leaving callers unable to use the module, the module is shallow — fix that instead.

## Vague Name

Rename to what the entity actually holds: `getCount()` to `getActiveIndexlets()`, `x`/`y` to `charIndex`/`lineIndex`, `blinkStatus` to `cursorVisible`, a bare `result` to `mergedLine`. Booleans read as predicates. Short names like `i` and `j` are fine when the whole scope is visible at once. A name can also be too specific: an argument named `selection` on a method that works on any range should be `range`.

## Hard to Pick Name

Treat it as a design signal, not a naming problem. The entity probably carries more than one purpose; split it until each part has one meaning, then the name appears.

## Hard to Describe

Same signal at the abstraction level: if complete documentation must be long, the interface is exposing too much. Redesign toward a deeper module, then rewrite the comment short.

## Nonobvious Code

Reduce the information the reader needs (better abstraction, fewer special cases) first, lean on conventions and expectations second, and supply the missing information through names and comments third. Recurring causes and their compensations:

- Event-driven flow: document on each handler when and why it is invoked.
- Generic containers (`Pair`, `std::pair`): define a small named type with meaningful field names instead.
- Declared type differing from the allocated type: match them where practical.
- Code that violates reader expectations: comment at the point of surprise as well as in the class comment.
- Dense blocks: separate with blank lines, each introduced by a short comment naming the phase.
