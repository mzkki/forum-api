const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

// support data purpose
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const LoginUserUseCase = require('../../../Applications/use_case/LoginUserUseCase');
const ThreadsTableTestHelper = require('../../../../tests/ThreadTableTestHelper');

describe('/comments endpoint', () => {
  let threadId;
  beforeEach(async () => {
    const userPayload = {
      username: 'testing_purpose',
      fullname: 'test',
      password: 'secret',
    };

    const threadPayload = {
      title: 'this is title',
      body: 'this is body',
    };

    const server = await createServer(container);

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const userLoginPayload = {
      username: 'testing_purpose',
      password: 'secret',
    };
    const loginUserUseCase = container.getInstance(LoginUserUseCase.name);
    const { accessToken } = await loginUserUseCase.execute(userLoginPayload);

    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: threadPayload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    threadId = responseJson.data.addedThread.id;
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      const userLoginPayload = {
        username: 'testing_purpose',
        password: 'secret',
      };
      const loginUserUseCase = container.getInstance(LoginUserUseCase.name);
      const { accessToken } = await loginUserUseCase.execute(userLoginPayload);

      const commentPayload = {
        content: 'test comment',
      };

      const server = await createServer(container);
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });
});
