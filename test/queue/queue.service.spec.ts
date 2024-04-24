import { QueueService } from '../../src/queue';
import { QueueData } from '../../src/queue/queue.service';

describe('QueueService', () => {
  let queueService: QueueService;

  beforeEach(() => {
    queueService = new QueueService();
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  it('should add data to the queue', () => {
    const data: QueueData = {
      taskId: 'task1',
      data: { },
      processing: false,
    } as any;

    queueService.addToQueue(data);

    expect(queueService.getQueue()).toEqual([data]);
  });

  it('should get the queue', () => {
    const data1: QueueData = {
      taskId: 'task1',
      data: { /* mock DrivingPositionData */ },
      processing: false,
    } as any;
    const data2: QueueData = {
      taskId: 'task2',
      data: { /* mock DrivingPositionData */ },
      processing: true,
    } as any;

    queueService.addToQueue(data1);
    queueService.addToQueue(data2);

    expect(queueService.getQueue()).toEqual([data1, data2]);
  });

  it('should remove data from the queue', () => {
    const data1: QueueData = {
      taskId: 'task1',
      data: {},
      processing: false,
    } as any;
    const data2: QueueData = {
      taskId: 'task2',
      data: {},
      processing: true,
    } as any;

    queueService.addToQueue(data1);
    queueService.addToQueue(data2);

    queueService.removeFromQueue(data1);

    expect(queueService.getQueue()).toEqual([data2]);
  });

  it('should not remove data from the queue if taskId does not exist', () => {
    const data1: QueueData = {
      taskId: 'task1',
      data: { },
      processing: false,
    } as any;
    const data2: QueueData = {
      taskId: 'task2',
      data: {},
      processing: true,
    } as any;

    queueService.addToQueue(data1);
    queueService.addToQueue(data2);

    const dataToRemove: QueueData = {
      taskId: 'task3', // taskId does not exist in the queue
      data: {},
      processing: false,
    } as any;

    queueService.removeFromQueue(dataToRemove);

    expect(queueService.getQueue()).toEqual([data1, data2]);
  });
});
