const GetThreadWithComments = require('../GetThreadWithComments');

describe('GetThreadWithComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
      username: 'dicoding',
    };

    expect(() => new GetThreadWithComments(payload)).toThrowError('GET_THREAD_WITH_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
      username: 'dicoding',
      comments: 'content',
    };

    expect(() => new GetThreadWithComments(payload)).toThrowError('GET_THREAD_WITH_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create get thread with comments object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'contoh title',
      body: 'contoh body',
      date: 'contoh date',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'dicoding-123',
          date: 'this is date',
          content: '123',
        },
      ],
    };

    const threadWithComments = new GetThreadWithComments(payload);
    expect(threadWithComments.id).toEqual(payload.id);
    expect(threadWithComments.title).toEqual(payload.title);
    expect(threadWithComments.body).toEqual(payload.body);
    expect(threadWithComments.date).toEqual(payload.date);
    expect(threadWithComments.username).toEqual(payload.username);
    expect(threadWithComments.comments).toEqual(payload.comments);
  });
});
