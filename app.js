const BRIGHTNESS_CMD = 0x00;
const PATTERN_CMD = 0x01;
const BOOTLOADER_CMD = 0x02;
const SLEEP_CMD = 0x03;
const ANIMATE_CMD = 0x04;
const PANIC_CMD = 0x05;
const DRAW_CMD = 0x06;
const STAGE_GREY_COL_CMD = 0x07;
const DrawGreyColBuffer = 0x08;
const SetText = 0x09;
const StartGame = 0x10;
const GameControl = 0x11;
const GameStatus = 0x12;
const SetColor = 0x13;
const DisplayOn = 0x14;
const InvertScreen = 0x15;
const SetPixelColumn = 0x16;
const FlushFramebuffer = 0x17;
const VERSION_CMD = 0x20;

const WIDTH = 9;
const HEIGHT = 34;

const PATTERNS = [
  'Custom',
  'Blank',
  'Full',
  'Checkerboard',
  'Double Checkerboard',
  'Every 2nd Row',
  'Every 3rd Row',
  'Every 2nd Col',
  'Every 3rd Col',
  'Logo Left',
  'Logo Right',
];

var matrix_left;
var matrix_right;
var $table_left;
var $table_right;
var rowMajor = false;
var msbendian = false;
var penBrightness = 1.0;
let portLeft = null;
let portRight = null;
let swap = false;

const GAMMA_CORRECTION = [
  0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 
  2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 
  4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 
  8, 9, 9, 9, 10, 10, 10, 11, 11, 11, 12, 12, 12, 13, 
  13, 14, 14, 14, 15, 15, 16, 16, 17, 17, 17, 18, 18, 
  19, 19, 20, 20, 21, 22, 22, 23, 23, 24, 24, 25, 26, 
  26, 27, 27, 28, 29, 29, 30, 31, 32, 32, 33, 34, 34, 
  35, 36, 37, 38, 38, 39, 40, 41, 42, 42, 43, 44, 45, 
  46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 
  59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 73, 
  74, 75, 76, 78, 79, 80, 82, 83, 84, 86, 87, 88, 90, 
  91, 93, 94, 96, 97, 99, 100, 102, 103, 105, 106, 108, 
  110, 111, 113, 115, 116, 118, 120, 121, 123, 125, 127, 
  128, 130, 132, 134, 136, 138, 140, 141, 143, 145, 147, 
  149, 151, 153, 155, 157, 159, 161, 164, 166, 168, 170, 
  172, 174, 177, 179, 181, 183, 186, 188, 190, 193, 195, 
  197, 200, 202, 205, 207, 210, 212, 215, 217, 220, 222, 
  225, 228, 230, 233, 236, 238, 241, 244, 247, 249, 252,
  255 
];

