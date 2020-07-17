var currentTab = 1; // Before we switch to first tab (janky)
switchTab(); // Display the first tab

function switchTab() {
  newTab = (currentTab + 1) % 2;
  var tabs = document.getElementsByClassName("tab");
  tabs[currentTab].style.display = "none";
  tabs[newTab].style.display = "block";
  switch (newTab) {
    case 0:
      drawInitial();
      break;
    case 1:
      addNamesToCircle();
      break;
  }
  currentTab = newTab;
}

function redrawBackground(showingTable) {
  canvas = document.getElementById("canvas");

  backDrop = document.getElementById("backDrop");
  if (showingTable) {
    backgroundSize = "contain"; // Ensmallen the background if showing the table with names
    minHeight = "850px";
  } else {
    backgroundSize = "cover";
    minHeight = "650px";
  }
  backDrop.style =
    "position:relative;background-repeat:no-repeat;background-size:" +
    backgroundSize +
    ";background-position:center;min-height:" +
    minHeight +
    ";background-image:url(" +
    canvas.toDataURL() +
    ");";
}

function getNamesFromTextArea() {
  namesText = document.getElementById("names").value;
  namesList = namesText.replace(/\n/g, ",").split(",");
  finalNames = [];
  for (maybeName of namesList) {
    if (maybeName.trim().length) {
      finalNames.push(maybeName.trim().toUpperCase());
    }
  }
  if (finalNames.length % 2 == 1) {
    halfLength = (finalNames.length + 1) / 2;
  } else {
    halfLength = finalNames.length / 2;
  }

  return {
    right: finalNames.slice(0, halfLength),
    left: finalNames.slice(halfLength, names.length)
  };
}

function getCircleInfo(canvas) {
  return {
    centre_x: canvas.width / 2,
    centre_y: canvas.height / 2,
    radius: canvas.height * 0.45,
    textRadius: canvas.height * 0.45 * 1.1
  };
}

START_ANGLE = Math.PI / 8;
SPAN = 3 * Math.PI / 4;

MORE_NAMES_START_ANGLE = Math.PI / 16;
MORE_NAMES_SPAN = 7 * Math.PI / 8;

LARGE_FONT = "32px Reem Kufi";
MEDIUM_FONT = "24px Reem Kufi";
SMALL_FONT = "26px Reem Kufi";

function getFormat(names) {
  totalNames = names["left"].concat(names["right"]).length;
  console.log(totalNames);
  if (totalNames > 40) {
    startAngle = MORE_NAMES_START_ANGLE;
    angleSpan = MORE_NAMES_SPAN;
    font = SMALL_FONT;
  } else {
    startAngle = START_ANGLE;
    angleSpan = SPAN;
    if (totalNames > 30) {
      font = MEDIUM_FONT;
    } else {
      font = LARGE_FONT;
    }
  }
  return {
    startAngle: startAngle,
    angleSpan: angleSpan,
    font: font
  };
}

function addNamesToCircle() {
  names = getNamesFromTextArea();
  circle = getCircleInfo(canvas);
  format = getFormat(names);

  ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.font = format["font"];

  for (side of ["right", "left"]) {
    for (var i = 0; i < names[side].length; i++) {
      textOffsets = getTextPosition(
        circle["textRadius"],
        format["startAngle"],
        format["angleSpan"],
        i,
        names[side].length,
        side
      );
      ctx.fillText(
        names[side][i],
        circle["centre_x"] + textOffsets["x"],
        circle["centre_y"] + textOffsets["y"]
      );
    }
  }
  ctx.textAlign = "center";
  ctx.font = LARGE_FONT;
  ctx.fillText(
    "Choose who will start, then flow clockwise",
    circle["centre_x"],
    circle["centre_y"]
  );
  redrawBackground(true);
  var allNames = names["right"].concat(names["left"]);
  backDrop = document.getElementById("backDrop");
  backDrop.setAttribute(
    "aria-label",
    "A white circle with a black outline, around which the following names are arranged:\n" +
      allNames.join("\n")
  );
  backDrop.style.display = "none";
  backDrop.style.display = "block";
}

function getTextPosition(radius, startAngle, span, i, n, side) {
  context = canvas.getContext("2d");
  totalAngle = startAngle + (i + 1) * span / (n + 1);
  x_offset = radius * Math.sin(totalAngle);
  y_offset = radius * Math.cos(totalAngle);
  if (side == "right") {
    context.textAlign = "left";
    return {
      x: x_offset,
      y: -1 * y_offset
    };
  } else {
    context.textAlign = "right";
    return {
      x: -1 * x_offset,
      y: y_offset
    };
  }
}

function drawInitial() {
  canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fef4c8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawFilledCircle(canvas);
  redrawBackground(false);
}

function drawFilledCircle(canvas) {
  circle = getCircleInfo(canvas);

  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(
    circle["centre_x"],
    circle["centre_y"],
    circle["radius"],
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    circle["centre_x"],
    circle["centre_y"],
    circle["radius"],
    0,
    2 * Math.PI
  );
  ctx.fillStyle = "#000000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function resize() {
  spacerOuter = document.getElementById("spacerAboveButton");
  if ($(window).width() < 1000) {
    spacerOuter.style.display = "block";
  } else {
    spacerOuter.style.display = "none";
  }
}

$(window).on("resize", resize);
