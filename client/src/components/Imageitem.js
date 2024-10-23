import React from 'react';
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const Container = styled.div`
  width: 150px;
  height: 150px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid gray;
  text-align: center;
  margin: 10px;
`;

const ImageItem = ({ fileName, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: fileName });

    return (
        <Container
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                zIndex: isDragging ? '100' : undefined,
            }}
        >
            <img
                src={`/uploads/${fileName}`}
                alt={fileName}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
            <button onClick={() => onDelete(fileName)}>X</button>
        </Container>
    );
};

export default ImageItem;
