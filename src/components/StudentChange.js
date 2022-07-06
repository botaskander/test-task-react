import axios from "axios";
import React, { Component } from "react";
import {Link, Redirect, useParams} from "react-router-dom";
import BookDataService from "../services/BookDataService";
import StudentDataService from "../services/StudentDataService";
import {Modal} from "react-bootstrap";
import {Navigate, useNavigate} from "react-router";
function withParams(StudentChange) {
    return function WrappedComponent(props) {
        const myHookValue = useParams();
        const navigate = useNavigate();
        return <StudentChange {...props} myHookValue={myHookValue.id} navigate={navigate}/>;
    }
}
class StudentChange extends Component {
    constructor(props) {
        super(props);
        this.getAllStudents = this.getAllStudents.bind(this);
        this.changeFirstnameHandler = this.changeFirstnameHandler.bind(this);
        this.changeLastnameHandler = this.changeLastnameHandler.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            id:null,
            firstname:'',
            lastname:"",
            message: "",
            messageCode: 0,
            show: false
        };
    }
    handleClose = (e) => {
        this.setState({show:false});
        this.props.navigate('/students');
    };
    changeFirstnameHandler= (event) => {
        this.setState({firstname: event.target.value});
    }
    changeLastnameHandler= (event) => {
        this.setState({lastname: event.target.value});
    }
    getAllStudents(){
        const id = this.props.myHookValue;
        StudentDataService.getStudent(id)
            .then(response => {
                this.setState({
                   id:id,
                   firstname:response.data.firstname,
                   lastname:response.data.lastname
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }
    save = (e) => {
        e.preventDefault();
        let student = {
            id: this.state.id,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
        };

        StudentDataService.saveStudent(student).then(res => {
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

    componentDidMount() {
        this.getAllStudents();
    }

    render() {
        return (
            <div>
                <h1>Изменение студента  </h1>
                <div className="row mt-5">
                    <div className = "card pt-5 pl-2 pr-2 pb-3 ">
                        <div className = "card-body">
                            <form className="pl-2 pr-2">
                                <div className = "form-group">
                                    <label> Имя: </label>
                                    <input  name="name" className="form-control mb-2"
                                            value={this.state.firstname} onChange={this.changeFirstnameHandler}/>
                                </div>
                                <div className = "form-group">
                                    <label> Фамилия: </label>
                                    <input  name="description" className="form-control mb-2"
                                            value={this.state.lastname} onChange={this.changeLastnameHandler}/>
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
export default  withParams(StudentChange);