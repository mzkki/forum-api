const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const AddThread = require('../../../Domains/threads/entites/AddThread');
const AddedThread = require('../../../Domains/threads/entites/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return addedThread correctly', async () => {
      const fakeIdGenerator = () => '0812';
      const registerUser = new RegisterUser({
        username: 'testing',
        password: 'testing',
        fullname: 'testing',
      });
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);
      await userRepositoryPostgres.addUser(registerUser);
      const users = await UsersTableTestHelper.findUsersById('user-0812');

      const threadData = new AddThread({
        title: 'ini title',
        body: 'ini body',
        owner: users[0].id,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await threadRepositoryPostgres.addThread(threadData);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-0812');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const addThread = new AddThread({
        title: 'ini title',
        body: 'ini body',
        owner: 'user-0812',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'ini title',
        owner: 'user-0812',
      }));
    });
  });
});
