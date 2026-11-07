# Curious Otter 🦦

Публична образователна платформа с курсове на български (и английски), изградена с [Astro](https://astro.build) + [Starlight](https://starlight.astro.build). Статичен сайт — без акаунти, без backend; прогресът на обучаемия се пази само в неговия браузър (`localStorage`).

## Курсове

| Курс | Път | Състояние |
| --- | --- | --- |
| **AI Agents Course** — адаптация на Hugging Face Agents Course с C# / .NET примери | `/unit-0/…`, `/unit-1/…` | Unit 0 и Unit 1 |
| **Python for .NET Developers** — Python за опитни C#/.NET разработчици | `/python-for-dotnet/…` | Unit 00 готов, Unit 01–12 предстоят |

Английските версии са под `/en/…`.

## Разработка

Изисква Node.js (LTS; deploy-ът използва Node 24).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # статичен build в ./dist
npm run preview    # преглед на build-а (търсенето работи само тук)
```

## Структура

```
src/
├── courses.ts                 # регистър на курсовете: заглавия, карти, модули, URL префикси
├── content/
│   ├── docs/                  # BG съдържание (root locale)
│   │   ├── index.mdx          # начална страница — каталог с курсове
│   │   ├── unit-0/, unit-1/   # AI Agents Course
│   │   └── python-for-dotnet/ # Python for .NET Developers (index.mdx + unit-XX-*.mdx)
│   ├── docs/en/               # EN огледало на горното
│   └── i18n/{bg,en}.json      # UI низове (Starlight + собствени)
├── components/
│   ├── *.astro                # Starlight overrides (Header, Sidebar, PageTitle, Footer…)
│   ├── course/                # landing на курс: CourseHero, CoursePath, CourseNav, Features…
│   └── lesson/                # урок: CodeComparison, MentalModelShift, PitfallCallout,
│                              #   LocalExercise, PythonPlayground, Pitfalls, ReadyCheck,
│                              #   KnowledgeCheck, LessonCheckpoint
├── examples/python-for-dotnet # .py файлове за упражненията (импортират се с ?raw)
├── scripts/                   # progress.ts (localStorage), pyodide-runner.ts (worker клиент)
└── styles/                    # fonts.css, theme.css (база), course.css (курсове и уроци)
public/
├── scripts/pyodide-worker.js  # Web Worker, зарежда Pyodide от jsDelivr при първия Run
└── downloads/                 # файлове за изтегляне от уроците
```

## Как се добавя урок към Python курса

1. Създай `src/content/docs/python-for-dotnet/unit-XX-slug.mdx` (и `en/` версията) с frontmatter:

   ```yaml
   title: …
   course: python-for-dotnet
   unit: 'XX'
   minutes: 20
   track: fast          # или deep
   pagination: false    # навигацията е в LessonCheckpoint
   tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 }
   ```

2. В `src/courses.ts` задай на модула `slug: 'unit-XX-slug'` и `status: 'ready'` — sidebar-ът, учебният път и checkpoint-ът се обновяват сами.
3. Следвай шаблона на урок: цел (`LessonGoals`) → `## секции` (всяко `##` се номерира автоматично) с `CodeComparison`, `MentalModelShift`, `PitfallCallout`, `LocalExercise`, `PythonPlayground` → `Pitfalls` → `ReadyCheck`/задача → `KnowledgeCheck` → TL;DR → `LessonCheckpoint`.

## Python Playground

`PythonPlayground` изпълнява код в браузъра чрез [Pyodide](https://pyodide.org) в Web Worker. Pyodide се изтегля от CDN при първото натискане на *Run* (~10 MB, кешира се). Изпълнение над 20 s прекъсва worker-а. Упражненията с `expect={[…]}` се проверяват по съдържанието на stdout. Примери, които изискват файлова система, мрежа или локални пакети, се дават само като „Изпълни локално“.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`): при push към `main` → `npm ci` → `npm run build` → FTPS качване на `dist/` към SuperHosting. Нужни secrets: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
