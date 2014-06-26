import {XHRConnection} from '../src/XHRConnection';
import {assert} from 'assert';
import {IConnection} from '../src/IConnection';
import {inject} from 'di/testing';
import {PromiseBackend, PromiseMock} from 'prophecy/PromiseMock';

describe('XHRConnection', function() {
  var sampleRequest;

  beforeEach(function() {
    sampleRequest = {
      method: 'GET',
      url: '/users',
      responseType: '',
      data: '',
      params: new Map(),
      headers: new Map()
    };
  });

  it('should implement IConnection', function() {
    assert.type(XHRConnection, IConnection);
  });

  describe('constructor', function() {
    it('should create a promise for the connection', function() {
      var connection = new XHRConnection();
      expect(connection.promise instanceof Promise).toBe(true);
    });
  });


  describe('.open()', function() {
    it('should complain if no method provided', function() {
      var connection = new XHRConnection();
      sampleRequest.method = undefined;
      expect(function() {
        connection.open(sampleRequest);
      }).toThrow();
    });

    it('should complain if provided method is not passed a valid request', function() {
      expect(function() {
        var connection = new XHRConnection();
        connection.open({});
      }).toThrowError(/to be an instance of IRequest/);
    });


    it('should set the method to the instance', function() {
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      expect(connection.method).toBe('GET');
    });


    it('should set the url to the instance', function () {
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      expect(connection.url).toBe('/users');
    });


    it('should complain if open is called more than once', function() {
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      expect(function() {
        connection.open(sampleRequest);
      }).toThrow();
    });
  });


  describe('.send()', function() {
    var sendSpy
    beforeEach(function() {
      sendSpy = spyOn(XMLHttpRequest.prototype, 'send');
    });

    it('should add load and error event listeners', function() {
      var listenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      expect(listenerSpy).not.toHaveBeenCalled();
      connection.send(sampleRequest);
      expect(listenerSpy.calls.all()[1].args[0]).toBe('error');
      expect(listenerSpy.calls.all()[0].args[0]).toBe('load');
    });


    it('should complain if not given a valid IRequest type', function() {
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      expect(function() {
        connection.send({});
      }).toThrow();
    });
  });


  describe('instance', function() {
    it('should be thenable at the instance level', function(){
      var connection = new XHRConnection();
      expect(typeof connection.then).toBe('function');
    });
  });


  describe('.promise', function() {
    it('should return a promise', function() {
      assert.type(new XHRConnection().promise, Promise);
    })
  });


  describe('.onLoad_()', function() {
    it('should unregister load and error events', function() {
      var addListenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      var removedListenerSpy = spyOn(XMLHttpRequest.prototype, 'removeEventListener');
      var sendSpy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      connection.send(sampleRequest);
      expect(addListenerSpy.calls.count()).toBe(2);
      expect(removedListenerSpy).not.toHaveBeenCalled();
      connection.onLoad_({});
      expect(removedListenerSpy.calls.count()).toBe(2);
      expect(removedListenerSpy.calls.all()[0].args[0]).toBe('load');
      expect(removedListenerSpy.calls.all()[1].args[0]).toBe('error');
    });


    it('should resolve the deferred with the responseText', function() {
      var res = 'The time is 12:00pm';
      var connection = new XHRConnection();
      var resolveSpy = spyOn(connection.deferred, 'resolve');
      connection.xhr_ = {responseText: res, removeEventListener: function(){}};
      connection.onLoad_.call(connection, {});
      expect(resolveSpy).toHaveBeenCalledWith(res);
    });
  });


  describe('.onError_()', function() {
    it('should unregister load and error events', function() {
      var addListenerSpy = spyOn(XMLHttpRequest.prototype, 'addEventListener');
      var removedListenerSpy = spyOn(XMLHttpRequest.prototype, 'removeEventListener');
      var sendSpy = spyOn(XMLHttpRequest.prototype, 'send');
      var connection = new XHRConnection();
      connection.open(sampleRequest);
      connection.send(sampleRequest);
      expect(addListenerSpy.calls.count()).toBe(2);
      expect(removedListenerSpy).not.toHaveBeenCalled();
      connection.onError_({});
      expect(removedListenerSpy.calls.count()).toBe(2);
      expect(removedListenerSpy.calls.all()[0].args[0]).toBe('load');
      expect(removedListenerSpy.calls.all()[1].args[0]).toBe('error');
    });
  });


  describe('.setRequestHeader()', function() {
    it('should call through to xhr_', function() {
      var spy = spyOn(XMLHttpRequest.prototype, 'setRequestHeader');
      var connection = new XHRConnection();
      connection.setRequestHeader('Foo', 'Bar');
      expect(spy).toHaveBeenCalledWith('Foo', 'Bar');
    });
  });


  describe('.success()', function() {

  });


  describe('.error()', function() {

  });
});
