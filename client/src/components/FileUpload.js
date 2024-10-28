import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import ImageItem from './ImageItem'; // Imageitem의 대문자를 수정
import './FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태 관리

  // 파일 목록 불러오기 (처음 페이지 로드될 때 한 번만 실행)
  useEffect(() => {
    fetchFiles();
  }, []);

  // 서버에서 파일 목록을 불러와 파일 리스트 상태 업데이트
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/files');
      const files = await response.json();
      setFileList(files);
    } catch (error) {
      alert('파일 목록을 불러오는 데 오류가 발생했습니다.');
    }
  };

  // 파일 선택 시 처리
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      handleSubmit(selectedFile); // 파일이 유효할 경우 자동으로 제출
    } else {
      setFile(null); // 유효하지 않은 파일일 경우 초기화
      alert('이미지 파일을 선택해주세요.');
    }
  };

  // 파일 업로드 처리
  const handleSubmit = async (selectedFile) => {
    const formData = new FormData();
    formData.append('file', selectedFile); // 선택된 파일 추가

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFile(null); // 선택된 파일 초기화
        fetchFiles(); // 파일 목록 다시 불러오기 (업로드 후)
      } else {
        alert('파일 업로드에 실패했습니다.');
      }
    } catch (error) {
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  // 파일 삭제 처리
  const handleDelete = async (fileName) => {
    if (window.confirm(`"${fileName}" 파일을 삭제하시겠습니까?`)) {
      try {
        const response = await fetch(
          `http://localhost:5000/delete/${fileName}`,
          {
            method: 'DELETE',
          }
        );
        if (response.ok) {
          setFileList((prevList) =>
            prevList.filter((file) => file !== fileName)
          );
        } else {
          alert('파일 삭제에 실패했습니다.');
        }
      } catch (error) {
        alert('파일 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 파일 순서 변경 처리
  const onDragEnd = async ({ active, over }) => {
    if (!over) return;

    const oldIndex = fileList.indexOf(active.id);
    const newIndex = fileList.indexOf(over.id);

    const newFileList = arrayMove(fileList, oldIndex, newIndex);
    setFileList(newFileList); // 파일 리스트 상태 업데이트
    console.log('정렬된 파일 목록:', newFileList);

    try {
      const response = await fetch('http://localhost:5000/update-file-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFileList),
      });

      if (!response.ok) {
        throw new Error('파일 순서 업데이트에 실패했습니다.');
      }
    } catch (error) {
      alert('파일 순서 업데이트 중 오류가 발생했습니다.');
    }
  };

  const handleDragStart = () => {
    setIsDragging(true); // 드래그 시작 시 상태 업데이트
  };

  const handleDragEndWrapper = (event) => {
    setIsDragging(false); // 드래그 종료 시 상태 업데이트
    onDragEnd(event); // 실제 드래그 종료 핸들러 호출
  };

  return (
    <div className='container'>
      <div className='select'>
        <form encType='multipart/form-data'>
          <label htmlFor='file' className='upload-label'>
            <img src='/image/upload.png' alt='upload' width="28px"/>
            <span style={{ color: 'white' }}>이미지 업로드</span>
          </label>
          <input type='file' id='file' name='file' className='upload' onChange={handleFileChange}/>
        </form>
      </div>

      <div className='description'>
        <img src='/image/information.png' alt='info-img' className='info'/>이미지를 드래그해서 순서를 조정할 수 있어요
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEndWrapper}>
        {fileList.length > 0 ? (
          <SortableContext items={fileList}>
            <div className='card'>
              {fileList.map((fileName, index) => (
                <ImageItem
                  key={index}
                  fileName={fileName}
                  onDelete={handleDelete}
                  isDragging={isDragging}
                />
              ))}
            </div>
          </SortableContext>
        ) : (
          <p>No images uploaded yet.</p>
        )}
      </DndContext>
    </div>
  );
}

export default FileUpload;
