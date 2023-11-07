import {
  GENERATE_CUCUMBER_HTML_REPORT,
  GENERATE_CUCUMBER_JUNIT_REPORT,
} from "./environment";
import { execSync } from "child_process";
import { existsSync, readFileSync, unlinkSync, writeFileSync } from "fs";
import logger from "./logger";

// import fetch from "node-fetch";
import createTestCafe from "testcafe";

export const isLiveModeOn = (): boolean => process.env.LIVE_MODE === "on";

export const testCafeErrorHandler = (error: any) => {
  logger.error("Caught error: ", error);
  process.exit(1);
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const testCafeTestFile = process.env.TEST_CAFE_TEST_FILE || "test.js";

/**
 * The purpose of this temporary test-file is to capture TestCafes' TestController.
 * We basically create and run a dummy test and capture the TestController for future tests.
 */
export const createTestFile = (): void => {
  if (existsSync(testCafeTestFile)) {
    return;
  }
  writeFileSync(
    testCafeTestFile,
    `import { testControllerHolder } from "./cucumber/support/testcafe/test-controller-holder";
fixture("TestController")
test("capture", testControllerHolder.capture)`
  );
};

export const removeTestFile = () => {
  if (existsSync(testCafeTestFile)) {
    unlinkSync(testCafeTestFile);
  }
};

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

/**
 * Creates a server instance of TestCafe and starts a test-runner.
 * For more info see {@link https://devexpress.github.io/testcafe/documentation/using-testcafe/programming-interface/testcafe.html}
 */

const testCafeHost = "localhost";
const testFile = "test.js";

const testCafeBrowser = process.env.BROWSER || "chrome";
const testCafeBrowserFlags = process.env.BROWSER_FLAGS || "";

const testCafeRecordVideo = !!process.env.RECORD_VIDEO;
const testCafeRecordVideoAsSingleFile =
  !!process.env.RECORD_VIDEO_AS_SINGLE_FILE;
const testCafeRecordVideoIfFailedOnly =
  !!process.env.RECORD_VIDEO_IF_FAILED_ONLY;

export const createTest = async (): Promise<TestCafe> =>
  createTestCafe({
    hostname: testCafeHost,
    ...(isLiveModeOn()
      ? {
          port1: 1337,
          port2: 1338,
        }
      : {}),
  });

export const closeTest = async (tc: TestCafe): Promise<TestCafe> => {
  if (isLiveModeOn()) {
    tc.close();
  }
  return tc;
};

export const createTestRunner = async (tc: TestCafe): Promise<Runner> =>
  isLiveModeOn() ? tc.createLiveModeRunner() : tc.createRunner();

export const setupTestRunner = (runner: Runner): Runner => {
  runner = runner
    .src(`./${testFile}`)
    .screenshots("screenshots/", false) // we create screenshots manually!
    .browsers(`${testCafeBrowser}${testCafeBrowserFlags}`.trim());
  if (testCafeRecordVideo) {
    runner = runner.video("videos", {
      singleFile: testCafeRecordVideoAsSingleFile,
      failedOnly: testCafeRecordVideoIfFailedOnly,
      pathPattern: "${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.mp4",
    });
  }

  return runner;
};

export const startTestRunner = async (runner: Runner): Promise<number> => {
  return runner.run({ quarantineMode: true }).catch((error: any) => {
    logger.error("Caught error: ", error);
    return 1;
  });
};

// function createServerAndRunTests(): void {
//   createTestCafe({ hostname: TEST_CAFE_HOST })
//     .then((tc: TestCafe) => {
//       testCafe = tc;
//       let runner: Runner = tc.createRunner();

//       runner = runner
//         .src(`./${TEST_FILE}`)
//         .screenshots("out/reports/screenshots/", false) // we create screenshots manually!
//         .browsers(`${BROWSER}${BROWSER_FLAGS}`.trim());
//       if (RECORD_VIDEO) {
//         runner = runner.video(VIDEO_DIR, {
//           singleFile: RECORD_SINGLE_FILE,
//           failedOnly: RECORD_FAILED_ONLY,
//           pathPattern: "${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.mp4",
//         });
//       }

//       return runner
//         .run({ quarantineMode: true })
//         .catch((error: any) => logger.error("Caught error: ", error));
//     })
//     .then(() => {
//       if (state.failedScenarios > 0) {
//         logger.warn(
//           `🔥🔥🔥 ${state.failedScenarios} scenarios (retry included) failed 🔥🔥🔥`
//         );
//       } else {
//         logger.info("All tests passed 😊");
//       }
//     })
//     .catch((error: any) => logger.error("Caught error: ", error));
// }

// function createLiveServerAndRunTests(): void {
//   createTestCafe({
//     hostname: TEST_CAFE_HOST,
//     port1: 1337,
//     port2: 1338,
//   })
//     .then((tc: TestCafe) => {
//       testCafe = tc;
//       let liveRunner: Runner = tc.createLiveModeRunner();

//       liveRunner = liveRunner
//         .src(`./${TEST_FILE}`)
//         .browsers(`${BROWSER}${BROWSER_FLAGS}`.trim());

//       return liveRunner
//         .run()
//         .catch((error: any) => logger.error("Caught error: ", error));
//     })
//     .then(() => testCafe.close())
//     .catch((error: any) => logger.error("Caught error: ", error));
// }

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// /**
//  * Fetch relevant application versions and store as metadata.
//  */
// export const fetchAndAddVersionsToMetadata = (): void => {
//   const responseHandler = (response) =>
//     response.ok ? response.json() : { version: "error" };
//   const getVersion = (url: string) =>
//     fetch(url, { method: "GET" }).then((response) => responseHandler(response));

//   getVersion(`${BASE_URL}/version`)
//     .then((res: any) => setMetadata("Some System", res.version as string))
//     .catch((err: any) => logger.error("Caught error: ", err));
// };

/**
 * Generates the HTML report if {@link GENERATE_CUCUMBER_HTML_REPORT} is `true`
 */
export const generateHtmlReport = (): void => {
  if (GENERATE_CUCUMBER_HTML_REPORT) {
    try {
      logger.info("Generating HTML report...");
      execSync(`node ${process.cwd()}/cucumber-html.config.js`);
    } catch (error) {
      logger.error("Could not generate cucumber html report", error);
    }
  }
};

/**
 * Generates the JUNIT report if {@link GENERATE_CUCUMBER_JUNIT_REPORT} is `true`
 */
export const generateJunitReport = (): void => {
  if (GENERATE_CUCUMBER_JUNIT_REPORT) {
    try {
      logger.info("Generating JUNIT report...");
      execSync(`node ${process.cwd()}/cucumber-junit.config.js`);
    } catch (error) {
      logger.error("Could not generate cucumber junit report", error);
    }
  }
};

/**
 * The purpose of this file is to notify the ci-build-server that at least one test/scenario failed.
 * The ci-build-server must then let the build fail (not pass).
 */
export const createTestFailFile = (testFailFile: string): void => {
  logger.info("Writing test-fail file...");
  writeFileSync(`reports/${testFailFile}`, "");
};
