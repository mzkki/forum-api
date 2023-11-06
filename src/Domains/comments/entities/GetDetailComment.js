class GetDetailComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, content, date,
    } = payload;

    this.id = id;
    this.username = username;
    this.content = content;
    this.date = date;

    this.comments = [];
  }

  _verifyPayload(payload) {
    const {
      id, username, content, date,
    } = payload;
    if (!id || !username || !content || !date) {
      throw new Error('GET_DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof date !== 'string') {
      throw new Error('GET_DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _addComment(payload) {
    this.comments.push(payload);
    return this.comments;
  }
}

module.exports = GetDetailComment;
