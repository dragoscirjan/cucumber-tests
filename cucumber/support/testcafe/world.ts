import { setWorldConstructor, World, IWorldOptions } from "@cucumber/cucumber";
import * as messages from "@cucumber/messages";

import testControllerHolder from "./holder";

export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  debug: boolean;
  feature?: messages.Pickle;

  testName?: string;
  startTime?: Date;
}

export class CustomWorld extends World implements ICustomWorld {
  public waitForTestController: Promise<any> | null = null;
  public testController: TestController | null = null;

  constructor(options: IWorldOptions) {
    super(options);

    // The waitForTestController promise object waits for TestCafe to finish setting up the controller asynchronously,
    // then adds it to Cucumber’s world scope as testController.
    // It calls the testControllerHolder.get function to trigger the promise to return the testController.
    this.waitForTestController = testControllerHolder.get().then((tc: any) => {
      console.log("waitForTestController", tc);
      this.testController = tc;
      return tc;
    });
  }

  debug = false;
}

setWorldConstructor(CustomWorld);
