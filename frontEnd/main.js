const columns = document.querySelectorAll(".column_cards");
const cards = document.querySelectorAll(".cards");

/* Card arrastado */
let draggedCard;

//Retorna Status da task
const taskStatus = (card)=>{
      if(card.parentElement.classList.contains('a-fazer')) return 'a_fazer';
      if(card.parentElement.classList.contains('em-andamento')) return 'em_andamento';
      if(card.parentElement.classList.contains('finalizado')) return 'concluido';
      return 'semStatus';
    }

//Inicio do arasto!
const dragStart = (event) => {
  /* event = "Mostra o evento em si" */
  /* event.target = "Mostra o elemento exato onde o evento aconteceu" */
  draggedCard = event.target;
  event.dataTransfer.effectAllowed = "move"; //Transforma o cursor em um item de transferência
};

//Enquanto arrastado sobre (ele vai piscando)!
const dragOver = (event) => {
  event.preventDefault(); // Remove o comportamento padrão, do icone de bloqueio
};

const dragEnter = (event) => {
  const elm = event.target;
  if (!elm.classList.contains("column_cards")) {
    return;
  }

  elm.classList.add("column_highlight");
};

const dragLeave = (event) => {
  const elm = event.target;
  elm.classList.remove("column_highlight");
};

const dragDrop = (event) => {
  const elm = event.target;
  const idTask = draggedCard.getAttribute('idTask');

  if (elm.classList.contains("column_cards")) {
    elm.classList.remove("column_highlight");
    
    elm.appendChild(draggedCard);

    //Pega o token, do ejs
    const token = document.querySelector('.columns').getAttribute('dataToken');
    
    //Mudar status da task
    fetch('http://localhost:5000/task/status',{
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'CSRF-Token':`${token}`,
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          taskDescription: draggedCard.textContent,
          status: taskStatus(draggedCard),
          idTask: idTask
        })
      }
    ).then((response)=>{
    }).catch(e=>{
      console.log(e);
    })

  }
};

const clickCard = (event) =>{
  const elm = event.target;
  if(event.target.classList.contains('card-edit')) {editTask(elm.closest('.cards'));};
  if(event.target.classList.contains('card-delete')) deleteTask(elm.closest('.cards'));
};

const createTask = (event)=>{
  //Column
    const elm = event.target;

  //Card
    const card = document.createElement('section');
    card.classList.add('cards');

  //Task Header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    const boxTaskIcons = document.createElement('div'); //Container com icones (apagar,editar...);
    boxTaskIcons.classList.add('box-task-icons');
    const taskTitle = document.createElement('h3');
    taskTitle.classList.add('task-title');

   //Task Description 
    const taskDescription = document.createElement('p');
    taskDescription.classList.add('task-description');
    
    if(!elm.classList.contains('column_cards')) return;

    //Adicionando elementos ao cabeçario
    cardHeader.appendChild(taskTitle);
    cardHeader.appendChild(boxTaskIcons);

    //Adiciona os elementos ao card
    card.appendChild(cardHeader);
    card.appendChild(taskDescription);

    //Atribui propriedades manipulaveis aos elementos (arrastar e editar)
    card.draggable = 'true';
    taskTitle.contentEditable = 'true';
    taskDescription.contentEditable = 'true';

    card.dataset.mode = 'creating';//Seta status de criação

    elm.appendChild(card);
    
    taskTitle.focus();

    card.addEventListener('focusout',(event)=>{
    if(card.dataset.mode !== 'creating') return;

        if(event.target.classList.contains('task-title')){
          taskDescription.focus();
          return;
        }
          
        if(!taskTitle.textContent){
            card.remove();
            return;
        }
        taskTitle.contentEditable = 'false';
        taskDescription.contentEditable = 'false';
        
        //Adiciona icones (edição e deletar)
        boxTaskIcons.innerHTML = `
        <i class="fa-solid fa-pen task-icons icons card-edit"></i>
        <i class="fa-solid fa-trash task-icons icons card-delete"></i>`

        card.dataset.mode = 'saving';

    //Pega o token, do ejs
    const token = document.querySelector('.columns').getAttribute('dataToken');
    
    //Cria Tarefa no banco
    fetch('http://localhost:5000/task/add',{
        method: 'POST',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'CSRF-Token':`${token}`,
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          taskTitle:`${taskTitle.textContent}`,
          taskDescription:`${taskDescription.textContent}`,
          status: taskStatus(card),
        })
      }
    ).then(response=>{
      if(response.ok){
      card.dataset.mode = 'viewing';
      return response.json();
      }
      return;
    })
    .then((dados)=>{
      if(!dados) return;
      const idTask = dados._id;
      card.setAttribute('idTask',idTask);
    }).catch(e=>{
      console.log(e);
    })
    });

    card.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){

        if(event.target.classList.contains('task-title')){
          taskTitle.contentEditable = 'false';
          taskDescription.focus();
          return;
        }

        if(event.target.classList.contains('task-description')){
          taskDescription.contentEditable = 'false';
        }
        }
    });
    card.addEventListener("click", clickCard); 
    card.addEventListener("dragstart", dragStart);
};

