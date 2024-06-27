import { Apple } from './apple';

export class Snake {
  body: number[][];
  direction: string;
  ateApple: boolean;
  ctx: CanvasRenderingContext2D;
  blockSize: number;

  constructor(body: number[][], direction: string, ctx: CanvasRenderingContext2D, blockSize: number) {
    this.body = body;
    this.direction = direction;
    this.ateApple = false;
    this.ctx = ctx;
    this.blockSize = blockSize;
  }

  draw(): void {
    this.ctx.save();
    this.ctx.fillStyle = "#000";
    for (let i = 0; i < this.body.length; i++) {
      this.drawBlock(this.body[i]);
    }
    this.ctx.restore();
  }

  advance(): void {
    const nextPosition: number[] = this.body[0].slice();
    switch (this.direction) {
      case "left":
        nextPosition[0] -= 1;
        break;
      case "right":
        nextPosition[0] += 1;
        break;
      case "down":
        nextPosition[1] += 1;
        break;
      case "up":
        nextPosition[1] -= 1;
        break;
      default:
        throw new Error("Invalid direction");
    }
    this.body.unshift(nextPosition);
    if (!this.ateApple) {
      this.body.pop();
    } else {
      this.ateApple = false;
    }
  }

  setDirection(newDirection: string): void {
    let allowedDirections: string[];
    switch (this.direction) {
      case "left":
      case "right":
        allowedDirections = ["up", "down"];
        break;
      case "down":
      case "up":
        allowedDirections = ["left", "right"];
        break;
      default:
        throw new Error("Invalid direction");
    }
    if (allowedDirections.indexOf(newDirection) > -1) {
      this.direction = newDirection;
    }
  }

  checkCollision(widthInBlocks: number, heightInBlocks: number): boolean {
    let wallCollision = false;
    let snakeCollision = false;
    const head = this.body[0];
    const rest = this.body.slice(1);
    const snakeX = head[0];
    const snakeY = head[1];
    const minX = 0;
    const minY = 0;
    const maxX = widthInBlocks - 1;
    const maxY = heightInBlocks - 1;
    const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
    const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
    if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
      wallCollision = true;
    }
    for (let i = 0; i < rest.length; i++) {
      if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
        snakeCollision = true;
      }
    }
    return wallCollision || snakeCollision;
  }

  isEatingApple(appleToEat: Apple): boolean {
    const head = this.body[0];
    return head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1];
  }

  private drawBlock(position: number[]): void {
    const x: number = position[0] * this.blockSize;
    const y: number = position[1] * this.blockSize;
    this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
  }
}
