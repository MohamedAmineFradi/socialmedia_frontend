import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';


export const fetchConversations = createAsyncThunk(
  'messaging/fetchConversations',
  async () => {
    try {
      const response = await api.get('/conversations/me');
      return response.data.map(conv => ({
        id: conv.id,
        participants: [conv.user1Id, conv.user2Id],
        createdAt: conv.createdAt,
        lastUpdated: conv.lastUpdated
      }));
    } catch (error) {
      throw error;
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'messaging/fetchMessages',
  async (conversationId) => {
    try {
      const response = await api.get(`/conversations/${conversationId}/messages`);
      const messages = response.data.content || [];
      return { conversationId, messages };
    } catch (error) {
      throw error;
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messaging/sendMessage', 
  async ({ conversationId, content, senderId }) => {
    try {
      const response = await api.post('/messages', {
        conversationId,
        content,
        senderId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: {
    conversations: [],
    currentConversation: null,
    messagesByConversation: {},
    loading: false,
    error: null,
    sending: false,
    sendError: null,
  },
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    addConversation(state, action) {
      state.conversations.push(action.payload);
    },
    updateConversation(state, action) {
      const index = state.conversations.findIndex(
        conv => conv.id === action.payload.id
      );
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },
    removeConversation(state, action) {
      const id = action.payload;
      state.conversations = state.conversations.filter(conv => conv.id !== id);
      if (state.currentConversation?.id === id) {
        state.currentConversation = null;
      }
    },
        addMessage(state, action) {
      const { conversationId, message } = action.payload;
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = [];
      }
      const existingMsgIndex = state.messagesByConversation[conversationId].findIndex(
        m => m.id === message.id || (m.clientMessageId && m.clientMessageId === message.clientMessageId)
      );

      if (existingMsgIndex > -1) {
        state.messagesByConversation[conversationId][existingMsgIndex] = message;
      } else {
        state.messagesByConversation[conversationId].push(message);
      }

      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessagePreview = message.content;
        conversation.lastUpdated = message.timestamp || new Date().toISOString();
        state.conversations = state.conversations.filter(c => c.id !== conversationId);
        state.conversations.unshift(conversation);
      }
    },
    removeMessage(state, action) {
      const { conversationId, messageId } = action.payload;
      if (state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] =
          state.messagesByConversation[conversationId].filter(
            msg => msg.id !== messageId && msg.clientMessageId !== messageId
          );
      }
    },
    removeOptimisticMessage(state, action) {
      const { conversationId, clientMessageId } = action.payload;
      if (state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] =
          state.messagesByConversation[conversationId].filter(
            msg => msg.clientMessageId !== clientMessageId
          );
      }
    },
    clearMessages(state, action) {
      const conversationId = action.payload;
      if (conversationId) {
        delete state.messagesByConversation[conversationId];
      } else {
        state.messagesByConversation = {};
      }
      state.sending = false;
            state.sendError = null;
    },
    clearError(state) {
      state.error = null;
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messagesByConversation[conversationId] = messages;
        state.loading = false;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.sendError = null;
      })
            .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const message = action.payload;
        const conversationId = message.conversationId;
        if (conversationId) {
            const existingMsgIndex = state.messagesByConversation[conversationId]?.findIndex(
                m => m.clientMessageId && m.clientMessageId === message.clientMessageId
            );

            if (existingMsgIndex > -1) {
                state.messagesByConversation[conversationId][existingMsgIndex] = message;
            } else if (!state.messagesByConversation[conversationId]?.some(m => m.id === message.id)) {
                state.messagesByConversation[conversationId].push(message);
            }

            const conversation = state.conversations.find(c => c.id === conversationId);
            if (conversation) {
                conversation.lastMessagePreview = message.content;
                conversation.lastUpdated = message.timestamp || new Date().toISOString();
                state.conversations = state.conversations.filter(c => c.id !== conversationId);
                state.conversations.unshift(conversation);
            }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.sendError = action.error.message;
      });
  }
});

export const {
  setCurrentConversation,
  addConversation,
  updateConversation,
  removeConversation,
  addMessage,
  removeMessage,
  removeOptimisticMessage,
  clearMessages,
  clearError
} = messagingSlice.actions;

export default messagingSlice.reducer;
export { fetchConversations, fetchMessages, sendMessage }; 