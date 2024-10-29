import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function ImageItem({ fileName, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: fileName });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        margin: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        position: 'relative',
    };


    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <img
                src={`/uploads/${fileName}`}
                alt={fileName}
                style={{ width: 'auto', height: '150px', objectFit: 'cover', cursor: 'grab' }} // 커서 스타일 변경
                {...listeners} // 드래그 리스너를 이미지에만 적용
            />
            <button
                onClick={() => onDelete(fileName)}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',  
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6l12 12" stroke="#fff" strokeWidth="5" />
    </svg>
</button>

        </div>
    );
}

export default ImageItem;