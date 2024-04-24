import { CacheModule } from "../../src/cache";

describe('CacheModule', () => {

  const module = new CacheModule();

  it('should create the module', () => {
    expect(module).toBeDefined();
  });

});
