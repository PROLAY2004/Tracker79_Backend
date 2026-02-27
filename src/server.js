import express from 'express';
import cors from 'cors';

import configuration from './config/config.js';
import errorHandler from './error/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import connectDB from './config/dbConfig.js';
import TokenValidation from './validations/middleware/TokenValidation.js';

await connectDB();

const app = express();
const tokenValidator = new TokenValidation();

app.use(cors(configuration.CORS));
app.use(express.json());

app.use('/', (req,res)=> {
  res.send('Backend Ok')
})

app.use('/user/auth', authRoutes);
app.use('/user/account', tokenValidator.accessTokenValidator, dashboardRoutes);

app.use(errorHandler);

app.listen(configuration.PORT, () => {
  console.log(`Tracker79 listening on port ${configuration.PORT}`);
});

export default app;
