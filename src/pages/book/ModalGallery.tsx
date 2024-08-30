import { Col, Image, Modal, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import './book.scss';

const ModalGallery = (props) => {
  const { isOpen, setIsOpen, currentIndex, images, title } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);
  const imgRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
    }
  }, [isOpen, currentIndex]);
  return (
    <Modal
      width={'60vw'}
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null} //hide footer
      closable={false} //hide close button
      className="modal-gallery"
    >
      <Row gutter={[20, 20]}>
        <Col lg={12}>
          <div className="modal-gallery__left">
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
              showThumbnails={false}
              onSlide={(i) => setActiveIndex(i)}
            />
          </div>
        </Col>
        <Col lg={12}>
          <div className="modal-gallery__right">
            <div className="modal-gallery__title subtitle1" style={{ padding: '5px 0 20px 0' }}>
              {title}
            </div>
            <div className="modal-gallery__slider">
              <Row gutter={[15, 15]}>
                {images?.map((item, index) => {
                  return (
                    <Col key={`image-${index}`}>
                      <Image
                        wrapperClassName={'img-normal'}
                        width={100}
                        height={100}
                        src={item.original}
                        preview={false}
                        onClick={() => {
                          galleryRef.current.slideToIndex(index);
                        }}
                      />
                      <div className={activeIndex === index ? 'active-img' : ''}></div>
                    </Col>
                  );
                })}
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
