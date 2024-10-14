const express = require('express');
const cors = require('cors'); // CORS 모듈을 가져옵니다.
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = 5000;
app.use(cors()); 

// 파일 저장을 위한 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 파일을 저장할 경로
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname.replace(/\s+/g, '_');
        const fileExt = path.extname(originalName);
        const nameWithoutExt = path.basename(originalName, fileExt);

        // 파일 이름과 숫자 초기화
        let newFileName = originalName;
        let counter = 1;

        // 파일이 존재하는지 확인하고, 존재할 경우 숫자 추가
        while (fs.existsSync(path.join('uploads', newFileName))) {
            newFileName = `${nameWithoutExt}_${counter}${fileExt}`;
            counter++;
        }
        cb(null, newFileName);
    }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage });

// 파일 업로드 라우트 설정
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully!');
});

// uploads 폴더의 파일 목록을 반환하는 라우트
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }
        res.json(files);
    });
});

// 정적 파일 제공 설정
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

// app.post('/updateorder', (req, res) => {
//     const updatedOrder = req.body.items;
//     try {
//         updatedOrder.forEach((fileName, index) => { //일단 보류
//             const fileExt = path.extname(fileName); // 파일 확장자 추출
//             const oldPath = path.join(__dirname, 'uploads', `${fileName}`);
//             const newPath = path.join(__dirname, 'uploads', `${index}`);
//             fs.renameSync(oldPath, newPath); 
//         });
//         res.json({ message: 'File order updated successfully' });
//     } catch (error) {
//         console.error('Error updating file order:', error);
//         res.status(500).json({ message: 'Error updating file order' });
//     }
// });

app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file' });
        }
        res.json({ message: 'File deleted successfully' });
    });
});

// POST 요청의 body를 JSON으로 처리하기 위한 미들웨어
app.use(express.json());

app.post('/createfolder', (req, res) => {
    const folderName = req.body.folderName;

    // 폴더 경로 설정 (현재 디렉토리에 폴더 생성)
    const folderPath = path.join(__dirname, 'public', folderName);

    // 폴더가 이미 존재하는지 확인한 후 생성
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        return res.status(200).json({ message: '폴더 생성 성공' });
    } else {
        return res.status(400).json({ message: '폴더가 이미 존재합니다' });
    }
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
