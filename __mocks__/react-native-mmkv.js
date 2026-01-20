export const createMMKV = jest.fn(() => ({
  set: jest.fn(),
  getString: jest.fn(),
  remove: jest.fn(),
}));
