const { PaddleOcrService, V4_SERVER_DOC_MODEL } = require("ppu-paddle-ocr");
const sharp = require("sharp");

/**
 * Automatically auto-rotates, converts to grayscale, normalizes contrast, and sharpens the image.
 * This preprocessing pipeline is extremely effective for extracting small text from phone camera photos.
 */
const cleanImageForOcr = async (buffer) => {
  return await sharp(buffer)
    .rotate()
    .greyscale()
    .normalise()
    .sharpen()
    .toBuffer();
};

/**
 * Standard cleanups for a single text line.
 */
const cleanLineText = (text) => {
  // TODO: Consider adding more advanced NLP-based cleaning if needed
  return text
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .replace(/([a-zA-Z])\s*\(/g, "$1 (") // Fix spacing before parentheses
    .replace(/\)\s*,/g, "),") // Fix spacing after parentheses
    .replace(/\s*,\s*/g, ", ") // Spacing after commas
    .replace(/[^a-zA-Z0-9\s,\.\(\)\[\]\-\:\;\%\/\&]/g, "") // Strip random noise but keep useful characters
    .trim();
};

let instance = null;

const initOcrEngine = async () => {
  if (!instance) {
    console.log("Booting OCR models...");

    instance = new PaddleOcrService({
      model: V4_SERVER_DOC_MODEL, // Can be swapped for V6_MEDIUM_MODEL for higher accuracy on small text
      detection: {
        maxSideLength: 2048, // Higher resolution for tiny ingredients text
        minimumAreaThreshold: 10, // Capture small symbols/punctuation
      },
      recognition: {
        strategy: "per-box", // Highly accurate box-by-box recognition
      },
    });

    await instance.initialize();
    console.log("OCR Engine loaded successfully.");
  }
};

const getOcrEngine = () => {
  if (!instance) {
    throw new Error("OCR Engine was called before it was initialized!");
  }
  return instance;
};

module.exports = {
  initOcrEngine,
  getOcrEngine,
  cleanImageForOcr,
  cleanLineText,
};
