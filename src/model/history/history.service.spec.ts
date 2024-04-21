import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService } from './history.service';
import { Model } from 'mongoose';
import { History } from './history';
import { getModelToken } from '@nestjs/mongoose';

describe('HistoryService', () => {
  let service: HistoryService;
  let historyModel: Model<History>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryService, {
        provide: getModelToken(History.name),
        useValue: {
          create: jest.fn(),
          find: jest.fn(),
        },
      }],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
    historyModel = module.get<Model<History>>(getModelToken(History.name));
  });

  describe('insert', () => {
    it('should insert data into the history', async () => {
      const mockHistoryData = { };
      await service.insert(mockHistoryData as any);

      expect(historyModel.create).toHaveBeenCalledWith(mockHistoryData);
    });
  });

  describe('viewUserHistory', () => {
    it('should return user history', async () => {
      const mockEmail = 'test@example.com';
      const mockHistoryData = [];
      (historyModel.find as any).mockResolvedValue(mockHistoryData);

      const result = await service.viewUserHistory(mockEmail);

      expect(result).toEqual(mockHistoryData);
      expect(historyModel.find).toHaveBeenCalledWith({ email: mockEmail });
    });
  });
});