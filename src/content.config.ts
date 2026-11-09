import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema(),
  }),
  i18n: defineCollection({
    loader: i18nLoader(),
    schema: i18nSchema({
      extend: z.object({
        'course.title': z.string().optional(),
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
      }),
    }),
  }),
};
