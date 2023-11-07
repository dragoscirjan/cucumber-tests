import fs from "fs";
import createTestCafe from "testcafe";
import testControllerHolder from "./holder";
import { AfterAll, setDefaultTimeout, Before, After } from "@cucumber/cucumber";

const timeout: number = 100000;
let cafeRunner: TestCafe;

const testFile = "cucumber/support/testcafe/cucumbertest.ts";

function createTestFile(): void {
  fs.writeFileSync(
    testFile,
    'import { fixture } from "testcafe";\n\n' +
      'import testControllerHolder from "./holder";\n\n' +
      'fixture("cucumberfixture")\n' +
      "test\n" +
      '("test", testControllerHolder.capture);'
  );
}

function runTest(browser: string): void {
  createTestCafe("localhost", 1337, 1338).then((tc: TestCafe) => {
    cafeRunner = tc;
    const runner = tc.createRunner();
    return runner
      .src(testFile)
      .screenshots("screenshots/", true)
      .browsers(browser)
      .run();
  });
}

setDefaultTimeout(timeout);

Before(async function (cw: any) {
  runTest("chrome");
  createTestFile();
  // console.log("Before", cw, this);
  // await this.waitForTestController;
  // console.log("Before", "controller found", this.testController);
  // await this.testController.maximizeWindow();
});

After(function () {
  fs.unlinkSync(testFile);
  testControllerHolder.free();
});

AfterAll(function () {
  let intervalId: NodeJS.Timeout;
  const waitForTestCafe = () => {
    intervalId = setInterval(checkLastResponse, 500);
  };

  const checkLastResponse = () => {
    if (
      testControllerHolder.testRun?.lastDriverStatusResponse ===
      "test-done-confirmation"
    ) {
      if (cafeRunner) {
        cafeRunner?.close();
      }
      clearInterval(intervalId);
      process.exit();
    }
  };

  waitForTestCafe();
});
