import { Button, Col, notification, Rate, Row } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-image-gallery/styles/scss/image-gallery.scss';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import './Book.scss';
import { formatVNCurrency } from '../../helpers/formatVNCurrency';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import { useEffect, useRef, useState } from 'react';
import { fetchABookData } from '../../services/bookService';
import BookLoader from './BookLoader';
import ModalGallery from './ModalGallery';
const baseUrlImg = `${import.meta.env.VITE_BACKEND_URL}/images/book/`;
let images: ReactImageGalleryItem[] = [];
function BookPage() {
  const [bookData, setBookData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const galleryRef = useRef(null);

  const buildSlider = (data: object) => {
    let dataImages = [];
    if (data && data.thumbnail) {
      dataImages.push({
        original: `${baseUrlImg}${data.thumbnail}`,
        thumbnail: `${baseUrlImg}${data.thumbnail}`,
        originalClass: 'original-image',
        thumbnailClass: 'thumbnail-image',
      });
    }

    if (data && data.slider) {
      data.slider.map((item) => {
        dataImages.push({
          original: `${baseUrlImg}${item}`,
          thumbnail: `${baseUrlImg}${item}`,
          originalClass: 'original-image',
          thumbnailClass: 'thumbnail-image',
        });
      });
    }

    images = [...dataImages];
  };
  useEffect(() => {
    const fetchBookData = async () => {
      setIsLoading(true);
      const res = await fetchABookData(id);
      if (res && res.data) {
        setBookData(res.data);
        buildSlider(res.data);
      } else {
        notification.error({
          message: 'Có lỗi xảy ra',
          description: res.message ? res.message : 'An error occurred',
          placement: 'topRight',
          duration: 5,
          showProgress: true,
        });
      }

      setTimeout(() => setIsLoading(false), 1000);
    };
    fetchBookData();
  }, [id]);

  const handleOnClickImage = () => {
    setCurrentIndex(galleryRef.current?.getCurrentIndex());
    setIsOpenModalGallery(true);
  };
  return (
    <>
      <div>
        <Button style={{ display: 'block', marginBottom: '16px' }} type="primary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      {!isLoading ? (
        <div className="book-page">
          <Row gutter={32}>
            <Col lg={12}>
              <div className="book-page__slider ">
                <ImageGallery
                  ref={galleryRef}
                  items={images}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  slideOnThumbnailOver={true}
                  infinite={true}
                  slideInterval={3000}
                  lazyLoad={true}
                  showNav={false}
                  onClick={() => {
                    handleOnClickImage();
                  }}
                />
              </div>
            </Col>
            <Col lg={12}>
              <div className="book-page__content">
                <div className="author subtitle2">
                  Tác giả: <span className="author__name">{bookData.author}</span>
                </div>
                <div className="title">{bookData.mainText}</div>
                <div className="testimonials" style={{ display: 'flex', gap: '15px' }}>
                  <div className="rating">
                    <Rate defaultValue={5} style={{ fontSize: 'inherit' }} disabled />
                  </div>
                  <div className="sold">Đã bán: {bookData.sold}</div>
                </div>
                <div className="price">
                  <span>{formatVNCurrency(bookData.price)}</span>
                </div>

                <div className="delivery">
                  <div>
                    <span className="left-side">Vận chuyển</span>
                    <span className="right-side">Miễn phí vận chuyển</span>
                  </div>
                </div>

                <div className="quantity">
                  <span className="left-side">Số lượng</span>
                  <span className="right-side">
                    <button
                    // onClick={() => handleChangeButton('MINUS')}
                    >
                      <MinusOutlined />
                    </button>
                    <input
                      // onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity}
                      defaultValue={1}
                    />
                    <button
                    // onClick={() => handleChangeButton('PLUS')}
                    >
                      <PlusOutlined />
                    </button>
                  </span>
                </div>

                <div className="buy">
                  <button
                    className="cart"
                    // onClick={() => handleAddToCart(currentQuantity, dataBook)}
                  >
                    <BsCartPlus className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button
                    className="now"
                    //  onClick={() => handleBuyNow(currentQuantity, dataBook)}
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <BookLoader />
      )}
      <div>
        <ModalGallery
          isOpen={isOpenModalGallery}
          setIsOpen={setIsOpenModalGallery}
          currentIndex={currentIndex}
          title={bookData?.mainText}
          images={images}
        />
      </div>
    </>
  );
}
export default BookPage;
