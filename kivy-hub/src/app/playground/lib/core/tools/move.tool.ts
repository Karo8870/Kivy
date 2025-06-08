import { Tool } from './tool.ts';
import { Point } from '../../types.ts';

export class MoveTool extends Tool {
  offset: Point;
  element: HTMLElement;

  onUnmount?: () => void;

  mouseMove(pos: Point) {
    this.element.style.transform = `translate(${pos.x - this.offset.x}px, ${pos.y - this.offset.y}px)`;
  }

  mount(
    element: HTMLElement,
    onUnmount?: () => void,
    pos: Point = this.kivyModule.currentPos
  ) {
    super.mount();

    const boundingBox = element.getBoundingClientRect();

    this.offset = {
      x: pos.x - boundingBox.x,
      y: pos.y - boundingBox.y
    };

    this.element = element;

    this.onUnmount = onUnmount;
  }

  unmount() {
    if (this.onUnmount) {
      this.onUnmount();
    }
  }
}
