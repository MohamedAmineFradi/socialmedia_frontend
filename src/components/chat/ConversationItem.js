import useProfile from '@/hooks/useProfile';
import UserDisplay from '@/components/ui/UserDisplay';

export default function ConversationItem({ conversation, onSelect, selected, currentUser, otherId }) {
  console.log('Conversation participants:', conversation.participants || conversation.participantIds);
  const { profile: otherProfile, loading: profileLoading } = useProfile(otherId);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();

      if (isYesterday) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    }
  };

  const participantList = conversation.participants || conversation.participantIds;
  if (!conversation || !participantList || !Array.isArray(participantList)) {
    return null;
  }

  return (
      <button
          onClick={() => onSelect(conversation)}
          className={`w-full p-4 flex items-center space-x-3 text-left transition-colors ${
              selected
                  ? 'bg-blue-50 border-r-2 border-blue-500'
                  : 'hover:bg-white'
          }`}
      >
        <UserDisplay
            userId={otherId}
            size="lg"
            showUsername={false}
            showFullName={true}
            className="flex-1"
        />

        <div className="flex flex-col items-end space-y-1 min-w-0">
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatTime(conversation.lastUpdated)}
        </span>

          {conversation.lastMessagePreview ? (
              <p className="text-sm text-gray-600 truncate max-w-32">
                {conversation.lastMessagePreview}
              </p>
          ) : (
              <p className="text-sm text-gray-400 italic max-w-32">
                No messages yet
              </p>
          )}
        </div>


      </button>
  );
}