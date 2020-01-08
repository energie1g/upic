const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE;

// DATABASE.
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful.'))
    .catch(err => console.log('[Connection Unsuccessful] ', err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
