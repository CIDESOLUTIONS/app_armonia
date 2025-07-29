import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller.js';
import { PlansService } from './plans.service.js';

@Module({
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService], // Export PlansService so FeatureGuard can use it
})
export class PlansModule {}
