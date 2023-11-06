const GetDetailComment = require('../GetDetailComment');

describe('GetDetailComment Entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'this is date',
    };

    expect(() => new GetDetailComment(payload)).toThrowError('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'this is date',
      content: 123,
    };

    expect(() => new GetDetailComment(payload)).toThrowError('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create get detail comment object correcly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: 'this is date',
      content: '123',
    };

    const detailComment = new GetDetailComment(payload);
    const getComments = detailComment._addComment(detailComment);

    expect(getComments[0].id).toEqual(payload.id);
    expect(getComments[0].username).toEqual(payload.username);
    expect(getComments[0].date).toEqual(payload.date);
    expect(getComments[0].content).toEqual(payload.content);
  });
});
