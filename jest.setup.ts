import '@testing-library/jest-dom';
import { Request, Response } from 'node-fetch';

// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';

if (typeof global !== 'undefined') {
  if (typeof global.TextEncoder === 'undefined') {
    (global as any).TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === 'undefined') {
    (global as any).TextDecoder = TextDecoder;
  }
}

// Polyfill for Request and Response in JSDOM environment
if (typeof global !== 'undefined' && !global.Request) {
  (global as any).Request = Request;
}
if (typeof global !== 'undefined' && !global.Response) {
  (global as any).Response = Response;
}
