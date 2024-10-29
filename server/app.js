const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const app = express();
const PORT = 5000;
const cors = require('cors');
app.use(cors());    

app.use('/uploads', express.static(path.join(__dirname, '..', 'client', 'public', 'uploads')));

// 현재 접속 중인 호스트 주소를 사용하여 API URL 구성
const apiUrl = `http://${window.location.hostname}:3000`;


// 파일 저장을 위한 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'client', 'public', 'uploads');
        cb(null, uploadPath);

    },
    filename: (req, file, cb) => {
        const uploadDir = 'uploads/';

        fs.readdir(path.join(__dirname, '..', 'client', 'public', 'uploads'), (err, files) => {
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
        const jsonFilePath = path.join(__dirname, '..', 'client', 'data', 'data.json');

        // const imageUrl = `http://localhost:3000/uploads/${fileData.filename}`;
        const imageUrl = apiUrl + `/uploads/${fileData.filename}`;
        const fileInfo = {
            id: null,
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

app.use(express.json());  // 이 줄을 추가하세요

app.post('/api/saveCount', (req, res) => {
    const { count } = req.body;  // 요청 본문에서 count 값을 가져옴
    const dataFilePath = path.join(__dirname, '..', 'client', 'public', 'config.json');
    
    try {
        const configData = fs.readFileSync(dataFilePath, 'utf8');
        const config = JSON.parse(configData);
        
        config.delaySec = count;

        fs.writeFileSync(dataFilePath, JSON.stringify(config, null, 4), 'utf8');
        console.log(`Updated delaySec to: ${count}`);
        res.send({ message: 'Delay time updated successfully!' });
    } catch (err) {
        console.error('Error updating config file:', err);
        res.status(500).send({ message: 'Failed to update delay time.' });
    }
});

app.get('/files', (req, res) => {
    const dirPath = path.join(__dirname, '../client/public/uploads/');
    const dataFilePath = path.join(__dirname, '..', 'client', 'data', 'data.json');
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: 'Error reading JSON file' });
        }

        let fileOrder;
        try {
            fileOrder = JSON.parse(data).map(fileInfo => fileInfo.filename);
        } catch (parseErr) {
            console.error('Error parsing JSON file:', parseErr);
            return res.status(500).json({ error: 'Error parsing JSON file' });
        }

        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return res.status(500).send('Error reading files');
            }
            const orderedFiles = fileOrder.filter(filename => files.includes(filename));
            res.set('Cache-Control', 'no-store'); // 캐시 방지
            res.json(orderedFiles);
        });
    });
});


app.use(bodyParser.json());
app.delete('/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    // const filePath = path.join(__dirname, 'uploads', fileName);  // BEFORE
    const filePath = path.join(__dirname, '..', 'client', 'public', 'uploads', fileName);

    // JSON 파일 경로 설정
    const jsonFilePath = path.join(__dirname, '..', 'client', 'data', 'data.json');

    // 파일 삭제
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ message: 'Error deleting file' });
        }

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
            fileInfoArray = fileInfoArray.filter(fileInfo => fileInfo.filename !== fileName);

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
// const dataFilePath = path.join(__dirname, './data/data.json');   // BEFORE
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));    // BEFORE
const dataFilePath = path.join(__dirname, '..', 'client', 'data/data.json');

app.post("/getImage", async (req, res) => {
    try {
        // JSON 파일 읽기
        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        res.json(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        res.status(500).send("An error occurred while reading the JSON file.");
    }
});


app.post('/update-file-order', (req, res) => {
    const newFileOrder = req.body; 
    const jsonFilePath = path.join(__dirname, '..', 'client', 'data/data.json');

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            return res.status(500).json({ error: '서버 오류' });
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ error: 'JSON 파싱 오류' });
        }

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
                    // url: `http://localhost:5000/uploads/${fileName}` // URL 정보
                    url: `http://localhost:3000/uploads/${fileName}` // URL 정보
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
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
