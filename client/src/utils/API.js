import axios from "axios";

export default {
    registerCompany: function(data) {
        return axios.post("/api/register/company", data);
    },
    registerUser: function(data) {
        return axios.post("/api/register/user", data);
    },
    signIn: function(data) {
        return axios.post("/api/login", data);
    },
    getUser: function() {
        return axios.get("/api/user_data");
    },
    getCompanyList: function(data) {
        return axios.get("/api/company?name=" + data);
    },
    saveContract: function(data) {
        return axios.post("/api/company", data);
    }
}