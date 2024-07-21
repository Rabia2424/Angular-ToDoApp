import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ToDo } from '../../models/todo';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css',
})
export class TodoListComponent implements OnInit {
  constructor() {}
  text: string = '';
  //displayAll:boolean=false;
  isToggled: boolean = false;
  filter: string = 'all';

  private readonly platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    this.todoList = this.getItemsFromLS();
  }

  todoList: ToDo[] = [
    { id: 1, description: 'Spor', action: true },
    { id: 2, description: 'Breakfast', action: false },
    { id: 3, description: 'Lunch', action: false },
  ];

  allToDoItems: ToDo[] = this.todoList;

  addToList() {
    if (this.text) {
      const nextId =
        this.todoList.length > 0
          ? Math.max(...this.todoList.map((t) => t.id)) + 1
          : 1;
      let data = { id: nextId, description: this.text, action: false };
      this.todoList.push(data);

      if (isPlatformBrowser(this.platformId)) {
        let items = this.getItemsFromLS();
        items.push(data);
        localStorage.setItem('items', JSON.stringify(items));
      }
      this.text = '';
    }
  }

  getItemsFromLS() {
    let items: ToDo[] = [];

    if(isPlatformBrowser(this.platformId)){
      let value = localStorage.getItem('items');
      if (value != null) {
        items = JSON.parse(value);
      }
    }
    return items;
  }

  onItemsChanged(todo: ToDo) {
    let items = this.getItemsFromLS();
    localStorage.clear();

    items.forEach(t=>{
      if(t.id === todo.id){
        t.action = todo.action;
      }
    });

    localStorage.setItem("items",JSON.stringify(items));
  }

  removeItem(todoItem: ToDo) {
    let items = this.getItemsFromLS();
    localStorage.clear();
    console.log(items);

    let index = items.findIndex(t=>t.id === todoItem.id);
    console.log(index);
    if(index!=-1){
      items.splice(index,1);
    }
    localStorage.setItem("items",JSON.stringify(items));
    this.todoList = this.getItemsFromLS();
    this.getItems("all");
    // let item = this.todoList.find((t) => t.id === todoItem.id);
    // if (item) {
    //   this.todoList.splice(this.todoList.indexOf(item), 1);
    // }
  }

  getClass() {
    return this.text ? 'enabled-btn' : 'disabled-btn';
  }

  getItems(filter: string) {
    this.filter = filter;
    if (filter === 'done') {
      return this.todoList.filter((item) => item.action == true);
    } else if (filter === 'undone') {
      return this.todoList.filter((item) => item.action == false);
    } else {
      return this.todoList;
    }
  }

  isSelectedFilter(filter: string): boolean {
    return this.filter === filter;
  }

  toggleAction(item: ToDo) {
    if (this.isToggled) {
      this.undoChangeAction(item);
    } else {
      this.changeAction(item);
    }
    this.isToggled = !this.isToggled;
  }

  changeAction(todoItem: ToDo) {
    if (!todoItem.action) {
      todoItem.action = true;
    }
  }

  undoChangeAction(todoItem: ToDo) {
    if (todoItem.action) {
      todoItem.action = false;
    }
  }
}
