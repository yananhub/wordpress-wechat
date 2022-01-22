// pages/posts/posts.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        queryParam: { page: 1 }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
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
        this.onScrollToBottom();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onScrollToBottom: function () {
        let currentPage = this.data.queryParam.page;
        this.setData({ 'queryParam.page': currentPage + 1 });
    }
})