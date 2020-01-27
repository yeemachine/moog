graphics.clear();
graphics.visible = false;
graphics.lineStyle(2, 0xffffff, 4);
graphics.alpha = 0;
graphics.moveTo(WIDTH * margin, HEIGHT * 0);
graphics.lineTo(WIDTH * margin, HEIGHT * 1);

let segmentDist = (WIDTH - WIDTH * margin * 2) / (fMajor.length - 2);
for (let i = 1; i < fMajor.length - 1; i++) {
  graphics.moveTo(WIDTH * margin + segmentDist * i, 0);
  graphics.lineTo(WIDTH * margin + segmentDist * i, HEIGHT);
}
