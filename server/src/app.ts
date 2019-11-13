import express from 'express';
import cors from 'cors';
import path from 'path';
//import morgan from 'morgan';
//Import routes
import FileManagerRoutes from './routes/FileManagerRoutes';
import { sendFile } from './services/FileManager';
export const PATH_PUBLIC_FILES = path.join(__dirname, '../../public-files');
export const PATH_WEBPACK_BUILD = path.join(__dirname, '../../webpack-build');

const app = express();
//debugging
//app.use(morgan('dev'));

//Enable CORS
app.use(cors());
//Load the JSON body parser
app.use(express.json());
//Enabled extended url encodings
app.use(express.urlencoded({ extended: true }));
//Apply Routers
app.use('/api', FileManagerRoutes);

//React static site serving
app.use('/', express.static(PATH_WEBPACK_BUILD));
//Always return index.html for 404 routes (MUST BE PLACED LAST)
app.get('*', (req, res) => {
  sendFile(PATH_WEBPACK_BUILD + '/index.html', res);
});

module.exports = app;
