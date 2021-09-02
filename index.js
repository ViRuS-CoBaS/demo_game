const canvas = document.createElement('canvas');
document.getElementById('app').append(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function drawCircle(x, y, radius) {
  context.fillStyle = '#000';
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  context.closePath();
  context.stroke();
}
function drawLine(fromX, fromY, toX, toY) {
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.closePath();
  context.stroke();
}

const map = {
  A: 32,
  X0: 100,
  Y0: 400,
  Xots: 0,
  Yots: 0,
  Xm: 0, //положение мыши X
  Ym: 0, //положение мыши Y
  drawAxis: context => {
    //Рисуем ОСИ
    // Pic.Line (X0, Y0)-(X0 + 1000, Y0 + 500), RGB(255, 0, 0)
    // Pic.Line (X0, Y0)-(X0 + 1000, Y0 - 500), RGB(0, 0, 255)
    drawLine(map.X0, map.Y0, map.X0 + 1500, map.Y0 + 750);
    drawLine(map.X0, map.Y0, map.X0 + 1500, map.Y0 - 750);
  },
  drawC0: context => {
    //Рисуем центр нулевого ромба
    // cx0 = X0 + 2 * A
    // cy0 = Y0
    // Pic.Circle (cx0, cy0), 5, RGB(255, 0, 0)
    cx0 = map.X0 + 2 * map.A;
    cy0 = map.Y0;
    drawCircle(cx0, cy0, 3);
  },
  drawCenter: context => {
    // For Y = 0 To 4 'Центры ромбов сетки
    // For X = 0 To 4
    // cx = cx0 + 2 * A * (X + Y)
    // cy = cy0 + A * (X - Y)
    // Pic.Circle (cx, cy), 3, RGB(0, 0, 0)
    // Pic.PSet (cx, cy), RGB(0, 0, 0)
    // Pic.Line (cx - 2 * A + 1, cy)-(cx, cy - A + 1), RGB(0, 0, 0)
    // Pic.Line (cx - 1, cy + A)-(cx + 2 * A - 2, cy + 1), RGB(0, 0, 0)
    // Pic.Line (cx - 2 * A + 1, cy + 1)-(cx, cy + A), RGB(0, 0, 0)
    // Pic.Line (cx, cy - A + 1)-(cx + 2 * A - 2, cy), RGB(255, 0, 0)
    // Next X
    // Next Y
    cx0 = map.X0 + 2 * map.A;
    cy0 = map.Y0;
    for (let x = 0; x <= 4; x++) {
      for (let y = 0; y <= 4; y++) {
        cx = cx0 + 2 * map.A * (x + y);
        cy = cy0 + map.A * (x - y);
        drawCircle(cx, cy, 3);

        let topLinefromX = cx - 2 * map.A + 1;
        let topLinefromY = cy;
        let topLinetoX = cx;
        let topLinetoY = cy - map.A + 1;
        drawLine(topLinefromX, topLinefromY, topLinetoX, topLinetoY);

        let bottomLinefromX = cx - 1;
        let bottomLinefromY = cy + map.A;
        let bottomLinetoX = cx + 2 * map.A - 2;
        let bottomLinetoY = cy + 1;
        drawLine(
          bottomLinefromX,
          bottomLinefromY,
          bottomLinetoX,
          bottomLinetoY
        );

        let rightLineFromX = cx;
        let rightLineFromY = cy - map.A + 1;
        let rightLineToX = cx + 2 * map.A - 2;
        let rightLineToY = cy;
        drawLine(rightLineFromX, rightLineFromY, rightLineToX, rightLineToY);

        let leftLineFromX = cx - 2 * map.A + 1;
        let leftLineFromY = cy + 1;
        let leftLineToX = cx;
        let leftLineToY = cy + map.A;
        drawLine(leftLineFromX, leftLineFromY, leftLineToX, leftLineToY);
      }
    }
  }
};
map.Xots = map.X0;
map.Yots = map.Y0;
map.drawAxis(context);
map.drawC0(context);
map.drawCenter(context);

window.addEventListener('click', event => {
  var rect = canvas.getBoundingClientRect();
  map.Xm =
    ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
  map.Ym =
    ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;

  let L = map.A * (5 ^ 0.5);
  let Xrc = map.Xots + 2 * map.A;
  let Yrc = map.Yots;
  /* console.log('first: ',L,Xrc,Yrc) */
  let X1 = map.Xm;
  let Y1 = map.Ym;
  console.log('mouse:', map.Xm, map.Ym);
  let X2 = Number(Y1 - (-0.5 * X1 + map.Yots));
  let Y2 = Number(0.5 * X2 + map.Yots);

  /* console.log('x2,y2:', X2,Y2) */

  let RoX = (X2 - map.Xots) ^ (2 + (Y2 - map.Yots)) ^ 2 ^ 0.5;
  let Xr = Number(RoX / L); //'X ромба
  /* console.log('RoX, xr:', RoX, Xr) */

  // 'Пересечение "мышиной" оси || X и оси OY'
  X2 = map.Yots - (Y1 - (0.5 * X1 + map.Yots) + map.Yots);
  Y2 = -0.5 * X2 + map.Yots;
  /* console.log('x2, y2:', X2, Y2) */ let RoY =
    (X2 - map.Xots) ^ (2 + (Y2 - map.Yots)) ^ 2 ^ 0.5;
  let Yr = Number(RoY / L); //'Y ромба
  /* console.log('RoY, xyr:', RoY, Yr) */ // 'Центры ромба

  let Xrcm = Xrc + 2 * map.A * (Xr + Yr);
  let Yrcm = Yrc + map.A * (Xr - Yr);
  console.log(Xrcm, Yrcm);
  // 'Угол ромба
  let Lrm = Xrcm - 2 * map.A + 1;
  let Trm = Yrcm - map.A + 1;
  drawCircle(Xrcm, Yrcm, 5);
});
