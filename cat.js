class Cat {
  constructor(quad) {
    this.quad = quad;
    this.visible = random() < 0.8;
  }

  update() {
    if (this.visible) {
      if (random() < 0.007) this.visible = false;
    } else {
      if (random() < 0.02) this.visible = true;
    }
  }

  display() {
    if (!this.visible || this.quad.isBoundary) return;

    let pts = this.quad.pts;
    let peekCorner = this.quad.peekCorner;

    let quadWidth = (dist(...pts[0], ...pts[1]) + dist(...pts[3], ...pts[2])) / 2;
    let quadHeight = (dist(...pts[0], ...pts[3]) + dist(...pts[1], ...pts[2])) / 2;
    let catSize = min(quadWidth, quadHeight) * 0.8;
    if (catSize < 12) return;

    let anchorX, anchorY, rotation = 0;
    switch (peekCorner) {
      case 'topLeft': anchorX = pts[0][0]; anchorY = pts[0][1]; rotation = 0; break;
      case 'topRight': anchorX = pts[1][0]; anchorY = pts[1][1]; rotation = HALF_PI; break;
      case 'bottomRight': anchorX = pts[2][0]; anchorY = pts[2][1]; rotation = PI; break;
      case 'bottomLeft': anchorX = pts[3][0]; anchorY = pts[3][1]; rotation = -HALF_PI; break;
    }

    push();
    translate(anchorX, anchorY);
    rotate(rotation);
    translate(0, -catSize);

    fill(0);
    noStroke();
    arc(catSize / 2, catSize, catSize, catSize, PI, TWO_PI);

    let eyeSize = catSize * 0.2;
    let pupilSize = eyeSize * 0.4;
    let eyeY = catSize * 0.85;

    stroke(255);
    strokeWeight(0.5);
    fill('#FFD700');
    ellipse(catSize / 2 - catSize * 0.2, eyeY, eyeSize, eyeSize);
    ellipse(catSize / 2 + catSize * 0.2, eyeY, eyeSize, eyeSize);

    noStroke();
    fill(0);
    ellipse(catSize / 2 - catSize * 0.2, eyeY, pupilSize, pupilSize);
    ellipse(catSize / 2 + catSize * 0.2, eyeY, pupilSize, pupilSize);

    fill(0);
    let earBaseY = catSize / 1.5;
    let earTipY = catSize * 0.35;
    triangle(catSize / 2 - catSize * 0.375, earBaseY, catSize / 2 - catSize * 0.25, earTipY, catSize / 2 - catSize * 0.125, earBaseY);
    triangle(catSize / 2 + catSize * 0.375, earBaseY, catSize / 2 + catSize * 0.25, earTipY, catSize / 2 + catSize * 0.125, earBaseY);

    pop();
  }
}
