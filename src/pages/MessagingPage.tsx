import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts';
import { supabase } from '@shared/api';
import Header from './Header';
import Footer from './Footer';

interface Chat {
  id: number;
  created_at: string | null;
  user_id_1: string;
  user_id_2: string;
  visible: boolean | null;
  user1: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
  } | null
  user2: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
  } | null
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
  const currentUserId = user.ok ? user.data.id : null;
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [];
  });
  const [messages, setMessages] = useState<UserMessage[]>(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  // const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);

  useEffect(() => {
    if (currentUserId && chats.length === 0) {
      fetchChats();
    }
    if (currentUserId && chats.length > 0 && messages.length === 0) {
      console.log("Messages going")
      fetchFirstMessages();
    }
  }, [currentUserId, chats]);


  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
    localStorage.setItem('messages', JSON.stringify(messages));
    if (chats.length > 0) setLoading(false);
  }, [chats]);

  // useEffect(() => {
  //   if (selectedChatId) {
  //     fetchMessages(selectedChatId);
  //   }
  // },[selectedChatId]);

  const fetchChats = async () => {
    if (!currentUserId) return;

    try {
      console.log("Attempting to fetch chats")
      const { data, error } = await supabase
        .from('Chats')
        .select(`
          id,
          user_id_1,
          user_id_2,
          created_at,
          visible,
          user1:User_Information!Chats_user_id_1_fkey (
          id,
          first_name,
          last_name,
          supabase_id
        ),
        user2:User_Information!Chats_user_id_2_fkey (
          id,
          first_name,
          last_name,
          supabase_id
        )        
        `)
        // recentMessage:Messages!Messages_chat_id_fkey (
        // )
        .or(`user_id_1.eq.${currentUserId},user_id_2.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log("No error thrown");
      // console.log("Data", data)
      setChats(data as Chat[]);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  }

  const fetchFirstMessages = async () => {
    if (!currentUserId) return;

    const chat_ids = chats.map(chat => chat.id);
    console.log("ChatIds ", chat_ids)
    try {
      const { data, error } = await supabase
        .from('Messages')
        .select(`
          id,
          chat_id,
          created_at,
          logged_message,
          sender_id,
          visible
        `)
        .in('chat_id', chat_ids)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data as UserMessage[]);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchMessages = async (chat_id: Chat['id']) => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('Messages')
        .select(`
          id,
          chat_id,
          created_at,
          logged_message,
          sender_id,
          visible,
          sender:User_Information!Messages_sender_id_fkey (
          id,
          first_name,
          last_name,
          supabase_id
        )
        `)
        .eq('chat_id', chat_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data as UserMessage[]);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  }


  const ChatCard = ({
    chat,
    showRemove = false,
    showSold = false,
  }: {
    chat: Chat;
    showRemove?: boolean;
    showVisible?: boolean;
  }) => {
    const [currentUser, otherUser] = chat.user_id_1 === currentUserId ? [chat.user1, chat.user2] : [chat.user2, chat.user1];
    const firstMessage = messages.find(msg => (msg.chat_id === chat.id))
    const isVisible = chat.visible;

    const messageDate = new Date(firstMessage?.created_at)
    let date;

    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    if (messageDate > yesterdayEnd) date = `${messageDate.getHours()}: ${messageDate.getMinutes()}`;
    else if (messageDate >= yesterdayEnd && messageDate < yesterdayStart) date = "Yesterday";
    else date = messageDate.toLocaleDateString();

    return (
      <div
        className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${isVisible ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => isVisible && navigate('/home')}
      >
        <div className='relative'></div>
        <div className='p-4'>{otherUser?.first_name}</div>
        <div className='p-4 text-sm'>{date} {firstMessage?.logged_message}</div>
      </div>
    );
  };

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

  if (!loading) {
    // console.log(currentUserId)
    // chats.length === 0 ? console.log("no chats found") : console.log("chats", chats)
    chats.forEach(c => {
      // console.log(c.user1?.first_name);
      const [currentUser, otherUser] = c.user_id_1 === currentUserId ? [c.user1, c.user2] : [c.user2, c.user1];
      console.log("currentUser: ", currentUser)
      console.log("otherUser: ", otherUser)
    });


    return (
      <div className='bg-[#F9FAFB] min-h-screen'>
        <Header />
        { /* Left aside for chat messages */}
        <aside className="flex flex-col w-1/3">
          <p className='text-xl text-gray-600 text-center'>Chats</p>
          {chats.length === 0 ? (
            <div className='bg-white rounded-lg shadow p-8 text-center'>
              <p className='text-gray-600 mb-4'>
                You don't have any chats yet
              </p>
              <button
                onClick={() => navigate('/product-search')}
                className='px-6 py-2 bg-[#007FB5] text-white rounded-lg hover:bg-[#006B9E]'
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className='flex flex-col gap-6 min-w-[20vw]'>
              {chats.map((chat) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  showRemove={true}
                />
              ))}
            </div>
            //   {!messageSelected ? (

            // ): (

            //   )}
          )}
        </aside>

        <main className='flex flex-col items-center min-h-[60vh]'>
          { /* Main area for the selected chat */}




        </main>
        <Footer />
      </div>
    );
  }

};

