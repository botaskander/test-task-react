import http from "../http-common";
import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api";
class BookDataService {
    getAllBooks() {
        return axios.get(API_BASE_URL+'/books/get-all');
    }
    getAllCupboards() {
        return axios.get(API_BASE_URL+'/cupboards/get-all');
    }
    getAllBooksByCupboard(id) {
        return axios.get(API_BASE_URL+`/books/get-all-by-cupboard/${id}`);
    }
    getBook(id) {
        return axios.get(API_BASE_URL+`/books/get-by-id/${id}`);
    }
    getCupboard(id) {
        return axios.get(API_BASE_URL+`/cupboards/get-by-id/${id}`);
    }
    saveCupBoard(data){
        return axios.post(API_BASE_URL+'/cupboards/save',data);
    }
    saveBook(data) {
        return axios.post(API_BASE_URL+"/books/save", data);
    }

    deleteBook(id) {
        return axios.delete(API_BASE_URL+`/books/delete/${id}`);
    }
}

export default new BookDataService();