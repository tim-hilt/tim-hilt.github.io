---
title: 'Improving on Matt Pococks improve-codebase-design skill'
description: 'I developed a more holistic agent skill to improve codebase design'
pubDate: '2026-09-25'
draft: true
---

Now, I admit that the title is a bit clickbaity, but bare with me.

I've been obsessed with [Matt](https://www.aihero.dev/)s skills ever since I saw his talk ["Software Fundamentals Matter More Than Ever"](https://www.youtube.com/watch?v=v4F1gFy-hqg). Before seeing this talk, I had briefly heard about Matt Pococks transformation from "TypeScript Wizard" to "AI Skills Wizard". I've heard about some viral "grill-me" skill, but hadn't tried it out before. I also heard about spec driven development. Some of my colleagues even tried it out by applying [spec-kit](https://github.com/github/spec-kit) during the development of an internal tool.

This changed after listening and understanding what Matt had to say. As software engineers, we don't want to mindlessly instruct a machine to generate some loosly defined code. That leads to an unmaintainable mess.

One of Matts statements goes something like this:

> I don't care about the implementation of every single function, but I care about the interfaces. Design the interfaces and let AI fill in the rest.

This statement is rooted in the idea of "Deep Modules", which is the idea, that a piece of code should only provide a minimal interface to control a large amount of functionality. The inverse would be a shallow module, where the user of the aforementioned module needs to perform a whole lot of rituals to use the fairly minimal functionality "abstracted" by the interface.

<!-- TODO: Add Excalidraw drawing -->

Deep Modules were introduced by John Ousterhout in his book ["A Philosophy Of Software Design"](https://web.stanford.edu/~ouster/cgi-bin/aposd.php), which Matt also brings up in his "Software Fundamentals" talk.

<!-- TODO: Add image of book cover -->

The ideas of developing Deep Modules and designing a minimal interface are used in [Matts `/improve-codebase-design` skill](https://github.com/mattpocock/skills/tree/main/skills/engineering/improve-codebase-architecture). The skill itself is a very sophisticated construct, that analyzes the codebase and identifies potentials to deepen modules. It even generates an html report, that explains the identified candidates with [Mermaid diagrams](https://mermaid.js.org/)! It also enters a grilling loop once the user has decided on which candidate to implement.

I applied the skill a lot of times and got a lot of use out of it. I noticed some antipatterns in my own usage though, that made me realize I might want to use something different:

1. The report was often hard to follow. I don't know if this was due to the model I've chosen to generate it, a lack of telling the model to use easier language or my own inexperience with the used lingo. In practice, this often lead me to blindly choose the highest rated candidate instead of judging myself, which candidate would be worth fixing first.
2. I didn't want to enter a grilling session after choosing a candidate, as that might push the context-window out of [the models smart zone](https://www.aihero.dev/ai-coding-dictionary/smart-zone) and lead to [context rot](https://www.trychroma.com/research/context-rot). Once the report was created, I opened a new agent session, pasted the path to the html report and told a smart model to fix the highest rated candidate
3. The skill can only be used after the module already exists. It doesn't provide any guidance as to designing the module from the beginning!
4. The skill is *only* concerned with deep modules. But isn't there so much more to good software design? I saw myself longing for something more holistic.

Matt talks about multiple fundamental books about software development; "A Philosophy of Software Design" being one of them. I must admit, that I practically stopped reading books once I could use coding agents. The books I read were mostly about technical topics like learning a programming language or using some fundamental library. It seemed to not be worth it anymore. An agent can implement some functionality and explain it afterwards. I was not satisfied with this approach and thought I'd give "A Philosophy Of Software Design" a shot.

It's one of those books, that contain a lot of wisdom on relatively few pages ([Domain Driven Design Distilled](https://www.pearson.de/domain-driven-design-distilled-9780134434421) or [Extreme Programming Explained](https://www.goodreads.com/book/show/67833.Extreme_Programming_Explained) come to mind). And it covers **so much more** than just deep modules! I'm not completely finished reading the book, but I found myself thinking I should condense the entire book into a software design skill that can be used to review an existing project or be used during initial implementation or refactoring.

Here's what I did:

1. Got a hold of an epub version of the book (easier to parse)
2. Converted the epub file to .md files using [epub2MD](https://github.com/uxiew/epub2MD)
3. Let Sonnet 5 summarize every chapter and append the summary to `SUMMARY.md`
4. Used Matts [`/writing-for-agents`](https://github.com/mattpocock/skills/tree/main/skills/productivity/writing-for-agents) skill to convert `SUMMARY.md` into a `SKILL.md` file

you can see the result [here]().

I achieved very good results with the skill. It's sometimes auto-triggered by the agent during implementation, but I also call it explicitly when adding some major new functionality. I also write prompts like this:

```
/software-design Analyze the codebase regarding software-design best practices. Create tasks with detailed implementation info for the 5 most impactful findings.
```

I then review the new findings (which are also more easy to follow) and let an agent fix them. Whenever I looked into code that was created by using the software-design skill, I can understand and follow it pretty easily.

I don't think, that Matts skill is the wrong approach, I just think it solves a different problem than what I was looking for. I also admit that I was much too lazy using the skill in the way it was designed for. Maybe I'm overthinking the whole topic and deep modules are all it takes at the end of the day Still: I'm honestly pretty happy with my software-design skill and will continue to use it on a daily basis.

