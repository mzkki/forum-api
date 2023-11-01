const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');

// data support purpose
// user data
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

// thread data
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AddThread = require('../../../Domains/threads/entites/AddThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('CommmentRepositoryPostgres', () => {
  beforeEach(async () => {
    const fakeIdGenerator = () => '213';
    const userPayload = new RegisterUser({
      username: 'test_purpose_only',
      fullname: 'for testing',
      password: 'test',
    });
    const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
    await userRepositoryPostgres.addUser(userPayload);

    const threadPayload = new AddThread({
      title: 'thread test',
      body: 'body thread',
      owner: 'user-213',
    });

    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
    await threadRepositoryPostgres.addThread(threadPayload);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return addedComment correctly', async () => {
      const commentPayload = new AddComment({
        content: 'this is comment',
        owner: 'user-213',
        threadId: 'thread-213',
      });

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.addComment(commentPayload);

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      const commentPayload = new AddComment({
        content: 'this is comment',
        owner: 'user-213',
        threadId: 'thread-213',
      });

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const addedComment = await commentRepositoryPostgres.addComment(commentPayload);

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'this is comment',
        owner: 'user-213',
      }));
    });
  });
});
