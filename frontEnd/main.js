
const columns = document.querySelectorAll(".column_cards");
const cards = document.querySelectorAll(".cards");
const cardEdit = document.querySelector(".card_edit")

/* Card arrastado */
let draggedCard;

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

  if (elm.classList.contains("column_cards")) {
    elm.classList.remove("column_highlight");
    
    elm.appendChild(draggedCard);
    // createTask(elm);
  }
};

const createTask = (event)=>{
    const card = document.createElement('section');
    const elm = event.target;

    if(!elm.classList.contains('column_cards')) return;

    card.classList.add('cards');
    card.draggable = 'true'; //Torna o card arrastavel
    card.contentEditable = 'true'; //Torna o conteúdo do elemento editavel

    elm.appendChild(card);
    card.focus(); //Traz o foco para o card, assim que criado, para adicionar o conteúdo da task

    card.addEventListener('focusout',()=>{
        if(!card.textContent){
            card.remove();
        }
        card.contentEditable = 'false';
    });

    card.addEventListener('keydown',(event)=>{
        if(event.key === 'Enter'){
            card.contentEditable = 'false';

            
    const taskStatus = (card)=>{
      if(card.parentElement.classList.contains('a-fazer')) return 'a_fazer';
      if(card.parentElement.classList.contains('em-andamento')) return 'em_andamento';
      if(card.parentElement.classList.contains('finalizado')) return 'concluido';
      return 'semStatus';
    }

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
          taskName:`${card.textContent}`,
          status: taskStatus(card),
        })
      }
    ).then((response)=>{
      console.log(response);
      console.log(card.textContent);
      console.log('PAI DO CARD',card.parentElement);
    }).catch(e=>{
      console.log(e);
    })
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

