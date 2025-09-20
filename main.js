const fs = require("fs");

// Decode value string in given base to BigInt (manual parse to support large values)
function decodeValue(valueStr, base) {
    const b = BigInt(base);
    let result = 0n;
    for (const char of valueStr) {
        let digit = BigInt(parseInt(char, 36)); // base36 covers 0-9, a-z
        result = result * b + digit;
    }
    return result;
}

// Lagrange interpolation to get constant term c at x=0
function lagrangeInterpolation(points, k) {
    let constant = 0n;

    for (let i = 0; i < k; i++) {
        const xi = BigInt(points[i].x);
        const yi = points[i].y;

        let numerator = 1n;
        let denominator = 1n;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const xj = BigInt(points[j].x);
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }

        constant += yi * numerator / denominator;
    }

    return constant;
}

function findConstant(fileName) {
    const data = JSON.parse(fs.readFileSync(fileName, "utf8"));
    const n = data.keys.n;
    const k = data.keys.k;

    let points = [];

    for (const key in data) {
        if (key === "keys") continue;
        const base = parseInt(data[key].base);
        const value = data[key].value;
        const y = decodeValue(value, base);
        points.push({ x: parseInt(key), y: y });
    }

    // Sort points by x ascending to ensure consistent order
    points.sort((a, b) => a.x - b.x);

    // Use first k points
    const constant = lagrangeInterpolation(points, k);

    console.log(constant.toString());
}

// Run for testcases
findConstant("testcase1.json");
findConstant("testcase2.json");
