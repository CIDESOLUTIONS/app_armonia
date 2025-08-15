import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityLogger {
  logActivity(data: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId: string;
    details: any;
  }) {
    console.log('Activity logged:', data);
  }
}
