import { cwd } from "process";
import { homedir } from "os";

/**
 * Path-Information
 * - home directory
 * - current working directory
 */
const DEFAULT_HOME = homedir(); // /home/<usr>
const DEFAULT_CWD = cwd();

/**
 * Download/Upload/Output directories + files
 */
const DEFAULT_DOWNLOAD_DIR = `${DEFAULT_HOME}/Downloads`;
const DEFAULT_OUTPUT_DIR = `${DEFAULT_CWD}/output`;

/**
 * Exported environment variables
 */
export const VIDEO_DIR = `${DEFAULT_OUTPUT_DIR}/videos`;
export const LOCALE = process.env.LOCALE || "en";
export const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || DEFAULT_DOWNLOAD_DIR;

/**
 * Automatically generates the cucumber report
 * Video Recording is disabled by default
 */
export const GENERATE_CUCUMBER_HTML_REPORT =
  process.env.GENERATE_HTML_REPORT !== "false"; // by default true
export const GENERATE_CUCUMBER_JUNIT_REPORT =
  process.env.GENERATE_JUNIT_REPORT !== "false";

const DEFAULT_BASE_URL = "http://localhost:4200";
export const BASE_URL = process.env.BASE_URL || DEFAULT_BASE_URL;