const deleteTask = (card)=>{
const token = document.querySelector('.columns').getAttribute('dataToken');
const id = card.getAttribute('idtask');

fetch(`http://localhost:5000/task/delete/${id}`,{
        method: 'DELETE',
        headers: {
          'CSRF-Token':`${token}`,
        },
        credentials: 'same-origin'
      }).then((res)=>{
        card.remove()
        // window.location.href = '/tasks'; /RECARREGA A PAGINA
      })
      .catch(e=>console.log(e));
};

const editTask = (card)=>{
if(card.dataset.mode === 'editing') return;//Se o card já estiver em edição não fazer nada
const token = document.querySelector('.columns').getAttribute('dataToken');

const title = card.querySelector('.task-title');
const description = card.querySelector('.task-description');

if(!title || !description) return;

const oldTitle = title.textContent;

card.dataset.mode = 'editing';//Seta modo de edição

title.contentEditable = true;
description.contentEditable = false;

title.textContent = '';
title.focus();

title.addEventListener('keydown',(event)=>{
  if(event.key === 'Enter'){
    event.preventDefault()
    event.target.blur();
  }
    });

title.addEventListener('focusout',(event)=>{

  title.contentEditable = false;
  description.contentEditable = true;

  description.focus();
},{once:true});

description.addEventListener('keydown',(event)=>{
  if(event.key === 'Enter'){
    event.preventDefault()
    event.target.blur();
  }
    });

description.addEventListener('focusout',(event)=>{
  let newTitle = title.textContent.trim();
  const newDescription = description.textContent.trim();

  if(!newTitle){
    title.textContent = oldTitle
    newTitle = oldTitle.trim();
  }

  description.contentEditable = false;
  title.contentEditable = false;
  card.dataset.mode = 'viewing';


  const newTask = {
    idTask : card.getAttribute('idTask'),
    taskTitle : newTitle,
    taskDescription : newDescription
  }

  fetch(`http://localhost:5000/task/edit/${newTask.idTask}`,{
        method: 'PATCH',
        headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'CSRF-Token':`${token}`,
        },
        credentials: 'same-origin',
        body: JSON.stringify(newTask)})
        .then((res)=>{
          if(res.status >=200 && res.status <300){
            console.log('tudo ok...')
          }else{
            console.log('ERRO:',res.status);
          }
        })
        .catch(err=>console.log(err));

},{once:true});

};

/* Adiciona em todos os cards, a escuta o inicio do arrasto */
cards.forEach((card) => {
card.addEventListener("dragstart", dragStart);
card.addEventListener("click", clickCard); 
});

columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
  column.addEventListener("dragenter", dragEnter);
  column.addEventListener("dragleave", dragLeave);
  column.addEventListener("drop", dragDrop);
  column.addEventListener("dblclick",createTask);
});