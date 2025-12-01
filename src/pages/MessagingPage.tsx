/* eslint-disable */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts';
import { supabase, UserAuthentication } from '@shared/api';
import Header from './Header';
import Footer from './Footer';
import { useChats } from '@features/messaging/hooks.ts';
import { UserChatting, UserMessaging } from '@features/messaging/index.ts';
import type { UserChat, UserProfile } from '@shared/types';

interface Chat {
  id: number;
  created_at: string;
  user_id_1: string;
  user_id_2: string;
  visible: boolean;
  user1?: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
    profile_image: any | null;
  } | null;
  user2?: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
    profile_image: any | null;
  } | null;
}

interface UserMessage {
  id: number;
  chat_id: number;
  created_at: string;
  logged_message: string;
  sender_id: string;
  visible: boolean;
  sender: {
    id: number;
    first_name: string;
    last_name: string;
    supabase_id: string;
    profile_image: any | null;
  } | null;
}

interface ChatUserPreview {
  id: number;
  first_name: string;
  last_name: string;
  supabase_id: string;
  profile_image: any;
}

export default function MessagingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
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
  const [error, setErrors] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatWith, setChatWith] = useState<ChatUserPreview | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    void fetchUserProfile().then(async () => {
      await fetchChats().then(async (chats: Chat[]) => {
        await fetchMessages(chats).then(() => {
          setLoading(false);
        });
      });
    });

    localStorage.setItem('chats', JSON.stringify(chats));
    if (chats.length > 0) setLoading(false);
  }, [currentUserId]);

  // useEffect(() => {
  //     if(!currentUserId) return;
  //     const initialize = async () => {
  //       if (!userInfo) await fetchUserProfile();
  //       if (!localStorage.getItem('chats')) await fetchChats();
  //       if (!localStorage.getItem('messages')) await fetchMessages();
  //     }
  //     initialize();
  //   }, [currentUserId]);

  //   useEffect(() => {
  //     localStorage.setItem('chats', JSON.stringify(chats));
  //     if (chats.length > 0) setLoading(false);
  //   }, [chats]);

  //   useEffect(() => {
  //     localStorage.setItem('messages', JSON.stringify(messages));
  //   }, [messages]);

  // useEffect(() => {
  //   if (!userInfo) return;
  //   const channel = UserChatting.subscribe(userInfo, (payload) => {

  //     setChats((chats) => [...chats, payload.new]);
  //   });

  //   return () => channel.unsubscribe();
  // }, [userInfo]);

  // useEffect(() => {
  //   if (!selectedChat) return;
  //   const channel = UserMessaging.subscribe(selectedChat, (payload) => {
  //     setMessages((messages) => [...messages, payload.new]);
  //   });

  //   return () => channel.unsubscribe();
  // }, [selectedChat]);

  const fetchUserProfile = async () => {
    if (!currentUserId) return;

    try {
      const { data, error } = await supabase
        .from('User_Information')
        .select('*')
        .eq('supabase_id', currentUserId)
        .single();

      if (error) throw error;
      setUserInfo(data);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchChats = async (): Promise<Chat[]> => {
    if (!currentUserId) throw Error('No user found');

    try {
      console.log('Attempting to fetch chats');
      const { data, error } = await supabase
        .from('Chats')
        .select(
          `
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
        `,
        )
        // recentMessage:Messages!Messages_chat_id_fkey (
        // )
        .or(`user_id_1.eq.${currentUserId},user_id_2.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('No error thrown');
      // console.log("Data", data)

      const chats = data as Chat[];
      setChats(chats);

      return chats;
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      throw err;
    }
  };

  const fetchFirstMessages = async (chat_id: Chat['id']) => {
    if (!currentUserId) return;

    const chat_ids = chats.map((chat) => chat.id);
    console.log('ChatIds ', chat_ids);
    try {
      const { data, error } = await supabase
        .from('Messages')
        .select(
          `
          id,
          chat_id,
          created_at,
          logged_message,
          sender_id,
          visible
        `,
        )
        .in('chat_id', chat_ids)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data as UserMessage[]);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchMessages = async (chats: Chat[]) => {
    if (!currentUserId) return;
    const chat_ids = chats.map((chat) => chat.id);

    try {
      const { data, error } = await supabase
        .from('Messages')
        .select(
          `
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
          supabase_id,
          profile_image
        )
        `,
        )
        .in('chat_id', chat_ids)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data as UserMessage[]);
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
    }
  };

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
    // if (!validateForm()) return;
    if (!selectedChat) return;
    if (!userInfo) return;

    const form = new FormData(event.currentTarget);
    const sendText = form.get(text);
    if (!sendText) return;

    const chatToSend: UserChat = {
      created_at: selectedChat.created_at,
      id: selectedChat.id,
      user_id_1: selectedChat.user_id_1,
      user_id_2: selectedChat.user_id_1,
      visible: selectedChat.visible,
    };
    // setIsSubmitting(true);
    try {
      const update = await UserMessaging.send(chatToSend, userInfo, text);

      if (!update.ok) {
        // setErrors({ general: 'Message failed to send' });
        return;
      } else {
        const transformed: UserMessage = {
          ...update.data,
          sender: userInfo as any,
        };

        setMessages([...messages, transformed]);
      }

      // navigate('/signin');
    } catch (error: any) {
      console.error('Error sending message:', error);
      // setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      // setIsSubmitting(false);
      setText('');
    }
  };

  const getAnyDate = (message: UserMessage) => {
    const messageDate = new Date(message?.created_at);
    let date;

    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    if (messageDate > yesterdayEnd)
      date = `${messageDate.getHours()}: ${messageDate.getMinutes()}`;
    else if (messageDate >= yesterdayStart && messageDate < yesterdayEnd)
      date = 'Yesterday';
    else date = messageDate.toLocaleDateString();

    return date;
  };

  const ChatCard = ({
    chat,
  }: {
    chat: Chat;
    showRemove?: boolean;
    showVisible?: boolean;
  }) => {
    const [currentUser, otherUser] =
      chat.user_id_1 === currentUserId
        ? [chat.user1, chat.user2]
        : [chat.user2, chat.user1];
    const firstMessage = messages.find((msg) => msg.chat_id === chat.id);
    const isVisible = chat.visible;
    const imageUrl = getImageUrl(otherUser?.profile_image);

    if (!otherUser) return;

    if (!firstMessage) return;
    const date = getAnyDate(firstMessage);

    return (
      <div
        className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow ${!isVisible ? 'opacity-60' : 'cursor-pointer'}`}
        onClick={() => {
          setChatLoading(false);
          setSelectedChat(chat);
          setChatWith(otherUser);
        }}
      >
        <div className='grid grid-cols-[1fr_10fr] p-4'>
          <div className='relative'>
            {imageUrl ? (
              <img
                src={imageUrl}
                className={`aspect-square object-cover`}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/profile/${otherUser.id}`);
                }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.src = '';
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className='aspect-square bg-gray-200 flex items-center justify-center rounded-4xl'>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/profile/${otherUser.id}`);
                  }}
                  className='text-gray-500 text-xs'
                >
                  no image
                </span>
              </div>
            )}
          </div>
          <div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${otherUser.id}`);
              }}
              className='px-4 font-bold font-black inline-block'
            >
              {otherUser?.first_name}
            </div>
            <div className='flex items-start h-full px-4 pt-2 text-sm'>
              <div className='flex-1 overflow-hidden'>
                <div className='truncate w-[15vw] whitespace-nowrap overflow-x-hidden text-black'>
                  {' '}
                  {firstMessage?.logged_message}{' '}
                </div>
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
    const isVisible = message.visible;
    const imageUrl = getImageUrl(message.sender?.profile_image);

    const date = getAnyDate(message);

    const senderBool = message.sender?.supabase_id === currentUserId;
    const bgColor = senderBool ? 'bg-blue-600' : 'bg-white';
    const textColor = senderBool ? 'text-white' : 'text-black';
    const dateAlign = senderBool ? 'text-end' : 'text-start pl-12';
    const grid = senderBool ? '' : 'grid-cols-[auto_auto]';
    const name = senderBool ? '' : message?.sender?.first_name;
    const image = senderBool ? '' : message?.sender?.first_name;

    return (
      <div className={`grid ${grid} p-2`}>
        <div className='relative flex items-end'>
          {!senderBool ? (
            imageUrl ? (
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
              <div className='aspect-square h-[3vh] mr-2 bg-gray-200 flex items-center justify-center rounded-4xl'>
                <span className='text-gray-500 text-xs'>n/a</span>
              </div>
            )
          ) : null}
        </div>
        <div className='flex flex-col'>
          <div
            className={`${bgColor} rounded-2xl py-1.5 shadow-md flex items-center`}
          >
            <div>
              <div className='px-4 font-semibold'>{name}</div>
              <div className='flex items-start h-full px-4 text-sm'>
                <div className='flex-1 overflow-hidden'>
                  <div className={`${textColor}`}>
                    {' '}
                    {message?.logged_message}{' '}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`text-gray-500 text-xs ${dateAlign} col-span-2 px-3`}>
          {date}
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
    return (
      <div className='bg-[#F9FAFB] grid grid-rows-[auto_1fr_auto] min-h-screen'>
        <Header />
        {/* Left aside for chats */}
        <div className='flex p-5 gap-5'>
          <aside className='flex flex-col w-1/3'>
            <p className='text-xl text-gray-600 text-center'>Chats</p>
            {chats.length === 0 ? (
              <div className='bg-white rounded-lg shadow p-8 text-center'>
                <p className='text-gray-600 mb-4'>
                  You don't have any chats yet
                </p>
              </div>
            ) : (
              <div className='flex flex-col gap-6 min-w-[20vw]'>
                {chats.map((chat) => (
                  <ChatCard key={chat.id} chat={chat} showRemove={true} />
                ))}
              </div>
            )}
          </aside>
          {chatLoading ? (
            <main className='flex flex-col w-2/3 justify-center items-center min-h-[60vh] rounded-2xl pb-5 bg-blue-300'>
              <div className='text-xl'>Select a chat to view messages</div>
            </main>
          ) : (
            <main className='flex flex-col w-2/3 items-center min-h-[60vh] rounded-2xl pb-5 bg-blue-300 relative'>
              <div className='bg-white w-full rounded-t-2xl border-b-1 pl-3 '>
                {chatWith ? `Chat with ${chatWith.first_name}` : ''}
              </div>

              <>
                {/* Main area for the selected chat */}
                <div className='flex flex-col gap-6 overflow-y-auto max-h-[70vh] w-full p-3 h-full'>
                  {messages
                    .filter(
                      (message) =>
                        message.visible && message.chat_id === selectedChat?.id,
                    )
                    .map((message) => {
                      const alignment =
                        message.sender?.supabase_id === currentUserId
                          ? 'justify-end'
                          : 'justify-start';
                      const travel = (ref: HTMLDivElement | null) => {
                        if (ref) {
                          ref.scrollIntoView({ behavior: 'smooth' });
                        }
                      };

                      return (
                        <div
                          key={message.id}
                          className={`flex ${alignment} min-w-[20vw]`}
                          ref={(ref) => travel(ref)}
                        >
                          <MessageCard message={message} showRemove={true} />
                        </div>
                      );
                    })}
                </div>
                <div className=''>
                  <form onSubmit={handleSubmit} className='space-y-6'>
                    {/* handle message input */}
                    <div>
                      <label
                        htmlFor='message'
                        className='block font-medium text-gray-700 mb-2 w-full'
                      >
                        Send Message
                      </label>
                      <input
                        id='message'
                        type='text'
                        name={text}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className='bg-white rounded-l-2xl w-[40vw] p-2'
                        placeholder='Type your message...'
                      ></input>
                      <button
                        type='submit'
                        name='submit'
                        className='bg-gray-200 p-2 rounded-r-2xl shadow cursor-pointer hover:shadow-lg transition-shadow hover:text-pink-600'
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </>
            </main>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}
