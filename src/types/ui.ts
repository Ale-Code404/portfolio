export interface Experience {
  company: string;
  position: string;
  dates: {
    start: string;
    end: string;
  };
  description: string;
  challenges: Array<string>;
  stack: Array<string>;
}

export interface Article {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  date: string;
  tags: Array<string>;
  relatedArticles: Array<Article>;
}
