import { After, AfterAll, BeforeAll, Status } from "@cucumber/cucumber";

import logger from "./logger";
import { testControllerHolder } from "./test-controller-holder";
import { testControllerConfig } from "./test-controller-config";
import {
  createTestFailFile,
  createTestFile,
  isLiveModeOn,
  createTest,
  createTestRunner,
  setupTestRunner,
  startTestRunner,
  closeTest,
  testCafeErrorHandler,
  removeTestFile,
} from "./helper";

const DELAY = 5 * 1000;

let testCafe: TestCafe;

const state = {
  failedScenarios: 0,
  browserMedadataAdded: false,
  startTime: 0,
};

/**
 * Runs before all tests are executed.
 * - collect metadata for the HTML report
 * - create the dummy test file to capture the {@link TestController}
 * - create TestCafe and runs the {@link Runner} w.r.t. the set environment variables (config)
 */
BeforeAll((callback: any) => {
  // createMetadataFile();

  // setMetadata("Base URL", BASE_URL);
  // setMetadata("Locale", LOCALE);
  // tslint:disable-next-line:no-commented-code
  // TODO if you want to have the app version in the report fetchAndAddVersionsToMetadata();

  state.startTime = new Date().getTime();

  testControllerHolder.register(testControllerConfig);
  //   SelectorFactoryInitializer.init();

  createTestFile();

  createTest()
    .then(async (tc: TestCafe) => {
      await createTestRunner(tc)
        .then(setupTestRunner)
        .then(startTestRunner)
        .catch(testCafeErrorHandler);
      return tc;
    })
    .then((tc) => {
      testCafe = tc;
      return tc;
    })
    // .then(closeTest)
    .catch(testCafeErrorHandler);

  setTimeout(() => callback(), DELAY);
});

/**
 * AfterEach (scenario):
 * - add metadata regarding the environment (browser + OS)
 * - take screenshot if the test case (scenario) has failed
 */
After(async function (this: any, testCase: any) {
  if (isLiveModeOn()) {
    return;
  }

  if (testCase.result.status === Status.FAILED) {
    state.failedScenarios += 1;
    await this.addScreenshotToReport();
  }
});

/**
 * Runs after all tests got executed.
 * Hook-Order:
 * 0. Hook: BeforeAll
 * - execute dummy test ('fixture') and capture TestController
 * 1. Execute feature 1 -> feature n (Hook: After)
 * 2. Hook: After All
 * - add metadata (start, stop and duration)
 * - cleanup (destroy TestController, delete dummy test file)
 * - generate reports (JSON, HTML and JUNIT)
 * - create file to indicate that tests failed (for CI/CD) if test failed
 * - shutdown TestCafe
 */
AfterAll((callback: any) => {
  if (isLiveModeOn()) {
    return;
  }

  testControllerHolder.destroy();

  removeTestFile();

  const testFailFile = process.env.TEST_FAIL_FILE || "";
  if (state.failedScenarios > 0 && testFailFile) {
    createTestFailFile(testFailFile);
  }

  setTimeout(() => callback(), DELAY);
  setTimeout(() => {
    logger.info("Shutting down TestCafe...");
    testCafe
      .close()
      .then(() => logger.info("Finished"))
      .catch((error: any) => logger.error("Caught error: ", error));
  }, DELAY * 2);
});
