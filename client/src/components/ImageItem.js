import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ImageItem.css';
import { ReactComponent as CloseIcon } from '../icons/fluent--dismiss-24-filled.svg';

function ImageItem({ fileName, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: fileName });

    
  return (
    <div
      className='card-item'
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
    >
      <div className='card-bg'>
        <button className='close-btn' onClick={() => onDelete(fileName)}>
          <CloseIcon className='close-icon close-icon1' />
          <CloseIcon className='close-icon close-icon2' />
        </button>
        <img
          className='card-img'
          src={`/uploads/${fileName}`}
          alt={fileName}
          {...listeners} // 드래그 리스너를 이미지에만 적용
        />
      </div>
      <div className='card-idx'>hi</div>
    </div>
  );
}

export default ImageItem;
