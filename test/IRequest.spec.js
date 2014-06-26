import {IRequest} from '../src/IRequest';
import {assert} from 'assert';

describe('IRequest', function() {
  var basicRequest;
  beforeEach(function(){
    basicRequest = {
      url: '/users',
      responseType: 'json',
      method: 'get',
      params: new Map(),
      data: '',
      headers: new Map()
    }
  });


  it('should complain if url is missing', function() {
    delete basicRequest.url;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.url = '/users';
    assert.type(basicRequest, IRequest);
  });


  it('should complain if responseType is missing', function() {
    delete basicRequest.responseType;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.responseType = 'json';
    assert.type(basicRequest, IRequest);
  });


  it('should complain if headers is missing', function() {
    delete basicRequest.headers;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.headers = new Map();
    assert.type(basicRequest, IRequest);
  });


  it('should complain if method is missing', function() {
    delete basicRequest.method;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.method = 'get';
    assert.type(basicRequest, IRequest);
  });


  it('should complain if data is missing', function() {
    delete basicRequest.data;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.data = 'foo';
    assert.type(basicRequest, IRequest);
  });


  it('should accept DataView data', function() {
    var buffer = new ArrayBuffer();
    basicRequest.method = 'POST';
    basicRequest.data = new DataView(buffer);
    assert.type(basicRequest, IRequest);
  });


  it('should accept Blob data', function() {
    basicRequest.data = new Blob();
    basicRequest.method = 'POST';
    assert.type(basicRequest, IRequest);
  });


  it('should accept Document data', function() {
    basicRequest.data = document.implementation.createDocument(null, 'doc');
    basicRequest.method = 'POST';
    assert.type(basicRequest, IRequest);
  });


  it('should accept String data', function() {
    basicRequest.data = 'POST ME!';
    basicRequest.method = 'POST';
    assert.type(basicRequest, IRequest);
  });


  it('should accept FormData data', function() {
    basicRequest.data = new FormData();
    basicRequest.data.append('user', 'Jeff');
    basicRequest.method = 'POST';
    assert.type(basicRequest, IRequest);
  });


  it('should complain when given an invalid type of data', function() {
    basicRequest.method = 'POST';
    basicRequest.data = 5;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
  });


  it('should complain if params is missing', function() {
    delete basicRequest.params;
    expect(function() {
      assert.type(basicRequest, IRequest);
    }).toThrow();
    basicRequest.params = new Map();
    assert.type(basicRequest, IRequest);
  });
});