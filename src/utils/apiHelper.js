import axios from '@/config/axiosConfig';
import math from "math";
import {vuexHelper} from "@/utils/vuexHelper";


export const apiHelper = {
    async sendVerificationCode(_email) {
        const resp = await axios.get("/api/user/verificationCode", {
            params: {
                email: _email
            }
        });
        return resp;
    },
    async submitUpdatePassword(_email, _password, _verificationCode) {
        const resp = await axios.post("/api/user/updatePassword", {}, {
            params: {
                email: _email,
                password: _password,
                verificationCode: _verificationCode,
            }
        });
        return resp;
    },
    async registry(_email, _password, _phone) {
        const resp = await axios.post('/api/user/registry', {}, {
            params: {
                username: _email,
                password: _password,
                phone: _phone,
            },
        });
        return resp;
    },
    async login(_username, _password) {
        const resp = await axios.post('api/user/login', {}, {
            params: {
                username: _username,
                password: _password,
            }
        });
        return resp;
    },
    // 根据索引获取题目
    async getQuestionByIndex(index) {
        const resp = await axios.get(`/api/practice/questionByOrderId?orderId=${index}`);
        // 返回响应数据
        resp.data.data.type = parseInt(resp.data.data.type) === 1 ? 'true-false' : 'multiple-choice';
        resp.data.data.errRate = math.round(resp.data.data.errRate.toPrecision(3) * 100);
        return resp.data.data;
    },
    async getRecAndFav(loginUsername) {
        const resp = await axios.get(`/api/practice/recAndFav?username=${loginUsername}`);
        return resp.data.data;
    },
    async getMockExamPaper(_randoms) {
        const resp = await axios.get(`/api/exam/paper`,{
            params:{
                randoms: _randoms + '',
            }
        })
        return resp.data.data;
    },

    async writeScore(_username, _score) {
        await axios.post('/api/exam/score', {}, {
            params: {
                username: _username,
                score: _score,
            }
        });
    },
    async readScore(loginUsername) {
        const resp = await axios.get(`/api/exam/score?username=${loginUsername}`);
        return resp.data.data;
    },
    async getRightAnswer() {
        const resp = await axios.get('/api/practice/rightAnswer');
        return resp.data.data;
    },
    async logout(){
        const resp = await axios.post('/api/user/logout',{},{
            params:{
                username: vuexHelper.getLoginUsername(),
            }
        });
        return resp.data;
    },
    async postRecAndFav(recAndFav) {
        await axios.post('/api/practice/recAndFav', recAndFav);
    }
}
