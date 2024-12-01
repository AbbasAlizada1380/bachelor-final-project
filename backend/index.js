import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import userRout from './routes/userRout.js';
import recordRout from './routes/recordsRout.js';
import childrenRout from './routes/childrenRout.js';
import appointmentRout from './routes/appointmentRout.js';
import sequelize from './dbconnection.js';
import path from 'path'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
const port = 8038
const app = express()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Middleware to serve static files (images)
const uploadsDirectory = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDirectory));
app.use(bodyParser.json())
app.use('/users', userRout)
app.use('/records', recordRout)
app.use('/children', childrenRout)
app.use('/appointment', appointmentRout)


// Sync database and start server
sequelize.sync({ alter: true }) // brings the neccessary changes to the table

  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });