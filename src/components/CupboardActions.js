import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Modal } from 'react-bootstrap';
import BookDataService from "../services/BookDataService";
import BookActions from "./BookActions";
export default class CupboardActions extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCode=this.onChangeCode.bind(this);
        this.getAllCupboards = this.getAllCupboards.bind(this);
        this.delete = this.delete.bind(this);
        this.state = {
            cupboards: [],
            name:'',
            code:0,
            messageCode:0,
            message:'',
            show:false
        };
    }
    onChangeName = event => {
        this.setState({ name: event.target.value });
    }
    onChangeCode = event => {
        this.setState({ code: event.target.value });
    }

    getAllCupboards(){
        BookDataService.getAllCupboards()
            .then(response => {
                this.setState({
                    cupboards: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
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
    componentDidMount() {
        this.getAllCupboards();
    }
    saveCupBoard = event => {
        event.preventDefault();

        const  data = {
            id: null,
            name:this.state.name,
            code:this.state.code,
        };
        BookDataService.saveCupBoard(data).then(res=>{
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
                    show: true
                });
            }
        );


    }
    handleClose = (e) => {
        this.setState({show:false});
        this.getAllCupboards();
    };

    render() {
        return (
            <div>
                    <div className="row">
                        <h3 className="d-flex justify-content-center">Добавление полки</h3>
                        <div className="col-12 col-6 d-flex justify-content-center">
                                <form>
                                    <div className="form-group">

                                            <input type="text" id="name" required value={this.state.name}
                                                   onChange={this.onChangeName} name="name"
                                                   className="form-control mt-4 ml-5"
                                                   placeholder="Название"/>
                                        </div>
                                        <div className="form-group">
                                            <input type="number" id="code" required value={this.state.code}
                                                   onChange={this.onChangeCode} name="name"
                                                   className="form-control mt-4 ml-5"
                                                   placeholder="Код"/>
                                        </div>
                                    <button type="submit" onClick={this.saveCupBoard} className="btn btn-primary ml-5 mt-3">Submit</button>
                                </form>
                        </div>
                    </div>
                    <div className="row mt-5">

                        { this.state.cupboards?
                            this.state.cupboards.map(cupboard=>
                                <div className="col-4 mt-3">
                                    <div className="card" key={cupboard.id} style={{width: "18rem"}}>
                                        <div className="card-body">
                                            <h5 className="card-title">{cupboard.name}</h5>
                                            <a  className="card-link"><Link to={`/cupboards/edit/${cupboard.id}`}>Изменить</Link></a>
                                            <a className="card-link"><Link to={`/cupboards/details/${cupboard.id}`}>Детали</Link></a>
                                            <button className="card-link btn btn-link" onClick={() => this.delete(cupboard.id)}>Удалить</button>
                                        </div>
                                    </div>
                                </div>)
                            :<p>Niche net</p>
                        }
                        <Modal
                            show={this.state.show}
                            onHide={this.handleClose}
                            backdrop="static"
                            keyboard={false}
                            centered>
                            <Modal.Header >
                                <Modal.Title style={{display: "block",marginLeft:"auto",marginRight:"auto"}}>
                                    {this.state.messageCode==0&&(
                                        <img src="https://icons.veryicon.com/png/o/miscellaneous/cloud-call-center/success-24.png" style={{height:100,width:100}} className="successIcon rounded mx-auto d-block"/>
                                    )}
                                    {this.state.messageCode==1&&(
                                        <img src="https://icons.veryicon.com/png/o/miscellaneous/digital-couplet/error-49.png" style={{height:100,width:100}} className="successIcon rounded mx-auto d-block"/>
                                    )}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{textAlign:"center"}}>
                                <h5>
                                    {this.state.message&&(
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
            </div>
        );
    }

}