import { HttpStatus } from '@nestjs/common';
import { HistoryController } from '../../../src/model/history/history.controller';
describe('HistoryController', () => {
  const sessionMock = {
    passenger: {
      email: 'jon@doe.com'
    }
  }

  const responseMock = {
    status: jest.fn().mockReturnValue({ send: jest.fn() }) as any
  };

  const mockHistoryService = {
    getUserHistory: jest.fn()
  };
  const controller = new HistoryController(mockHistoryService as any);

  it('should create', () => {
    expect(controller).toBeDefined();
  });

  describe('get', () => {
    it('should call historyService.getUserHistory with the session email', async () => {
      await controller.get(sessionMock, responseMock);
      expect(mockHistoryService.getUserHistory).toHaveBeenCalledWith(sessionMock.passenger.email);
    });

    it('should call status with 200 OK', async () => {
      await controller.get(sessionMock, responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
    });

    it('should call send with 200 OK', async () => {
      const mockHistory = 'mockHistory';

      const mockResonse = {
        message: 'History for the user: jon@doe.com',
        data: mockHistory
    }
      mockHistoryService.getUserHistory.mockReturnValueOnce(mockHistory);
      await controller.get(sessionMock, responseMock);
      expect(responseMock.status().send).toHaveBeenCalledWith(mockResonse);
    });

    it('should throw error', async () => {
      const mockError = new Error();
      mockHistoryService.getUserHistory.mockRejectedValue(mockError);
      try {
        await controller.get(sessionMock, responseMock);
      } catch(e) {
        expect(mockError).toBe(e);
      }

    })
  });
})