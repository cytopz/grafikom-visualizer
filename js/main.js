const xSize = 25;
const ySize = 25;
const red = "#ff0000";
const green = "#00ff00";
const algo = document.getElementsByTagName('algo')[0].id
let point = [];
let selectedPoint = 0;
let alreadyHasLine = false;

const Algo = {
    points: [],
    dda: () => {
        let x = point[0][0];
        let y = point[0][1];
        let dx = point[1][0] - point[0][0];
        let dy = point[1][1] - point[0][1];
        let step = Math.abs(dx) >= Math.abs(dy) ? Math.abs(dx) : Math.abs(dy);
        let xStep = dx / step;
        let yStep = dy / step;
        let points = [];
        for (let i=0; i<step; i++) {
            let elem = document.getElementById(`${Math.round(x)},${Math.round(y)}`);
            fillPixel(elem, green);
            points.push([Math.round(x), Math.round(y)]);
            x += xStep;
            y += yStep;
        }
        showResult(this.points);
    },
    bresenhamLine: () => {
        let x = point[0][0];
        let y = point[0][1];
        let dx = Math.abs(point[1][0] - point[0][0]);
        let dy = -Math.abs(point[1][1] - point[0][1]);
        let sx = point[0][0] < point[1][0] ? 1 : -1;
        let sy = point[0][1] < point[1][1] ? 1 : -1;
        let err = dx + dy;
        let points = [];
        while (true) {
            if (x === point[1][0] && y === point[1][1]) break;
            let elem = document.getElementById(`${x},${y}`);
            fillPixel(elem, green);
            points.push([x, y]);
            e2 = err * 2;
            if (e2 >= dy) { err += dy; x += sx; };
            if (e2 <= dx) { err += dx; y += sy; };
        }
        showResult(points);
    }
}

// Generate table
let container = document.querySelector('.table-container')
let tableContent = "<table>"
for (let row=ySize; row>=0; row--) {
    tableContent += "<tr>";
    for(let col=0; col<=xSize; col++) {
        tableContent += `<td class="pixel" id="${col},${row}" onclick="select(${col}, ${row})"></td>`;
    }
    tableContent += "</tr>";
}
tableContent += "</table>";
container.innerHTML += tableContent;

const reset = (hardReset=false) => {
    selectedPoint = 0;
    point = [];
    alreadyHasLine = true;
    if (hardReset) {
        activePixels = document.querySelectorAll("td[style]");
        activePixels.forEach(item => {
            item.removeAttribute('style');
        });
        document.querySelector('.selected-point').innerHTML = "";
        alreadyHasLine = false;
    }
}

const fillPixel = (elem, color) => {
    elem.style.background = color;
}

const select = (x, y) => {
    if (alreadyHasLine) { return; }
    let elem = document.getElementById(`${x},${y}`);
    fillPixel(elem, red);
    selectedPoint++;
    point.push([x, y]);
    document.querySelector('.selected-point').innerHTML += `<b>(${x}, ${y}) </b>`
    if (selectedPoint >= 2) {
        Algo[algo]();
        reset();
    }
}

const showResult = points => {
    let result = "";
    let resultContainer = document.querySelector('.result')
    points.forEach(item => {
        result += `(${item[0]}, ${item[1]})<br>`;
    })
    resultContainer.innerHTML = result;
}

