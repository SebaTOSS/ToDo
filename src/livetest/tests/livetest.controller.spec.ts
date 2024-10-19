import { Test, TestingModule } from '@nestjs/testing';
import { LiveTestController } from '../livetest.controller';

describe('LiveTestController', () => {
  let controller: LiveTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveTestController],
    }).compile();

    controller = module.get<LiveTestController>(LiveTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a message indicating the application is running correctly', () => {
    const response = controller.checkLiveTest();
    expect(response).toEqual({ message: 'Application is running correctly' });
  });
});