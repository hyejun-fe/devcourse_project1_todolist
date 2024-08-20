document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소들을 가져옵니다.
    const todoList = document.getElementById('todo-list'); // 할 일 목록을 표시할 <ul> 요소
    const newTodoInput = document.getElementById('new-todo'); // 새로운 할 일을 입력하는 <input> 요소
    const addBtn = document.getElementById('add-btn'); // 할 일을 추가하는 <button> 요소

    // 서버로부터 모든 할 일을 불러와서 화면에 표시하는 함수입니다.
    function fetchTodos() {
        fetch('/todos') // 서버에 GET 요청을 보내서 모든 할 일을 가져옵니다.
            .then(response => response.json()) // 응답을 JSON 형식으로 변환합니다.
            .then(todos => {
                todoList.innerHTML = ''; // 할 일 목록을 초기화합니다.
                todos.forEach(todo => {
                    addTodoToList(todo); // 각 할 일을 화면에 추가하는 함수 호출
                });
            });
    }

    function addTodoToList(todo) {
        const li = document.createElement('li'); // 새로운 <li> 요소를 생성합니다.
    
        // 체크 아이콘을 위한 <span> 요소를 생성합니다.
        const checkIcon = document.createElement('span');
        checkIcon.classList.add('material-symbols-outlined');
        checkIcon.textContent = 'check_circle';
        checkIcon.style.cursor = 'pointer';

     
        // 텍스트를 위한 <span> 요소를 생성합니다.
        const todoText = document.createElement('span');
        todoText.textContent = todo.title;
    
        // 수정 아이콘을 위한 <span> 요소를 생성합니다.
        const editIcon = document.createElement('span');
        editIcon.classList.add('material-symbols-outlined');
        editIcon.textContent = 'edit';
        editIcon.style.cursor = 'pointer';
    
        // 삭제 아이콘을 위한 <span> 요소를 생성합니다.
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('material-symbols-outlined', 'delete_icon');
        deleteIcon.textContent = 'delete';
        deleteIcon.style.cursor = 'pointer';
    
        // 삭제 아이콘 클릭 시 할 일을 삭제하는 이벤트 리스너를 추가합니다.
        deleteIcon.addEventListener('click', () => deleteTodo(todo._id, li));
    
        // 수정완료 아이콘을 위한 <span> 요소를 생성합니다.
        const confirmIcon = document.createElement('span');
        confirmIcon.classList.add('material-symbols-outlined');
        confirmIcon.textContent = 'check';
        confirmIcon.style.cursor = 'pointer';
        confirmIcon.style.display = 'none'; // 초기에는 숨겨둡니다.
    
        // 수정취소 아이콘을 위한 <span> 요소를 생성합니다.
        const closeIcon = document.createElement('span');
        closeIcon.classList.add('material-symbols-outlined');
        closeIcon.textContent = 'close';
        closeIcon.style.cursor = 'pointer';
        closeIcon.style.display = 'none'; // 초기에는 숨겨둡니다.
    
        // 아이콘들을 묶는 컨테이너를 생성합니다.
        const iconContainer = document.createElement('div');
        iconContainer.style.display = 'flex';
        iconContainer.style.alignItems = 'center';
        iconContainer.style.gap = '10px';
    
        // 컨테이너에 아이콘들을 추가합니다.
        iconContainer.appendChild(editIcon);
        iconContainer.appendChild(deleteIcon);
        iconContainer.appendChild(confirmIcon);
        iconContainer.appendChild(closeIcon);
    
        // 텍스트와 아이콘을 <li> 요소에 추가합니다.
        li.appendChild(checkIcon);
        li.appendChild(todoText);
        li.appendChild(iconContainer);
    
        // <li> 요소를 할 일 목록에 추가합니다.
        todoList.appendChild(li);
    
        // 수정 아이콘 클릭 시 이벤트 처리
        editIcon.addEventListener('click', () => {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = todoText.textContent;
            inputField.classList.add('edit_input');
            li.replaceChild(inputField, todoText);
    
            // 아이콘을 confirmIcon과 closeIcon으로 교체
            editIcon.style.display = 'none';
            deleteIcon.style.display = 'none';
            confirmIcon.style.display = 'inline';
            closeIcon.style.display = 'inline';
    
            // 수정 완료
            confirmIcon.addEventListener('click', () => {
                const newTitle = inputField.value.trim();
                if (newTitle) {
                    fetch(`/todos/${todo._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ title: newTitle })
                    })
                    .then(response => response.json())
                    .then(updatedTodo => {
                        todoText.textContent = updatedTodo.title;
                        li.replaceChild(todoText, inputField);
    
                        // 아이콘을 원래대로 복구
                        confirmIcon.style.display = 'none';
                        closeIcon.style.display = 'none';
                        editIcon.style.display = 'inline';
                        deleteIcon.style.display = 'inline';
                    });
                }
            });
    
            // 수정 취소
            closeIcon.addEventListener('click', () => {
                li.replaceChild(todoText, inputField);
    
                // 아이콘을 원래대로 복구
                confirmIcon.style.display = 'none';
                closeIcon.style.display = 'none';
                editIcon.style.display = 'inline';
                deleteIcon.style.display = 'inline';
            });
        });
    }

    // 새로운 할 일을 생성하고 서버에 저장하는 함수입니다.
    addBtn.addEventListener('click', () => {
        const title = newTodoInput.value.trim(); // 입력된 할 일 제목에서 공백을 제거합니다.
        if (title) { // 제목이 비어있지 않은 경우에만 실행합니다.
            fetch('/todos', {
                method: 'POST', // POST 메서드를 사용하여 새로운 할 일을 서버에 전송합니다.
                headers: {
                    'Content-Type': 'application/json' // 요청 본문이 JSON 형식임을 알립니다.
                },
                body: JSON.stringify({ title }) // 요청 본문에 할 일 제목을 JSON으로 변환하여 포함합니다.
            })
            .then(response => response.json()) // 서버로부터의 응답을 JSON으로 변환합니다.
            .then(todo => {
                addTodoToList(todo); // 새로 추가된 할 일을 화면에 추가합니다.
                newTodoInput.value = ''; // 입력 필드를 비웁니다.
            });
        }
    });

    // 할 일을 삭제하는 함수입니다.
    function deleteTodo(id, todoElement) {
        fetch(`/todos/${id}`, { // DELETE 메서드를 사용하여 특정 할 일을 삭제합니다.
            method: 'DELETE'
        })
        .then(() => {
            todoList.removeChild(todoElement); // 삭제된 할 일을 화면에서 제거합니다.
        });
    }

    // 페이지가 로드될 때 초기 할 일 리스트를 가져옵니다.
    fetchTodos();
});
