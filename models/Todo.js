// /models/Todo.js
const mongoose = require('mongoose'); // Mongoose 모듈을 가져옵니다.

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 할 일의 제목을 필수 값으로 설정합니다.
    completed: { type: Boolean, default: false } // 할 일의 완료 여부를 기본값 false로 설정합니다.
});

module.exports = mongoose.model('Todo', todoSchema); // Todo 모델을 생성하여 모듈로 내보냅니다.

