class TestControllerHolder {
  private testController: any;
  private captureResolver: (() => void) | null;
  private getResolver: ((controller: any) => void) | null;
  public testRun?: {
    lastDriverStatusResponse: string;
  };

  constructor() {
    this.testController = null;
    this.captureResolver = null;
    this.getResolver = null;
  }

  // This method captures the testController object and returns a promise to be resolved when the Cucumber script finishes.
  // It will be called by the TestCafe test at the beginning.
  capture(t: any): Promise<any> {
    this.testController = t;

    if (this.getResolver) {
      this.getResolver(t);
    }

    return new Promise((resolve) => {
      this.captureResolver = resolve as any;
    });
  }

  // This method frees the testController object.
  // It will be called by the TestCafe test at the end.
  free(): void {
    this.testController = null;

    if (this.captureResolver) {
      this.captureResolver();
    }
  }

  // This method resolves and gets the testController object.
  // It will be called by CucumberWorld and helps in setting up the controller asynchronously,
  // then adds it to Cucumber’s world scope.
  get(): Promise<any> {
    console.log("testControllerHolder.get", this.testController);
    return new Promise((resolve) => {
      if (this.testController) {
        resolve(this.testController);
      } else {
        this.getResolver = resolve;
      }
    });
  }
}

// Exporting the class for other files to import and use
export default new TestControllerHolder();
