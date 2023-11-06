const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadWithCommentsByIdUseCase = require('../../../../Applications/use_case/GetThreadWithCommentsByIdUseCase');
const SoftDeleteCommentUseCase = require('../../../../Applications/use_case/SoftDeleteCommentUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadWithCommentsHandler = this.getThreadWithCommentsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { title, body } = request.payload;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ title, body, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { content } = request.payload;
    const { threadId } = request.params;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ content, owner, threadId });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const softDeleteCommentUseCase = this._container.getInstance(SoftDeleteCommentUseCase.name);
    await softDeleteCommentUseCase.execute({ owner, threadId, commentId });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadWithCommentsHandler(request, h) {
    const getThreadwithCommentsByIdUseCase = this
      ._container.getInstance(GetThreadWithCommentsByIdUseCase.name);
    // console.log(getThreadwithCommentsByIdUseCase);
    const data = await getThreadwithCommentsByIdUseCase.execute(request.params);

    const response = h.response({
      status: 'success',
      data: {
        thread: data,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
