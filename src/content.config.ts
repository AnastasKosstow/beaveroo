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
      }),
    }),
  }),
};
