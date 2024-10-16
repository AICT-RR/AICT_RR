import React from 'react';
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const Container = styled.div`
  width: 320px;
  height: 120px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid gray;
  text-align: center;
`;

const Item = ({ name }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: name });

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
    <div style={{ margin: '10px', position: 'relative' }}>
        <img
                src={`/uploads/${name}`}
                alt={name}
                style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain' }}
    />
      </div>
    </Container>
  );
};

export default Item;
