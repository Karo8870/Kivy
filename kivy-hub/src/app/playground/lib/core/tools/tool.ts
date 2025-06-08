import { KivyModule } from '../kivy.module.ts';
import { Point } from '../../types.ts';

export interface Tool {
  unmount?(): void;
}

export abstract class Tool {
  kivyModule: KivyModule;

  constructor(kivyModule: KivyModule) {
    this.kivyModule = kivyModule;
  }

  mount(...args: any[]): void {
    if (this.kivyModule.currentTool.unmount) {
      this.kivyModule.currentTool.unmount();
    }

    this.kivyModule.currentTool = this;
  }

  mouseMove(pos: Point): void {}
}
