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
    profile_image: any | null;
  } | null
  user2: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
    profile_image: any | null;
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
    return savedChats ? (JSON.parse(savedChats) as Chat[]) : [];
  });
  const [messages, setMessages] = useState<UserMessage[]>(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? (JSON.parse(savedMessages) as UserMessage[]) : [];
  });
  // const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  useEffect(() => {
    if (currentUserId && chats.length === 0) fetchChats();
    if (currentUserId && chats.length > 0 && messages.length === 0) fetchFirstMessages();
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
          supabase_id,
          profile_image
        ),
        user2:User_Information!Chats_user_id_2_fkey (
          id,
          first_name,
          last_name,
          supabase_id,
          profile_image
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

  const getImageUrl = (imageData: any): string | null => {
    if (!imageData) return null;

    try {
      let imagePath: string | null = null;

      if (typeof imageData === 'object' && imageData !== null) {
        imagePath =
          imageData.image ||
          imageData.path ||
          imageData.url ||
          imageData.filename;
      } else if (typeof imageData === 'string') {
        imagePath = imageData;
      }

      if (!imagePath) return null;
      if (imagePath.startsWith('http')) return imagePath;

      // Get filename from path
      const filename = imagePath
        .replace('database/images/', '')
        .split('/')
        .pop();
      if (!filename) return null;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filename);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting image URL:', error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    const form = new FormData(event.currentTarget);
    console.log(formData)

    setIsSubmitting(true);
    try {
      console.log(form)
      const update = await password.update(form, formData.password);

      if (!update.ok) {
        setErrors({ general: 'Password update failed' });
        return;
      }

      navigate('/signin');
    } catch (error: any) {
      console.error('Error confirming password:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };


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
    const firstMessage = messages.find(msg => msg.chat_id === chat.id)
    const isVisible = chat.visible;
    const imageUrl = getImageUrl(otherUser?.profile_image);

    const messageDate = new Date(firstMessage?.created_at)
    let date;

    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    if (messageDate > yesterdayEnd) date = `${messageDate.getHours()}: ${messageDate.getMinutes()}`;
    else if (messageDate >= yesterdayStart && messageDate < yesterdayEnd) date = "Yesterday";
    else date = messageDate.toLocaleDateString();

    return (
      <div
        className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${!isVisible ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => setChatLoading(!chatLoading) && setSelectedChat(chat)}
      >
        <div className='grid grid-cols-[10%_90%] p-4'>
          <div className='relative'>
            {imageUrl ? (
              <img
                src={imageUrl}
                className={`w-full h-full object-cover`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${otherUser.id}`)
                }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '';
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className='aspect-square h-full bg-gray-200 flex items-center justify-center rounded-4xl'>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${otherUser.id}`)
                  }}
                  className='text-gray-500 text-xs'>no image</span>
              </div>
            )}</div>
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${otherUser.id}`)
              }}
              className='px-4 font-bold font-black inline-block'>{otherUser?.first_name}</div>
            <div className='flex items-start h-full px-4 pt-2 text-sm'>

              <div className='flex-1 overflow-hidden'>
                <div className='truncate whitespace-nowrap overflow-hidden text-black'> {firstMessage?.logged_message} </div>
              </div>
              <div className='flex items-end '>{date}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MessageCard = ({
    message,
    showRemove = false,
    showVisible = false,
  }: {
    message: UserMessage;
    showRemove?: boolean;
    showVisible?: boolean;
  }) => {
    // const [currentUser, otherUser] = chat.user_id_1 === currentUserId ? [chat.user1, chat.user2] : [chat.user2, chat.user1];
    const isVisible = message.visible;
    // const imageUrl = getImageUrl(otherUser?.profile_image);

    const messageDate = new Date(message?.created_at)
    let date;

    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    if (messageDate > yesterdayEnd) date = `${messageDate.getHours()}: ${messageDate.getMinutes()}`;
    else if (messageDate >= yesterdayStart && messageDate < yesterdayEnd) date = "Yesterday";
    else date = messageDate.toLocaleDateString();

    return (
      <div
        className={`bg-white rounded-lg shadow`}
      >
        <div className='grid grid-cols-[10%_90%] p-2'>
          <div className='relative'>
            {/* {imageUrl ? (
              <img
                src={imageUrl}
                className={`w-full h-full object-cover`}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '';
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className='aspect-square h-full bg-gray-200 flex items-center justify-center rounded-4xl'>
                <span className='text-gray-500 text-xs'>no image</span>
              </div>
            )} */}
            </div>
          <div>
            {/* <div className='px-4 font-bold font-black'>{otherUser?.first_name}</div> */}
            <div className='flex items-start h-full px-4 text-sm'>

              <div className='flex-1 overflow-hidden'>
                <div className='text-black'> {message?.logged_message} </div>
              </div>              
            </div><div className='text-gray-500 text-xs'>{date}</div>
          </div>
        </div>
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
        { /* Left aside for chats */}
        <div className='flex min-w-full'>
          <aside className="flex flex-col w-1/3">
            <p className='text-xl text-gray-600 text-center '>Chats</p>
            {chats.length === 0 ? (
              <div className='bg-white rounded-lg shadow p-8 text-center'>
                <p className='text-gray-600 mb-4'>
                  You don't have any chats yet
                </p>
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
            )}
          </aside>
          <main className='flex flex-col w-2/3 items-center min-h-[60vh]'>
            {chatLoading ? (<div className='flex items-center justify-center h-full text-xl'>Select a chat to view messages</div>
            ) : (
              /* Main area for the selected chat */
              <div className='flex flex-col gap-6 min-w-[20vw]'>
                {messages.map((message) => (
                  <MessageCard
                    key={message.id}
                    message={message}
                    showRemove={true}
                  />
                ))}
                <div>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* handle message input */}
                    <div>
                      <label
                        htmlFor='text'
                        className='block text-sm font-medium text-gray-700 mb-2'>
                        Send Message
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            )}



          </main>
        </div>
        <Footer />
      </div>
    );
  }

};

