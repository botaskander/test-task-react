import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import BookDataService from "../services/BookDataService";
import {Modal } from 'react-bootstrap';
import { useParams } from "react-router-dom";
function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}
class CupboardDetails extends Component {
    constructor(props) {
        super(props);
        this.getAllCards = this.getAllCards.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            books:[],
            cupboard:null,
            message: "",
            messageCode: 0,
            show: false,
        };
    }
    handleClose = (e) => {
        this.setState({show:false});

    };
    getAllCards(){
        const id=this.props.params.id;
        BookDataService.getCupboard(id).then((res) => {
                this.setState({cupboard: res.data});
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
        BookDataService.getAllBooksByCupboard(id).then((res) => {
                this.setState({books: res.data});
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
        this.getAllCards();
    }

    render() {
        return (
            <div>
                <h1>{this.state.cupboard&&(this.state.cupboard.name)}</h1>
                <div className="row mt-5">
                    { this.state.books.length>0?

                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Имя</th>
                                <th scope="col">Описания</th>
                                <th scope="col">Цена</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.books.map(book=>
                                <tr>
                                    <th scope="row">{book.id}</th>
                                    <td>{book.name}</td>
                                    <td>{book.description}</td>
                                    <td>{book.price}</td>

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
export default  withParams(CupboardDetails);