// pages/posts/posts.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        queryParam: { page: 1 }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.onScrollToBottom();
    },

    onScrollToBottom: function () {
        let currentPage = this.data.queryParam.page;
        this.setData({ 'queryParam.page': currentPage + 1 });
    }
})