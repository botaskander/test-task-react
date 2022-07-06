import axios from "axios";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {Modal } from 'react-bootstrap';
import BookDataService from "../services/BookDataService";
import BookActions from "./BookActions";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router";
function withParams(CupboardChange) {
    return function WrappedComponent(props) {
        const myHookValue = useParams();
        const navigate = useNavigate();
        return <CupboardChange {...props} myHookValue={myHookValue.id} navigate={navigate}/>;
    }
}
class CupboardChange extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCode=this.onChangeCode.bind(this);
        this.getAllCupboards = this.getAllCupboards.bind(this);
        this.state = {
            id:null,
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
        const id = this.props.myHookValue;
        BookDataService.getCupboard(id)
            .then(response => {
                this.setState({
                    id:id,
                    name:response.data.name,
                    code:response.data.code,
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    componentDidMount() {
        this.getAllCupboards();
    }
    saveCupBoard = event => {
        event.preventDefault();

        const  data = {
            id: this.state.id,
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
        this.getAllCupboards();

    }
    handleClose = (e) => {
        this.setState({show:false});
        this.props.navigate('/');

    };

    render() {
        return (
            <div>
                <h1>Изменение полки</h1>
                <div className="row">
                    <h3 className="d-flex justify-content-center">Изменение полки</h3>
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
                            <button type="submit" onClick={this.saveCupBoard} className="btn btn-primary ml-5 mt-3">Изменить</button>
                        </form>
                    </div>
                </div>

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
        );
    }

}
export default  withParams(CupboardChange);