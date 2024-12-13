const uploadInput = document.getElementById("uploadInput");
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
let image;

// 上傳圖片
uploadInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    image = new Image();
    image.onload = function () {
      // 將上傳的圖片放入 Canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

let isDrawing = false;
let tool = "brush";
let startCoordinates = { x: 0, y: 0 };
let brushColor = "#000000";

// 監聽滑鼠按下事件
canvas.addEventListener("mousedown", function (event) {
  isDrawing = true;
  startCoordinates = getMouseCoordinates(canvas, event);
});

// 監聽滑鼠移動事件
canvas.addEventListener("mousemove", function (event) {
  if (isDrawing) {
    const currentCoordinates = getMouseCoordinates(canvas, event);
    draw(startCoordinates, currentCoordinates);
    startCoordinates = currentCoordinates;
  }
});

// 監聽滑鼠放開事件
canvas.addEventListener("mouseup", function () {
  isDrawing = false;
});

colorPicker.addEventListener("input", function () {
  brushColor = colorPicker.value;
});

function draw(start, end) {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);

  if (tool === "brush") {
    context.lineWidth = 5;
    context.strokeStyle = brushColor;
  } else if (tool === "highlighter") {
    context.lineWidth = 10;
    context.strokeStyle = brushColor;
    context.globalAlpha = 0.5;
  } else if (tool === "eraser") {
    context.lineWidth = 10;
    context.strokeStyle = "White";
  }

  context.stroke();
  context.globalAlpha = 1.0;
}

function setTool(selectedTool) {
  tool = selectedTool;
}

// 還原 Canvas
function resetCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (image) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  circles = [];
}

// 下載完成的圖片
function downloadCanvas() {
  const downloadLink = document.createElement("a");
  downloadLink.href = canvas.toDataURL();
  downloadLink.download = "canvas_image.png";
  downloadLink.click();
}

// 取得滑鼠在 Canvas 內的座標
function getMouseCoordinates(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// 計算兩點之間的距離
function getDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point2.y, 2)
  );
}
