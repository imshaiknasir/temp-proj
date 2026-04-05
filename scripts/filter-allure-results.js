import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESULTS_DIR = path.resolve(__dirname, '..', 'allure-results');
const REPORT_TEST_RESULTS_DIR = path.resolve(__dirname, '..', 'allure-report', 'data', 'test-results');
const AWESOME_REPORT_TEST_RESULTS_DIR = path.resolve(__dirname, '..', 'allure-report', 'awesome', 'data', 'test-results');
const LABELS_TO_REMOVE = new Set(['language', 'framework', 'package', 'titlePath']);

function sanitizeNode(node) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      sanitizeNode(item);
    }
    return;
  }

  if (Array.isArray(node.labels)) {
    node.labels = node.labels.filter((label) => !LABELS_TO_REMOVE.has(label.name));
  }

  if (node.groupedLabels && typeof node.groupedLabels === 'object') {
    for (const labelName of LABELS_TO_REMOVE) {
      delete node.groupedLabels[labelName];
    }
  }

  for (const value of Object.values(node)) {
    sanitizeNode(value);
  }
}

function sanitizeJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);

  sanitizeNode(json);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
}

function sanitizeDirectory(dirPath, fileFilter) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  const resultFiles = fs.readdirSync(dirPath).filter(fileFilter);

  for (const fileName of resultFiles) {
    sanitizeJsonFile(path.join(dirPath, fileName));
  }
}

function main() {
  sanitizeDirectory(RESULTS_DIR, (fileName) => fileName.endsWith('-result.json'));
  sanitizeDirectory(REPORT_TEST_RESULTS_DIR, (fileName) => fileName.endsWith('.json'));
  sanitizeDirectory(AWESOME_REPORT_TEST_RESULTS_DIR, (fileName) => fileName.endsWith('.json'));
}

main();