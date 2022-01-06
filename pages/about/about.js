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
        HttpClient.get('/wp-json/wp/v2/pages?_fields=content&slug=about', null, (res) => {
            wx.hideLoading();

            let pageList = res.data;
            if (pageList.length > 0) {
                this.setData({ pageModel: pageList[0] });
            } else {
                this.setData({
                    'pageModel.content.rendered': '<p>未找到关于页面！</p><p>请在 WordPress 后台设置关于页面，并把 URL 别名填写为 "about".</p>'
                });
            }
        });
    }
})
