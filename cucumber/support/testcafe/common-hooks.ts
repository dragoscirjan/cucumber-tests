// import { ICustomWorld } from "./custom-world";
// import { config } from "./config";
// import {
//   Before,
//   After,
//   BeforeAll,
//   AfterAll,
//   Status,
//   setDefaultTimeout,
// } from "@cucumber/cucumber";

// import { ITestCaseHookParameter } from "@cucumber/cucumber/lib/support_code_library_builder/types";
// import { ensureDir } from "fs-extra";

// const tracesDir = "traces";

// setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

// BeforeAll(async function () {
//   await ensureDir(tracesDir);
// });

// Before({ tags: "@ignore" }, async function () {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   return "skipped" as any;
// });

// Before({ tags: "@debug" }, async function (this: ICustomWorld) {
//   // this.debug = true;
// });

// Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
//   this.startTime = new Date();
//   this.testName = pickle.name.replace(/\W/g, "-");
//   // this.test
//   this.feature = pickle;
// });

// After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
//   if (result) {
//     await this.attach(
//       `Status: ${result?.status}. Duration:${result.duration?.seconds}s`
//     );
//     if (result.status !== Status.PASSED) {
//     }
//   }
// });

// AfterAll(async function () {
//   await browser.close();
// });
