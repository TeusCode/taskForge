const columns = document.querySelectorAll(".column_cards");
const cards = document.querySelectorAll(".cards");
const cardEdit = document.querySelector(".card_edit")

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
          idTask: draggedCard.getAttribute('idTask')
        })
      }
    ).then((response)=>{
      console.log('Status do card atualizado!');
      console.log('id:',draggedCard.getAttribute('idTask'))
    }).catch(e=>{
      console.log(e);
    })

  }
};

const createTask = (event)=>{
    const card = document.createElement('section');
    const taskDescription = document.createElement('p');
    const elm = event.target;
    const taskMenu = document.createElement('span');
    const taskTitle = document.createElement('h3');

    if(!elm.classList.contains('column_cards')) return;

    //Adiciona elementos ao card
    card.appendChild(taskTitle);
    card.appendChild(taskDescription);

    card.classList.add('cards');
    taskTitle.classList.add('task-title');
    taskDescription.classList.add('task-description');
    taskMenu.classList.add("material-symbols-outlined","task-menu");
    taskMenu.textContent = "more_vert";
    
    //Atribui propriedades manipulaveis aos elementos (arrastar e editar)
    card.draggable = 'true';
    taskTitle.contentEditable = 'true';
    taskDescription.contentEditable = 'true';
    taskMenu.contentEditable = 'false';

    card.addEventListener("dragstart", dragStart);

    elm.appendChild(card);
    
    taskTitle.focus();

    card.addEventListener('focusout',(event)=>{
        if(event.target.classList.contains('task-title')) return;
          
        if(!taskDescription.textContent){
            card.remove();
            return;
        }
        card.contentEditable = 'false';


    card.appendChild(taskMenu);
    

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
      return response.json();
    })
    .then((dados)=>{
      console.log('Card adicionado ao banco de dados!');
      const idTask = dados._id;
      card.setAttribute('idTask',idTask);
    }).catch(e=>{
      console.log(e);
    })
        

    });

    card.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){

        if(event.target.classList.contains('task-title')){
          console.log('Passando para outra tarefa');
          taskTitle.contentEditable = 'false';
          taskDescription.focus();
          return;
        }

        if(event.target.classList.contains('task-description')){
          console.log('ELEMENTO descrição');
          taskDescription.contentEditable = 'false';
        }

        console.log('EVENTO 3',event.target)
        }
    });


};

/* Adiciona em todos os cards, a escuta o inicio do arrasto */
cards.forEach((card) => {
  card.addEventListener("dragstart", dragStart);
});

columns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
  column.addEventListener("dragenter", dragEnter);
  column.addEventListener("dragleave", dragLeave);
  column.addEventListener("drop", dragDrop);
  column.addEventListener("dblclick",createTask);
});

