import * as  dotEnv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotEnv.config({
  path: `.env.${env}`,
});

import express, { json } from 'express';
import { routes } from './routes';
import * as mongoose from 'mongoose';
import fs from 'fs';
import passport from './strategies/passport-strategy';
import { SQSService } from './services/SQS';

async function bootstrap() {
  if (!fs.existsSync(`.env.${env}`)) {
    const errorMessage = `Environment file (.env.${env}) not found. Please create the environment file and add necessary env variables`;
    throw Object.assign(new Error(errorMessage), { code: 'ENV_ERROR' });
  }

  const requiredEnvVariables = [
    'MONGODB_URI_ADMIN',
    'MONGO_ADMIN_DATABASE',
    'aws_region',
    'aws_sqs_queue_url',
    'aws_sqs_queue_name',
    'aws_sqs_access_key_id',
    'aws_sqs_secret_access_key',
    'JWT_SUPER_ADMIN_SECRET',
    'aws_sns_access_key_id',
    'aws_sns_secret_access_key',
    'ADMIN_TOPIC_SNS_ARN',
    'JWT_ADMIN_SECRET'
  ];

  const missingVariables = requiredEnvVariables.filter(variable => {
    return !process.env[variable];
  });

  if (missingVariables.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVariables.join(', ')}`;
    throw Object.assign(new Error(errorMessage), { code: 'ENV_ERROR' });
  }

  const PORT = process.env.PORT || 3000;
  const app = express();
  app.use(passport.initialize());
  app.use(json());
  app.use(routes);


  try {
    await mongoose.connect(process.env.MONGODB_URI_ADMIN || '', {
      dbName: process.env.MONGO_ADMIN_DATABASE,
    });

    console.log('Connected to Mongodb successfully');
    app.listen(PORT, async () => {
      console.log(`Server Started and Listening on PORT ${PORT} `);
    });
    // Start SQS Polling
    SQSService.initPoling();
  } catch (err) {
    console.log('Error in starting the server', err);
  }
}

bootstrap().catch(error => {
  if (error.code && error.code.startsWith('ENV'))
    console.error(`Failed to start application: ${error}`);
  process.exit(1);
});