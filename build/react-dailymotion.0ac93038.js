parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ABmX":[function(require,module,exports) {
function e(e,n){var o=document.head||document.getElementsByTagName("head")[0],r=document.createElement("script");r.type="text/javascript",r.async=!0,r.src=e,n&&(r.onload=function(){r.onerror=r.onload=null,n(null,r)},r.onerror=function(){r.onerror=r.onload=null,n(new Error("Failed to load "+e),r)}),o.appendChild(r)}module.exports=e;
},{}],"LiAt":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=n(require("react")),t=n(require("prop-types")),a=n(require("load-script2"));function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var u={ad_end:"onAdEnd",ad_pause:"onAdPause",ad_play:"onAdPlay",ad_start:"onAdStart",ad_timeupdate:"onAdTimeUpdate",apiready:"onApiReady",durationchange:"onDurationChange",end:"onEnd",error:"onError",fullscreenchange:"onFullscreenChange",loadedmetadata:"onLoadedMetadata",pause:"onPause",play:"onPlay",playing:"onPlaying",progress:"onProgress",qualitiesavailable:"onQualitiesAvailable",qualitychange:"onQualityChange",seeked:"onSeeked",seeking:"onSeeking",subtitlechange:"onSubtitleChange",subtitlesavailable:"onSubtitlesAvailable",start:"onStart",timeupdate:"onTimeUpdate",video_start:"onVideoStart",video_end:"onVideoEnd",volumechange:"onVolumeChange",waiting:"onWaiting"},i=!1;function r(){return i||(i="object"==typeof window.DM&&"function"==typeof window.DM.player?Promise.resolve(window.DM):new Promise(function(e,t){(0,a.default)("https://api.dmcdn.net/all.js",function(a){a?t(a):e(window.DM)})})),i}var s=function(t){function a(e){var a;return(a=t.call(this,e)||this).refContainer=function(e){a.container=e},a}o(a,t);var n=a.prototype;return n.componentDidMount=function(){this.createPlayer()},n.componentDidUpdate=function(e){var t=this,a=Object.keys(this.props).filter(function(a){return t.props[a]!==e[a]});this.updateProps(a)},n.getPlayerParameters=function(){return{autoplay:this.props.autoplay,controls:this.props.controls,"endscreen-enable":this.props.showEndScreen,id:this.props.id,mute:this.props.mute,origin:this.props.origin,quality:this.props.quality,"queue-autoplay-neext":this.props.autoplayQueue,"queue-enable":this.props.showQueue,"sharing-enable":this.props.sharing,start:this.props.start,"subtitles-default":this.props.subtitles,syndication:this.props.syndication,"ui-highlight":this.props.uiHighlightColor,"ui-logo":this.props.uiShowLogo,"ui-start-screen-info":this.props.uiShowStartScreenInfo,"ui-theme":this.props.uiTheme}},n.getInitialOptions=function(){return{video:this.props.video,width:this.props.width,height:this.props.height,params:this.getPlayerParameters(),events:{}}},n.updateProps=function(e){var t=this;this.player.then(function(a){e.forEach(function(e){var n=t.props[e];switch(e){case"mute":a.setMuted(n);break;case"quality":a.setQuality(n);break;case"subtitles":a.setSubtitle(n);break;case"volume":a.setVolume(n);break;case"paused":n&&!a.paused?a.pause():!n&&a.paused&&a.play();break;case"id":case"className":case"width":case"height":a[e]=n;break;case"video":n?a.load(n,t.getPlayerParameters()):a.pause()}})})},n.createPlayer=function(){var e=this,t=this.props.volume;this.player=r().then(function(t){var a=t.player(e.container,e.getInitialOptions());return Object.keys(u).forEach(function(t){var n=u[t];a.addEventListener(t,function(t){var a=e.props[n];a&&a(t)})}),new Promise(function(e){a.addEventListener("apiready",function(){e(a)})})}),"number"==typeof t&&this.updateProps(["volume"])},n.render=function(){var t=this.props,a=t.id,n=t.className;return e.default.createElement("div",{id:a,className:n,ref:this.refContainer})},a}(e.default.Component);s.propTypes={video:t.default.string,id:t.default.string,className:t.default.string,width:t.default.oneOfType([t.default.number,t.default.string]),height:t.default.oneOfType([t.default.number,t.default.string]),paused:t.default.bool,autoplay:t.default.bool,controls:t.default.bool,showEndScreen:t.default.bool,mute:t.default.bool,origin:t.default.string,quality:t.default.oneOf(["auto","240","380","480","720","1080","1440","2160"]),showQueue:t.default.bool,autoplayQueue:t.default.bool,sharing:t.default.bool,start:t.default.number,subtitles:t.default.string,syndication:t.default.string,uiHighlightColor:t.default.string,uiShowLogo:t.default.bool,uiShowStartScreenInfo:t.default.bool,uiTheme:t.default.oneOf(["light","dark"]),volume:t.default.number,onAdEnd:t.default.func,onAdPause:t.default.func,onAdPlay:t.default.func,onAdStart:t.default.func,onAdTimeUpdate:t.default.func,onApiReady:t.default.func,onDurationChange:t.default.func,onEnd:t.default.func,onError:t.default.func,onFullscreenChange:t.default.func,onLoadedMetadata:t.default.func,onPause:t.default.func,onPlay:t.default.func,onPlaying:t.default.func,onProgress:t.default.func,onQualitiesAvailable:t.default.func,onQualityChange:t.default.func,onSeeked:t.default.func,onSeeking:t.default.func,onSubtitleChange:t.default.func,onSubtitlesAvailable:t.default.func,onStart:t.default.func,onTimeUpdate:t.default.func,onVideoStart:t.default.func,onVideoEnd:t.default.func,onVolumeChange:t.default.func,onWaiting:t.default.func},s.defaultProps={uiTheme:"dark",quality:"auto",showQueue:!1,autoplayQueue:!1};var l=s;exports.default=l;
},{"react":"n8MK","prop-types":"D9Od","load-script2":"ABmX"}]},{},[], null)
//# sourceMappingURL=/react-dailymotion.0ac93038.js.map