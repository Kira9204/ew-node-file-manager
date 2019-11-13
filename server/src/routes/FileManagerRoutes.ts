//API Routes
import express from 'express';
import {
  downloadFile,
  downloadGenerateZip,
  generateFilePreview,
  getPathInfo
} from '../services/FileManager';

const router = express.Router();
//Used for retrieving files list
router.get('/path/*', (req, res, next) => {
  return getPathInfo(req, res);
});
router.get('/preview/*', (req, res, next) => {
  return generateFilePreview(req, res);
});
router.get('/download/*', (req, res, next) => {
  return downloadFile(req, res);
});

router.get('/zip/*', (req, res, next) => {
  return downloadGenerateZip(req, res);
});

export default router;
