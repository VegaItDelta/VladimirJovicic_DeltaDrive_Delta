import { WorkerModule } from '../../src/queue';

describe('WorkerModule', () => {
  const module = new WorkerModule();

  it('should create', () => {
    expect(module).toBeDefined();
  })
})
