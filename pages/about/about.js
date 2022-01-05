//about.js
import { HttpClient } from '../../utils/util.js';

Page({
    data: {
        pageModel: {}
    },

    onLoad: function () {
        this.loadAboutData();
    },

    loadAboutData: function () {
        wx.showLoading({ title: '加载中' });
        HttpClient.get('/wp-json/wp/v2/pages/84?_fileds=content', null, (res) => {
            wx.hideLoading();

            let pageInfo = res.data;
            this.setData({ pageModel: pageInfo });
        });
    }
})
