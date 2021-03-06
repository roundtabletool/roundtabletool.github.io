var currentTab = 1; // Before we switch to first tab (janky)
switchTab(); // Display the first tab

function addWatermark() {
  canvas = document.getElementById("canvas");
  ctx.font = "26px Righteous";
  ctx = canvas.getContext("2d");
  ctx.textAlign = "right";

  ctx.fillText("The Round Table", canvas.width - 10, canvas.height - 50);

  ctx.font = "26px Reem Kufi";
  ctx.fillText("www.roundtabletool.com", canvas.width - 10, canvas.height - 10);
}

download_img = function(el) {
  addWatermark();
  var image = canvas.toDataURL("image/png");
  el.href = image;
};

function switchTab() {
  newTab = (currentTab + 1) % 2;
  var tabs = document.getElementsByClassName("tab");
  tabs[currentTab].style.display = "none";
  tabs[newTab].style.display = "block";
  switch (newTab) {
    case 0:
      drawInitial();
      document.getElementById("buttonDiv").style.display = "none";
      break;
    case 1:
      addNamesToCircle();
      document.getElementById("buttonDiv").style.display = "block";
      break;
  }
  currentTab = newTab;
}

function getCurrentCenterText(){
  maybeCenterText = document.getElementById("centerText").textContent;
  console.log("hi!");
  console.log(maybeCenterText);
  if (maybeCenterText == ""){
    return DEFAULT_CENTER_TEXT;
  } else {
    return maybeCenterText;
  }
}

DEFAULT_CENTER_TEXT = "Choose who will start, then flow clockwise."

function updateCenterText(custom){
  if (custom) {
   document.getElementById("centerTextPrefix").innerHTML = "Custom center text:";
   document.getElementById("centerText").innerHTML = document.getElementById("centerTextForm").value; 
  }
  else {
    document.getElementById("centerTextPrefix").innerHTML = "Default center text:";
    document.getElementById("centerText").innerHTML = DEFAULT_CENTER_TEXT;
  }
}

function redrawBackground(showingTable) {
  canvas = document.getElementById("canvas");
  if (showingTable) {
    backgroundSize = "contain"; // Ensmallen the background if showing the table with names
  } else {
    backgroundSize = "cover";
  }

  minHeight = "620px";

  for (elementName of ["formBackDrop", "displayBackDrop"]) {
    backDrop = document.getElementById(elementName);
    backDrop.style =
      "position:relative;background-repeat:no-repeat;background-size:" +
      backgroundSize +
      ";background-position:center;min-height:" +
      minHeight +
      ";background-image:url(" +
      canvas.toDataURL() +
      ");";
  }
}

function getNamesFromTextArea() {
  namesText = document.getElementById("names").value;
  namesList = namesText.replace(/\n/g, ",").split(",");
  finalNames = [];
  for (maybeName of namesList) {
    if (maybeName.trim().length) {
      finalNames.push(maybeName.trim());
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
MEDIUM_FONT = "26px Reem Kufi";
SMALL_FONT = "24px Reem Kufi";

function getFormat(names) {
  totalNames = names["left"].concat(names["right"]).length;
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
        names[side][i].toUpperCase(),
        circle["centre_x"] + textOffsets["x"],
        circle["centre_y"] + textOffsets["y"]
      );
    }
  }
  ctx.textAlign = "center";
  ctx.font = LARGE_FONT;
  ctx.fillText(
    getCurrentCenterText(),
    circle["centre_x"],
    circle["centre_y"]
  );
  redrawBackground(true);
  var allNames = names["right"].concat(names["left"]);

  document.getElementById("show").style.display = "inline";
  descriptionDiv = document.getElementById("textDes");
  descriptionDiv.innerHTML =
    '<div class="imgDesc" >Image description: A white circle with a black outline, around which the following names are arranged:\n' +
    allNames.join(", ") +
    "</div>";
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

  descriptionDiv = document.getElementById("textDes");
  descriptionDiv.innerHTML = "";
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
  // spacerOuter = document.getElementById("spacerAboveButton");
  // if ($(window).width() < 1000) {
  //   spacerOuter.style.display = "block";
  // } else {
  //   spacerOuter.style.display = "none";
  // }
}

$(window).on("resize", resize);

$(document).ready(function() {
  resize();
  $("#show").click(function() {
    // $('.menu').toggle("slide");
    $(".menu").toggle(0);
  });
});
