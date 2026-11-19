import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Extra parts of the hero on a course's first page. The title, tagline and buttons come from Starlight's `hero`.
        courseHero: z
          .object({
            eyebrow: z.string().optional(),
            stats: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
            code: z
              .object({
                file: z.string(),
                panes: z.array(
                  z.object({
                    label: z.string(),
                    hint: z.string().optional(),
                    lang: z.string(),
                    code: z.string(),
                  })
                ),
                note: z.string().optional(),
              })
              .optional(),
          })
          .optional(),
      }),
    }),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({
      extend: z.object({
        'course.title': z.string().optional(),
        'python.title': z.string().optional(),
        'python.description': z.string().optional(),
        'header.linksLabel': z.string().optional(),
        'header.switchLanguageLabel': z.string().optional(),
        'header.switchLanguageTitle': z.string().optional(),
        'header.huggingFace': z.string().optional(),
        'landing.heading': z.string().optional(),
        'landing.courseDescription': z.string().optional(),
        'footer.sourceCode': z.string().optional(),
        'footer.sourceCodeTitle': z.string().optional(),
        'pagination.label': z.string().optional(),
        'quiz.check': z.string().optional(),
        'quiz.correct': z.string().optional(),
        'quiz.incorrect': z.string().optional(),
        'quiz.allCorrect': z.string().optional(),
        'quiz.someWrong': z.string().optional(),
        'quiz.solved': z.string().optional(),
        'embed.note': z.string().optional(),
        'embed.open': z.string().optional(),
        'progress.label': z.string().optional(),
        'progress.step1': z.string().optional(),
        'progress.step2': z.string().optional(),
        'progress.step3': z.string().optional(),
        'progress.step4': z.string().optional(),
        'progress.step5': z.string().optional(),
        'progress.step6': z.string().optional(),
        'cycle.label': z.string().optional(),
        'cycle.thought': z.string().optional(),
        'cycle.action': z.string().optional(),
        'cycle.observation': z.string().optional(),
        'cycle.center': z.string().optional(),
        'track.course': z.string().optional(),
        'track.lessons': z.string().optional(),
        'track.lesson': z.string().optional(),
        'track.minutes': z.string().optional(),
        'track.topics': z.string().optional(),
        'track.checks': z.string().optional(),
        'track.saved': z.string().optional(),
        'track.summary': z.string().optional(),
        'track.hint': z.string().optional(),
        'track.complete': z.string().optional(),
        'track.reset': z.string().optional(),
        'track.soon': z.string().optional(),
        'track.start': z.string().optional(),
        'track.resume': z.string().optional(),
        'track.review': z.string().optional(),
        'try.run': z.string().optional(),
        'try.running': z.string().optional(),
        'try.loading': z.string().optional(),
        'try.reset': z.string().optional(),
        'try.output': z.string().optional(),
        'try.outputEmpty': z.string().optional(),
        'try.editable': z.string().optional(),
        'try.console': z.string().optional(),
        'try.correct': z.string().optional(),
        'try.wrong': z.string().optional(),
        'try.error': z.string().optional(),
        'try.timeout': z.string().optional(),
        'try.loadFailed': z.string().optional(),
        'try.note': z.string().optional(),
        'try.expected': z.string().optional(),
        'try.actual': z.string().optional(),
        'try.empty': z.string().optional(),
      }),
    }),
  }),
};
