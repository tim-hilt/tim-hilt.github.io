---
name: software-design
description: Best practices for software design. Use when designing a module or API, implementing a feature, reviewing a diff, refactoring, or naming and commenting code.
---

Complexity is the one thing being fought: anything about a system's structure that makes it hard to understand or modify. It has two roots, **dependencies** and **obscurity**, and it accumulates incrementally, so judge every choice by one test: does this interface, argument, class, or layer remove more complexity than it introduces?

Complexity is weighted by how often code is touched and judged by readers, not authors. If a reader finds it complex, it is complex.

Moderation binds everything below: each lever taken to its extreme lands in a bad place. A design is good when competing levers balance, not when one is maxed out.

## Implementing

1. **Design it twice.** Before writing an interface, sketch at least two radically different alternatives (not variants) and list pros and cons. Rank by: ease of use for callers, then interface simplicity, then generality, then efficiency. If every option is unattractive, use their shared weakness to invent a third. Done when two genuinely different sketches exist and the chosen one is justified against the other.
2. **Write the interface comment before the body.** Comment the class, then each key method's signature and comment, then instance variables, then the bodies. A comment that must be long, or must describe how the code works, is the design telling you the abstraction is wrong: fix the design then, not later. Done when every new class and method carries an interface comment that lets a caller use it without reading the implementation.
3. **Make each module deep.** Simple interface over substantial implementation. Apply the levers below while writing the body.
4. **Follow the local conventions.** Read neighbouring code first and match its naming, ordering, style, and invariants. A precedent elsewhere in the project outranks a personal preference.
5. **Sweep your own diff against the red flags** before calling the work done, and fix the design problems you find, including pre-existing ones you are already standing next to. Done when every changed module has been checked against every red flag.

## Reviewing

1. Read each changed file once at reading speed and record where your first guess about behaviour was wrong. Non-obvious code is a finding, whether the cause is a name, a hidden dependency, or a missing comment.
2. Apply **every** red flag to **every** changed module. Done when each flag has been considered against each changed module, not when a few findings have been collected.
3. For each finding, cite `file:line`, name the flag, and state the concrete fix; read [`RED-FLAGS.md`](RED-FLAGS.md) for the fix moves.
4. Report findings ranked by cost of leaving them: interface and information-leakage problems in new APIs first (they propagate to every caller), then internal ones. Say plainly when the design is sound.

## Levers

- **Deep modules.** Maximise functionality hidden behind a given interface. Shallow classes and methods whose interface is nearly as complex as their implementation add cost and hide nothing; splitting into many small classes ("classitis") multiplies interfaces. Judge by interface-to-functionality ratio, never by line count: no rules like "no method over 20 lines".
- **Information hiding.** Each design decision (format, algorithm, representation, encoding) lives inside one module and appears in no interface. `private` plus a getter hides nothing. Return targeted accessors, not internal data structures. Decompose by the knowledge each task needs, never by the order operations run.
- **Common case simple.** Default whatever the caller usually should not specify, and let rare needs be reached through a separate override. Callers of the common path should not have to learn the rare features.
- **General-purpose interfaces.** Implement today's functionality, but keep the interface untied to today's caller. Calibrate with: what is the simplest interface covering all current needs; in how many situations will this be used (built for exactly one is a red flag); is it still easy for the current need.
- **Different layer, different abstraction.** Adjacent layers that repeat an abstraction, methods that forward to a similar signature, and variables threaded through a call chain that never uses them are all infrastructure not earning its keep. For threaded values, prefer an object already shared by both ends of the chain.
- **Pull complexity downwards.** A module has many users and few developers, so absorb unavoidable complexity in the implementation rather than exporting it as an exception or a configuration parameter. Before exporting a parameter, ask whether the module could compute a good value itself; if it must exist, default it automatically. This applies only when the complexity is related to the module's existing purpose and genuinely simplifies both callers and the interface.
- **Separate general from special.** A general-purpose mechanism holds none of the logic that specialises it for one use; push that up to the caller's layer.
- **Together or apart.** Join pieces that share information, are always used together, form one natural category, or cannot be understood apart. Separate genuinely independent pieces. Split a method only to extract a subtask understandable on its own, or to produce two methods with genuinely simpler interfaces that most callers use one of.
- **Define errors out of existence.** Redesign the semantics so the error case becomes normal behaviour (delete-if-exists as a no-op; a substring that returns the overlapping range). Otherwise mask the exception at a low level, aggregate many call sites into one high-level handler, or crash cleanly for rare unrecoverable bugs. Every exception is part of the interface, so throwing relocates the problem to a caller who usually knows less. The same move kills special cases: pick representations where the empty or degenerate case flows through the normal path. The limit: expose what callers genuinely need to act on.
- **Comments carry what code cannot.** Describe what is not obvious from the code next to it: units, inclusive or exclusive bounds, what null means, ownership, invariants, rationale, and the intent above a block. Use different words than the name itself. Keep interface comments free of implementation detail, keep each decision documented in exactly one natural place with pointers elsewhere, and keep comments beside the code they describe.
- **Names create an image.** Precise, consistent, two or three words. A reader seeing the name alone should guess what it refers to and what it does not. One concept, one name, one meaning; add a distinguishing prefix for related variables. Struggling to name something is a signal the entity lacks a single clean purpose.
- **Consistency.** Similar things done in similar ways, so knowledge transfers. Follow the existing convention over a marginally better new one, document conventions and invariants where they apply, and enforce the mechanical ones with tooling.
- **Strategic over tactical.** Working code is not enough: the goal is the design the system would have had if built from scratch with this change in mind. Spend a fraction of each change on proactive and reactive design investment; a stream of minimal patches is what degrades a codebase.
- **Performance.** Clean designs are usually fast. Prefer the cheap option when it is equally simple, measure before optimising, prefer a fundamental fix over micro-tuning, and when a critical path needs work, design it around the minimum work the common case requires with one test at the top.

## Red flags

Signs the code is more complicated than it needs to be. Read [`RED-FLAGS.md`](RED-FLAGS.md) for the fix for any flag that fires.

| Flag                                                | Symptom                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Shallow Module                                      | The interface of a class or method is nearly as complex as its implementation.           |
| Information Leakage                                 | The same design decision is reflected in two or more modules.                            |
| Temporal Decomposition                              | Module structure follows execution order instead of the knowledge each task needs.       |
| Overexposure                                        | Using a common feature forces callers to learn rarely used ones.                         |
| Pass-Through Method                                 | A method does almost nothing but call another with a similar signature.                  |
| Repetition                                          | A nontrivial block of code appears over and over.                                        |
| Special-General Mixture                             | Special-purpose code sits inside a general-purpose mechanism.                            |
| Conjoined Methods                                   | One piece of code cannot be understood without reading another, physically separate one. |
| Comment Repeats Code                                | Every bit of the comment is visible in the code beside it.                               |
| Implementation Documentation Contaminates Interface | An interface comment describes internals callers do not need.                            |
| Vague Name                                          | A name is so imprecise it could refer to many different things.                          |
| Hard to Pick Name                                   | No precise, intuitive, short name exists for the entity.                                 |
| Hard to Describe                                    | Complete documentation for a variable or method has to be long.                          |
| Nonobvious Code                                     | Behaviour cannot be understood from a quick reading.                                     |
