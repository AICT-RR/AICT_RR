const express = require('express');
const cors = require('cors'); // CORS 모듈을 가져옵니다.
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const app = express();
const PORT = 5000;
app.use(cors()); 


// 파일 저장을 위한 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 파일을 저장할 경로
    },
    filename: (req, file, cb) => {
        const uploadDir = 'uploads/';
        
        fs.readdir(uploadDir, (err, files) => {
            if (err) {
                console.error('Error reading upload directory:', err);
                return cb(err);
            }
        
            const randomString = crypto.randomBytes(8).toString('hex'); // 16자리 랜덤 문자열
            const fileExt = path.extname(file.originalname); // 원본 파일의 확장자 가져오기
            const newFileName = `${randomString}${fileExt}`; // 랜덤 문자열 + 확장자

            cb(null, newFileName); // 새로운 파일명 설정
        });
    }
});

// multer 미들웨어 설정
const upload = multer({ storage: storage });

// 파일 업로드 라우트 설정
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      const fileData = req.file;
      const jsonFilePath = path.join(__dirname, '..', 'server', 'data', 'data.json');
        
      const imageUrl = `http://localhost:5000/${fileData.path}`; 
      const fileInfo = {
        id: null, // 나중에 ID를 설정할 것입니다.
        fieldname: fileData.fieldname,
        mimetype: fileData.mimetype,
        destination: fileData.destination,
        filename: fileData.filename,
        path: fileData.path,
        size: fileData.size,
        url: imageUrl
      };
  
      fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        let fileInfoArray = [];

        if (err) {
            if (err.code === 'ENOENT') {
                // 파일이 없을 경우: 새 배열에 데이터를 추가
                console.log('파일이 없어 새로 생성합니다.');
                fileInfoArray = [fileInfo]; // 새로운 배열 생성
            } else {
                console.error('파일을 읽는 중 오류 발생:', err);
                return res.status(500).send('파일 읽기 실패');
            }
        } else {
            if (data.trim() === '') {
                console.warn('파일이 비어 있습니다. 빈 배열로 초기화합니다.');
                fileInfoArray = [];
            } else {
                try {
                    fileInfoArray = JSON.parse(data);

                    // 파일 정보 배열이 아닌 경우 빈 배열로 초기화
                    if (!Array.isArray(fileInfoArray)) {
                        console.warn('파일 데이터가 배열이 아닙니다. 빈 배열로 초기화합니다.');
                        fileInfoArray = [];
                    }
                } catch (parseErr) {
                    console.error('파일을 파싱하는 중 오류 발생:', parseErr);
                    return res.status(500).send('파일 파싱 실패');
                }
            }
            fileInfo.id = fileInfoArray.length > 0 ? fileInfoArray[fileInfoArray.length - 1].id + 1 : 1;
            fileInfoArray.push(fileInfo);
        }

        // 배열을 다시 JSON 파일에 저장
        fs.writeFile(jsonFilePath, JSON.stringify(fileInfoArray, null, 2), (err) => {
            if (err) {
                console.error('파일 정보를 저장하는 중 오류 발생:', err);
                return res.status(500).send('파일 저장 실패');
            }

            res.send('파일 업로드 및 정보 저장 완료');
        });
    });
} else {
    res.status(400).send('업로드된 파일이 없습니다');
}
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
app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
    
    // JSON 파일 경로 설정
    const jsonFilePath = path.join(__dirname, '..', 'server', 'data', 'data.json');

    // 파일 삭제
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file' });
        }

        // JSON 파일에서 파일 정보 삭제
        fs.readFile(jsonFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                return res.status(500).json({ message: 'Error reading JSON file' });
            }

            let fileInfoArray;
            try {
                fileInfoArray = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON file:', parseErr);
                return res.status(500).json({ message: 'Error parsing JSON file' });
            }

            // 파일 정보를 배열에서 삭제
            fileInfoArray = fileInfoArray.filter(fileInfo => fileInfo.filename !== fileName);

            // ID 재정렬
            fileInfoArray.forEach((fileInfo, index) => {
                fileInfo.id = index + 1; // ID를 1부터 시작하여 재설정
            });

            // 배열을 다시 JSON 파일에 저장
            fs.writeFile(jsonFilePath, JSON.stringify(fileInfoArray, null, 2), (err) => {
                if (err) {
                    console.error('Error saving updated JSON file:', err);
                    return res.status(500).json({ message: 'Error saving updated JSON file' });
                }

                res.json({ message: 'File deleted successfully' });
            });
        });
    });
});

