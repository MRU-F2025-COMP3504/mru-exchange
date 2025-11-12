import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { register } from '../features/listing/api/product';
import { ok, err } from '../shared/utils';

// System Variables
type Product = {
  title: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
};

export default function PreviewPostPage() {
  const { state } = useLocation();
  const product = state?.product;
  const avgRating: number = 3;
  const totalReviews: number = 1;

  function displayStars(avgRating: number): string {
    // Initialize
    const fullStar: string = '★';
    const emptyStar: string = '☆';
    let result: string = '';

    // Build
    for (let i = 1; i <= 5; i++) {
      result += i <= avgRating ? fullStar : emptyStar;
    }

    // Return
    return result;
  }

  async function handleProductPosting() {
    if (!product) {
      alert('No product data found!');
    }

    try {
      const builder = register();

      const result = builder
        .title(product.title)
        .description(product.description)
        .image(product.imageUrl)
        .price(product.price)
        .stock(product.stock_count);

      if (result.isErr?.()) {
        alert('Error ');
      }

      const insert = await result.value.build();

      alert('Product successfully inserted');
      console.log('inserted:', insert);
    } catch (e) {
      console.error(e);
      alert('failed to register product');
    }
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        minHeight: '100vh',
      }}
    >
      <main
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <div
          style={{ position: 'relative', width: '100%', maxWidth: '1200px' }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-1.2rem',
              left: '1.5rem',
              color: 'red',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            Preview
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '2rem',
              width: '100%',
              maxWidth: '1200px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '1px solid #D1D5DB',
            }}
          >
            {/* Product Details */}
            <section id='details' className='p-8 bg-[#A7E2FC] text-[#003A5F]'>
              {/* Product Information */}
              <section className='p-5 flex flex-col sm:flex-row gap-5'>
                <div className='sm:hidden'>
                  <h1 className='text-3xl py-2'>{product.title}</h1>
                  <p className='text-xl'>{product.seller}</p>
                </div>

                <div>
                  {product.image && product.image.length > 0 ? (
                    <img
                      src={URL.createObjectURL(product.image[0])}
                      alt={product.title}
                      width='250px'
                      height='250px'
                      className='bg-white object-cover mx-auto sm:mx-0 rounded-2xl shadow-xl'
                    />
                  ) : (
                    <div
                      style={{
                        width: '250px',
                        height: '250px',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      No Image Selected
                    </div>
                  )}
                </div>

                {/* <div className="p-3 w-full bg-amber-50"> */}
                <div className='p-3'>
                  <div className='hidden sm:block'>
                    <h1 className='text-3xl py-2'>{product.title}</h1>
                    <p className='text-xl pb-4'>{product.seller}</p>
                  </div>
                  <p className='whitespace-pre-line'>{product.description}</p>
                </div>
              </section>
            </section>

            {/* Reviews */}
            <section className='p-10'>
              <h2 className='text-2xl'>Reviews</h2>
              <p className='text-2xl'>
                <span className='text-3xl'>{displayStars(avgRating)}</span> (
                {totalReviews})
              </p>
            </section>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                onClick={handleProductPosting}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: '#0F76D7',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Post Product
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
