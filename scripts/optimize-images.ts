import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { logger } from '@/lib/logger';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

type OptimizeResult = {
  file: string;
  originalSize: number;
  compressedSize: number;
  webpSize: number;
};

const findImages = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findImages(fullPath)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        files.push(fullPath);
      }
    }
  }

  return files;
};

const optimizeImage = async (filePath: string): Promise<OptimizeResult> => {
  const originalBuffer = await fs.readFile(filePath);
  const originalSize = originalBuffer.length;
  const ext = path.extname(filePath).toLowerCase();

  // Compress the original format in-place
  let compressedBuffer: Buffer;
  if (ext === '.png') {
    compressedBuffer = await sharp(originalBuffer)
      .png({ quality: 85, compressionLevel: 9 })
      .toBuffer();
  } else {
    compressedBuffer = await sharp(originalBuffer)
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
  }

  // Only overwrite if compression actually reduced size
  if (compressedBuffer.length < originalSize) {
    await fs.writeFile(filePath, compressedBuffer);
  } else {
    compressedBuffer = originalBuffer;
  }

  // Generate WebP version alongside the original
  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
  const webpBuffer = await sharp(originalBuffer)
    .webp({ quality: 80 })
    .toBuffer();
  await fs.writeFile(webpPath, webpBuffer);

  return {
    file: path.relative(PUBLIC_DIR, filePath),
    originalSize,
    compressedSize: compressedBuffer.length,
    webpSize: webpBuffer.length,
  };
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
};

const run = async () => {
  const images = await findImages(PUBLIC_DIR);

  if (images.length === 0) {
    logger.info('No images to optimize');
    return;
  }

  logger.info('Starting image optimization', { count: images.length });

  const results: OptimizeResult[] = [];
  for (const image of images) {
    const result = await optimizeImage(image);
    results.push(result);

    const saved = result.originalSize - result.compressedSize;
    const savedPct = ((saved / result.originalSize) * 100).toFixed(1);
    logger.info(`Processed ${result.file}`, {
      original: formatBytes(result.originalSize),
      compressed: formatBytes(result.compressedSize),
      webp: formatBytes(result.webpSize),
      saved: `${savedPct}%`,
    });
  }

  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
  const totalCompressed = results.reduce((sum, r) => sum + r.compressedSize, 0);
  const totalWebp = results.reduce((sum, r) => sum + r.webpSize, 0);

  logger.info('Image optimization complete', {
    filesProcessed: results.length,
    totalOriginal: formatBytes(totalOriginal),
    totalCompressed: formatBytes(totalCompressed),
    totalWebp: formatBytes(totalWebp),
  });
};

run();
