import { UserByIdPipe } from './user-by-id.pipe';

describe('UserByIdPipe', () => {
  it('create an instance', () => {
    const pipe = new UserByIdPipe();
    expect(pipe).toBeTruthy();
  });
});
