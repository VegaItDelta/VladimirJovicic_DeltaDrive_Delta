import { Test, TestingModule } from '@nestjs/testing';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { HttpStatus } from '@nestjs/common';

describe('HistoryController', () => {
  let controller: HistoryController;
  let historyServiceMock = {
    viewUserHistory: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [{
        provide: HistoryService,
        useValue: historyServiceMock
      }],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
  });

  describe('viewUserHistory', () => {
    it('should return user history', async () => {
      const mockSession = {
        passenger: {
          email: 'test@example.com',
        },
      };
      const mockHistoryData = [];
      jest.spyOn(historyServiceMock, 'viewUserHistory').mockResolvedValueOnce(mockHistoryData);
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.viewUserHistory(mockSession, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: `History for the user: ${mockSession.passenger.email}`,
        data: mockHistoryData,
      });
    });

    it('should handle missing session', async () => {
      const mockSession = null;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.viewUserHistory(mockSession, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Can not find the session!' });
    });

    it('should handle missing passenger in session', async () => {
      const mockSession = { passenger: null };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.viewUserHistory(mockSession, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'Can not find the passenger in the session!' });
    });

    it('should handle missing email in passenger session', async () => {
      const mockSession = { passenger: { email: null } };
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.viewUserHistory(mockSession, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.send).toHaveBeenCalledWith({ message: 'No email saved in the passenger session' });
    });
  });
});