// POST 요청의 body를 JSON으로 처리하기 위한 미들웨어
app.use(express.json());
const dataFilePath = path.join(__dirname, './data/data.json');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post("/getImages", async (req, res) => {
    const { filename } = req.file;
    const { subject } = req.body;
    const filePath = `http://localhostt:${PORT}/${filename}`;
    const data = { subject, filePath };
    board.push(data);
    console.log(board);
    res.send('OK');

    try {
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        
        let imageFiles = [];
    
        // JSON 데이터 배열을 순회하면서 파일 찾기
        for (let item of data) {
            if (fs.existsSync(item.filename)) {
            imageFiles.push(item.filename);
            }
        } console(imageFiles);
    
        if (imageFiles.length > 0) {
            res.json({ images: imageFiles });
        } else {
            res.status(404).send('No image files found.');
        }
        } catch (error) {
        console.error("Error reading JSON file:", error);
        res.status(500).send("An error occurred.");
        }
    });

app.get('/slides', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'data', 'data.json'); // JSON 파일 경로 설정

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류 발생:', err);
            return res.status(500).send('파일 읽기 실패');
        }
        try {
            const slidesData = JSON.parse(data); // JSON 파일을 파싱
            res.json(slidesData); // 클라이언트에 JSON 데이터 반환
        } catch (parseErr) {
            console.error('파일을 파싱하는 중 오류 발생:', parseErr);
            return res.status(500).send('파일 파싱 실패');
        }
    });
});
app.post('/update-file-order', (req, res) => {
    const newFileOrder = req.body; // 클라이언트에서 보낸 정렬된 파일 목록

    const jsonFilePath = path.join(__dirname, 'data', 'data.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: '서버 오류' });
        }

        // JSON 데이터 파싱
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ error: 'JSON 파싱 오류' });
        }

        // files 속성이 정의되어 있는지 확인
        if (!Array.isArray(jsonData)) {
            console.error('파일 목록이 정의되지 않았습니다.');
            return res.status(500).json({ error: '파일 목록이 정의되지 않았습니다.' });
        }

        // 기존 파일 목록에서 파일 이름과 ID를 매핑하여 업데이트
        const newjsonData = newFileOrder.map((fileName, index) => {
            // filename과 일치하는 기존 파일 찾기
            const existingFile = jsonData.find(file => file.filename === fileName);
            
            if (existingFile) {
                existingFile.id = index + 1; // 새로운 ID 할당 (1부터 시작)
                return existingFile; // 업데이트된 기존 파일 반환
            } else {
                // 기존 파일이 없는 경우 새로운 파일 객체를 추가할 수 있습니다.
                return {
                    id: index + 1, // 새로운 ID 할당
                    fieldname: "file", // 필요 시 추가할 속성
                    mimetype: "image/png", // 필요 시 추가할 속성
                    destination: "uploads/", // 필요 시 추가할 속성
                    filename: fileName, // 새로 추가된 파일 이름
                    path: `uploads/${fileName}`, // 새로운 파일 경로
                    size: 0, // 크기 정보는 필요에 따라 업데이트
                    url: `http://localhost:5000/uploads/${fileName}` // URL 정보
                };
            }
        });

        // 업데이트된 jsonData에 새 파일 목록 할당
        jsonData.length = 0; // 기존 배열 비우기
        jsonData.push(...newjsonData); // 새로운 배열 요소 추가

        // 업데이트된 JSON 파일 쓰기
        fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error('Error writing JSON file:', err);
                return res.status(500).json({ error: '서버 오류' });
            }

            res.json({ message: '파일 순서가 업데이트되었습니다.' });
        });
    });
});


// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
