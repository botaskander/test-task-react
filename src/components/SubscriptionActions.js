import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookDataService from "../services/BookDataService";
import StudentDataService from "../services/StudentDataService";
import {Modal} from "react-bootstrap";
export default class SubscriptionActions extends Component {
    constructor(props) {
        super(props);
        this.getAllSubscriptions = this.getAllSubscriptions.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.changeBookIdHandler = this.changeBookIdHandler.bind(this);
        this.changeStudentIdHandler = this.changeStudentIdHandler.bind(this);
        this.delete=this.delete.bind(this);
        this.state = {
            subscriptions: [],
            students:[],
            books:[],
            studentId:null,
            bookId:null,
            message: "",
            messageCode: 0,
            show: false
        };
    }
    handleClose = (e) => {
        this.setState({show:false});
        this.getAllSubscriptions();
    };
    changeStudentIdHandler= (event) => {
        this.setState({studentId: event.target.value});
    }
    changeBookIdHandler= (event) => {
        this.setState({bookId: event.target.value});
    }

    getAllSubscriptions(){
        StudentDataService.getAllStudents().then(res=>{
            this.setState({students:res.data}
            );
        }).catch(e => {
            console.log(e);
        });
        BookDataService.getAllBooks().then(res=>{
            this.setState({books:res.data}
            );
        }).catch(e => {
            console.log(e);
        });
        StudentDataService.getAllSubscriptions()
            .then(response => {
                this.setState({
                    subscriptions: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    delete(id) {
        StudentDataService.deleteSubscription(id).then(res => {
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

    componentDidMount() {
        this.getAllSubscriptions();
    }
    save = (e) => {
        e.preventDefault();
        let subscriptions = {
            id: null,
            student: {id:this.state.studentId},
            book: {id:this.state.bookId},
        };

        StudentDataService.saveSubscriptions(subscriptions).then(res => {
                if (res.data.responseCode === 0) {
                    this.setState({
                        show: true,
                        id: null,
                        student: null,
                        book: null,

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

    render() {
        return (
            <div>
                <h1>Добавление учета</h1>
                    <div className="row mt-5">
                        <div className = "card pt-5 pl-2 pr-2 pb-3 ">
                            <div className = "card-body">
                                <form className="pl-2 pr-2">
                                    <div className = "form-group">
                                        <label> Студент:  </label>
                                        {
                                            this.state.students ?(
                                                <select name="cupboards" className="form-control mb-2" onChange={this.changeStudentIdHandler} value={this.state.studentId} >
                                                    {
                                                        this.state.students.map(
                                                            student=> <option value={student.id}>{student.firstname+" "+student.lastname}</option>
                                                        )
                                                    }
                                                </select>
                                            ):(  <span>  ---- </span>)
                                        }
                                    </div>
                                    <div className = "form-group">
                                        <label> Книга:  </label>
                                        {
                                            this.state.books ?(
                                                <select name="cupboards" className="form-control mb-2" onChange={this.changeBookIdHandler} value={this.state.bookId} >
                                                    {
                                                        this.state.books.map(
                                                            book=> <option value={book.id}>{book.name}</option>
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

                        { this.state.subscriptions.length>0?

                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Студент</th>
                                    <th scope="col">Книга</th>
                                    <th scope="col">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.subscriptions.map(subscription=>
                                    <tr>
                                        <th scope="row">{subscription.id}</th>
                                        <td>{subscription.student.firstname+" "+subscription.student.lastname}</td>
                                        <td>{subscription.book.name}</td>
                                        <td><a  className="card-link"><Link  to={`/subscriptions/edit/${subscription.id}`}>Изменить</Link></a>
                                            <button className="btn btn-link" onClick={() => this.delete(subscription.id)}>
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>

                            :<p>Пусто,нет учетов</p>
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
