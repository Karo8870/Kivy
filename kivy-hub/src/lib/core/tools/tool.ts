import { KivyModule } from '../kivy.module';
import { Point } from '../../types';

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
