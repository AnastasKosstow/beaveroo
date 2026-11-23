# Beaveroo

[![Docs](https://img.shields.io/badge/docs-beaveroo.tech-blue)](https://beaveroo.tech)
[![Site](https://img.shields.io/website?url=https%3A%2F%2Fbeaveroo.tech&label=site&up_message=online&down_message=offline)](https://beaveroo.tech)
[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Starlight](https://img.shields.io/badge/Starlight-docs-8D46E7)](https://starlight.astro.build)
[![Examples](https://img.shields.io/badge/examples-C%23%20%2F%20.NET-512BD4?logo=dotnet&logoColor=white)](https://learn.microsoft.com/dotnet/)
[![Languages](https://img.shields.io/badge/languages-Bulgarian%20%7C%20English-informational)](https://beaveroo.tech/en/)

Beaveroo is a platform for courses for .NET developers. A course is a folder of lessons, a sidebar, and a card on the home page. The lessons are written in Bulgarian and translated into English. They are written for people who work in C# and .NET.

## Table of Contents
- [Courses](#courses)
  - [AI Agents](#ai-agents)
  - [Python for .NET Developers](#python-for-net-developers)
- [Stack](#stack)
- [Local development](#local-development)
- [Add a course](#Add-a-course)
- [Add a lesson](#add-a-lesson)
- [Track progress](#track-progress)
- [Deploy](#deploy)

The site is a static build. There is no database and no server-side app. Astro compiles the lessons to HTML, and a GitHub Action uploads that HTML to the host.

## Courses

### AI Agents

An unofficial adaptation of the [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/). The explanations are translated, the technical terms stay in English, and the samples use C# and .NET. Where the original uses a Python library, the lesson uses the .NET equivalent, mostly `Microsoft.Extensions.AI`.

| Unit | What it covers |
| --- | --- |
| [WELCOME TO THE COURSE](https://beaveroo.tech/ai-agents/unit-0/introduction/) | What the course is, and what you need installed (.NET SDK). |
| [INTRODUCTION TO AGENTS](https://beaveroo.tech/ai-agents/unit-1/introduction/) | Agents, LLMs, messages, chat templates, tools, and the thought, action, observation loop. Ends with a small agent written in C#. |
| [FRAMEWORKS](https://beaveroo.tech/ai-agents/unit-2/introduction/) | When an agentic framework is worth using, and what it has to provide. |
| &emsp;[ - Microsoft Agent Framework](https://beaveroo.tech/ai-agents/unit-2/agent-framework/introduction/) | Tools, memory, and multi-agent workflows in .NET, on top of `Microsoft.Extensions.AI`. |

### Python for .NET Developers

Python for people who already program in C#. It does not explain what a variable or a loop is. Every topic starts from C# code, shows the same code in Python next to it, explains only the differences, and ends with a self-check question. The course will have nine lessons. Three are published. Each one ends with three tasks that the reader runs and checks in the browser.

| Unit | What it covers |
| --- | --- |
| [WELCOME TO THE COURSE](https://beaveroo.tech/python-for-dotnet/unit-0/introduction/) | What the course is, the learning path with the reader's progress, and what you need installed (Python 3.12 or newer). |
| [TYPES AND DATA](https://beaveroo.tech/python-for-dotnet/unit-1/types-and-data/) | Lesson 01: names instead of typed variables, numbers and text, the built-in collections, `None`, truthiness, shared references and type hints. |
| [CLASSES AND PROTOCOLS](https://beaveroo.tech/python-for-dotnet/unit-2/classes-and-protocols/) | Lesson 02: `__init__` and `self`, properties, class attributes, special methods, a dataclass in place of a `record`, inheritance, duck typing and `Protocol`. |
| [FROM LINQ TO COMPREHENSIONS](https://beaveroo.tech/python-for-dotnet/unit-3/linq-to-comprehensions/) | Lesson 03: list, dict and set comprehensions, generator expressions, the aggregates with `key`, sorting and grouping. |

Each lesson shows the reader's progress in percent. It is kept in the browser's `localStorage`, so there are no accounts. See [Track progress](#track-progress).

## Stack

- [Astro 7](https://astro.build) builds the site.
- [Starlight](https://starlight.astro.build) provides the docs layout, sidebar, search, and the two locales. Bulgarian is the default locale. English lives in `src/content/docs/en/`.
- Lessons are MDX. Images in `src/assets/` are processed by `sharp`. Files in `public/` are copied as they are.
- Search is [Pagefind](https://pagefind.app), which Starlight runs at build time. It does not work in `astro dev`. Use `npm run build` and `npm run preview` if you need to try it.

Every course uses this same setup. A new course does not get its own app.

## Local development

You need Node.js 22 or newer.

```bash
npm install
npm run dev
```

The dev server starts at <http://localhost:4321>.

```bash
npm run build    # writes the site to dist/
npm run preview  # serves that build locally
```

## Add a course

A course needs a slug, used in the URL and in the folder name. AI Agents uses `ai-agents`. Pick something short and stable, because changing it later changes every link.

1. Create `src/content/docs/<course>/` for the Bulgarian lessons and `src/content/docs/en/<course>/` for the English ones. Inside, split the writing into units: `unit-0`, `unit-1`, and so on.
2. Add the unit to the sidebar in `astro.config.mjs`. `label` is Bulgarian, `translations.en` is English, and each `slug` starts with `<course>/`. The list holds the entries of every course. A page shows only the entries of its own course, and its previous and next links stay inside that course. `src/routeData.ts` does this by looking at the first part of the slug.

   A unit with several lessons is a group: `items` holds the lessons, and the group label is the unit name. AI Agents is built this way. A unit that is itself the page is a link, with the unit name as its `label` and no `items`. The Python course is built this way. Both use the same sidebar. A top-level link is drawn as a unit heading.
3. Add the course to `src/courses.ts`. `id` is the slug, and `title` is the i18n key of its name, which the sidebar shows above the units.
4. Add a card in `src/components/LearnGrid.astro`, next to the existing ones. Point it at the course's first lesson, usually `unit-0/introduction`.
5. Give the course its own title and description in `src/content/i18n/bg.json` and `src/content/i18n/en.json`. AI Agents uses `course.title` and `landing.courseDescription`, and the Python course uses `python.title` and `python.description`. New keys also go in `src/content.config.ts` and `src/starlight.d.ts`.

The home page is `src/content/docs/index.mdx`. It renders `<LearnGrid />` and nothing else. New cards show up there on their own.

The first page of a course can open with a hero instead of a plain title. Set Starlight's `hero` in the frontmatter for the heading, the tagline and the buttons, and `courseHero` for the line above the heading, the numbers and the code window. `src/components/Hero.astro` renders both. The Python course's `unit-0/introduction.mdx` is the example to copy.

## Add a lesson

A lesson belongs to a course and a unit. It is two MDX files with the same path. The Bulgarian file is the source of truth. The English file is the translation.

```
src/content/docs/<course>/<unit>/my-lesson.mdx
src/content/docs/en/<course>/<unit>/my-lesson.mdx
```

For the current course that looks like this:

```
src/content/docs/ai-agents/unit-1/my-lesson.mdx
src/content/docs/en/ai-agents/unit-1/my-lesson.mdx
```

Frontmatter is the same shape in both files. `title` and `description` are the page title and the text used by search.

````mdx
---
title: Заглавие
description: Едно изречение за търсенето и за meta description.
---

Текст на урока.

```csharp
int Calculator(int a, int b) => a * b;
```
````

Then add the page to that unit's group in the sidebar. `slug` has no locale prefix and no `.mdx`.

```js
{
  label: 'Моят урок',
  translations: { en: 'My lesson' },
  slug: 'ai-agents/unit-1/my-lesson',
}
```

Sidebar order is the reading order. Starlight builds the previous and next links from it.

Shared pieces live in `src/components/` and are available to every course. The import depth depends on how deep the file sits. A lesson in `ai-agents/unit-1` reaches them with `../../../../components/...`. The English copy sits one folder deeper, so it needs `../../../../../components/...`. Count `../` until you reach `src/`.

```mdx
import Question from '../../../../components/Question.astro';

<Question
  choices={[
    { text: 'Верният отговор.', explain: 'Защо е верен.', correct: true },
    { text: 'Друг отговор.', explain: 'Защо не е.' },
  ]}
/>
```

`correct: true` marks a right answer. There can be more than one. The button stays disabled until something is checked.

UI strings that are not part of a lesson, such as the quiz button and the cards on the home page, live in `src/content/i18n/bg.json` and `src/content/i18n/en.json`.

To put a C# sample next to the same code in another language, wrap the two code blocks in `<Compare>`. Give each block a `title`, and keep the lines under about 38 characters so that neither side has to scroll. On a narrow screen the second block moves under the first.

````mdx
import Compare from '../../../../components/Compare.astro';

<Compare>

```csharp title="C#"
List<string> days = ["Mon", "Tue"];
```

```python title="Python"
days = ["Mon", "Tue"]
```

</Compare>
````

## Track progress

A course can show the reader how far they are, in percent. The numbers are kept in the browser's `localStorage` under the key `beaveroo:progress:v1`. Nothing is sent to a server. The Bulgarian and the English page of a lesson share one record.

A lesson's percentage is the share of its questions that were answered correctly. The course's percentage is the average over all the lessons the course will have, so a lesson that is not published yet counts as 0%.

To track a lesson:

1. List it in `src/courses.ts`, under `progress.lessons` of its course. `progress.planned` is the number of lessons the finished course will have.
2. Put `<LessonProgress number={1} of={9} minutes={35} topics={7} />` at the top of the lesson, and `<LessonProgress summary />` at the end.
3. Give every question that should count an `id`: `<Question id="names" choices={[...]} />`. The `id` has to be unique in the lesson and the same in both languages.
4. Add the lesson's `slug` to its row in `<CoursePath />` on the course's first page. A row without a `slug` is shown as coming soon. The build fails if the rows and `src/courses.ts` disagree.

The sidebar picks up the rest on its own: the course's percentage above the units, and each tracked lesson's percentage next to its name.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`. The action installs dependencies, runs `npm run build`, and uploads `dist/` over FTPS into `public_html/` on the host.

The workflow reads three repository secrets:

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | hostname |
| `FTP_USERNAME` | username |
| `FTP_PASSWORD` | password |

You can also start it by hand from the Actions tab with **Run workflow**.

## Layout

```
src/content/docs/          one folder per course, Bulgarian lessons
src/content/docs/en/       the same courses, in English
src/content/i18n/          UI strings, including the home page cards
src/components/            header, sidebar, quizzes, course grid, progress
src/courses.ts             the list of courses and their tracked lessons
src/routeData.ts           keeps the sidebar inside the current course
src/scripts/               progress tracking in the browser
src/assets/                images used inside lessons
public/                    fonts, favicon, files copied as-is
astro.config.mjs           locales, sidebar, theme
.github/workflows/         build and upload
```
