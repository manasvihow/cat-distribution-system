let frameRateVal = 30;


let palette = [
  '#264653', 
  '#2a9d8f', 
  '#f4a261', 
  '#e76f51',
  '#d62828',
  '#003049', 
  '#f77f00', 
  '#fcbf49',
  '#eae2b7', 
  '#457b9d', 
  '#ffd166', 
  '#b23a48',  
  '#606c38', 
  '#bc6c25', 
  '#e5989b', 
  '#6d6875'
];

const MARGIN = 20;
let quads = [];

function setup() {
  createCanvas(1080, 1080);
  frameRate(frameRateVal);
  background('#f0ead6');
  stroke(0);
  strokeWeight(2);

  let p1 = { x: MARGIN, y: MARGIN };
  let p2 = { x: width - MARGIN, y: MARGIN };
  let p3 = { x: width - MARGIN, y: height - MARGIN };
  let p4 = { x: MARGIN, y: height - MARGIN };

  subdivide(p1, p2, p3, p4, {
    top: true,
    right: true,
    bottom: true,
    left: true
  });
}

function draw() {
  background('#f0ead6');

  for (let quad of quads) {
    quad.update();
    quad.display();
  }

  if (frameCount % 30 === 0) {
    let numToBlink = int(random(1, 4));
    for (let i = 0; i < numToBlink; i++) {
      let idx = int(random(quads.length));
      quads[idx].blinkColor();
    }
  }

  if (frameCount % 10 === 0) {
    const maxVisibleCats = 80;
    let currentVisible = quads.filter(q => q.cat && q.cat.visible).length;

    for (let q of quads) {
      if (q.cat && random() < 0.1) {
        q.cat = null;
      }
    }

    let addLimit = maxVisibleCats - quads.filter(q => q.cat && q.cat.visible).length;
    if (addLimit > 0) {
      let candidates = quads.filter(q => !q.isBoundary && !q.cat);
      shuffle(candidates, true);
      for (let i = 0; i < min(addLimit, candidates.length); i++) {
        candidates[i].cat = new Cat(candidates[i]);
      }
    }
  }
  
}

function subdivide(p1, p2, p3, p4, edgeLock) {
  let d = dist(p1.x, p1.y, p3.x, p3.y);

  if (d < 75) {
    let col = random(palette);
    let epsilon = 1.0;
    let isBoundary = (
      Math.abs(p1.x - MARGIN) < epsilon ||
      Math.abs(p2.x - (width - MARGIN)) < epsilon ||
      Math.abs(p3.x - (width - MARGIN)) < epsilon ||
      Math.abs(p4.x - MARGIN) < epsilon ||
      Math.abs(p1.y - MARGIN) < epsilon ||
      Math.abs(p2.y - MARGIN) < epsilon ||
      Math.abs(p3.y - (height - MARGIN)) < epsilon ||
      Math.abs(p4.y - (height - MARGIN)) < epsilon
    );

    let peekCorner = random(['bottomRight', 'bottomLeft', 'topLeft', 'topRight', 'topRight', 'topLeft']);
    quads.push(new Quad([
      [p1.x, p1.y], [p2.x, p2.y], [p3.x, p3.y], [p4.x, p4.y]
    ], col, isBoundary, peekCorner));
    return;
  }

  let topWidth = dist(p1.x, p1.y, p2.x, p2.y);
  let leftHeight = dist(p1.x, p1.y, p4.x, p4.y);
  let splitHorizontally = leftHeight > topWidth;
  if (topWidth / leftHeight > 0.95 && topWidth / leftHeight < 1.05) {
    splitHorizontally = random() > 0.5;
  }

  let jitter = 1;
  let splitAmount = random(0.4, 0.6);

  if (splitHorizontally) {
    let pL_mid = {
      x: lerp(p1.x, p4.x, splitAmount),
      y: lerp(p1.y, p4.y, splitAmount)
    };
    let pR_mid = {
      x: lerp(p2.x, p3.x, splitAmount),
      y: lerp(p2.y, p3.y, splitAmount)
    };

    if (!edgeLock.left) {
      pL_mid.x += random(-jitter, jitter);
      pL_mid.y += random(-jitter, jitter);
    }
    if (!edgeLock.right) {
      pR_mid.x += random(-jitter, jitter);
      pR_mid.y += random(-jitter, jitter);
    }

    subdivide(p1, p2, pR_mid, pL_mid, {
      top: edgeLock.top,
      right: false,
      bottom: false,
      left: edgeLock.left
    });

    subdivide(pL_mid, pR_mid, p3, p4, {
      top: false,
      right: edgeLock.right,
      bottom: edgeLock.bottom,
      left: edgeLock.left
    });

  } else {
    let pT_mid = {
      x: lerp(p1.x, p2.x, splitAmount),
      y: lerp(p1.y, p2.y, splitAmount)
    };
    let pB_mid = {
      x: lerp(p4.x, p3.x, splitAmount),
      y: lerp(p4.y, p3.y, splitAmount)
    };

    if (!edgeLock.top) {
      pT_mid.x += random(-jitter, jitter);
      pT_mid.y += random(-jitter, jitter);
    }
    if (!edgeLock.bottom) {
      pB_mid.x += random(-jitter, jitter);
      pB_mid.y += random(-jitter, jitter);
    }

    subdivide(p1, pT_mid, pB_mid, p4, {
      top: edgeLock.top,
      right: false,
      bottom: edgeLock.bottom,
      left: edgeLock.left
    });

    subdivide(pT_mid, p2, p3, pB_mid, {
      top: edgeLock.top,
      right: edgeLock.right,
      bottom: edgeLock.bottom,
      left: false
    });
  }
}
