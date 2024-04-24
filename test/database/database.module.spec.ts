import { DatabaseModule } from "../../src/database";

describe('DatabaseModule', () => {
  const module = new DatabaseModule();

  it('should create', () => {
    expect(module).toBeDefined();
  })
});