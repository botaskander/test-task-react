import axios from "axios";
import React, { Component } from "react";
import {Link, useParams} from "react-router-dom";
import BookDataService from "../services/BookDataService";
import StudentDataService from "../services/StudentDataService";
import {Modal} from "react-bootstrap";
import {useNavigate} from "react-router";
function withParams(SubscriptionChange) {
    return function WrappedComponent(props) {
        const myHookValue = useParams();
        const navigate = useNavigate();
        return <SubscriptionChange {...props} myHookValue={myHookValue.id} navigate={navigate}/>;
    }
}

class SubscriptionChange extends Component {
    constructor(props) {
        super(props);
        this.getAllSubscriptions = this.getAllSubscriptions.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.changeBookIdHandler = this.changeBookIdHandler.bind(this);
        this.changeStudentIdHandler = this.changeStudentIdHandler.bind(this);
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
        this.props.navigate("/subscriptions")
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
        const id = this.props.myHookValue;
        StudentDataService.getSubscription(id)
            .then(response => {
                this.setState({
                    id:id,
                    bookId: response.data.book!=null? response.data.book.id:null,
                    studentId:response.data.student!=null? response.data.student.id:null,
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    componentDidMount() {
        this.getAllSubscriptions();
    }
    save = (e) => {
        e.preventDefault();
        let subscriptions = {
            id: null,
            student: {id:this.state.studentId!=null? this.state.studentId:null},
            book: {id:this.state.bookId!=null? this.state.bookId:null},
        };

        StudentDataService.saveSubscriptions(subscriptions).then(res => {
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

    render() {
        return (
            <div>
                <h1>Изменение учета</h1>
                <div className="row mt-5">
                    <div className = "card pt-5 pl-2 pr-2 pb-3 ">
                        <div className = "card-body">
                            <form className="pl-2 pr-2">
                                <div className = "form-group">
                                    <label> Студент:  </label>
                                    {
                                        this.state.students ?(
                                            <select name="cupboards" className="form-control mb-2" onChange={this.changeStudentIdHandler} value={this.state.studentId&&(this.state.studentId)} >
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
                                            <select name="cupboards" className="form-control mb-2" onChange={this.changeBookIdHandler} value={this.state.bookId&&(this.state.bookId)} >
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
                                        onClick={this.save}>Изменить</button>
                            </form>
                        </div>
                    </div>
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
export default  withParams(SubscriptionChange);