import http from "../http-common";
import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api";
class StudentDataService {
    getAllStudents() {
        return axios.get(API_BASE_URL+'/students/get-all');

    }
    getAllSubscriptions() {
        return axios.get(API_BASE_URL+'/subscriptions/get-all');

    }
    getStudent(id) {
        return axios.get(API_BASE_URL+`/students/get-by-id/${id}`);
    }
    getSubscription(id) {
        return axios.get(API_BASE_URL+`/subscriptions/get-by-id/${id}`);
    }

    getAllSubscriptionsByStudent(id) {
        return axios.get(API_BASE_URL+`/subscriptions/get-all-by-student/${id}`);
    }
    getAllBooksByStudent(id) {
        return axios.get(API_BASE_URL+`/books/get-all-by-student/${id}`);
    }
    getAllSumByStudent(id) {
        return axios.get(API_BASE_URL+`/subscriptions/get-sum-by-student/${id}`);
    }
    saveStudent(data) {
        return axios.post(API_BASE_URL+"/students/save", data);
    }
    saveSubscriptions(data) {
        return axios.post(API_BASE_URL+"/subscriptions/save", data);
    }
    deleteStudent(id) {
        return axios.delete(API_BASE_URL+`/books/delete/${id}`);
    }
    deleteSubscription(id) {
        return axios.delete(API_BASE_URL+`/subscriptions/delete/${id}`);
    }
}

export default new StudentDataService();