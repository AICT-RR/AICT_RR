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
                style={{ width: '150px', height: '150px', objectFit: 'cover', cursor: 'grab' }} // 커서 스타일 변경
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
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                }}
            >
                X
            </button>
        </div>
    );
}

export default ImageItem;
