import { MoveTool } from './tools/move.tool';
import { Tool } from './tools/tool';
import { IdleTool } from './tools/idle.tool';
import { Point } from '../types';

export class KivyModule {
  // @ts-ignore
  currentPos: Point;

  moveTool: MoveTool = new MoveTool(this);
  idleTool: IdleTool = new IdleTool(this);

  currentTool: Tool = this.idleTool;

  mouseMove(pos: Point) {
    this.currentPos = pos;

    this.currentTool.mouseMove(pos);
  }
}
