const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config({path: '.env'});

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', (err) => {
    console.error('Database connection error:', err);
});

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.end('StackShare API V1.0');
})

app.use((req, res) => {
    res.status(404).json({
        message: 'not found'
    });
});

app.use((err, req, res, next) => {
    let error = {
        status: err.status || 500,
        message: err.message || 'Something went wrong!'
    }
    if (process.env.NODE_ENV === 'development') {
        error['stack'] = err.stack;
    }
    res.status(err.status || 500).json(error);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`StackShare backend API is running on port ${port}`));
