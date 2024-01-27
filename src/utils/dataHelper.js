import {vuexHelper} from "@/utils/vuexHelper";
import {apiHelper} from "@/utils/apiHelper";

export const dataHelper={
    async handleUnload() {
        const recAndFav = {
            "username": vuexHelper.getLoginUsername(),
            "answerRecord": vuexHelper.getAnswerRecord(),
            "favorite": vuexHelper.getFavorite(),
        };
        await apiHelper.postRecAndFav(recAndFav);
        //axios.post("/api/practice/recAndFav", recAndFav)
        //navigator.sendBeacon('http://localhost:9000/practice/recAndFav', JSON.stringify(recAndFav))//非阻塞的

    },
    async refreshData(){
        //加载答题记录/收藏记录
        const resp = await apiHelper.getRecAndFav(vuexHelper.getLoginUsername());
        // if(vuexHelper.getAnswerRecord().length === 0){
        vuexHelper.resetAnswerRecord(resp.answerRecord);
        // }
        // if(vuexHelper.getFavorite().length ===0) {
        vuexHelper.setFavorite(resp.favorite);
        //}
    }
}