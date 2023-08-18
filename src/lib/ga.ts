import { PUBLIC_GA_TRACKING_ID } from "$env/static/public";

declare global {
  interface Window {
    _gaq: unknown[];
    dataLayer: unknown[];
  }
}

export enum GAActions {
  CLICK = "_button_click"
}

class GA {
  private static instance: GA;
  private loadedResult: unknown;

  public static getInstance(): GA {
    if (!GA.instance) {
      GA.instance = new GA();
    }
    return GA.instance;
  }

  public async load() {
    if (!this.loadedResult) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push("js", new Date());
      window.dataLayer.push("config", PUBLIC_GA_TRACKING_ID);
      await this.loadTagManager();
    }
  }

  private async loadTagManager() {
    this.loadedResult = await import(
      `https://www.googletagmanager.com/gtag/js?id=${PUBLIC_GA_TRACKING_ID}`
    );
  }

  public sendEvent(action: GAActions, ...args: string[]) {
    window.dataLayer.push("event", action, ...args);
  }
}

const ga = GA.getInstance();

export { ga as GA };