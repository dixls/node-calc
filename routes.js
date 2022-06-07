const express = require('express');
const ExpressError = require('./errorHandler')

const app = express();

app.use(express.json());

app.get('/mean', (req, res, next) => {
    let nums = [];
    try {
        nums = [...req.query["nums"].split(",").map(num => parseInt(num))];
    } catch {
        const newErr = new ExpressError("required query 'nums' missing", 404)
        next(newErr);
    }
    let sum = 0;
    nums.forEach(num => {
        if (isNaN(num)) {
            const nanError = new ExpressError(`${num} is not a number`);
            next(nanError);
        } else {
            sum += num;
        }
    });
    let mean = sum / nums.length
    return res.send({
        operation: "mean",
        value: mean
    });
})

app.get('/median', (req, res, next) => {
    let nums = [];
    try {
        nums = [...req.query["nums"].split(",").map(num => parseInt(num))];
    } catch {
        const newErr = new ExpressError("required query 'nums' missing", 404);
        next(newErr);
    }
    console.log(nums)
    nums.forEach(num => {
        if (isNaN(num)) {
            const nanError = new ExpressError(`${num} is not a number`);
            next(nanError);
        }
    });
    nums.sort()
    const len = nums.length;
    let median = 0
    if (len % 2 == 0) {
        let i = len / 2;
        let j = i - 1;
        median = (nums[i] + nums[j]) / 2;
    } else {
        let i = Math.floor(len / 2);
        median = nums[i];
    }
    return res.send({
        operation: "median",
        value: median
    })
})

app.get('/mode', (req, res, next) => {
    let nums = [];
    try {
        nums = [...req.query["nums"].split(",").map(num => parseInt(num))];
    } catch {
        const newErr = new ExpressError("required query 'nums' missing", 404);
        next(newErr);
    }
    nums.sort()
    let count = 1
    let max = 1
    let mode = nums[0]
    for (let i = 1; i < nums.length; i++) {
        if (isNaN(nums[i])) {
            const nanError = new ExpressError(`${nums[i]} is not a number`);
            next(nanError);
        } else {
            if (nums[i] == nums[i - 1]) {
                count++;
            } else {
                count = 1;
            }
            if (count > max) {
                max = count;
                mode = nums[i]
            }
        }
    }
    return res.send({
        operation: "mode",
        value: mode
    })
})

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: { message, status }
    })
})

app.listen(3000, () => {
    (
        console.log("Server running on port 3000")
    )
})