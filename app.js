const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const AppError = require('./utils/appErrors');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Global Middleware

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Create security header
app.use(helmet());
app.use(helmet.hidePoweredBy());

// Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests.',
});

app.use('/api', limiter);

app.use(express.json({ limit: '100kb' }));

// Monogo sanitize for prevent database injection
app.use(mongoSanitize());

// xss for prevent cross-site injection
app.use(xss());

// hpp for prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingsQuantity',
      'ratingsAverage',
    ],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route
app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
