
// 屏幕飘落————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
// 声明全局变量
var stop, staticx;

// 创建图片对象
var img = new Image();
// 图片地址
img.src = "./images/c13.png";  

// 落樱对象构造函数
function Sakura(x, y, s, r, fn) {
  this.x = x;
  this.y = y;
  this.s = s;
  this.r = r;
  this.fn = fn;
}

// 添加绘制方法
Sakura.prototype.draw = function (cxt) {
  cxt.save();
  var xc = 40 * this.s / 4;
  cxt.translate(this.x, this.y);
  cxt.rotate(this.r);
  cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s);
  cxt.restore();
}

// 添加更新方法
Sakura.prototype.update = function () {
  this.x = this.fn.x(this.x, this.y);
  this.y = this.fn.y(this.y, this.y);
  this.r = this.fn.r(this.r);
  // 如果超出窗口范围，则重新设置位置和角度
  if (this.x > window.innerWidth ||
    this.x < 0 ||
    this.y > window.innerHeight ||
    this.y < 0
  ) {
    this.r = getRandom('fnr');
    if (Math.random() > 0.4) {
      this.x = getRandom('x');
      this.y = 0;
      this.s = getRandom('s');
      this.r = getRandom('r');
    } else {
      this.x = window.innerWidth;
      this.y = getRandom('y');
      this.s = getRandom('s');
      this.r = getRandom('r');
    }
  }
}

// 落樱列表对象
SakuraList = function () {
  this.list = [];
}

// 添加落樱对象到列表中
SakuraList.prototype.push = function (sakura) {
  this.list.push(sakura);
}

// 更新落樱列表中所有落樱对象的状态
SakuraList.prototype.update = function () {
  for (var i = 0, len = this.list.length; i < len; i++) {
    this.list[i].update();
  }
}

// 绘制落樱列表中所有落樱对象
SakuraList.prototype.draw = function (cxt) {
  for (var i = 0, len = this.list.length; i < len; i++) {
    this.list[i].draw(cxt);
  }
}

// 生成随机数或者随机运动函数
function getRandom(option) {
  var ret, random;
  switch (option) {
    case 'x':
      ret = Math.random() * window.innerWidth;
      break;
    case 'y':
      ret = Math.random() * window.innerHeight;
      break;
    case 's':
      ret = Math.random();
      break;
    case 'r':
      ret = Math.random() * 6;
      break;
    case 'fnx':
      random = -0.5 + Math.random() * 1;
      ret = function (x, y) {
        return x + 0.5 * random - 1.7;
      };
      break;
    case 'fny':
      random = 1.5 + Math.random() * 0.7
      ret = function (x, y) {
        return y + random;
      };
      break;
    case 'fnr':
      random = Math.random() * 0.03;
      ret = function (r) {
        return r + random;
      };
      break;
  }
  return ret;
}

// 开始落樱动画
function startSakura() {
  // 获取 requestAnimationFrame 方法
  requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

  // 创建画布
  var canvas = document.createElement('canvas');
  var cxt;
  staticx = true;

  // 设置画布属性
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.setAttribute('style', 'position: fixed;left: 0;top: 0;pointer-events: none;');
  canvas.setAttribute('id', 'canvas_sakura');
  document.getElementsByTagName('body')[0].appendChild(canvas);
  cxt = canvas.getContext('2d');

  // 创建落樱对象列表
  var sakuraList = new SakuraList();

  // 初始化落樱对象
  for (var i = 0; i < 50; i++) {
    var sakura, randomX, randomY, randomS, randomR, randomFnx, randomFny;
    randomX = getRandom('x');
    randomY = getRandom('y');
    randomR = getRandom('r');
    randomS = getRandom('s');
    randomFnx = getRandom('fnx');
    randomFny = getRandom('fny');
    randomFnR = getRandom('fnr');
    sakura = new Sakura(randomX, randomY, randomS, randomR, {
      x: randomFnx,
      y: randomFny,
      r: randomFnR
    });
    sakura.draw(cxt);
    sakuraList.push(sakura);
  }

  // 启动落樱动画循环
  stop = requestAnimationFrame(function () {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    sakuraList.update();
    sakuraList.draw(cxt);
    stop = requestAnimationFrame(arguments.callee);
  })
}

// 窗口调整大小事件处理
window.onresize = function () {
  var canvasSnow = document.getElementById('canvas_snow');
  canvasSnow.width = window.innerWidth;
  canvasSnow.height = window.innerHeight;
}

// 图片加载完成后开始落樱动画
img.onload = function () {
  startSakura();
}

// 停止或开始动画的函数
function stopp() {
  if (staticx) {
    var child = document.getElementById("canvas_sakura");
    child.parentNode.removeChild(child);
    window.cancelAnimationFrame(stop);
    staticx = false;
  } else {
    startSakura();
  }
}
