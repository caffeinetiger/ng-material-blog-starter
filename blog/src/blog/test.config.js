'use strict';
var validUser = { email: "valid@valid.com", password: "valid", rememberMe: false };
var invalidUser = { email: "invalid", password: "invalid", rememberMe: false };

var testContext = {
    $controller: null,
    stubs: [],
    mocks: [],
    spies: [],
    mockDatacontext: sinon.stub(mockDatacontext),
    validUser: validUser,
    invalidUser: invalidUser

};

