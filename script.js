function getFormattedDate(date, selectedDateFormat) {
  if (selectedDateFormat === "yyyy-mm-dd") {
    return date;
  } else if (selectedDateFormat === "yyyy.mm.dd") {
    return date.replace(/-/g, ".");
  } else if (selectedDateFormat === "yyyy/mm/dd") {
    return date.replace(/-/g, "/");
  } else if (selectedDateFormat === "'yy,mm,dd") {
    const [year, month, day] = date.split("-");
    return `'${year.slice(2)},${month},${day}`;
  }
  return "";
}

function adjustFontSize(text, maxTextLength, baseFontSize) {
  if (text.length > maxTextLength) {
    return Math.floor((baseFontSize * maxTextLength) / text.length);
  }
  return baseFontSize;
}

function updateSVG() {
  // 入力値を取得
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const date = document.getElementById("date").value;
  const selectedDateFormat = document.getElementById("date-format").value;
  const selectedFont = document.getElementById("font-family").value;
  const color = document.getElementById("color").value;
  const transparentCheckbox = document.getElementById("transparent");

  const isTransparent = transparentCheckbox.checked;
  const circleFillColor = isTransparent ? "none" : "#FFFFFF";

  // 字数が少なくなる分fontsize up&位置を若干移動
  const dateFontSize = selectedDateFormat === "'yy,mm,dd" ? 36 : 30;
  const dateOffset = selectedDateFormat === "'yy,mm,dd" ? -1 : 0;

  const formattedDate = getFormattedDate(date, selectedDateFormat);

  // 名前と部署名の文字数に応じてフォントサイズを調整
  const maxNameLength = 3;
  const maxDepartmentLength = 3;

  const nameFontSize = adjustFontSize(name, maxNameLength, 40);
  const departmentFontSize = adjustFontSize(
    department,
    maxDepartmentLength,
    40
  );

  // フォントサイズを小さくした分の上方向の調整量を計算
  const departmentOffset = (40 - departmentFontSize) * 0.3;
  const nameOffset = (40 - nameFontSize) * 0.3;

  // 現在の日付のUNIXタイムスタンプを取得
  const timestamp = Math.floor(Date.now() / 1000);

  const svg = `
  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <!-- 円 -->
    <circle cx="100" cy="100" r="95" fill="${circleFillColor}" stroke="${color}" stroke-width="5" />

    <!-- 分割線 -->
    <line x1="10" y1="130" x2="190" y2="130" stroke="${color}" stroke-width="2" />
    <line x1="10" y1="70" x2="190" y2="70" stroke="${color}" stroke-width="2" />

    <!-- テキスト -->
    <text x="50%" y="60" text-anchor="middle" font-size="${departmentFontSize}" font-family="${selectedFont}" fill="${color}" dy="${-departmentOffset}">${department}</text>
    <text x="50%" y="110" text-anchor="middle" font-size="${dateFontSize}" font-family="${selectedFont}" fill="${color}" dy="${-dateOffset}">${formattedDate}</text>
    <text x="50%" y="170" text-anchor="middle" font-size="${nameFontSize}" font-family="${selectedFont}" fill="${color}" dy="${-nameOffset}">${name}</text>
    <!-- Created: ${timestamp} -->
  </svg>
  `;

  // 生成したSVGを表示する場所を取得
  const svgOutput = document.getElementById("svgOutput");

  // SVGを表示
  svgOutput.innerHTML = svg;
}

function downloadSVG() {
  // 生成したSVGを取得
  const svg = document.getElementById("svgOutput").innerHTML;

  // // SVGデータをBlobに変換してダウンロード
  const svgBlob = new Blob([svg], { type: "image/svg+xml" });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(svgBlob);
  downloadLink.download = "data_stamp.svg";
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// テキストボックスと日付入力欄の変更時にリアルタイムでSVGを更新
const inputs = document.querySelectorAll(
  'input[type="text"], input[type="date"], input[type="color"], input[type="checkbox"], select'
);
inputs.forEach((input) => {
  input.addEventListener("input", updateSVG);
});

// ダウンロードボタンのクリック時にダウンロード処理を呼び出す
const downloadButton = document.getElementById("downloadButton");
downloadButton.addEventListener("click", downloadSVG);

// 初期表示時にSVGを生成
updateSVG();
