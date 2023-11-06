class GetThreadWithCommentsByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute({ threadId }) {
    this._verifyPayload(threadId);
    await this._threadRepository.checkAvaibilityThread(threadId);
    const comments = await this._commentRepository.getCommentsFromThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const threadData = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments: comments.map((comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
      })),
    };
    return threadData;
  }

  _verifyPayload(threadId) {
    if (!threadId) {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.NOT_CONTAIN_THREADID');
    }
    if (typeof threadId !== 'string') {
      throw new Error('GET_DETAIL_THREAD_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadWithCommentsByIdUseCase;
