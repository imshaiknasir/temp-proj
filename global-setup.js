// @ts-check
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export default function globalSetup() {
  const resultsDir = path.resolve('allure-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const envInfo = {
    OS: `${os.platform()} ${os.release()}`,
    Host: os.hostname(),
    Build: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER || 'local',
    Environment: process.env.TEST_ENV || 'local',
    Execution_Mode: process.env.GITHUB_ACTIONS ? 'GitHub Actions' : 'Local',
    Node_Version: process.version,
  };

  const content = Object.entries(envInfo)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(path.join(resultsDir, 'environment.properties'), content);
}
