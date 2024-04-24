import { v4 as uuidv4 } from 'uuid';
import { GuidService } from '../../../src/services';

jest.mock('uuid');

describe('GuidService', () => {
  let guidService: GuidService;

  beforeEach(() => {
    guidService = new GuidService();
  });

  it('should be defined', () => {
    expect(guidService).toBeDefined();
  });

  it('should generate a GUID', () => {
    const mockGuid = 'mock-guid';
    (uuidv4 as jest.Mock).mockReturnValue(mockGuid);

    const guid = guidService.generateGuid();

    expect(uuidv4).toHaveBeenCalled();
    expect(guid).toBe(mockGuid);
  });
});
