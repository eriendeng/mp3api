//index.js
//获取应用实例
var app = getApp()
const innerAudioContext = wx.getBackgroundAudioManager()

Page({
  data: {
    //页面信息
    hotList: [],
    articleList: [],
    playIcon: '../../image/pause.png',
    duration: '00:00',
    curTimeVal: '00:00',
    lyric: "",
    tmpurl: "",
    name: "",
    author: "",
    showLyricst: "",
    showLyricnd: "",
    showLyricrd: "",
    drawer: 1,
  },
  onLoad: function () {
    this.getMP3();
    this.getArticle();
  },
  //获取推荐栏
  getMP3: function () {
    var that = this
    wx.showLoading({
      title: 'loading',
    })
    wx.request({
      url: 'https://erien.gz01.bdysite.com/mp3list.php',
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (res) {
        that.setData({
          hotList: res.data
        })
        wx.hideLoading()
      }
    })
  },
  //获取文章列表
  getArticle: function () {
    var that = this
    wx.showLoading({
      title: 'loading',
    })
    wx.request({
      url: 'https://erien.gz01.bdysite.com/articlelist.php',
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (res) {
        that.setData({
          articleList: res.data
        })
        wx.hideLoading()
      }
    })
  },
  //获取详细内容
  toDetail: function (e) {
    var mid = this.data.articleList[e.currentTarget.id].song_mid
    //console.log(e)
    var that = this
    that.data.lyric = ""
    wx.showLoading({
      title: 'loading',
    })
    wx.request({
      url: 'https://erien.gz01.bdysite.com/mp3detail.php?mid=' + mid,
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (res) {
        app.globalData.detail = res.data
        //console.log(app.globalData.detail)
        that.getLyric(mid)
        innerAudioContext.src = app.globalData.detail.song_mp3
        that.setData({
          tmpurl: "",
          name: app.globalData.detail.song_name,
          author: app.globalData.detail.song_author,
          playIcon: '../../image/play.png',
          showLyricst: app.globalData.detail.song_lyric1,
          showLyricnd: app.globalData.detail.song_lyric2,
          showLyricrd: app.globalData.detail.song_lyric3,
        })
        wx.hideLoading()
        innerAudioContext.onPlay((res) => {
          that.updateTime(that)
        })
      }
    })
  },
  //获取歌词
  getLyric: function (mid) {
    var that = this
    wx.request({
      url: 'https://erien.gz01.bdysite.com/lyric.php?mid=' + mid,
      header: {
        "Content-Type": "applciation/json"
      },
      method: "GET",
      success: function (res) {
        app.globalData.lyric = res.data
        //console.log(app.globalData.lyric)
        that.setData({
          lyrics: res.data,
        })
      }
    })
  },
  //播放器控制
  playerHandler: function () {
    var that = this;
    if (that.data.tmpurl != ""){
      innerAudioContext.src = that.data.tmpurl
    }
    if (innerAudioContext.paused) {
      innerAudioContext.play();
      that.setData({
        playIcon: '../../image/play.png'
      })
      app.globalData.playing = true
      innerAudioContext.onPlay((res) => {
        that.updateTime(that)
      })
    } else {
      innerAudioContext.pause();
      that.setData({
        playIcon: '../../image/pause.png'
      })
      app.globalData.playing = false
    }
  },
  //更新时间 调用于第一次按按钮触发playerHandler的callback中
  updateTime: function (that) {
    innerAudioContext.onTimeUpdate((res) => {
      that.setData({
        duration: that.makeInt(Math.floor((innerAudioContext.duration.toFixed(0)) / 60)) + ":" + that.makeInt((innerAudioContext.duration.toFixed(0)) % 60),
        curTimeVal: that.makeInt(Math.floor((innerAudioContext.currentTime.toFixed(0)) / 60)) + ":" + that.makeInt((innerAudioContext.currentTime.toFixed(0)) % 60),
      })
      
      for (let key in app.globalData.lyric) {         /* * ***/
        if (that.data.curTimeVal == key.toString()) { 
          that.setData({
            lyric: app.globalData.lyric[key],
          })
          break;                                        
        }
      }
      if (innerAudioContext.duration.toFixed(2) - innerAudioContext.currentTime.toFixed(2) <= 0) {
        that.setStopState(that)
      }
      innerAudioContext.onEnded(() => {
        that.setStopState(that)
      })
    })
  },
  //播放完成后停止 调用于updateTime的callback中
  setStopState: function (that) {
    that.setData({
      curTimeVal: '00:00',
      playIcon: '../../image/pause.png',
      lyric: '',
      tmpurl: app.globalData.detail.song_mp3
    })
    innerAudioContext.stop()
  },
  //取整
  makeInt: function (num) {
    if (num < 10) return '0' + num;
    else return num;
  },
  drawer: function (e) {
    if (this.data.drawer == 1){
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear", //线性 
        delay: 0
      })
      this.animation = animation;
      animation.translateX(180).step();
      this.setData({
        animationData: animation.export(),
        drawer: 0,
      })
    }else if (this.data.drawer == 0) {
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: "linear", //线性 
        delay: 0
      })
      this.animation = animation;
      animation.translateX(0).step();
      this.setData({
        animationData: animation.export(),
        drawer: 1,
      })
    }
  },
})
