import { glob, type Loader, type LoaderContext } from "astro/loaders";
import type { AnyEntryMap, DataEntry, DataEntryMap } from "astro:content";
import { TemplatedClient } from "@integrations/templated";

interface projectsLoaderOptions {
  image: {
    api: string;
    token: string;
    template: string;
  };
}

const createProjectThumbnail = async (
  template: string,
  client: TemplatedClient,
  project: DataEntryMap["projects"]["data"]
): Promise<string> => {
  const existingRender = await client.getRender(project.id);

  if (existingRender) {
    return existingRender.url;
  }

  const image = await client.createRender({
    template,
    name: project.id,
    layers: {
      title: {
        text: project.data.title,
      },
      codename: {
        text: project.data.codename,
      },
    },
  });

  return image.url;
};

export function projectsLoader(options: projectsLoaderOptions): Loader {
  return {
    name: "projects",
    load: async (context: LoaderContext) => {
      const client = new TemplatedClient(
        options.image.api,
        options.image.token
      );

      const projectsFiles = glob({
        base: "./src/data",
        pattern: "projects/*.json",
      });

      const projects = (await projectsFiles
        .load(context)
        .then(() => context.store.values())) as Array<
        DataEntryMap["projects"]["data"]
      >;

      for (const project of projects) {
        const imageUrl = await createProjectThumbnail(
          options.image.template,
          client,
          project
        );

        context.store.set({
          id: project.id,
          data: {
            ...project.data,
            image_url: imageUrl,
          },
        });
      }
    },
  };
}
