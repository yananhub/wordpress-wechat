// pages/order-list/order-list.js
import { HttpClient } from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTab: [],
        currentTab: {},
        queryParam: { }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadCatetoriesData();
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
        let currentPage = this.data.queryParam.page;
        this.setData({ 'queryParam.page': currentPage + 1 });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        
    },

    onTabChange: function (e) {
        let currentTab = e.currentTarget.dataset.currentTab;
        if (this.data.currentTab.id != currentTab.id) {
            this.setData({
                currentTab: currentTab,
                'queryParam.page': 1,
                'queryParam.categories': currentTab.id
            });
        }
    },

    loadCatetoriesData: function() {
        HttpClient.get('/wp-json/wp/v2/categories?_fields=id,name&orderby=count&order=desc', null, (res) => {
            let categories = res.data;
            if (categories && categories.length > 0) {
                this.setData({
                    navTab: categories,
                    currentTab: categories[0],
                    'queryParam.page': 1,
                    'queryParam.categories': categories[0].id
                });
            }
        });
    }
})