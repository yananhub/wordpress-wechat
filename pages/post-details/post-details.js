// pages/post-details/post-details.js
import { formatTime, HttpClient } from '../../utils/util.js';

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
        this.loadPostDetails(options.postId);
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

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

    loadPostDetails: function (postId) {
        wx.showLoading({ title: '加载中' });
        let data = {
            _fields: 'id,title,modified,content'
        };
        HttpClient.get(`/wp-json/wp/v2/posts/${postId}`, data, (res) => {
            wx.hideLoading();

            res.data.modified = formatTime(res.data.modified);
            this.setData({
                postDetailsModel: res.data
            });
        });
    },
})