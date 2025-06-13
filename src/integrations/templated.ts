interface Layer {
  text?: string;
  image_url?: string;
  color?: string;
  color_2?: string;
  background?: string;
  font_family?: string;
  font_family_2?: string;
  font_size?: string;
  font_weight?: string;
  horizontal_align?: "left" | "center" | "right";
  vertical_align?: "top" | "center" | "bottom";
  autofit?: "width" | "height";
  border_width?: number;
  border_color?: string;
  border_radius?: string;
  fill?: string;
  stroke?: string;
  hide?: boolean;
  link?: string;
  x?: number;
  y?: number;
  rotation?: number;
  width?: number;
  height?: number;
  barcode_format?: "CODE128" | "CODE39" | "EAN13" | "EAN8" | "ITF14" | "UPC";
  html?: string;
}

interface Layers {
  [layerName: string]: Layer;
}

interface CreateRenderRequest {
  template?: string;
  templates?: string[];
  format?: "jpg" | "png" | "webp" | "pdf";
  transparent?: boolean;
  name?: string;
  background?: string;
  width?: number;
  height?: number;
  layers: Layers;
}

interface TemplatedRender {
  id: string;
  width: number;
  height: number;
  url: string;
  render_url: string;
  status: string;
  format: string;
  templateId: string;
  templateName: string;
  folderId: null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  payload: string;
  name: null;
}

export class TemplatedClient {
  constructor(
    private api: string,
    private token: string
  ) {}

  private request(method: string, path: string, data?: any) {
    const url = `${this.api}/${path}`;
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options);
  }

  createRender(data: CreateRenderRequest): Promise<TemplatedRender> {
    return this.request("POST", "render", data)
      .then((response) => response.json())
      .then((data) => data);
  }

  getRenders(): Promise<TemplatedRender[]> {
    return this.request("GET", "renders")
      .then((response) => response.json())
      .then((data) => data);
  }

  getRender(render: string): Promise<TemplatedRender | undefined> {
    return this.getRenders().then((renders) => {
      return renders.find((r) => r.name === render);
    });
  }

  renderExists(render: string): Promise<boolean> {
    return this.getRender(render).then((render) => {
      return render !== undefined;
    });
  }
}
