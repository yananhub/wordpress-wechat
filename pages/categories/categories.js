// pages/order-list/order-list.js
import dataService from '../../utils/data-service.js';

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
        this._loadCatetoriesData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let currentPage = this.data.queryParam.page;
        this.setData({ 'queryParam.page': currentPage + 1 });
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

    _loadCatetoriesData: function() {
        dataService.loadCatetoriesData().then(categories => {
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