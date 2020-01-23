import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
//import morgan from 'morgan';
//Import routes
import FileManagerRoutes from './routes/FileManagerRoutes';
import { sendFile } from './services/FileManager';
import { PATH_TMP_UPLOAD, PATH_WEBPACK_BUILD } from './constants';

const app = express();
//debugging
//app.use(morgan('dev'));

// We use our own eTags.
// This also gets rid of potential
// 'Error [ERR_HTTP_HEADERS_SENT]: Cannot remove headers after they are sent to the client'
// Errors since express aggressively tries to modify the headers with it's own Etags for everything.
app.disable('etag');
//Enable CORS
app.use(cors());
//Load the JSON body parser
app.use(express.json());
//Enabled extended url encodings
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: PATH_TMP_UPLOAD
  })
);

//Apply Routers
app.use('/api', FileManagerRoutes);

//React static site serving
app.use('/', express.static(PATH_WEBPACK_BUILD));
//Always return index.html for 404 routes (MUST BE PLACED LAST)
app.get('*', (req, res) => {
  sendFile(PATH_WEBPACK_BUILD + '/index.html', req, res);
});

module.exports = app;
