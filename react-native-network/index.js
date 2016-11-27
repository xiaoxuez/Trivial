'use strict';

var React = require('react-native');

var {
    StyleSheet,
    NativeModules,
} = React;

var ReactWithNativeBridgeManager = NativeModules.ReactWithNativeBridgeManager;

class PhantomNetWork {
  constructor(header) {
    this.header = header;
  }

  setRequestInfo(url, method, params, callback) {
    var requestInfo = {
      url: url,
      method: method,
      params: params,
    };
    this.requestInfo = requestInfo;
  }

  getRequestInfo() {
    return this.requestInfo;
  }

  networkManager(url, method, params, callback) {
    this.setRequestInfo(url, method, params);
    var _this = this;
    this.request(url, method, params, function(result) {
      if (result.success == true) {
        if (result.statusCode == 401) {
          _this.toObtainOauthCode(callback);
        } else {
          callback(result);
        }
      } else {
        callback(result);
      }
    });
  }

  request(url, method, params, callbackRequest) {
    var _this = this;
    var request_url = this.header + url;
    var header = method == 'GET' ?
    {'Accept': 'application/json', 'If-None-Match': '',} :
    {'Accept': 'application/json', 'Content-Type': 'application/json',}
    var body = params ? JSON.stringify(params) : null;

    fetch(request_url, {
      method: method,
      headers: header,
      body: body,
    })
    .then(response => {
      if (response.status == 401) {
        callbackRequest({success: true, statusCode: 401, response: response})
      } else {
        return response.text()
      }
    })
    .then(data => {
      let responseData = JSON.parse(data);
      callbackRequest({success: responseData.success, statusCode: 200, response: responseData, message: 'request error with URl' + request_url})
      })
    .catch(error => {
      callbackRequest({success: false, message: 'request error with URl' + request_url + 'error ' + error})
    });
  }

  toObtainOauthCode(callback) {
    var _this = this;
    var request_url = this.header + '/api/oauth_info';
    fetch(request_url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'If-None-Match': ''
      }
    })
    .then(response => response.json())
    .then(responseData => {
      if (responseData.success == true) {
        var applicationId = responseData.oauth_info.id;
        var scopes = responseData.oauth_info.scopes;
        var callbackUrls = responseData.oauth_info.redirect_uri;
        ReactWithNativeBridgeManager.oauthQueryCodeWithApplicationId(applicationId,
          scopes,
          callbackUrls,
          function(result) {
            if (result.success == true) {
              _this.refreshUserOauthAccessToken(result.code, callback);
            }
          });
        }
      })
      .catch(error => {
        console.log('Phantom request query oauth info code ' + error);
      });
    }

    refreshUserOauthAccessToken(code, callback) {
      var _this = this;
      var request_url = this.header + '/api/token';
      fetch(request_url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'code': code,
        })
      })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.success == true) {
          var requestInfo = _this.getRequestInfo();
          _this.networkManager(requestInfo.url, requestInfo.method, requestInfo.params, callback);
        }
      })
      .catch(error => {
        callback({success: false, message: 'request error with URl' + request_url + 'error ' + error})
      });
    }

}

module.exports = PhantomNetWork;
