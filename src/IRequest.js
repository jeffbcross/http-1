import {assert} from 'assert';

var XHRDataTypes = assert.define('XHRDataTypes', (value) => {
  if (value instanceof Document) {
    //pass
    //related to issue https://github.com/angular/assert/issues/5
  }
  else {
    assert(value).is(DataView, Blob, Document, assert.string, FormData);
  }
});

var IRequest = assert.define('IRequest', function(value) {
  assert.type(value, assert.structure({
    url: assert.string,
    method: assert.string,
    data: XHRDataTypes,
    responseType: assert.string,
    params: Map,
    headers: Map
  }));

});

export {IRequest};
