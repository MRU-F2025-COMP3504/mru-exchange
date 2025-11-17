import { useState, useEffect } from 'react';
// import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@shared/contexts';
import { UserChatting, UserMessaging } from '@features/messaging/api';
import { useChat, useChats } from '@features/messaging/hooks';
import Header from './Header';
import Footer from './Footer';
import { supabase } from '@shared/api';
import { getUser } from '@shared/api/auth';

interface Chat {
  id: number;
  created_at: string | null;
  user_id_1: string;
  user_id_2: string;
  visible: boolean | null;
}

interface UserMessage {
  id: number;
  chat_id: number;
  created_at: string;
  logged_message: string;
  sender_id: string;
  visible: boolean;
}

export default function MessagingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user.ok ? user.data.id : null!;
  // const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { loading: chatsLoading, chats } = useChats({
    supabase_id: currentUserId,
  });
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const chatHook = selectedChat
    ? useChat({ supabase_id: currentUserId }, { id: selectedChat })
    : null;
  // if(!user.ok) return;
  // void getByUser({ supabase_id: user.data.id })
  // .then((chats) => {
  // if(chats.ok) {
  // console.log("Chats: ", chats.data);
  // setChats(chats.data);
  // }
  // else console.error("Error: ", chats.error);
  // });

  // useEffect(() => {
  //     if (!user?.ok) return;
  //     const supabaseID = user.data.id;

  //     (async () => {
  //         const chatResults = await getByUser({ supabase_id: supabaseID })
  //         if (chatResults.ok) {
  //             console.log("Chats: ", chatResults.data);
  //             setChats(chatResults.data);
  //         }
  //         else console.error("Error fetching chats: ", chatResults.error);
  //     })();
  // }, [user]);

  // useEffect(() => {
  //     if (chats.length === 0) return;

  //     (async () => {
  //         const allMessages: UserMessage[] = [];
  //         for (const chat of chats) {
  //             const messageResults = await getByChat({ id: chat.id })
  //             if (messageResults.ok) {
  //                 console.log("Messages: ", messageResults.data);
  //                 setMessages(messageResults.data);
  //             }
  //             else console.error("Error fetching messages : ", messageResults.error);
  //         }
  //     })();
  // }, [chats]);

  // chats.forEach(chat => {
  // void getByChat({ id: chat.id })
  // .then((messages) => {
  //     if(messages.ok) {
  //         console.log("Chats: ", messages.data);
  //         setMessages(messages.data);
  //     }
  //     else console.error("Error: ", messages.error);
  //   });
  // });

  const getUserName = async (userID: string) => {
    try {
      // Get the user names of users in chats that are visible
      const { data, error } = await supabase
        .from('User_Information')
        .select('id, supabase_id, first_name, last_name')
        .eq('currentUserId', userID)
        .eq('visible', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };
  const ChatCard = ({
    chat,
    showRemove = false,
    showSold = false,
  }: {
    chat: Chat;
    showRemove?: boolean;
    showSold?: boolean;
  }) => {
    const userName = getUserName(chat.user_id_2);
    const isVisible = chat.visible;

    return (
      <div
        className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${isVisible ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => !isVisible && navigate(`/chat/${chat.id}`)}
      >
        <div className='relative'></div>
        <div className='p-4'></div>
      </div>
    );
  };

  if (!currentUserId) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <div className='text-center'>
            <p className='text-xl text-gray-600 mb-4'>
              Please log in to view your chats
            </p>
            <button
              onClick={() => navigate('/signin')}
              className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
            >
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        <main className='flex items-center justify-center min-h-[60vh]'>
          <p className='text-xl text-gray-600'>Loading chats...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bg-[#F9FAFB] min-h-screen'>
      <Header />

      {/* Left aside - Chats list */}
      <aside
        style={{
          width: '300px',
          borderRight: '1px solid #ddd',
          padding: '1rem',
          overflowY: 'auto',
        }}
      >
        <h2>Chats</h2>
        {chatsLoading ? (
          <p>Loading chats...</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor:
                  chat.id === selectedChat ? '#e5e7eb' : 'transparent',
              }}
            >
              Chat #{chat.id}
            </div>
          ))
        )}
        {chats.length === 0 ? (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
            <p className='text-gray-600 mb-4'>You do not have any chats yet</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {chats.map((chat) => (
              <ChatCard key={chat.id} chat={chat} showRemove={true} />
            ))}
          </div>
        )}
      </aside>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
          <h2>Choose a chat to see it's messages</h2>

          <div>
            {chats.map((chat) => (
              <p key={chat.id}>{chat.user_id_2}</p>
            ))}
            {messages.map((messages) => (
              <p key={messages.id}>{messages.logged_message}</p>
            ))}
          </div>
        </div>
        {!selectedChat ? (
          <p style={{ color: '#555' }}>Select a chat to view messages</p>
        ) : chatHook?.loading ? (
          <p>Loading messages...</p>
        ) : (
          <>
            <h2>Messages for Chat #{selectedChat}</h2>
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                height: '70vh',
                overflowY: 'auto',
                backgroundColor: '#fff',
              }}
            >
              {chatHook?.messages?.length ? (
                chatHook.messages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: '1rem' }}>
                    <strong>
                      {msg.sender_id === currentUserId ? 'You' : msg.sender_id}
                    </strong>
                    : {msg.logged_message}
                  </div>
                ))
              ) : (
                <p>No messages yet</p>
              )}
            </div>

            {/* Send Message Input */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem(
                  'message',
                ) as HTMLInputElement;
                const message = input.value.trim();
                if (message && chatHook) {
                  const result = await chatHook.send(message);
                  if (!result.ok) console.error(result.error);
                  input.value = '';
                }
              }}
              style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}
            >
              <input
                type='text'
                name='message'
                placeholder='Type a message...'
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                type='submit'
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
