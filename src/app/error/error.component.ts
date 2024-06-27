import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { Snake } from './snake';
import { Apple } from './apple';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit, AfterViewInit {
  private readonly canvasWidth: number = 900;
  private readonly canvasHeight: number = 600;
  private readonly blockSize: number = 30;
  private readonly widthInBlocks: number = this.canvasWidth / this.blockSize;
  private readonly heightInBlocks: number = this.canvasHeight / this.blockSize;
  private readonly centreX: number = this.canvasWidth / 2;
  private readonly centreY: number = this.canvasHeight / 2;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private delay!: number;
  private snakee!: Snake;
  private applee!: Apple;
  private score!: number;
  private timeout!: number | undefined;
  private map: { [key: number]: boolean } = {};

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.init();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      this.init();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  private init(): void {
    // Remove existing canvas if any
    const existingCanvas = document.getElementById('gameCanvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // Create new canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'gameCanvas';
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.border = '30px solid gray';
    this.canvas.style.margin = '25px auto';
    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = '#ddd';
    document.getElementById('game-container')?.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.launch();
  }

  private launch(): void {
    this.snakee = new Snake([[2, 4]], 'right', this.ctx, this.blockSize);
    this.applee = new Apple([10, 10], this.ctx, this.blockSize);
    this.score = 0;
    clearTimeout(this.timeout);
    this.delay = 100;
    this.refreshCanvas();
  }

  private refreshCanvas(): void {
    this.snakee.advance();
    if (this.snakee.checkCollision(this.widthInBlocks, this.heightInBlocks)) {
      this.gameOver();
    } else {
      if (this.snakee.isEatingApple(this.applee)) {
        this.score++;
        this.snakee.ateApple = true;
        do {
          this.applee.setNewPosition(this.widthInBlocks, this.heightInBlocks);
        } while (this.applee.isOnSnake(this.snakee));
        if (this.score % 5 === 0) {
          this.speedUp();
        }
      }
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.drawScore();
      this.snakee.draw();
      this.applee.draw();
      this.timeout = window.setTimeout(() => this.refreshCanvas(), this.delay);
    }
  }

  private gameOver(): void {
    this.ctx.save();
    this.ctx.font = 'bold 70px sans-serif';
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 5;
    this.ctx.strokeText('Game Over', this.centreX, this.centreY - 180);
    this.ctx.fillText('Game Over', this.centreX, this.centreY - 180);
    this.ctx.font = 'bold 30px sans-serif';
    this.ctx.strokeText('Appuyer sur la touche espace pour rejouer', this.centreX, this.centreY - 120);
    this.ctx.fillText('Appuyer sur la touche espace pour rejouer', this.centreX, this.centreY - 120);
    this.ctx.restore();
  }

  private drawScore(): void {
    this.ctx.save();
    this.ctx.font = 'bold 200px sans-serif';
    this.ctx.fillStyle = 'grey';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.score.toString(), this.centreX, this.centreY);
    this.ctx.restore();
  }

  private speedUp(): void {
    this.delay /= 1.1;
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  private handleKeyDown(event: KeyboardEvent): void {
    this.map[event.keyCode] = event.type === 'keydown';
    let newDirection: string | undefined;
    if ([37, 38, 39, 40].includes(event.keyCode)) {
      event.preventDefault();
    }
    if (this.map[37]) {
      newDirection = 'left';
    } else if (this.map[38]) {
      newDirection = 'up';
    } else if (this.map[39]) {
      newDirection = 'right';
    } else if (this.map[40]) {
      newDirection = 'down';
    } else if (this.map[32]) {
      this.launch();
    }
    if (newDirection) {
      this.snakee.setDirection(newDirection);
    }
  }
}