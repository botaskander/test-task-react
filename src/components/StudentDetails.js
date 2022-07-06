import axios from "axios";
import React, { Component } from "react";
import {Link, useParams} from "react-router-dom";
import BookDataService from "../services/BookDataService";
import StudentDataService from "../services/StudentDataService";
import {Modal} from "react-bootstrap";
function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
}
class StudentDetails extends Component {
    constructor(props) {
        super(props);
        this.getAllStudents = this.getAllStudents.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            books: [],
            student:null,
            message: "",
            messageCode: 0,
            show: false,
            sum:0
        };
    }
    handleClose = (e) => {
        this.setState({show:false});
        this.getAllStudents();
    };

    getAllStudents(){
        const id=this.props.params.id;
        StudentDataService.getStudent(id)
            .then(response => {
                this.setState({
                    student: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        StudentDataService.getAllBooksByStudent(id)
            .then(response => {
                this.setState({
                    books: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
        StudentDataService.getAllSumByStudent(id)
            .then(response => {
                this.setState({
                    sum: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }


    componentDidMount() {
        this.getAllStudents();
    }


    render() {
        return (
            <div>
                <h4>{this.state.student&&(this.state.student.firstname+" "+this.state.student.lastname)} сумма {this.state.sum}</h4>
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
            </div>
        );
    }

}
export default  withParams(StudentDetails);
