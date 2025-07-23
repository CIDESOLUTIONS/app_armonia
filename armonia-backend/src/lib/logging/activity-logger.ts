import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogger {
  logActivity(data: { userId: number; action: string; resourceType: string; resourceId: number; details: any }) {
    console.log('Activity logged:', data);
  }
}