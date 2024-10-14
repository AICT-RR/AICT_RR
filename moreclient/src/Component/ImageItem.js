import React from 'react';

function ImageItem({ fileName, onDelete }) {
    return (
        <div style={{ margin: '10px', position: 'relative' }}>
            <img
                src={`/uploads/${fileName}`}
                alt={fileName}
                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
            />
            <button 
                onClick={() => onDelete(fileName)} 
                style={{
                    position: 'absolute', 
                    top: '0', 
                    right: '0', 
                    background: 'red', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer'
                }}
            >
                X
            </button>
        </div>
    );
}

export default ImageItem;
