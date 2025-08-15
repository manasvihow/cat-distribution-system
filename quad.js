class Quad {
  constructor(pts, color, isBoundary, peekCorner) {
    this.pts = pts;
    this.originalColor = color;
    this.currentColor = color;
    this.timer = 0;

    this.cat = null;
    this.isBoundary = isBoundary;
    this.peekCorner = peekCorner;
  }

  update() {
    if (this.timer > 0) {
      this.timer--;
      if (this.timer === 0) {
        this.currentColor = this.originalColor;
      }
    }

    this.cat?.update();
  }

  display() {
    fill(this.currentColor);
    quad(...this.pts.flat());

    this.cat?.display();
  }

  blinkColor() {
    let newColor;
    do {
      newColor = random(palette);
    } while (newColor === this.currentColor);

    this.currentColor = newColor;
    this.timer = int(random(10, 25));
  }
}
