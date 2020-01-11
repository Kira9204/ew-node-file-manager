//API Routes
import express from 'express';
import {
  deleteFile,
  downloadFile,
  downloadGenerateZip,
  generateFilePreview,
  getPathInfo,
  uploadFile
} from '../services/FileManager';

const router = express.Router();
//Used for retrieving files list
router.get('/path/*', (req, res) => {
  return getPathInfo(req, res);
});
router.get('/preview/*', (req, res) => {
  return generateFilePreview(req, res);
});
router.get('/download/*', (req, res) => {
  return downloadFile(req, res);
});
router.get('/zip', (req, res) => {
  return downloadGenerateZip(req, res);
});
router.get('/zip/*', (req, res) => {
  return downloadGenerateZip(req, res);
});

router.post('/upload', (req, res) => {
  return uploadFile(req, res);
});
router.post('/upload/*', (req, res) => {
  return uploadFile(req, res);
});

router.delete('/delete', (req, res) => {
  return deleteFile(req, res);
});
router.delete('/delete/*', (req, res) => {
  return deleteFile(req, res);
});
export default router;
