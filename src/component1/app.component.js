import React, {Component, RenderCounter} from "react";
import { BrowserRouter, Route, Link } from 'react-router-dom';

import {observable, configure, action} from 'mobx';
import {observer} from 'mobx-react';


configure({'enforceActions': 'observed'});

const peopleStore = observable([
	{name: "first person"},
	{name: "other person"}
])



const todoStore = observable({
    
    todos: [],
	pendingRequests: 0,

	get completedTodosCount() {
		return this.todos.filter(todo => todo.completed === true).length;
	},
	get report(){
		if (this.todos.length > 0){
			return `Next todos: "${this.todos.filter(todo => todo.completed === false)[0] 
				? this.todos.filter(todo => todo.completed === false)[0].task
				: "there is no one uncompleted todo. you can go to take a cup of coffee)" }"` 
				+ ' '  
				+ `progress: ${this.completedTodosCount}/${this.todos.length}`
		}
		return null;
	},

	addTodo(todo_add_item){
        if (!Boolean(todo_add_item.todo)) return;
		const old_todos = this.todos.slice();
		this.todos = [...old_todos, {
			task: todo_add_item.todo,
			completed: false,
			assignee: {name: todo_add_item.name || null} ,
		}]
	}
}, {
	addTodo: action,
}); 

@observer
class NewComponent extends Component{
	render(){
		return (<div>
			<h1>Hello world!</h1>
		</div>)
	}	
}
@observer
export default class App extends Component {
	render(){
		return(
			<BrowserRouter>

				<Link to='/' children="home"/>
				<Link to='/new/' children="login"/>


				<Route exact path='' component={TodoStores} />
				<Route path='/new' component={NewComponent} />
			</BrowserRouter>
		)
	}
} 

@observer
class TodoStores extends Component {

	@action
	handleSubmit = (e) => {
		e.preventDefault();
		
		const todo_add_item = {};
		todo_add_item.name = this.inputNodeName.value
		todo_add_item.todo = this.inputNodeTodo.value
		todoStore.addTodo(todo_add_item)
		this.inputNodeTodo.value = ''
		this.inputNodeName.value = ''
	}
		
	render(){
		const store = todoStore;
		return(
			<div>
				<form
					onSubmit={(e) => this.handleSubmit(e)}
				>
					<lable>
						inter your todo: <br/>
						<input 
							type="text"
							name="todo"
							placeholder="your todo..."
							ref={node => this.inputNodeTodo = node}
						/>
						<input 
							type="text"
							name="name"
							placeholder="your name..."
							ref={node => this.inputNodeName = node}
						/>
					</lable>
					<button type="submit">
						add todo
					</button>
				</form>
				<div>
					{store.report}
				</div>
				<ul>
					
					{store.todos.map((todo, i) => (
						<TodoView key={i} todo={todo} />
					))}
				</ul>
				{store.pendingRequest > 0 
					? <marquee>Loading...</marquee>
					: null 
				}
				<small>double-click on todo to edit</small>
			</div>

		)
	}
}

@observer
class TodoView extends Component{

	@action
	handleEdit = () => {
		const todo = this.props.todo;
		todo.task = prompt('rename your todo: ', todo.task) || todo.task;
	}
	@action
	handleComplete = () => {
		const todo = this.props.todo;
		todo.completed = !todo.completed;
	}

	render(){
		const todo = this.props.todo;
		return (
			<li>
				<input 
					type="checkbox"
					onChange={this.handleComplete}
					checked={todo.completed}
				/>
				<span
					onDoubleClick={this.handleEdit}
					ref={node => this.todoNode = node}
				>
					{todo.task}
					<small> <i>{todo.assignee.name}</i></small>
				</span>
			</li>
		);
	}
}
