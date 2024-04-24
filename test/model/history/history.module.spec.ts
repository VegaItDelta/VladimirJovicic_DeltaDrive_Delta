import { HistoryModule } from '../../../src/model';

describe('HistoryModule', () => {

  let historyModule: HistoryModule;

  beforeEach(() => {
    historyModule = new HistoryModule();

  });
  it('should init module', () => {
    expect(historyModule).toBeDefined();
  });
});
