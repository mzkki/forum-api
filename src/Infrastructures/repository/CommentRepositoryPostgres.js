const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const GetDetailComment = require('../../Domains/comments/entities/GetDetailComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { content, owner, threadId } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, threadId, date, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentOwner(payload) {
    const { commentId, owner } = payload;

    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak melakukan hal ini');
    }
  }

  async softDeleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentFromThread(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, users.username FROM comments
      LEFT JOIN users ON users.id = comments.owner WHERE thread_id = $1`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const rawComments = result.rows;

    let comments = [];
    rawComments.map((comment) => {
      const detailComment = new GetDetailComment(comment);
      comments = detailComment._addComment(comment);
      return comment;
    });
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;
