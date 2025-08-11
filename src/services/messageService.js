import api from './api';

export const createConversation = async (participantIds) => {
  return api.post('/conversations', {
    user1Id: participantIds[0],
    user2Id: participantIds[1]
  });
};
