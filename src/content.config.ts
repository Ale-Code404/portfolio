import { z, defineCollection, reference } from "astro:content";
import { projectsLoader } from "./data/loaders/projects";
import { glob } from "astro/loaders";

const experiences = defineCollection({
  loader: glob({
    base: "./src/data/experiences",
    pattern: "*.json",
  }),
  schema: z.object({
    company: z.string(),
    position: z.string(),
    dates: z.object({
      start: z.string(),
      end: z.string(),
    }),
    description: z.string(),
    challenges: z.array(z.string()),
    stack: z.array(z.string()),
  }),
});

const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    codename: z.string(),
    description: z.string(),
    image_url: z.string(),
    stack: z.array(z.string()),
    actions: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        button_style: z.string(),
      })
    ),
  }),
  loader: projectsLoader({
    template: {
      image: import.meta.env.TEMPLATED_API_URL,
      token: import.meta.env.TEMPLATED_API_KEY,
    },
  }),
});

const articles = defineCollection({
  loader: glob({
    base: "./src/data/articles",
    pattern: "*.md",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    date: z.date(),
    tags: z.array(z.string()),
    relatedArticles: z.array(reference("articles")).optional(),
  }),
});

export const collections = {
  experiences,
  projects,
  articles,
};
