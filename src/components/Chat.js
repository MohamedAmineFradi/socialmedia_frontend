import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '@/store/profileSlice';
import {
  fetchConversations,
  fetchMessages,
  setCurrentConversation,
  addMessage,
  addConversation,
  clearError
} from '@/store/messagingSlice';
import { toast } from 'react-toastify';
import ConversationItem from '@/components/chat/ConversationItem';
import UserDisplay from '@/components/ui/UserDisplay';
import UserAvatar from '@/components/ui/UserAvatar';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { getAllUsers } from '@/services/userService';
import useUserDbId from '@/hooks/useUserDbId';
import useProfile from '@/hooks/useProfile';
import { MessageCircle, Plus, Send, X, Search } from 'lucide-react';
import { createConversation } from '@/services/messageService';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MessageBubble = ({ message, isCurrentUser, currentUserId }) => {
  if (!message || !message.id) {
    return null;
  }

  return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex flex-col max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {!isCurrentUser && message.senderId && (
              <div className="mb-1">
                <UserDisplay
                    userId={message.senderId}
                    size="sm"
                    showUsername={false}
                />
              </div>
          )}
          <div className={`px-4 py-2 rounded-2xl ${
              isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
          }`}>
            <p className="text-sm">{message.content || ''}</p>
            {message.isOptimistic && (
                <div className="text-xs opacity-70 mt-1">Sending...</div>
            )}
          </div>
        </div>
      </div>
  );
};

const UserListItem = ({ user, onStartConversation }) => {
  const handleClick = useCallback(() => {
    onStartConversation(user.id);
  }, [user.id, onStartConversation]);

  return (
      <button
          onClick={handleClick}
          className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex-1 text-left">
          <UserDisplay
              userId={user.id}
              size="md"
              showUsername={true}
              className="justify-start"
          />
        </div>
      </button>
  );
};

const EnhancedConversationItem = ({ conversation, onSelect, selected, currentUser }) => {
  const otherId = (conversation.participants || conversation.participantIds || []).find(id => id !== currentUser.id);
  const participantList = conversation.participants || conversation.participantIds;
  if (!conversation || !participantList || !Array.isArray(participantList)) {
    return null;
  }

  return (
      <ConversationItem
          conversation={conversation}
          onSelect={onSelect}
          selected={selected}
          currentUser={currentUser}
          otherId={otherId}
      />
  );
};

