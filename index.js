const express = require('express'); // Express 모듈을 가져옵니다.
const mongoose = require('mongoose'); // Mongoose 모듈을 가져옵니다.
const bodyParser = require('body-parser'); // body-parser 모듈을 가져옵니다.
const path = require('path'); // path 모듈을 가져옵니다.
const PORT = process.env.PORT || 3000;

const app = express(); // Express 애플리케이션을 생성합니다.

app.use(bodyParser.json()); // JSON 형식의 요청 본문을 파싱하도록 설정합니다.
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일을 제공하도록 설정합니다.

mongoose.connect('mongodb://127.0.0.1:27017/todoDB', { useNewUrlParser: true, useUnifiedTopology: true })
 
    .then(() => console.log('MongoDB 연결 성공')) // 연결 성공 시 메시지를 출력합니다.
    .catch((err) => console.log('MongoDB 연결 실패', err)); // 연결 실패 시 에러 메시지를 출력합니다.

    app.listen(PORT, () => {
        console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
    });

const Todo = require('./models/Todo'); // Todo 모델을 가져옵니다.

// 모든 할 일을 가져오는 API 엔드포인트입니다.
app.get('/todos', async (req, res) => {
    const todos = await Todo.find(); // MongoDB에서 모든 할 일을 조회합니다.
    res.json(todos); // 조회된 할 일을 JSON 형식으로 응답합니다.
});


// 새로운 할 일을 추가하는 API 엔드포인트입니다.
app.post('/todos', async (req, res) => {
    const newTodo = new Todo({
        title: req.body.title // 요청 본문에서 받은 제목으로 새로운 할 일을 생성합니다.
    });
    const savedTodo = await newTodo.save(); // 생성한 할 일을 데이터베이스에 저장합니다.
    res.json(savedTodo); // 저장된 할 일을 JSON 형식으로 응답합니다.
});

// 특정 할 일을 업데이트하는 API 엔드포인트입니다.
app.put('/todos/:id', async (req, res) => {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
        $set: req.body // 요청 본문에서 받은 데이터로 할 일을 업데이트합니다.
    }, { new: true }); // 업데이트된 할 일을 반환합니다.
    res.json(updatedTodo); // 업데이트된 할 일을 JSON 형식으로 응답합니다.
});

// 특정 할 일을 삭제하는 API 엔드포인트입니다.
app.delete('/todos/:id', async (req, res) => {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id); // 할 일을 데이터베이스에서 삭제합니다.
    res.json(deletedTodo); // 삭제된 할 일을 JSON 형식으로 응답합니다.
});
