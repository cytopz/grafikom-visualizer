const xSize = 26;
const ySize = 26;
const red = "#ff0000";
const green = "#00ff00";
const algo = document.getElementsByTagName('algo')[0].id;
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
        showResult(points);
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
    },
    bresenhamCircle: (radius) => {
        const fill8Octants = (center, point) => {
            let xc = center[0],
                yc = center[1],
                x = point[0],
                y = point[1];
            points = [
                {x: xc+x, y: yc+y},
                {x: xc-x, y: yc+y},
                {x: xc+x, y: yc-y},
                {x: xc-x, y: yc-y},
                {x: xc+y, y: yc+x},
                {x: xc-y, y: yc+x},
                {x: xc+y, y: yc-x},
                {x: xc-y, y: yc-x},
            ]
            .filter((point) => (point.x <= 25 && point.y <=25) && (point.x >= 0 && point.y >= 0))
            points.forEach((point) => {
                let elem = document.getElementById(`${point.x},${point.y}`);
                fillPixel(elem, green);
            });
            return points;
        }
        let center = [point[0][0], point[0][1]];
        let x = 0;
        let y = radius;
        let d = 3 - 2 * radius;
        let points = [];
        while (y >= x) {
            x++;
            if (d > 0) {
                y--;
                d += 4 * (x - y) +10;
            } else {
                d += 4 * x + 6;
            }
            points = points.concat(fill8Octants(center, [x, y]));
        }
        points = [
            ...points.map(obj => `${obj.x},${obj.y}`)
        ];
        showResult(
            [...new Set(points)].map(str => str.split(","))
        );
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
        document.querySelector('.result').innerHTML = "";
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
    if (algo != "bresenhamCircle") {
        if (selectedPoint >= 2) {
            Algo[algo]();
            reset();
        }
    } else {
        const radius = prompt("Masukkan radius: ");
        Algo[algo](parseInt(radius));
        reset();
    }
}

const showResult = points => {
    let resultContainer = document.querySelector('.result')
    points.forEach(item => {
        resultContainer.innerHTML += `(${item[0]}, ${item[1]})<br>`;
    });
}