export default function Chat() {
  const dispatch = useDispatch();
  const { userDbId: currentUserId, loadingUserId } = useUserDbId();
  const { subscribe: wsSubscribe, unsubscribe: wsUnsubscribe, sendMessage: wsSendMessage } = useWebSocketContext();

  const messagesEndRef = useRef(null);
  const wsSubscriptionRef = useRef(null);

  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Redux selectors with null checks
  const { error, conversations = [], currentConversation, messagesByConversation = {} } = useSelector(state => state?.messaging || {});
  const profiles = useSelector(state => state?.profile?.entities || {});
  const currentUser = useSelector(state => state?.auth?.user);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    const validUsers = users.filter(user =>
        user?.id &&
        (user.firstName || user.lastName || user.username) &&
        user.id !== currentUserId
    );

    if (!debouncedSearchQuery) return validUsers;

    return validUsers.filter(user => {
      const name = `${user.firstName || ''} ${user.lastName || ''} ${user.username || ''}`.toLowerCase();
      return name.includes(debouncedSearchQuery.toLowerCase());
    });
  }, [users, currentUserId, debouncedSearchQuery]);

  const currentMessages = useMemo(() => {
    if (!currentConversation?.id) return [];
    return messagesByConversation[currentConversation.id] || [];
  }, [messagesByConversation, currentConversation?.id]);

  const otherUserId = useMemo(() => {
    if (!currentConversation || !currentUserId) return null;
    const list = currentConversation.participants || currentConversation.participantIds || [];
    return list.find(id => id !== currentUserId);
  }, [currentConversation, currentUserId]);

  useEffect(() => {
    if (otherUserId && !profiles[otherUserId]) {
      console.log('Fetching profile for otherUserId:', otherUserId);
      dispatch(fetchProfile(otherUserId));
    }
  }, [otherUserId, profiles, dispatch]);

  useEffect(() => {
    if (currentUserId) {
      dispatch(fetchConversations());
    }
  }, [dispatch, currentUserId]);

  
  useEffect(() => {
    if (showUserList && currentUserId && users.length === 0) {
      setIsLoadingUsers(true);
      getAllUsers()
          .then(data => {
            setUsers(data.filter(u => u.id !== currentUserId));
            data.forEach(user => {
              if (user.id !== currentUserId && !profiles[user.id]) {
                dispatch(fetchProfile(user.id));
              }
            });
          })
          .catch(err => {
            console.error('Failed to load users:', err);
            toast.error('Failed to load users');
          })
          .finally(() => {
            setIsLoadingUsers(false);
          });
    }
  }, [showUserList, currentUserId, users.length, dispatch, profiles]);

  // WebSocket subscription for current conversation
  useEffect(() => {
    if (currentConversation?.id) {
      dispatch(fetchMessages(currentConversation.id));

      const topic = `/topic/conversation.${currentConversation.id}`;
      const subscription = wsSubscribe(topic, (message) => {
        try {
          const newMessage = JSON.parse(message.body);
          dispatch(addMessage({ conversationId: currentConversation.id, message: newMessage }));
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      });

      wsSubscriptionRef.current = subscription;

      return () => {
        if (wsSubscriptionRef.current) {
          wsUnsubscribe(wsSubscriptionRef.current.id);
          wsSubscriptionRef.current = null;
        }
      };
    }
  }, [currentConversation?.id, wsSubscribe, wsUnsubscribe, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSelectConversation = useCallback((conv) => {
    dispatch(setCurrentConversation(conv));
  }, [dispatch]);

  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentConversation) return;

    const tempMessageId = crypto.randomUUID();
    const optimisticMessage = {
      id: tempMessageId,
      content: input,
      senderId: currentUserId,
      sender: currentUser,
      timestamp: new Date().toISOString(),
      isOptimistic: true,
      clientMessageId: tempMessageId
    };

    dispatch(addMessage({ conversationId: currentConversation.id, message: optimisticMessage }));
    setInput('');

    try {
      await wsSendMessage(`/app/chat`, {
        conversationId: currentConversation.id,
        content: input,
        senderId: currentUserId,
        clientMessageId: tempMessageId
      });
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message');
    }
  }, [input, currentConversation, currentUserId, currentUser, dispatch, wsSendMessage]);

  const handleStartConversation = useCallback(async (userId) => {
    if (!userId || !currentUserId || userId === currentUserId) {
      toast.error('Please select a valid user to chat with');
      return;
    }

    try {
      const existingConversation = conversations.find(conv => {
        const participants = conv.participants || conv.participantIds || [];
        return participants.includes(currentUserId) && participants.includes(userId) && participants.length === 2;
      });

      if (existingConversation) {
        console.log('Found existing conversation:', existingConversation.id);
        dispatch(setCurrentConversation(existingConversation));
        
        if (!profiles[userId]) {
          dispatch(fetchProfile(userId));
        }
        
        setShowUserList(false);
        setSearchQuery('');
        toast.success('Switched to existing conversation');
        return;
      }

      console.log('Creating new conversation with user:', userId);
      const response = await createConversation([currentUserId, userId]);
      const newConv = response.data;
      dispatch(addConversation(newConv));
      dispatch(setCurrentConversation(newConv));

      // Ensure profile is fetched for new conversation
      if (!profiles[userId]) {
        dispatch(fetchProfile(userId));
      }

      setShowUserList(false);
      setSearchQuery('');
      toast.success('New conversation started');
    } catch (err) {
      console.error('Conversation creation failed:', err);
      toast.error('Failed to start conversation');
    }
  }, [currentUserId, dispatch, profiles, conversations]);

  const handleCloseUserList = useCallback(() => {
    setShowUserList(false);
    setSearchQuery('');
  }, []);

  const handleOpenUserList = useCallback(() => {
    setShowUserList(true);
  }, []);

  if (loadingUserId) {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
    );
  }

  if (!currentUserId) {
    return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">Please log in to access messaging</p>
          </div>
        </div>
    );
  }

  return (
      <div className="flex h-full bg-white">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
              <button
                  onClick={handleOpenUserList}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  title="New conversation"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle className="mx-auto mb-3 text-gray-400" size={32} />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start a new chat to get started</p>
                </div>
            ) : (
                conversations.map(conversation => (
                    <EnhancedConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        onSelect={handleSelectConversation}
                        selected={currentConversation?.id === conversation.id}
                        currentUser={currentUser}
                    />
                ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  {otherUserId ? (
                      <>
                        {console.log('Profile available for otherUserId:', otherUserId, profiles[otherUserId])}
                        <UserDisplay
                            userId={otherUserId}
                            size="md"
                            showUsername={true}
                        />
                        <p className="text-sm text-gray-500 mt-1">Online</p>
                      </>
                  ) : (
                      <div className="text-gray-500 text-sm">Loading user info...</div>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg) => (
                      <MessageBubble
                          key={msg.id}
                          message={msg}
                          isCurrentUser={msg.senderId === currentUserId}
                          currentUserId={currentUserId}
                      />
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={handleSend} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </>
          ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="mx-auto mb-4 text-gray-400" size={64} />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Welcome to Messages</h3>
                  <p className="text-gray-500 mb-6">Select a conversation or start a new one to begin chatting</p>
                  <button
                      onClick={handleOpenUserList}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              </div>
          )}
        </div>

        {/* User Selection Modal */}
        {showUserList && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 flex flex-col">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Start New Chat</h2>
                    <button
                        onClick={handleCloseUserList}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {/* Search Input */}
                  <div className="mt-3 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-2">
                  {isLoadingUsers ? (
                      <div className="p-4 text-center text-gray-500">Loading users...</div>
                  ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {searchQuery ? 'No users found' : 'No users available'}
                      </div>
                  ) : (
                      filteredUsers.map(user => (
                          <UserListItem
                              key={user.id}
                              user={user}
                              onStartConversation={handleStartConversation}
                          />
                      ))
                  )}
                </div>
              </div>
            </div>
        )}
      </div>
  );
}