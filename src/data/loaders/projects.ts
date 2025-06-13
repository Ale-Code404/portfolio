import { glob, type Loader, type LoaderContext } from "astro/loaders";

interface projectsLoaderOptions {
  template: {
    image: string;
    token: string;
  };
}

export function projectsLoader(options: projectsLoaderOptions): Loader {
  return {
    name: "projects",
    load: (context: LoaderContext) => {
      const projectsFiles = glob({
        base: "./src/data",
        pattern: "projects/*.json",
      });

      projectsFiles.load(context).then(() => {
        context.logger.info("Loaded projects files");
        context.logger.info(
          `context.store.values().length: ${context.store.values().length}`
        );
      });

      return Promise.resolve();
    },
  };
}
