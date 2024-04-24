import { HistoryService } from '../../../src/model';

describe('HistoryService', () => {
  const historyModelMock = {
    create: jest.fn()
  }
  const cacheServiceMock = {}
  const service: HistoryService = new HistoryService(historyModelMock as any, cacheServiceMock as any);

  it('should create', () => {
    expect(service).toBeDefined();
  })

  describe('insert', () => {
    it('should call create with the provided data', async () => {
      const mockData = 'mockData';
      await service.insert(mockData as any);
      expect(historyModelMock.create).toHaveBeenCalledWith(mockData);
    });
  })
  
});