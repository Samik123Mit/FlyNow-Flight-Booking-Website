const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./router/UserRoutes.js');
const authroutes = require('./router/UserAuthRoutes.js');
const adminRoutes = require('./router/adminRoutes.js');
const feedbackRoutes = require('./router/feedbackRoutes.js');
const paymentRoutes = require('./router/paymentRoutes.js');
const connect = require('./db/connection.js');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware.js');

dotenv.config();
const app = express();

/* middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.status(200).json("Home get request");
});

/* api routes */
app.use('/api/auth', authroutes);
app.use('/api/payment', authMiddleware, paymentRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use('/api/admin', (req, res, next) => {
    if (req.path === '/login') next();
    else authMiddleware(req, res, next);
}, adminRoutes);

app.use('/api', (req, res, next) => {
    if (req.path === '/searchFlight' || req.path === '/searchAllFlights') next();
    else authMiddleware(req, res, next);
}, router);

/* start server */
connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("invalid db connection");
    console.error(err);
});
