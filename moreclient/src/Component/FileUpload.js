import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ImageItem from './ImageItem'; // 새로 만든 ImageItem 컴포넌트 import

function FileUpload() {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/files'); //get요철 받은 후에 다음
            const files = await response.json();
            setFileList(files);
            //await handleReorder(files); 
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('파일 목록을 불러오는 데 오류가 발생했습니다.');
        }
    };

    const handleReorder = async (fileList) => {
        try {
            const response = await fetch('/updateorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: fileList }), // 변경된 파일 목록 전송
            });

            if (response.ok) {
                console.log('File order updated successfully');
            } else {
                console.error('Error updating file order:', response.statusText);
                alert('파일 순서 업데이트에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating file order:', error);
            alert('파일 순서 업데이트 중 오류가 발생했습니다.');
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
                const message = await response.text();
                console.log(message);
                setFile(null);
                setPreviewUrl(null);
                e.target.reset();
                fetchFiles();
            } else {
                console.error('File upload failed');
                alert('파일 업로드에 실패했습니다.');
            }
        } catch (error) {   
            console.error('Error uploading file:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(fileList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFileList(items);
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
            <div>
                <h3>Uploaded Images:</h3>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                        {(provided) => (
                            <div 
                                style={{ display: 'flex', flexWrap: 'wrap', margin: '10px', backgroundColor: '#f0f0f0', alignItems: 'center', padding: '10px', borderRadius: '5px' }}
                                ref={provided.innerRef} 
                                {...provided.droppableProps} 
                            >
                                {fileList.map((fileName, index) => (
                                    <Draggable key={fileName} draggableId={fileName} index={index}>
                                        {(provided) => (
                                            <div 
                                                ref={provided.innerRef} 
                                                {...provided.draggableProps} 
                                                {...provided.dragHandleProps} 
                                                style={{ 
                                                    margin: '10px', 
                                                    position: 'relative', 
                                                    ...provided.draggableProps.style 
                                                }}
                                            >
                                                <ImageItem 
                                                    fileName={fileName} 
                                                    onDelete={handleDelete} // handleDelete 함수 전달
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
}

export default FileUpload;
