const uploadInput = document.getElementById("uploadInput");
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");
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
let circles = [];
let startCoordinates = { x: 0, y: 0 };
let radius = 0;

// 監聽滑鼠按下事件
canvas.addEventListener("mousedown", function (event) {
  isDrawing = true;
  startCoordinates = getMouseCoordinates(canvas, event);
});

// 監聽滑鼠移動事件
canvas.addEventListener("mousemove", function (event) {
  if (isDrawing) {
    // 清除 canvas
    // context.clearRect(0, 0, canvas.width, canvas.height);

    // 將上傳的圖片放入 Canvas
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    // 繪製已保存的圓圈
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      context.beginPath();
      context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      context.lineWidth = 5;
      context.strokeStyle = "Red";
      context.stroke();
    }

    // 計算圓圈半徑
    const currentCoordinates = getMouseCoordinates(canvas, event);
    radius = getDistance(startCoordinates, currentCoordinates);

    // 繪製圓圈
    context.beginPath();
    context.arc(startCoordinates.x, startCoordinates.y, radius, 0, 2 * Math.PI);
    context.lineWidth = 5;
    context.strokeStyle = "Red";
    context.stroke();
  }
});

// 監聽滑鼠放開事件
canvas.addEventListener("mouseup", function (event) {
  if (isDrawing) {
    isDrawing = false;

    // 將完成的圓圈保存到陣列中
    circles.push({
      x: startCoordinates.x,
      y: startCoordinates.y,
      radius: radius,
      brushSize: 5,
      brushColor: "Red",
    });
  }
});

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
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}
