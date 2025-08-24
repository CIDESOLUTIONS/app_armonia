import { fetchApi } from '@/lib/api';

export interface LogEvent {
  id: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source: string;
  timestamp: string;
  user?: { id: string; email: string };
}

export interface LogFilters {
  level?: string;
  source?: string;
  limit?: number;
}

/**
 * Fetches log events from the backend.
 * @param filters Optional filters for level, source, and limit.
 */
export async function getLogs(filters: LogFilters = {}): Promise<LogEvent[]> {
  const query = new URLSearchParams();
  if (filters.level) query.append('level', filters.level);
  if (filters.source) query.append('source', filters.source);
  if (filters.limit) query.append('limit', filters.limit.toString());

  const response = await fetchApi(`/monitoring/logs?${query.toString()}`);
  return response.data || response;
}

/**
 * Sends a log event to the backend.
 * @param logData The log event data.
 */
export async function logEvent(logData: Partial<LogEvent>): Promise<void> {
  await fetchApi('/monitoring/log', {
    method: 'POST',
    body: JSON.stringify(logData),
  });
}
