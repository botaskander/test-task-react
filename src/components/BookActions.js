import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookDataService from "../services/BookDataService";
import {Modal } from 'react-bootstrap';
export default class BookActions extends Component {
    constructor(props) {
        super(props);
        this.getAllCards = this.getAllCards.bind(this);
        this.changeCupBoardIdHandler = this.changeCupBoardIdHandler.bind(this);
        this.changeNameHandler = this.changeNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.changeYearHandler = this.changeYearHandler.bind(this);
        this.changePriceHandler=this.changePriceHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.delete = this.delete.bind(this);
        this.state = {
            books: [],
            cupboards:[],
            name:'',
            cupboardId:null,
            price:0,
            year:0,
            description:"",
            message: "",
            messageCode: 0,
            show: false
        };
    }
    changeNameHandler= (event) => {
        this.setState({name: event.target.value});
    }
    changeYearHandler= (event) => {
        this.setState({year: event.target.value});
    }
    changePriceHandler= (event) => {
        this.setState({price: event.target.value});
    }
    changeDescriptionHandler= (event) => {
        this.setState({description: event.target.value});
    }
    changeCupBoardIdHandler= (event) => {
        this.setState({cupboardId: event.target.value});
    }
    handleClose = (e) => {
        this.setState({show:false});
        this.getAllCards();
    };
    save = (e) => {
        e.preventDefault();
        let book = {
            id: null,
            name: this.state.name,
            description: this.state.description,
            year: this.state.year,
            price:this.state.price,
            cupBoard:{id:this.state.cupboardId}
        };

        BookDataService.saveBook(book).then(res => {
                if (res.data.responseCode === 0) {
                    this.setState({
                        show: true
                    });
                }
                this.setState({
                    message: res.data.responseMessage,
                    messageCode: res.data.responseCode
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    message: resMessage,
                    messageCode: 1
                });
            }
        );

    }

    getAllCards(){
        BookDataService.getAllCupboards().then(res=>{
            this.setState({cupboards:res.data}
            );
        }).catch(e => {
            console.log(e);
        });
        BookDataService.getAllBooks()
            .then(response => {
                this.setState({
                    books: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    componentDidMount() {
        this.getAllCards();
    }
    delete(id) {
        BookDataService.deleteBook(id).then(res => {
                this.setState({
                    message: res.data.responseMessage,
                    messageCode: res.data.responseCode,
                    show:true
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    message: resMessage,
                    messageCode: 1,
                    show:true
                });
            }
        );
    }

    render() {
        return (
            <div>
                <h1>Добавление книги</h1>
                <div className="row mt-5">
                    <div className = "card pt-5 pl-2 pr-2 pb-3 ">
                        <div className = "card-body">
                            <form className="pl-2 pr-2">
                                <div className = "form-group">
                                    <label> Название: </label>
                                    <input  name="name" className="form-control mb-2"
                                           value={this.state.name} onChange={this.changeNameHandler}/>
                                </div>
                                <div className = "form-group">
                                    <label> Описание: </label>
                                    <input  name="description" className="form-control mb-2"
                                           value={this.state.description} onChange={this.changeDescriptionHandler}/>
                                </div>
                                <div className = "form-group">
                                    <label> Цена: </label>
                                    <input name="price" type="number" step="0.01" min="0" className="form-control mb-2"
                                           value={this.state.price} onChange={this.changePriceHandler}/>
                                </div>
                                <div className = "form-group">
                                    <label> Год: </label>
                                    <input name="name"  step="1" type="number" className="form-control mb-2"
                                           value={this.state.year} onChange={this.changeYearHandler}/>
                                </div>
                                <div className = "form-group">
                                    <label> Полка:  </label>
                                    {
                                        this.state.cupboards ?(
                                            <select name="cupboards" className="form-control mb-2" onChange={this.changeCupBoardIdHandler} value={this.state.cupboardId} >
                                                {
                                                    this.state.cupboards.map(
                                                        cupboard=> <option value={cupboard.id}>{cupboard.name}</option>
                                                    )
                                                }
                                            </select>
                                        ):(  <span>  ---- </span>)
                                    }
                                </div>
                                <button className="btn btn-success mt-3 "
                                        onClick={this.save}>Добавить</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row mt-5">

                    { this.state.books.length>0?

                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Имя</th>
                                    <th scope="col">Описания</th>
                                    <th scope="col">Цена</th>
                                    <th scope="col">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.books.map(book=>
                                    <tr>
                                        <th scope="row">{book.id}</th>
                                        <td>{book.name}</td>
                                        <td>{book.description}</td>
                                        <td>{book.price}</td>
                                        <td>
                                           <Link to={`/books/edit/${book.id}`}>Изменить</Link>
                                            <button className="btn btn-link" onClick={() => this.delete(book.id)}>
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                        :<p>Пусто, нет книг</p>
                    }
                </div>
                <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    centered>
                    <Modal.Header>
                        <Modal.Title style={{display: "block", marginLeft: "auto", marginRight: "auto"}}>
                            {this.state.messageCode == 0 && (
                                <img style={{height:100,width:100}}
                                    src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png"
                                    className="successIcon rounded mx-auto d-block"/>
                            )}
                            {this.state.messageCode == 1 && (
                                <img style={{height:100,width:100}}
                                    src="https://icons.veryicon.com/png/o/miscellaneous/digital-couplet/error-49.png"
                                    className="successIcon rounded mx-auto d-block"/>
                            )}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign: "center"}}>
                        <h5>
                            {this.state.message && (
                                <>{this.state.message} </>
                            )}
                        </h5>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-center">
                        <button className='btn btn-primary' onClick={this.handleClose}>
                            Ок
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}