const LOGO_LEFT = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0.6, 1, 1, 0.17, 0],
  [0, 0, 0, 0.6, 1, 1, 1, 1, 1],
  [0, 0, 0.33, 1, 1, 1, 1, 1, 1],
  [0, 0, 0.33, 1, 1, 1, 1, 1, 0],
  [0, 0, 0.49, 1, 1, 1, 0.17, 0, 0],
  [0, 0.17, 0.69, 1, 1, 0.17, 0, 0, 0],
  [0, 1, 1, 1, 0.41, 0, 0, 0, 0],
  [1, 1, 1, 1, 0.17, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 0.17, 0, 0, 0, 0],
  [0.17, 1, 1, 1, 0.4, 0, 0, 0, 0],
  [0, 0.17, 0.61, 1, 1, 0.17, 0, 0, 0],
  [0, 0, 0.4, 1, 1, 1, 0.17, 0, 0],
  [0, 0, 0.47, 1, 1, 1, 1, 1, 0],
  [0, 0, 0.47, 0.98, 1, 1, 1, 1, 1],
  [0, 0, 0, 0.6, 0.98, 1, 1, 1, 1],
  [0, 0, 0, 0, 0.6, 0.57, 1, 0.4, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const LOGO_RIGHT = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0.17, 1, 1, 0.6, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 0.6, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0.33, 0, 0],
  [0, 1, 1, 1, 1, 1, 0.33, 0, 0],
  [0, 0, 0.17, 1, 1, 1, 0.49, 0, 0],
  [0, 0, 0, 0.17, 1, 1, 0.69, 0.17, 0],
  [0, 0, 0, 0, 0.41, 1, 1, 1, 0],
  [0, 0, 0, 0, 0.17, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0.17, 1, 1, 1, 1],
  [0, 0, 0, 0, 0.41, 1, 1, 1, 0],
  [0, 0, 0, 0.17, 1, 1, 0.61, 0, 0],
  [0, 0, 0.17, 1, 1, 1, 0.47, 0, 0],
  [0, 1, 1, 1, 1, 1, 0.47, 0, 0],
  [1, 1, 1, 1, 1, 0.87, 0.39, 0, 0],
  [1, 1, 1, 1, 1, 0.6, 0, 0, 0],
  [0, 0.4, 0.57, 1, 0.6, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

$(function() {
  matrix_left = createArray(34, 9);
  matrix_right = createArray(34, 9);
  updateTableLeft();
  updateTableRight();
  initOptions();

  for (pattern of PATTERNS) {
    $("#select-left").append(`<option value="${pattern}">${pattern}</option>`);
    $("#select-left").on("change", async function() {
      if (pattern == 'Custom') return;
      drawPattern(matrix_left, $(this).val(), 'left');
      await sendToDisplay(true);
    });

    $("#select-right").append(`<option value="${pattern}">${pattern}</option>`);
    $("#select-right").on("change", async function() {
      if (pattern == 'Custom') return;
      drawPattern(matrix_right, $(this).val(), 'right');
      await sendToDisplay(true);
    });
  }
});

function drawPattern(matrix, pattern, pos) {
  for (let col = 0; col < WIDTH; col++) {
    for (let row = 0; row < HEIGHT; row++) {
      if (pattern == 'Blank') {
        matrix[row][col] = 0;
      } else if (pattern == 'Full') {
        matrix[row][col] = 1;
      } else if (pattern == 'Checkerboard') {
        matrix[row][col] = Number(col % 2 == row % 2);
      } else if (pattern == 'Double Checkerboard') {
        if (row % 4 < 2)
          matrix[row][col] = Number((col+2) % 4 < 2);
        else
          matrix[row][col] = Number((col) % 4 < 2);
      } else if (pattern == 'Every 2nd Row') {
        matrix[row][col] = Number(row % 2 == 1);
      } else if (pattern == 'Every 3rd Row') {
        matrix[row][col] = Number(row % 3 == 2);
      } else if (pattern == 'Every 2nd Col') {
        matrix[row][col] = Number(col % 2 == 1);
      } else if (pattern == 'Every 3rd Col') {
        matrix[row][col] = Number(col % 3 == 2);
      } else if (pattern == 'Logo Left') {
        matrix[row][col] = LOGO_LEFT[row][col];
      } else if (pattern == 'Logo Right') {
        matrix[row][col] = LOGO_RIGHT[row][col];
      }
    }
  }
  updateMatrix(matrix, pos);
}

function updateMatrix(matrix, pos) {
  for (let col = 0; col < WIDTH; col++) {
    for (let row = 0; row < HEIGHT; row++) {
      let foo = $(`#${pos}-${row}-${col}`);
      if (matrix[row][col] > 0) {
        foo.addClass('off');
      } else {
        foo.removeClass('off');
      }
    }
  }
}

function updateTableLeft() {
	var width = matrix_left[0].length;
	var height = matrix_left.length;

  $table_left = populateTable(null, height, width, "left");
	$('#led-grid_left').html('');
	$('#led-grid_left').append($table_left);

	// events
	$table_left.on("mousedown", "td", toggleLeft);
    $table_left.on("mouseenter", "td", toggleLeft);
    $table_left.on("dragstart", function() { return false; });
}

function updateTableRight() {
	var width = matrix_right[0].length;
	var height = matrix_right.length;

  $table_right = populateTable(null, height, width, "right");
	$('#led-grid_right').html('');
	$('#led-grid_right').append($table_right);

	// events
	$table_right.on("mousedown", "td", toggleRight);
  $table_right.on("mouseenter", "td", toggleRight);
  $table_right.on("dragstart", function() { return false; });
}

function initOptions() {
	$('#clearLeftBtn').click(function() {
    matrix_left = createArray(matrix_left.length, matrix_left[0].length);
    updateTableLeft();
    sendToDisplay(true);
  });
	$('#wakeBtn').click(function() {
    wake(portLeft, true);
    wake(portRight, true);
  });
	$('#sleepBtn').click(function() {
    wake(portLeft, false);
    wake(portRight, false);
  });
	$('#bootloaderBtn').click(function() {
    bootloader(portLeft);
    bootloader(portRight);
  });
	$('#clearRightBtn').click(function() {
    matrix_right = createArray(matrix_right.length, matrix_right[0].length);
    updateTableRight();
    sendToDisplay(true);
  });
	$('#connectLeftBtn').click(connectSerialLeft);
	$('#connectRightBtn').click(connectSerialRight);
	$('#swapBtn').click(async function() {
    swap = !swap;
    await sendToDisplay(true);
  });
	//$('#sendButton').click(sendToDisplay);
  $(document).on('input change', '#brightnessRange', function() {
  //$('#brightnessRange').change(function() {
    let brightness = $(this).val();
    //console.log("Brightness:", brightness);
    sendCommand(portLeft, BRIGHTNESS_CMD, brightness);
    sendCommand(portRight, BRIGHTNESS_CMD, brightness);
  });
  $(document).on('input change', '#penBrightness', function() {
    penBrightness = $(this).val();
  });
}

async function checkFirmwareVersion(port, side) {
  const id = 0x20;
  const params = [];

  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();

  let bytes = [0x32, 0xAC];
  bytes = bytes.concat([id]);
  bytes = bytes.concat(params);
  console.log('Params:', bytes);

  const data = new Uint8Array(bytes);
  await writer.write(data);
  await writer.close();
  // Allow the serial port to be closed later.
  writer.releaseLock();

  const { value, done } = await reader.read();
  // Attention: Seems the variable name `value` cannot be changed!
  const response = value;
  console.log(`Done: ${done} Response:`, response);

  const major = response[0];
  const minor = (response[1] & 0xF0) >> 4;
  const patch = response[1] & 0x0F;
  const pre_release = response[2] == 1;

  const fw_str = `Connected!<br>Device FW Version: ${major}.${minor}.${patch} Pre-release: ${pre_release}`;
  console.log(fw_str);
  $(`#fw-version-${side}`).html(fw_str);

  // Allow the serial port to be closed later.
  reader.releaseLock();
}

async function sendToDisplay(recurse) {
    await sendToDisplayLeft(recurse);
    await sendToDisplayRight(recurse);
}

async function sendToDisplayLeft(recurse) {
  if (portLeft === null) return;
	
  const width = matrix_left[0].length;
  for (let col = 0; col < width; col++) {
    await sendColumnToDisplayLeft(col);
  }

  console.log('flush buffers left');
  await sendCommand(portLeft, DrawGreyColBuffer, []);
}

async function sendToDisplayRight(recurse) {
  if (portRight === null) return;
	
  const width = matrix_right[0].length;
  for (let col = 0; col < width; col++) {
    await sendColumnToDisplayRight(col);
  }

  await sendCommand(portRight, DrawGreyColBuffer, []);
}

async function sendColumnToDisplayRight(columnIndex) {
  if (portRight === null) return;
  let column = getColumnBytes(matrix_right, columnIndex);
  let params = [columnIndex].concat(column);

  // console.log(`Send column ${columnIndex} bytes right:`, params);
  await sendCommand(portRight, STAGE_GREY_COL_CMD, params);
  await new Promise(r => setTimeout(r, 10));
}

async function sendColumnToDisplayLeft(columnIndex) {
  if (portLeft === null) return;
  let column = getColumnBytes(matrix_left, columnIndex);
  let params = [columnIndex].concat(column);

  // console.log(`Send column ${columnIndex} bytes left:`, params);
  await sendCommand(portLeft, STAGE_GREY_COL_CMD, params);
  await new Promise(r => setTimeout(r, 10));
}

function getColumnBytes(matrix, columnIndex) {
  return matrix.map(row => GAMMA_CORRECTION[Math.floor((row[columnIndex] ?? 0) * 255)]);
}

async function connectSerialLeft() {
  portLeft = await navigator.serial.requestPort();

  const { usbProductId, usbVendorId } = portLeft.getInfo();
  console.log(`Selected`, portLeft);
  console.log(`VID:PID ${usbVendorId}:${usbProductId}`);

  if (portLeft.readable === null || portLeft.writeable === null) {
    console.log("Opening portLeft");
    await portLeft.open({ baudRate: 115200 });
  }

  await checkFirmwareVersion(portLeft, 'left');
}

async function connectSerialRight() {
  portRight = await navigator.serial.requestPort();

  const { usbProductId, usbVendorId } = portRight.getInfo();
  console.log(`Selected`, portRight);
  console.log(`VID:PID ${usbVendorId}:${usbProductId}`);

  if (portRight.readable === null || portRight.writeable === null) {
    console.log("Opening portRight");
    await portRight.open({ baudRate: 115200 });
  }

  await checkFirmwareVersion(portRight, 'right');
}

function toggleLeft(e) {
	var x = $(this).data('i');
	var y = $(this).data('j');

	if (e.buttons == 1 && !e.ctrlKey) {
		matrix_left[x][y] = penBrightness;
		$(this).addClass('off');
	}
	else if (e.buttons == 2 || (e.buttons == 1 && e.ctrlKey)) {
		matrix_left[x][y] = 0;
		$(this).removeClass('off');
	}

  sendToDisplayLeft(true);

	return false;
}

function toggleRight(e) {
	var x = $(this).data('i');
	var y = $(this).data('j');

	if (e.buttons == 1 && !e.ctrlKey) {
		matrix_right[x][y] = penBrightness;
		$(this).addClass('off');
	}
	else if (e.buttons == 2 || (e.buttons == 1 && e.ctrlKey)) {
		matrix_right[x][y] = 0;
		$(this).removeClass('off');
	}

  sendToDisplayRight(true);

	return false;
}

function populateTable(table, rows, cells, pos) {
    if (!table) table = document.createElement('table');
    for (var i = 0; i < rows; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < cells; ++j) {
            row.appendChild(document.createElement('td'));
            $(row.cells[j]).data('i', i);
            $(row.cells[j]).data('j', j);
            $(row.cells[j]).attr('id', `${pos}-${i}-${j}`);
        }
        table.appendChild(row);
    }
    return $(table);
}

// (height, width)
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

async function wake(port, wake) {
  await sendCommand(port, SLEEP_CMD, [wake ? 0 : 1]);
}

async function bootloader(port) {
  await sendCommand(port, BOOTLOADER_CMD, [0]);
}

async function sendCommand(port, commandId, params) {
  if (port === null) return;

  const writer = port.writable.getWriter();

  let bytes = [0x32, 0xAC];
  bytes = bytes.concat([commandId]);
  bytes = bytes.concat(params);
  console.log('Params:', bytes);

  const data = new Uint8Array(bytes);
  await writer.write(data);
  await writer.close();
  // Allow the serial port to be closed later.
  writer.releaseLock();
}
