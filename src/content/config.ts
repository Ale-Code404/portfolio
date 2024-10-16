import { z, defineCollection } from "astro:content";

const experiences = defineCollection({
  type: "data",
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
  type: "data",
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
});

export const collections = {
  experiences,
  projects,
};
