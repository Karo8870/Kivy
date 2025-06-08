import { MoveTool } from './tools/move.tool.ts';
import { Tool } from './tools/tool.ts';
import { IdleTool } from './tools/idle.tool.ts';
import { Point } from '../types.ts';

export class KivyModule {
  currentPos: Point;

  moveTool: MoveTool = new MoveTool(this);
  idleTool: IdleTool = new IdleTool(this);

  currentTool: Tool = this.idleTool;

  mouseMove(pos: Point) {
    this.currentPos = pos;

    this.currentTool.mouseMove(pos);
  }
}
