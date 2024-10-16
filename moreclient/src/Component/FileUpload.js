import React, { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import ImageItem from './ImageItem';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/files');
            const files = await response.json();
            setFileList(files);
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('파일 목록을 불러오는 데 오류가 발생했습니다.');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile && selectedFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(selectedFile);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            console.error('No file selected');
            alert('파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
            setFile(null); // 선택된 파일 초기화
            setPreviewUrl(null); // 미리보기 URL 초기화
            fetchFiles(); // 파일 목록 다시 불러오기
            } else {
                console.error('File upload failed');
                alert('파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (fileName) => {
        if (window.confirm(`"${fileName}" 파일을 삭제하시겠습니까?`)) {
            try {
                const response = await fetch(`/delete/${fileName}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setFileList((prevList) => prevList.filter((file) => file !== fileName));
                } else {
                    console.error('Error deleting file:', response.statusText);
                    alert('파일 삭제에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error deleting file:', error);
                alert('파일 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    const onDragEnd = async ({ active, over }) => {
        if (!over) return;

        const oldIndex = fileList.indexOf(active.id);
        const newIndex = fileList.indexOf(over.id);

        const newFileList = arrayMove(fileList, oldIndex, newIndex);
        setFileList(newFileList);
        
        // 정렬된 파일 목록을 콘솔에 출력
        console.log("정렬된 파일 목록:", newFileList);
            // 서버에 정렬된 파일 목록을 업데이트 요청
    try {
        const response = await fetch('/update-file-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFileList), // 정렬된 파일 목록을 JSON으로 변환하여 전송
        });

        if (!response.ok) {
            throw new Error('파일 순서 업데이트에 실패했습니다.');
        }
    } catch (error) {
        console.error('Error updating file order:', error);
        alert('파일 순서 업데이트 중 오류가 발생했습니다.');
    }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input 
                    type="file" 
                    name="file" 
                    onChange={handleFileChange} 
                    required 
                />
                <button type="submit">Submit</button>
            </form>
            {previewUrl && (
                <div>
                    <h3>Image Preview:</h3>
                    <img src={previewUrl} alt="Preview" style={{ maxWidth: '300px', maxHeight: '300px' }} />
                </div>
            )}
            <h3>Uploaded Images:</h3>
            <DndContext onDragEnd={onDragEnd}>
                <SortableContext items={fileList}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', margin: '10px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                        {fileList.map((fileName) => (
                            <ImageItem key={fileName} fileName={fileName} onDelete={handleDelete} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

export default FileUpload;
