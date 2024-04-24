import { HistoryService, ReviewService, VehicleService, DrivingPositionData } from '../../src/model';
import { WorkerService, QueueService } from '../../src/queue';
import { PositionService, GuidService } from '../../src/services';

describe('WorkerService', () => {
  let workerService: WorkerService;
  let queueService: QueueService;
  let positionService: PositionService;
  let historyService: HistoryService;
  let reviewService: ReviewService;
  let vehicleService: VehicleService;
  let guidService: GuidService;

  beforeEach(() => {
    queueService = new QueueService();
    positionService = new PositionService();
    historyService = new HistoryService('' as any, '' as any);
    reviewService = new ReviewService('' as any, '' as any, '' as any);
    vehicleService = new VehicleService('' as any, '' as any, '' as any, '' as any);
    guidService = new GuidService();
    workerService = new WorkerService(queueService, positionService, historyService, reviewService, vehicleService, guidService);
  });

  it('should be defined', () => {
    expect(workerService).toBeDefined();
  });

  describe('addToQueue', () => {
    it('should add ride data to the queue with processing status false', () => {
      const data: DrivingPositionData = {} as any;
      const addToQueueSpy = jest.spyOn(queueService, 'addToQueue');

      workerService.addToQueue(data);

      expect(addToQueueSpy).toHaveBeenCalledWith(expect.objectContaining({
        data,
        processing: false,
        taskId: expect.any(String)
      }));
    });
  });

  describe('processQueue', () => {
    it('should process the queue by calling process method for each task', async () => {
      const queue = [
        { taskId: 'task1', data: { /* mock data */ }, processing: false },
        { taskId: 'task2', data: { /* mock data */ }, processing: false },
      ] as any;
      const getQueueSpy = jest.spyOn(queueService, 'getQueue').mockReturnValue(queue);
      const processSpy = jest.spyOn(workerService, 'process' as any).mockResolvedValue({});

      await workerService.processQueue();

      expect(getQueueSpy).toHaveBeenCalled();
      expect(processSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle errors thrown during processing', async () => {
      const mockError = new Error('An error occurred');
      jest.spyOn(queueService, 'getQueue').mockImplementation(() => {
        throw mockError;
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await workerService.processQueue();

      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    });
  });

  describe('process', () => {
    // Write tests for the process method
  });
});
