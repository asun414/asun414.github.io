import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const research = defineCollection({ loader: glob({ pattern:'**/*.{md,mdx}', base:'./src/content/research' }), schema:z.object({ title:z.string(), titleZh:z.string(), status:z.string(), year:z.string().optional(), summary:z.string(), summaryZh:z.string(), keywords:z.array(z.string()), featured:z.boolean().default(false), paperUrl:z.string().optional(), slidesUrl:z.string().optional(), codeUrl:z.string().optional(), order:z.number() }) });
const publications = defineCollection({ loader: glob({ pattern:'**/*.{md,mdx}', base:'./src/content/publications' }), schema:z.object({ authors:z.string(), year:z.number(), title:z.string(), venue:z.string(), doi:z.string().optional(), category:z.enum(['publication','working-paper','book-chapter','other']), order:z.number() }) });
const notes = defineCollection({ loader: glob({ pattern:'**/*.{md,mdx}', base:'./src/content/notes' }), schema:z.object({ title:z.string(), titleZh:z.string().optional(), description:z.string(), date:z.coerce.date(), draft:z.boolean().default(false) }) });
export const collections={research,publications,notes};
