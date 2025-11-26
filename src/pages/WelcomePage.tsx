import { useNavigate } from 'react-router-dom';

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <div className='max-w-md w-full px-6'>
        <div className='text-center mb-10'>
          <img
            className='w-[150px] h-auto mb-6 mx-auto'
            src='/MruExchangeLogo.png'
            alt='MRU Exchange Logo'
          />
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            MRU Exchange
          </h1>
          <p className='text-lg text-gray-600'>Welcome</p>
        </div>

        <div className='flex flex-col gap-3'>
          <button
            className='w-full py-3 px-4 border-2 border-blue-600 rounded-md text-blue-600 bg-white font-medium text-base cursor-pointer transition-colors duration-200 hover:bg-blue-50'
            onClick={() => {
              navigate('/signin');
            }}
          >
            Sign In
          </button>

          <button
            className='w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-base border-none cursor-pointer transition-colors duration-200 hover:bg-blue-700'
            onClick={() => {
              navigate('/create-account');
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
