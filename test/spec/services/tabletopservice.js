'use strict';

describe('Service: tabletopService', function () {

  // load the service's module
  beforeEach(module('stpApp'));

  // instantiate service
  var tabletopService;
  beforeEach(inject(function (_tabletopService_) {
    tabletopService = _tabletopService_;
  }));

  it('should do something', function () {
    expect(!!tabletopService).toBe(true);
  });

});
