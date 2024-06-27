import { Snake } from './snake';

export class Apple {
    position: number[];
    private image: HTMLImageElement;
  
    constructor(position: number[], private ctx: CanvasRenderingContext2D, private blockSize: number) {
      this.position = position;
      this.image = new Image();
      this.image.src = 'data:image/svg+xml;base64,' + btoa(`
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 512 512" width="100" height="100">
          <g>
            <path d="M59.375 18.75c0 -1.726 -1.399 -3.125 -3.125 -3.125H25c-1.726 0 -3.125 1.399 -3.125 3.125v25c0 1.726 1.399 3.125 3.125 3.125h31.25c1.726 0 3.125 -1.399 3.125 -3.125zm-6.25 21.875H28.125v-18.75h25z"/>
            <path d="m95.222 22.159 -12.463 -6.25c-1.547 -0.775 -3.402 -0.145 -4.174 1.398 -0.772 1.544 -0.137 3.421 1.407 4.193l4.746 2.371c-0.127 0.34 -0.291 0.699 -0.291 1.084 0 4.069 3.053 7.505 6.178 8.799v38.076c0 1.723 -1.402 3.125 -3.125 3.125s-3.125 -1.402 -3.125 -3.125v-25c0 -7.545 -6.25 -13.857 -12.5 -15.309V12.454C71.875 5.562 66.417 0 59.524 0h-37.5C15.132 0 9.375 5.562 9.375 12.454v69.943l-4.523 2.261A3.125 3.125 0 0 0 3.125 87.454v9.375C3.125 98.555 4.673 100 6.399 100h68.75C76.875 100 78.125 98.555 78.125 96.829v-9.375a3.125 3.125 0 0 0 -1.727 -2.796L71.875 82.397v-44.367c3.125 1.294 6.25 4.73 6.25 8.799v25c0 5.17 4.205 9.375 9.375 9.375s9.375 -4.205 9.375 -9.375v-46.875c0 -1.184 -0.594 -2.266 -1.653 -2.796M71.875 93.75H9.375v-4.364l4.523 -2.261A3.125 3.125 0 0 0 15.625 84.329v-71.875C15.625 9.007 18.577 6.25 22.024 6.25h37.5C62.971 6.25 65.625 9.007 65.625 12.454v71.875a3.125 3.125 0 0 0 1.727 2.796L71.875 89.386z"/>
          </g>
        </svg>
      `);
    }
  
    draw(): void {
      const x = this.position[0] * this.blockSize;
      const y = this.position[1] * this.blockSize;
      this.ctx.drawImage(this.image, x, y, this.blockSize, this.blockSize);
    }
  
    setNewPosition(widthInBlocks: number, heightInBlocks: number): void {
      const newX: number = Math.round(Math.random() * (widthInBlocks - 1));
      const newY: number = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    }
  
    isOnSnake(snakeToCheck: Snake): boolean {
      let isOnSnake = false;
      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    }
  }
  