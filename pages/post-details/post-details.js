// pages/post-details/post-details.js
import dataService from '../../utils/data-service.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postDetailsModel: {},
        errorMsg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this._loadPostDetails(options.postId);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return { title: this.data.postDetailsModel.title.rendered }
    },

    onShareTimeline: function () {
        return { title: this.data.postDetailsModel.title.rendered }
    },

    _loadPostDetails: function (postId) {
        dataService.loadPostDetails(postId).then(details => this.setData({ postDetailsModel: details }));
    }
})