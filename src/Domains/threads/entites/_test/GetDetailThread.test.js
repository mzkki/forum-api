const GetDetailThread = require('../GetDetailThread');

describe('A GetDetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
    };

    expect(() => new GetDetailThread(payload)).toThrowError('GET_DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
      username: ['user-123'],
    };

    expect(() => new GetDetailThread(payload)).toThrow('GET_DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetDetailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
      username: 'user-123',
    };

    const getDetailThread = new GetDetailThread(payload);

    expect(getDetailThread.id).toEqual(payload.id);
    expect(getDetailThread.title).toEqual(payload.title);
    expect(getDetailThread.body).toEqual(payload.body);
    expect(getDetailThread.date).toEqual(payload.date);
    expect(getDetailThread.username).toEqual(payload.username);
    expect(getDetailThread.comments).toEqual(payload.comments);
  });
});
