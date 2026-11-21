const WIDTH = 800;
const HEIGHT = 500;

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function stringSeed(text) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function roundedPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function roundedFill(ctx, x, y, width, height, radius, fill) {
  roundedPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function withShadow(ctx, blur, color, x, y, draw) {
  ctx.save();
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
  ctx.shadowOffsetX = x;
  ctx.shadowOffsetY = y;
  draw();
  ctx.restore();
}

function paper(ctx, x, y, width, height, color = '#d4c39b', angle = 0) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(angle);
  withShadow(ctx, 16, 'rgba(20, 20, 12, 0.35)', 5, 7, () => {
    ctx.fillStyle = color;
    ctx.fillRect(-width / 2, -height / 2, width, height);
  });
  ctx.strokeStyle = 'rgba(75, 59, 36, 0.22)';
  ctx.lineWidth = 1;
  ctx.strokeRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8);
  ctx.restore();
}

function typed(ctx, text, x, y, size = 13, color = '#27332c', align = 'left') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 ${size}px "Barlow Archive", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawLeaf(ctx, x, y, width, height, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(width * 0.48, -height * 0.48, width, -height * 0.12, width, 0);
  ctx.bezierCurveTo(width, height * 0.18, width * 0.42, height * 0.45, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = 'rgba(39, 66, 45, 0.72)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(1, 0);
  ctx.lineTo(width * 0.86, 0);
  ctx.stroke();
  ctx.restore();
}

function drawFern(ctx, changed) {
  ctx.save();
  ctx.translate(185, 250);
  ctx.rotate(-0.22);
  ctx.strokeStyle = '#546b3d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-74, 110);
  ctx.quadraticCurveTo(-5, 12, 30, -126);
  ctx.stroke();
  const missing = 6;
  for (let index = 0; index < 13; index += 1) {
    const progress = index / 12;
    const stemX = -64 + progress * 91;
    const stemY = 99 - progress * 213;
    const size = 34 - Math.abs(index - 6) * 2.2;
    if (!(changed && index === missing)) drawLeaf(ctx, stemX, stemY, -size, 18, -0.43, '#708052');
    drawLeaf(ctx, stemX + 2, stemY - 2, size, 18, 0.43, '#667a49');
  }
  ctx.restore();
}

function drawMoth(ctx, changed) {
  ctx.save();
  ctx.translate(471, 151);
  ctx.rotate(0.08);
  ctx.fillStyle = '#776244';
  ctx.beginPath();
  ctx.moveTo(-4, -5);
  ctx.bezierCurveTo(-24, -42, -81, -43, -93, -4);
  ctx.bezierCurveTo(-83, 31, -33, 37, -4, 13);
  ctx.bezierCurveTo(25, 37, 77, 31, 91, -4);
  ctx.bezierCurveTo(78, -42, 23, -42, 4, -5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ba8850';
  ctx.beginPath();
  ctx.ellipse(-46, -7, 20, 13, -0.25, 0, Math.PI * 2);
  ctx.ellipse(46, -7, 20, 13, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#21291f';
  ctx.beginPath();
  ctx.ellipse(-46, -7, 8, 6, 0, 0, Math.PI * 2);
  if (!changed) ctx.ellipse(46, -7, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2a2b21';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 25);
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-2, -18);
  ctx.quadraticCurveTo(-15, -35, -19, -37);
  ctx.moveTo(2, -18);
  ctx.quadraticCurveTo(15, -35, 19, -37);
  ctx.stroke();
  ctx.restore();
}

function drawMug(ctx, changed) {
  const x = 686;
  const y = 159;
  ctx.save();
  withShadow(ctx, 11, 'rgba(8, 12, 10, 0.35)', 4, 5, () => {
    ctx.fillStyle = '#d9ded0';
    ctx.beginPath();
    ctx.ellipse(x, y, 56, 28, -0.08, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#59432d';
  ctx.beginPath();
  ctx.ellipse(x, y - 2, 47, 20, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c9cfc2';
  ctx.lineWidth = 12;
  if (!changed) {
    ctx.beginPath();
    ctx.arc(x + 55, y + 5, 24, Math.PI * 0.55, Math.PI * 1.45);
    ctx.stroke();
  }
  ctx.strokeStyle = '#3f8178';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(x, y, 56, 28, -0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawCamera(ctx, changed) {
  ctx.save();
  ctx.translate(583, 344);
  ctx.rotate(0.05);
  withShadow(ctx, 13, 'rgba(9, 11, 8, 0.45)', 5, 7, () => {
    roundedFill(ctx, -77, -50, 154, 100, 10, '#202a28');
  });
  roundedFill(ctx, -53, -66, 67, 22, 4, '#38423e');
  ctx.fillStyle = '#111714';
  ctx.beginPath();
  ctx.arc(3, 2, 43, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9e946f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(3, 2, 31, 0, Math.PI * 2);
  ctx.stroke();
  const lens = ctx.createRadialGradient(-7, -8, 3, 3, 2, 26);
  lens.addColorStop(0, '#769698');
  lens.addColorStop(0.38, '#2f5556');
  lens.addColorStop(1, '#0c1717');
  ctx.fillStyle = lens;
  ctx.beginPath();
  ctx.arc(3, 2, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = changed ? '#363e38' : '#cf4d3f';
  ctx.beginPath();
  ctx.arc(50, -48, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawRuler(ctx, changed) {
  ctx.save();
  ctx.translate(252, 438);
  ctx.rotate(-0.025);
  withShadow(ctx, 6, 'rgba(15, 12, 7, 0.35)', 2, 3, () => {
    ctx.fillStyle = '#c5a456';
    ctx.fillRect(-151, -17, 302, 34);
  });
  ctx.strokeStyle = '#4a4229';
  ctx.lineWidth = 2;
  for (let index = 0; index <= 30; index += 1) {
    if (changed && index === 15) continue;
    const x = -145 + index * 9.7;
    const height = index % 5 === 0 ? 13 : index % 2 === 0 ? 9 : 6;
    ctx.beginPath();
    ctx.moveTo(x, -15);
    ctx.lineTo(x, -15 + height);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpool(ctx, changed) {
  const x = 682;
  const y = 421;
  withShadow(ctx, 8, 'rgba(18, 12, 8, 0.38)', 3, 4, () => {
    ctx.fillStyle = '#bca77c';
    ctx.fillRect(x - 31, y - 29, 62, 58);
  });
  ctx.fillStyle = changed ? '#344f69' : '#934638';
  ctx.fillRect(x - 26, y - 22, 52, 44);
  ctx.strokeStyle = changed ? '#728aa0' : '#c67a62';
  ctx.lineWidth = 1;
  for (let offset = -18; offset < 20; offset += 5) {
    ctx.beginPath();
    ctx.moveTo(x - 25, y + offset);
    ctx.lineTo(x + 25, y + offset + 3);
    ctx.stroke();
  }
  ctx.fillStyle = '#d0bd90';
  ctx.beginPath();
  ctx.ellipse(x, y - 29, 31, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(x, y + 29, 31, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCompass(ctx, changed) {
  const x = 724;
  const y = 303;
  withShadow(ctx, 9, 'rgba(10, 12, 8, 0.42)', 3, 4, () => {
    ctx.fillStyle = '#b9944f';
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#d6cfad';
  ctx.beginPath();
  ctx.arc(x, y, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#365047';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - 25);
  ctx.lineTo(x, y - 18);
  ctx.moveTo(x + 25, y);
  ctx.lineTo(x + 18, y);
  ctx.moveTo(x, y + 25);
  ctx.lineTo(x, y + 18);
  ctx.moveTo(x - 25, y);
  ctx.lineTo(x - 18, y);
  ctx.stroke();
  const angle = changed ? Math.PI : -Math.PI / 2;
  ctx.strokeStyle = '#bd473b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + Math.cos(angle) * 21, y + Math.sin(angle) * 21);
  ctx.stroke();
  ctx.fillStyle = '#24342e';
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpecimen(ctx, change) {
  const table = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  table.addColorStop(0, '#355c48');
  table.addColorStop(0.45, '#294e40');
  table.addColorStop(1, '#183c34');
  ctx.fillStyle = table;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = 'rgba(225, 213, 171, 0.08)';
  for (let y = 18; y < HEIGHT; y += 27) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(190, y - 7, 485, y + 9, WIDTH, y - 2);
    ctx.stroke();
  }
  paper(ctx, 53, 42, 307, 355, '#d7c89d', -0.032);
  paper(ctx, 317, 67, 95, 70, '#e1d5b8', 0.045);
  typed(ctx, change(2) ? 'OG-47 / L3' : 'OG-42 / L3', 365, 106, 16, '#34473c', 'center');
  typed(ctx, 'M. ALBARENSIS', 365, 124, 9, '#7c6c50', 'center');
  drawFern(ctx, change(0));
  paper(ctx, 393, 60, 153, 185, '#b6a77e', -0.015);
  drawMoth(ctx, change(1));
  drawMug(ctx, change(3));
  drawCamera(ctx, change(4));
  drawRuler(ctx, change(5));
  drawSpool(ctx, change(6));
  drawCompass(ctx, change(9));

  paper(ctx, 68, 356, 128, 73, '#e5d7b3', 0.06);
  typed(ctx, 'RIVER MILE 12', 132, 389, 12, '#6c5037', 'center');
  typed(ctx, change(8) ? 'CANOPY / 07:10' : 'CANOPY / 06:40', 132, 406, 9, '#725f47', 'center');
  ctx.strokeStyle = '#cfb36d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(558, 71);
  ctx.bezierCurveTo(588, 43, 617, 63, 638, 47);
  ctx.bezierCurveTo(661, 29, 692, 47, 711, 75);
  ctx.stroke();
  for (let index = 0; index < 7; index += 1) {
    const x = 557 + index * 25;
    const swatches = ['#b95a43', '#d3a458', '#c7c3a2', '#4d7661', '#335c56', '#40516e', '#73514e'];
    ctx.fillStyle = change(7) && index === 2 ? '#b65348' : swatches[index];
    ctx.fillRect(x, 72, 21, 25);
  }
  typed(ctx, 'COLOR / HUMID', 637, 112, 10, '#bbc5b4', 'center');
}

function lantern(ctx, x, y, color, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  const glow = ctx.createRadialGradient(0, 5, 4, 0, 5, 43);
  glow.addColorStop(0, `${color}aa`);
  glow.addColorStop(1, 'rgba(255, 170, 80, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(-48, -40, 96, 96);
  ctx.strokeStyle = '#241d18';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -44);
  ctx.lineTo(0, -25);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 235, 186, 0.62)';
  ctx.lineWidth = 2;
  for (let offset = -12; offset <= 12; offset += 8) {
    ctx.beginPath();
    ctx.moveTo(offset, -26);
    ctx.quadraticCurveTo(offset + 5, 0, offset, 27);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBicycle(ctx, changed) {
  ctx.save();
  ctx.strokeStyle = '#bac6bd';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(493, 390, 39, 0, Math.PI * 2);
  ctx.arc(577, 390, 39, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#7c3633';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(493, 390);
  ctx.lineTo(530, 338);
  ctx.lineTo(557, 390);
  ctx.lineTo(493, 390);
  ctx.lineTo(540, 390);
  ctx.moveTo(530, 338);
  ctx.lineTo(574, 333);
  ctx.lineTo(577, 390);
  ctx.stroke();
  ctx.strokeStyle = '#d0d0bc';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(566, 328);
  ctx.lineTo(588, 323);
  ctx.stroke();
  if (!changed) {
    ctx.fillStyle = '#786947';
    roundedFill(ctx, 555, 335, 49, 31, 3, '#786947');
    ctx.strokeStyle = '#c0a46b';
    ctx.lineWidth = 2;
    for (let x = 562; x < 602; x += 9) {
      ctx.beginPath();
      ctx.moveTo(x, 338);
      ctx.lineTo(x - 3, 362);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawCat(ctx, changed) {
  ctx.save();
  ctx.translate(701, 395);
  ctx.fillStyle = '#171b18';
  ctx.beginPath();
  ctx.ellipse(0, 14, 24, 35, -0.15, 0, Math.PI * 2);
  ctx.arc(-4, -18, 18, 0, Math.PI * 2);
  ctx.moveTo(-18, -28);
  ctx.lineTo(-14, -50);
  ctx.lineTo(-2, -34);
  ctx.moveTo(9, -34);
  ctx.lineTo(20, -50);
  ctx.lineTo(19, -25);
  ctx.fill();
  ctx.strokeStyle = '#171b18';
  ctx.lineWidth = 11;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(15, 25);
  ctx.bezierCurveTo(changed ? 72 : 52, changed ? 40 : -10, changed ? 63 : 75, changed ? -20 : 24, changed ? 47 : 59, changed ? -29 : 2);
  ctx.stroke();
  ctx.fillStyle = '#d7b65d';
  ctx.beginPath();
  ctx.arc(-10, -20, 2, 0, Math.PI * 2);
  ctx.arc(2, -20, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawMarket(ctx, change) {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#152b37');
  sky.addColorStop(0.55, '#27352f');
  sky.addColorStop(1, '#17201f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#212a26';
  ctx.fillRect(0, 145, WIDTH, 232);
  for (let x = 12; x < WIDTH; x += 58) {
    ctx.fillStyle = change(9) && x === 708 ? '#b99155' : x % 116 === 12 ? '#2c3b34' : '#18231f';
    ctx.fillRect(x, 160, 43, 97);
  }
  const street = ctx.createLinearGradient(0, 330, 0, 500);
  street.addColorStop(0, '#293a35');
  street.addColorStop(1, '#121b1a');
  ctx.fillStyle = street;
  ctx.fillRect(0, 330, WIDTH, 170);
  ctx.globalAlpha = 0.22;
  ['#e7a34f', '#5ba6a2', '#cc4e43'].forEach((color, index) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(75 + index * 235, 355);
    ctx.lineTo(140 + index * 225, 355);
    ctx.lineTo(198 + index * 205, 500);
    ctx.lineTo(18 + index * 232, 500);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  ctx.strokeStyle = '#111b18';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 26);
  ctx.bezierCurveTo(250, 54, 530, 4, 800, 35);
  ctx.stroke();
  const lanterns = [
    [123, 96, change(0) ? '#dfa642' : '#416f92', 1.08],
    [254, 78, '#d45643', 0.88],
    [381, 91, '#e2aa4e', 1],
    [540, 75, '#4e8f7a', 0.86],
    [692, 93, '#d35b48', 1.03],
  ];
  for (const [x, y, color, scale] of lanterns) lantern(ctx, x, y, color, scale);

  ctx.fillStyle = '#7d3e32';
  ctx.beginPath();
  ctx.moveTo(300, 137);
  ctx.lineTo(527, 128);
  ctx.lineTo(555, 217);
  ctx.lineTo(276, 218);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#d7a261';
  ctx.lineWidth = 11;
  for (let x = 306; x < 530; x += 38) {
    ctx.beginPath();
    ctx.moveTo(x, 139);
    ctx.lineTo(x - 12, 214);
    ctx.stroke();
  }
  if (change(6)) {
    ctx.strokeStyle = '#d7c49a';
    ctx.lineWidth = 3;
    ctx.strokeRect(448, 92, 31, 30);
    ctx.beginPath();
    ctx.moveTo(448, 107);
    ctx.lineTo(479, 107);
    ctx.moveTo(463, 92);
    ctx.lineTo(463, 122);
    ctx.stroke();
  }

  ctx.fillStyle = '#d5c18e';
  ctx.fillRect(298, 151, 93, 54);
  typed(ctx, 'FRESH', 344, 174, 14, '#2d594e', 'center');
  ctx.fillStyle = '#4f7d72';
  ctx.beginPath();
  ctx.ellipse(344, 189, 29, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d5c18e';
  ctx.lineWidth = 2;
  for (let index = 0; index < (change(1) ? 4 : 5); index += 1) {
    ctx.beginPath();
    ctx.arc(328 + index * 8, 189, 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#2c4d44';
  ctx.fillRect(96, 239, 244, 126);
  ctx.fillStyle = '#c08a4d';
  ctx.fillRect(80, 350, 274, 38);
  ctx.fillStyle = '#8b5d34';
  ctx.fillRect(175, 348, 112, 61);
  const fruit = [
    [194, 364], [218, 364], [242, 364], [266, 364],
    [205, 344], [230, 344], [255, 344],
    [218, 324], [244, 324],
    [231, 305],
  ];
  fruit.forEach(([x, y], index) => {
    if (change(5) && index === 5) return;
    ctx.fillStyle = index % 3 === 0 ? '#dd7844' : index % 3 === 1 ? '#d19f44' : '#ba593c';
    ctx.beginPath();
    ctx.ellipse(x, y + 35, 13, 17, 0.12, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#3b5650';
  ctx.fillRect(587, 159, 88, 76);
  ctx.fillStyle = '#d5c596';
  ctx.beginPath();
  ctx.arc(632, 104, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#27443d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(632, 104, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(632, 104);
  ctx.lineTo(change(2) ? 648 : 632, change(2) ? 119 : 82);
  ctx.moveTo(632, 104);
  ctx.lineTo(617, 111);
  ctx.stroke();

  drawBicycle(ctx, change(4));
  drawCat(ctx, change(3));

  ctx.strokeStyle = '#8aa46d';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(57, 332);
  ctx.quadraticCurveTo(63, 304, 62, 275);
  ctx.stroke();
  for (let index = 0; index < 7; index += 1) {
    if (change(7) && index === 3) continue;
    const y = 318 - index * 7;
    drawLeaf(ctx, 61, y, index % 2 === 0 ? 19 : -19, 11, index % 2 === 0 ? -0.38 : 0.38, '#718b58');
  }

  ctx.strokeStyle = 'rgba(229, 226, 203, 0.35)';
  ctx.lineWidth = 5;
  for (let index = 0; index < 4; index += 1) {
    if (change(8) && index === 2) continue;
    ctx.beginPath();
    ctx.moveTo(385 + index * 13, 337);
    ctx.bezierCurveTo(367 + index * 14, 299, 408 + index * 12, 279, 391 + index * 15, 243);
    ctx.stroke();
  }
}

function drawGull(ctx, x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = '#e2ded0';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-10, -9, -22, 0);
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(10, -9, 22, 0);
  ctx.stroke();
  ctx.restore();
}

function drawWeather(ctx, change) {
  const sky = ctx.createLinearGradient(0, 0, 0, 305);
  sky.addColorStop(0, '#768a8c');
  sky.addColorStop(0.45, '#536d72');
  sky.addColorStop(1, '#9fa99d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, 305);
  ctx.fillStyle = '#496b6c';
  ctx.fillRect(0, 211, WIDTH, 94);
  ctx.fillStyle = '#385957';
  for (let y = 220; y < 300; y += 15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= WIDTH; x += 40) ctx.lineTo(x, y + Math.sin((x + y) * 0.045) * 7);
    ctx.lineTo(WIDTH, y + 18);
    ctx.lineTo(0, y + 18);
    ctx.fill();
  }
  ctx.fillStyle = '#263d38';
  ctx.beginPath();
  ctx.moveTo(0, 258);
  ctx.lineTo(72, 206);
  ctx.lineTo(128, 215);
  ctx.lineTo(196, 270);
  ctx.lineTo(0, 294);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#c5c0a8';
  ctx.fillRect(108, 153, 31, 75);
  ctx.fillStyle = '#7a4434';
  ctx.beginPath();
  ctx.moveTo(105, 154);
  ctx.lineTo(124, 133);
  ctx.lineTo(143, 154);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(238, 223, 151, 0.45)';
  ctx.beginPath();
  ctx.moveTo(126, 159);
  ctx.lineTo(change(0) ? 248 : 46, change(0) ? 208 : 183);
  ctx.lineTo(change(0) ? 237 : 50, change(0) ? 224 : 196);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#253c36';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(218, 158);
  ctx.lineTo(218, 103);
  ctx.stroke();
  ctx.fillStyle = '#b94c3e';
  ctx.beginPath();
  ctx.moveTo(218, 105);
  ctx.lineTo(270, 117);
  if (change(1)) {
    ctx.lineTo(218, 134);
  } else {
    ctx.lineTo(251, 121);
    ctx.lineTo(218, 136);
  }
  ctx.closePath();
  ctx.fill();

  drawGull(ctx, 575, 121, 0.7);
  drawGull(ctx, 626, 146, 0.82);
  if (!change(5)) drawGull(ctx, 603, 100, 0.55);

  ctx.fillStyle = '#293f3c';
  ctx.fillRect(691, 205, 72, 18);
  ctx.fillStyle = '#ddd3ad';
  ctx.fillRect(704, 185, 38, 20);
  ctx.fillStyle = change(6) ? '#e6e2d4' : '#c58740';
  ctx.fillRect(716, 166, 14, 19);
  ctx.strokeStyle = '#222f2d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(691, 223);
  ctx.lineTo(763, 223);
  ctx.stroke();

  ctx.fillStyle = '#293932';
  ctx.fillRect(0, 0, 16, 500);
  ctx.fillRect(784, 0, 16, 500);
  ctx.fillRect(0, 292, 800, 23);
  ctx.fillRect(391, 0, 18, 305);

  const desk = ctx.createLinearGradient(0, 305, 0, 500);
  desk.addColorStop(0, '#6d6045');
  desk.addColorStop(1, '#3e382c');
  ctx.fillStyle = desk;
  ctx.fillRect(0, 315, 800, 185);
  paper(ctx, 252, 322, 211, 145, '#c9c09e', -0.04);
  typed(ctx, change(8) ? 'CAP LOPEZ / TEMPERATURE' : 'CAP LOPEZ / PRESSURE', 355, 345, 11, '#3b5148', 'center');
  ctx.strokeStyle = '#5d796f';
  ctx.lineWidth = 2;
  const lines = [
    [274, 369, 426, 377],
    [270, 395, 428, 392],
    [278, 420, 420, 414],
    [292, 448, 400, 438],
  ];
  lines.forEach(([x1, y1, x2, y2], index) => {
    if (change(4) && index === 1) return;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1, y1, (x1 + x2) / 2, y1 - 14 + index * 5, x2, y2);
    ctx.stroke();
  });

  withShadow(ctx, 10, 'rgba(8, 10, 8, 0.4)', 4, 5, () => roundedFill(ctx, 446, 345, 143, 107, 7, '#202c29'));
  ctx.fillStyle = '#94825a';
  ctx.fillRect(463, 360, 109, 32);
  typed(ctx, '6.1 MHz', 518, 383, 18, '#252d29', 'center');
  ctx.strokeStyle = '#d2be79';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(514, 417, 24, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = change(3) ? '#7eb3aa' : '#d14f42';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const dialAngle = change(3) ? -0.55 : 0.18;
  ctx.moveTo(514, 417);
  ctx.lineTo(514 + Math.cos(dialAngle) * 20, 417 + Math.sin(dialAngle) * 20);
  ctx.stroke();

  ctx.fillStyle = '#9b895b';
  ctx.fillRect(651, 340, 49, 99);
  ctx.fillStyle = '#d4d0b4';
  ctx.fillRect(665, 350, 21, 73);
  ctx.fillStyle = '#537e7b';
  ctx.fillRect(668, change(2) ? 374 : 392, 15, change(2) ? 46 : 28);
  ctx.strokeStyle = '#332e22';
  ctx.lineWidth = 2;
  ctx.strokeRect(665, 350, 21, 73);
  typed(ctx, 'RAIN', 676, 454, 10, '#d8c99c', 'center');

  withShadow(ctx, 8, 'rgba(8, 10, 8, 0.38)', 3, 4, () => {
    ctx.fillStyle = '#b69b61';
    ctx.beginPath();
    ctx.arc(82, 408, 38, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#ded5b3';
  ctx.beginPath();
  ctx.arc(82, 408, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#324b43';
  ctx.lineWidth = 2;
  for (let index = 0; index < 7; index += 1) {
    const angle = Math.PI * 0.74 + index * 0.26;
    ctx.beginPath();
    ctx.moveTo(82 + Math.cos(angle) * 22, 408 + Math.sin(angle) * 22);
    ctx.lineTo(82 + Math.cos(angle) * 27, 408 + Math.sin(angle) * 27);
    ctx.stroke();
  }
  const barometerAngle = change(9) ? Math.PI * 0.9 : Math.PI * 0.28;
  ctx.strokeStyle = '#bd4b3e';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(82, 408);
  ctx.lineTo(82 + Math.cos(barometerAngle) * 23, 408 + Math.sin(barometerAngle) * 23);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(223, 232, 224, 0.27)';
  ctx.lineWidth = 1;
  for (let x = 15; x < 785; x += 24) {
    if (change(7) && x === 63) continue;
    ctx.beginPath();
    ctx.moveTo(x, 10);
    ctx.lineTo(x - 19, 115);
    ctx.stroke();
  }
}

function drawHeron(ctx, changed) {
  ctx.save();
  ctx.translate(662, 130);
  ctx.fillStyle = '#c7c9b4';
  ctx.beginPath();
  ctx.ellipse(0, 18, 18, 35, -0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c7c9b4';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, -6);
  ctx.quadraticCurveTo(4, -34, 20, -45);
  ctx.stroke();
  ctx.fillStyle = '#d5d0b5';
  ctx.beginPath();
  ctx.arc(22, -47, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c77d3e';
  ctx.beginPath();
  ctx.moveTo(changed ? 15 : 30, -48);
  ctx.lineTo(changed ? -18 : 61, -43);
  ctx.lineTo(changed ? 15 : 30, -39);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#cabd8b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-8, 47);
  ctx.lineTo(-12, 82);
  ctx.moveTo(8, 47);
  ctx.lineTo(15, 82);
  ctx.stroke();
  ctx.restore();
}

function drawFerry(ctx, change) {
  const sky = ctx.createLinearGradient(0, 0, 0, 270);
  sky.addColorStop(0, '#546f77');
  sky.addColorStop(0.54, '#c28a64');
  sky.addColorStop(1, '#d6ad75');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, 270);

  ctx.fillStyle = '#e1a155';
  ctx.beginPath();
  ctx.arc(704, change(6) ? 57 : 88, 35, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(228, 180, 107, 0.22)';
  ctx.fillRect(0, 94, WIDTH, 90);

  ctx.fillStyle = '#1e413a';
  ctx.beginPath();
  ctx.moveTo(0, 164);
  for (let x = 0; x <= WIDTH; x += 24) ctx.lineTo(x, 135 + Math.sin(x * 0.071) * 18 + (x % 72 === 0 ? -31 : 0));
  ctx.lineTo(WIDTH, 254);
  ctx.lineTo(0, 254);
  ctx.closePath();
  ctx.fill();

  const water = ctx.createLinearGradient(0, 210, 0, HEIGHT);
  water.addColorStop(0, '#426b67');
  water.addColorStop(1, '#173d3b');
  ctx.fillStyle = water;
  ctx.fillRect(0, 210, WIDTH, 290);
  ctx.strokeStyle = 'rgba(211, 193, 142, 0.24)';
  ctx.lineWidth = 2;
  for (let y = 226; y < 500; y += 19) {
    ctx.beginPath();
    for (let x = -20; x <= WIDTH + 20; x += 28) {
      const waveY = y + Math.sin((x + y) * 0.043) * 5;
      if (x === -20) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = '#294a3c';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(48, 0);
  ctx.bezierCurveTo(65, 73, 51, 135, 72, 238);
  ctx.stroke();
  ctx.strokeStyle = '#355b48';
  ctx.lineWidth = 4;
  for (let index = 0; index < 9; index += 1) {
    const y = 63 + index * 17;
    ctx.beginPath();
    ctx.moveTo(62, y);
    ctx.quadraticCurveTo(91, y - 17, 117, y - 6);
    ctx.stroke();
    if (!(change(3) && index === 6)) drawLeaf(ctx, 91 + index * 1.5, y - 12, 25, 14, -0.25, '#54755a');
  }
  if (!change(3)) drawLeaf(ctx, 82, 191, 34, 18, -0.42, '#719065');

  ctx.fillStyle = '#504534';
  ctx.fillRect(84, 105, 95, 59);
  ctx.fillStyle = '#a36a41';
  ctx.beginPath();
  ctx.moveTo(73, 105);
  ctx.lineTo(131, 73);
  ctx.lineTo(190, 105);
  ctx.closePath();
  ctx.fill();
  if (!change(9)) {
    ctx.fillStyle = '#c49b62';
    ctx.fillRect(119, 66, 24, 20);
    ctx.fillStyle = '#644936';
    ctx.beginPath();
    ctx.moveTo(114, 67);
    ctx.lineTo(131, 53);
    ctx.lineTo(148, 67);
    ctx.closePath();
    ctx.fill();
  }

  withShadow(ctx, 15, 'rgba(4, 16, 14, 0.48)', 5, 8, () => {
    ctx.fillStyle = '#765139';
    ctx.beginPath();
    ctx.moveTo(102, 276);
    ctx.lineTo(727, 276);
    ctx.lineTo(679, 438);
    ctx.lineTo(155, 438);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#a27249';
  ctx.fillRect(114, 258, 603, 49);
  ctx.strokeStyle = '#4d372a';
  ctx.lineWidth = 4;
  for (let x = 135; x < 708; x += 47) {
    ctx.beginPath();
    ctx.moveTo(x, 261);
    ctx.lineTo(x - 12, 431);
    ctx.stroke();
  }

  ctx.fillStyle = '#e0d2a6';
  ctx.beginPath();
  ctx.arc(156, 337, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#bd493e';
  ctx.beginPath();
  ctx.arc(156, 337, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#765139';
  ctx.beginPath();
  ctx.arc(156, 337, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#e7d9af';
  ctx.lineWidth = 9;
  [0.32, 1.9, 3.46, 5.05].forEach((angle, index) => {
    if (change(0) && index === 1) return;
    ctx.beginPath();
    ctx.arc(156, 337, 31, angle, angle + 0.37);
    ctx.stroke();
  });

  ctx.fillStyle = change(7) ? '#d49a4f' : '#4b8d73';
  roundedFill(ctx, 238, 278, 39, 55, 7, ctx.fillStyle);
  ctx.fillStyle = '#e8d48c';
  ctx.fillRect(248, 270, 19, 9);
  ctx.strokeStyle = '#40392a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(257, 268);
  ctx.lineTo(257, 249);
  ctx.stroke();

  ctx.strokeStyle = '#c5ab6f';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(296, 278);
  ctx.lineTo(386, 408);
  ctx.stroke();
  if (!change(2)) {
    ctx.fillStyle = '#b98a4d';
    ctx.beginPath();
    ctx.ellipse(400, 426, 23, 42, -0.57, 0, Math.PI * 2);
    ctx.fill();
  }

  roundedFill(ctx, 444, 344, 99, 76, 4, '#8d633e');
  ctx.strokeStyle = '#cfab69';
  ctx.lineWidth = 3;
  ctx.strokeRect(451, 351, 85, 62);
  typed(ctx, change(4) ? 'D-81' : 'D-31', 494, 391, 18, '#ead6a0', 'center');

  ctx.fillStyle = '#9a7a4d';
  ctx.beginPath();
  ctx.ellipse(589, 379, 48, 29, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#cfb778';
  ctx.lineWidth = 2;
  for (let x = 553; x < 628; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 357);
    ctx.lineTo(x + 6, 398);
    ctx.stroke();
  }
  const fishCount = change(5) ? 3 : 4;
  for (let index = 0; index < fishCount; index += 1) {
    ctx.fillStyle = '#bfc7ba';
    ctx.beginPath();
    ctx.ellipse(565 + index * 16, 371 + (index % 2) * 10, 11, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#b89d67';
  ctx.fillRect(385, 416, 39, 12);
  ctx.strokeStyle = '#d8bd7b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(405, 422);
  ctx.bezierCurveTo(383, 407, 380, 442, 405, 429);
  if (change(8)) ctx.bezierCurveTo(430, 445, 432, 405, 407, 417);
  ctx.stroke();

  drawHeron(ctx, change(1));
}

function drawCamp(ctx, change) {
  const dusk = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  dusk.addColorStop(0, '#263f47');
  dusk.addColorStop(0.5, '#314b3e');
  dusk.addColorStop(1, '#142b24');
  ctx.fillStyle = dusk;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#e5d39d';
  ctx.beginPath();
  if (change(7)) ctx.arc(694, 75, 22, 0, Math.PI * 2);
  else {
    ctx.arc(694, 75, 24, -Math.PI / 2, Math.PI / 2);
    ctx.arc(684, 75, 20, Math.PI / 2, -Math.PI / 2, true);
  }
  ctx.fill();

  ctx.fillStyle = '#18372d';
  for (let x = -25; x < WIDTH + 40; x += 44) {
    ctx.beginPath();
    ctx.ellipse(x, 96 + Math.sin(x) * 9, 58, 35, (x % 3) * 0.13, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#1b2e27';
  ctx.fillRect(0, 436, WIDTH, 64);
  ctx.strokeStyle = '#2d4d3c';
  ctx.lineWidth = 24;
  ctx.beginPath();
  ctx.moveTo(55, 0);
  ctx.lineTo(67, 433);
  ctx.moveTo(753, 0);
  ctx.lineTo(729, 440);
  ctx.stroke();

  if (change(9)) {
    ctx.fillStyle = '#6fa35e';
    ctx.beginPath();
    ctx.ellipse(64, 193, 16, 7, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#a9c66f';
    ctx.beginPath();
    ctx.arc(48, 196, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#334a32';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(87, 375);
  ctx.quadraticCurveTo(95, 312, 102, 246);
  ctx.stroke();
  for (let index = 0; index < 7; index += 1) {
    drawLeaf(ctx, 100, 352 - index * 17, index % 2 === 0 ? 24 : -24, 14, index % 2 === 0 ? -0.3 : 0.3, '#54714a');
  }
  for (let index = 0; index < (change(2) ? 2 : 3); index += 1) {
    const x = 90 + index * 14;
    const y = 277 - index * 13;
    ctx.fillStyle = '#e4ddd0';
    for (let petal = 0; petal < 5; petal += 1) {
      const angle = (petal / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 6, y + Math.sin(angle) * 6, 5, 3, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ce8d4d';
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  withShadow(ctx, 18, 'rgba(4, 11, 8, 0.5)', 5, 8, () => {
    ctx.fillStyle = '#9d865d';
    ctx.beginPath();
    ctx.moveTo(183, 368);
    ctx.lineTo(346, 146);
    ctx.lineTo(526, 369);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = '#b9a270';
  ctx.beginPath();
  ctx.moveTo(346, 146);
  ctx.lineTo(526, 369);
  ctx.lineTo(347, 369);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#4b3b2d';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(346, 146);
  ctx.lineTo(347, 369);
  ctx.stroke();
  if (change(0)) {
    ctx.fillStyle = '#6d775d';
    ctx.fillRect(329, 215, 43, 35);
    ctx.strokeStyle = '#d0bf88';
    ctx.lineWidth = 2;
    ctx.strokeRect(333, 219, 35, 27);
  }

  ctx.strokeStyle = '#2b3227';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(503, 0);
  ctx.lineTo(503, 81);
  ctx.stroke();
  const lampGlow = ctx.createRadialGradient(503, 113, 4, 503, 113, 63);
  lampGlow.addColorStop(0, change(1) ? 'rgba(102, 191, 139, 0.7)' : 'rgba(246, 180, 82, 0.7)');
  lampGlow.addColorStop(1, 'rgba(240, 174, 75, 0)');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(440, 50, 126, 126);
  roundedFill(ctx, 485, 83, 36, 57, 8, change(1) ? '#5e9872' : '#cf8745');
  ctx.strokeStyle = '#d9c88c';
  ctx.lineWidth = 4;
  ctx.strokeRect(492, 91, 22, 39);

  ctx.fillStyle = '#5a442f';
  ctx.fillRect(382, 320, 201, 26);
  ctx.fillRect(398, 346, 14, 91);
  ctx.fillRect(553, 346, 14, 91);
  paper(ctx, 397, 293, 92, 75, '#d1c49b', -0.03);
  ctx.strokeStyle = '#65776b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(412, 317);
  ctx.lineTo(470, 311);
  ctx.moveTo(417, 333);
  ctx.lineTo(473, 339);
  ctx.stroke();
  if (!change(4)) {
    ctx.strokeStyle = '#c34d3d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(414, 347);
    ctx.bezierCurveTo(429, 333, 444, 357, 474, 326);
    ctx.stroke();
  }

  ctx.fillStyle = '#232d29';
  roundedFill(ctx, 526, 298, 58, 37, 7, '#232d29');
  ctx.strokeStyle = '#a99461';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(541, 316, 11, 0, Math.PI * 2);
  ctx.arc(567, 316, 11, 0, Math.PI * 2);
  ctx.stroke();
  if (change(8)) {
    ctx.fillStyle = '#4a3428';
    ctx.beginPath();
    ctx.arc(550, 348, 14, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#252a24';
  ctx.beginPath();
  ctx.ellipse(624, 382, 35, 26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b9a36a';
  ctx.fillRect(606, 350, 36, 11);
  if (!change(3)) {
    ctx.strokeStyle = '#c4a55d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(624, 365, 33, Math.PI, 0);
    ctx.stroke();
  }

  ctx.fillStyle = '#3a3329';
  ctx.beginPath();
  ctx.moveTo(691, 391);
  ctx.lineTo(747, 391);
  ctx.lineTo(756, 437);
  ctx.lineTo(703, 437);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#c2ad77';
  ctx.lineWidth = 2;
  for (let index = 0; index < 5; index += 1) {
    if (change(5) && index === 2) continue;
    ctx.beginPath();
    ctx.moveTo(707, 403 + index * 6);
    ctx.lineTo(739, 411 + index * 6);
    ctx.moveTo(739, 403 + index * 6);
    ctx.lineTo(707, 411 + index * 6);
    ctx.stroke();
  }

  const fireGlow = ctx.createRadialGradient(239, 409, 8, 239, 409, 82);
  fireGlow.addColorStop(0, 'rgba(242, 159, 64, 0.58)');
  fireGlow.addColorStop(1, 'rgba(220, 104, 46, 0)');
  ctx.fillStyle = fireGlow;
  ctx.fillRect(157, 327, 164, 164);
  ctx.strokeStyle = '#5f3c2a';
  ctx.lineWidth = 15;
  [-22, 0, 22].forEach((offset, index) => {
    if (change(6) && index === 1) return;
    ctx.beginPath();
    ctx.moveTo(206 + offset, 432 - offset * 0.15);
    ctx.lineTo(271 + offset, 412 + offset * 0.15);
    ctx.stroke();
  });
  ctx.fillStyle = '#d9683b';
  ctx.beginPath();
  ctx.moveTo(238, 416);
  ctx.bezierCurveTo(211, 391, 238, 360, 246, 383);
  ctx.bezierCurveTo(272, 363, 275, 405, 238, 416);
  ctx.fill();
  ctx.fillStyle = '#efad50';
  ctx.beginPath();
  ctx.moveTo(239, 411);
  ctx.bezierCurveTo(225, 397, 242, 380, 247, 398);
  ctx.bezierCurveTo(254, 402, 248, 412, 239, 411);
  ctx.fill();
}

const drawers = {
  specimen: drawSpecimen,
  market: drawMarket,
  weather: drawWeather,
  ferry: drawFerry,
  camp: drawCamp,
};

function finishExposure(ctx, sceneId) {
  const random = seeded(stringSeed(sceneId));
  ctx.save();
  ctx.globalCompositeOperation = 'soft-light';
  for (let index = 0; index < 1350; index += 1) {
    const value = random();
    ctx.fillStyle = value > 0.53 ? 'rgba(255,244,214,0.13)' : 'rgba(8,19,16,0.11)';
    const size = random() > 0.88 ? 2 : 1;
    ctx.fillRect(Math.floor(random() * WIDTH), Math.floor(random() * HEIGHT), size, size);
  }
  ctx.globalCompositeOperation = 'source-over';
  const vignette = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 150, WIDTH / 2, HEIGHT / 2, 520);
  vignette.addColorStop(0, 'rgba(4, 12, 10, 0)');
  vignette.addColorStop(0.66, 'rgba(4, 12, 10, 0.06)');
  vignette.addColorStop(1, 'rgba(3, 10, 8, 0.49)');
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(223, 167, 92, 0.045)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.restore();
}

function foundMarker(ctx, difference, number) {
  ctx.save();
  ctx.translate(difference.x, difference.y);
  ctx.strokeStyle = '#ee4f3f';
  ctx.fillStyle = '#ee4f3f';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(0, 0, difference.r * 1.08, difference.r * 0.89, -0.18, 0.12, Math.PI * 2 + 0.02);
  ctx.stroke();
  ctx.globalAlpha = 0.62;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(2, -1, difference.r * 0.96, difference.r, 0.14, -0.08, Math.PI * 2 - 0.2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(difference.r * 0.75, -difference.r * 0.78, 12, 0, Math.PI * 2);
  ctx.fill();
  typed(ctx, String(number), difference.r * 0.75, -difference.r * 0.78 + 5, 13, '#f8e7c5', 'center');
  ctx.restore();
}

function hintMarker(ctx, difference) {
  ctx.save();
  ctx.translate(difference.x, difference.y);
  ctx.strokeStyle = '#f1d27b';
  ctx.lineWidth = 3;
  ctx.setLineDash([7, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, difference.r * 1.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(241, 210, 123, 0.12)';
  ctx.beginPath();
  ctx.arc(0, 0, difference.r * 1.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function keyboardReticle(ctx, reticle) {
  if (!reticle?.visible) return;
  ctx.save();
  ctx.translate(reticle.x, reticle.y);
  ctx.strokeStyle = '#f5df9b';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.moveTo(-27, 0);
  ctx.lineTo(-10, 0);
  ctx.moveTo(10, 0);
  ctx.lineTo(27, 0);
  ctx.moveTo(0, -27);
  ctx.lineTo(0, -10);
  ctx.moveTo(0, 10);
  ctx.lineTo(0, 27);
  ctx.stroke();
  ctx.restore();
}

export function drawExposure(canvas, scene, changed, view) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  const change = (index) => changed && (view.activeIndices ? view.activeIndices.has(index) : index < view.differenceCount);
  drawers[scene.id](ctx, change);
  finishExposure(ctx, scene.id);
  for (const index of view.found) foundMarker(ctx, scene.differences[index], index + 1);
  if (view.hintIndex !== null && !view.found.has(view.hintIndex)) hintMarker(ctx, scene.differences[view.hintIndex]);
  keyboardReticle(ctx, view.reticle);
}

export function buildDifferenceMasks(scene) {
  return scene.differences.map((difference, differenceIndex) => {
    const left = document.createElement('canvas');
    const right = document.createElement('canvas');
    left.width = right.width = WIDTH;
    left.height = right.height = HEIGHT;
    const view = {
      found: new Set(),
      hintIndex: null,
      reticle: null,
      differenceCount: 0,
      activeIndices: new Set([differenceIndex]),
    };
    drawExposure(left, scene, false, view);
    drawExposure(right, scene, true, view);
    const original = left.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT).data;
    const changed = right.getContext('2d').getImageData(0, 0, WIDTH, HEIGHT).data;
    const pixels = new Uint8Array(WIDTH * HEIGHT);
    for (let pixel = 0; pixel < pixels.length; pixel += 1) {
      const offset = pixel * 4;
      const delta = Math.abs(original[offset] - changed[offset])
        + Math.abs(original[offset + 1] - changed[offset + 1])
        + Math.abs(original[offset + 2] - changed[offset + 2]);
      if (delta >= 18) pixels[pixel] = 1;
    }
    return { difference, pixels };
  });
}
