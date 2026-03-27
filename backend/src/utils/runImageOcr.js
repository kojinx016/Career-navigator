import Tesseract from "tesseract.js";

const imagePath = process.argv[2];

if (!imagePath) {
  console.error("Image path is required.");
  process.exit(1);
}

try {
  const result = await Tesseract.recognize(imagePath, "eng");
  process.stdout.write(result.data.text?.trim() || "");
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Image OCR failed.");
  process.exit(1);
}