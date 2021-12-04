const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config({path: '.env'});
require('./models/User-repository');
require('./handlers/jwt-validation');

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
app.use('/', require('./routes/authentication'));

app.get('/', (req, res) => {
    res.end('StackShare API V1.0');
})

app.use((req, res) => {
    res.status(404).json({
        message: 'not found'
    });
});

app.options('/login', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.end();
});

app.use((err, req, res, next) => {
    const error = {
        status: err.status || 500,
        message: err.message || 'Something went wrong!'
    };
    if (process.env.NODE_ENV === 'development') {
        error['stack'] = err.stack;
    }
    res.status(err.status || 500).json(error);
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`StackShare backend API is running on port ${port}`));
