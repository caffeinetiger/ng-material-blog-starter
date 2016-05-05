module FormlyMaterial {
    'use strict';

    interface IWrapper {
        fieldName: string;
        types: string[];
        templateUrl: string;
    }

    angular.module('formlyMaterial', ['formly'])
        .run(function (formlyConfig: any, formlyValidationMessages: any, formlyApiCheck: any) {

            angular.forEach(['checkbox', 'radio', 'radioRow', 'radioRowTall'],
                function (fieldName: string) {
                    formlyConfig.setType({
                        name: fieldName,
                        templateUrl: getFieldTemplateUrl(fieldName)
                    });
                });

            angular.forEach([ 'input', 'textarea', 'iDsbdPrice', 'iQty', 'iInt', 'rPrice', 'iPhone'],
                function (fieldName: string) {
                    formlyConfig.setType({
                        name: fieldName,
                        templateUrl: getFieldTemplateUrl(fieldName),
                        defaultOptions: {
                            templateOptions: {
                                hintNeeded: true,
                                onFocus: function (value: any, options: any) {
                                    options.validation.show = false;
                                },
                                onBlur: function (value: any, options: any, scope) {
                                    options.validation.show = true;
                                }
                            }
                        }
                    });
                });
      
                
            formlyConfig.setType({
                name: 'customInput',
                extends: 'input',
                apiCheck: function (check: any) {
                    return {
                        templateOptions: {
                            vtor: check.string.optional
                        }
                    };
                }
            });

            formlyConfig.setType({
                name: 'matchField',
                apiCheck: function () {
                    return {
                        data: {
                            fieldToMatch: formlyApiCheck.string
                        }
                    };
                },
                apiCheckOptions: {
                    prefix: 'matchField type'
                },
                defaultOptions: function matchFieldDefaultOptions(options: any) {
                    return {
                        extras: {
                            validateOnModelChange: true
                        },
                        expressionProperties: {
                            'templateOptions.disabled': function (viewValue: any, modelValue: any, scope: any) {
                                var matchField = find(scope.fields, 'key', options.data.fieldToMatch);
                                if (!matchField) {
                                    throw new Error('Could not find a field for the key ' + options.data.fieldToMatch);
                                }
                                var model = options.data.modelToMatch || scope.model;
                                var originalValue = model[options.data.fieldToMatch];
                                var invalidOriginal = matchField.formControl && matchField.formControl.$invalid;
                                return !originalValue || invalidOriginal;
                            }
                        },
                        validators: {
                            fieldMatch: {
                                expression: function (viewValue: any, modelValue: any, fieldScope: any) {
                                    var value = modelValue || viewValue;
                                    var model = options.data.modelToMatch || fieldScope.model;
                                    return value === model[options.data.fieldToMatch];
                                },
                                message: options.data.matchFieldMessage || '"Must match"'
                            }
                        }
                    };

                    function find(array: any, prop: any, value: any) {
                        var foundItem: any;
                        array.some(function (item: any) {
                            if (item[prop] === value) {
                                foundItem = item;
                            }
                            return !!foundItem;
                        });
                        return foundItem;
                    }
                }
            });

            formlyConfig.setWrapper({
                name: 'loader',
                template: [
                    '<md-input-container>',
                    '<formly-transclude></formly-transclude>',
                    '<span class="glyphicon glyphicon-refresh loader" ng-show="to.loading"></span>',
                    '</md-input-container>'
                ].join(' ')
            });

            formlyConfig.setType({
                name: 'input-loader',
                extends: 'input',
                wrapper: ['loader']
            });

            formlyConfig.setType({
                name: 'maskedInput',
                extends: 'input',
                template: '<input type="text" class="form-control" ng-model=\"model[options.key]\" ' +
               'ui-options="{clearOnBlur: false, clearOnBlurPlaceholder: true }"' +
                    ' ui-mask-placeholder-char="space" />',
                defaultOptions: {
                    ngModelAttrs: {
                        mask: {
                            attribute: 'ui-mask'
                        }
                    }
                },
            });

                //formlyConfig.setWrapper({
                //    name: 'validation',
                //    types: ['input'],
                //    templateUrl: 'error-messages.html'
                //});

                formlyConfig.setWrapper({
                    name: 'panel',
                    templateUrl: 'app/checkout/panel.html'
                });

                formlyConfig.setWrapper({
                    name: 'panelInProgress',
                    templateUrl: 'app/inProgress/panel.html'
                });


            angular.forEach([
                {
                    fieldName: 'validationMessages', types: ['input', 'customInput', 'input-loader',
                        'select', 'textarea', 'maskedInput', 'iInt']
                },
                { fieldName: 'mdLabel', types: ['input', 'iDsbdPrice', 'iQty', 'iInt'] },
               
                { fieldName: 'mdNoFloatLabel', types: ['rPrice', 'maskedInput'] },
                { fieldName: 'mdInputContainer', types: ['input', 'textarea', 'iDsbdPrice', 'rPrice', 'maskedInput', 'radioRowTall', 'iInt'] },
                { fieldName: 'mdIQtyContainer', types: ['iQty'] }
            ], function (wrapper: IWrapper) {
                formlyConfig.setWrapper({
                    name: wrapper.fieldName,
                    types: wrapper.types,
                    templateUrl: getWrapperTemplateUrl(wrapper.fieldName)
                });
            });

            // having trouble getting icons to work.
            // Feel free to clone this jsbin, fix it, and make a PR to the website repo: https://github.com/formly-js/angular-formly-website
            formlyConfig.templateManipulators.preWrapper.push(function (template: string, options: any, scope: ng.IScope) {
                if (!options.data.icon) {
                    return template;
                }
                return '<md-icon class="step" md-font-icon="icon-' + options.data.icon + '"></md-icon>' + template;
            });

            formlyValidationMessages.addStringMessage('required', 'required');

            formlyValidationMessages.messages.validThru = function (viewValue, modelValue, scope) {
                return scope.model.validThru.err;
            }

            function getTemplateUrl(type: string, name: string) {
                return type + '/mtrl-' + name + '.html';
            }

            function getFieldTemplateUrl(name: string) {
                return getTemplateUrl('fields', name);
            }

            function getWrapperTemplateUrl(name: string) {
                return getTemplateUrl('wrapper', name);
            }
        })
        .run([
            '$templateCache', function ($templateCache: ng.ITemplateCacheService) {
                $templateCache.put('fields/mtrl-checkbox.html', '<md-checkbox ng-model="model[options.key]">' +
                    '{{to.label}}</md-checkbox>');

                $templateCache.put('fields/mtrl-radio.html',
                    "<md-radio-group ng-model=\"model[options.key]\">" +
                    "<md-radio-button ng-repeat=\"option in to.options\"" +
                    " ng-value=\"option[to.valueProp || 'value']\">" +
                    "{{option[to.labelProp || 'name']}}" +
                    "</md-radio-button></md-radio-group>");

                var radioRow = '<md-radio-group ng-model="model[options.key]" layout="row" layout-align="space-around">' +
                    '<md-radio-button ng-repeat="option in to.options"' +
                    ' ng-value=\"option[to.valueProp || \'value\']\">' +
                    '{{option[to.labelProp || "name"]}}' +
                    '</md-radio-button></md-radio-group>';

                $templateCache.put('fields/mtrl-radioRow.html', radioRow);
                $templateCache.put('fields/mtrl-radioRowTall.html', radioRow);

                $templateCache.put('fields/mtrl-rPrice.html',
                    "<md-radio-group ng-model=\"model[options.key]\"" +
                    "> <md-radio-button " +
                    " ng-disabled=\"model.del\"" +
                    "ng-repeat=\"option in to.options\" " +
                    "ng-value=\"option.field\"> " +
                    "{{option.label}} ({{option.amount | currency : '': 2}}) </md-radio-button></md-radio-group>");

                $templateCache.put('fields/mtrl-input.html', '<input ng-model=\"model[options.key]\" ng-disabled=\'to.disabled\'>');

                $templateCache.put('fields/mtrl-iQty.html', '<input ng-model=\"model[options.key]\" ' +
                    'onkeypress="var charCode = (event.which)? event.which: event.keyCode; return  (charCode === 46 ||(charCode >= 48 && charCode <= 57));"' +
                    ' ng-disabled=\'to.disabled\'>');

                $templateCache.put('fields/mtrl-iInt.html', '<input ng-model=\"model[options.key]\" ' +
                    'onkeypress="var charCode = (event.which)? event.which: event.keyCode; return  (charCode >= 48 && charCode <= 57);"' +
                    ' ng-disabled=\'to.disabled\'>');  
               

                $templateCache.put('fields/mtrl-iDsbdPrice.html', '<input value=\"{{to.amount | currency:\'\': 2}}\" disabled style="border-color:rgba(0, 0, 0, 0.12)">');
                $templateCache.put('fields/mtrl-textarea.html', '<textarea ng-model=\"model[options.key]\" columns=\"doesnt take\" ' +
                    'md-maxlength=\"to.maxlen\" rows=\"does not take\"></textarea>');
                $templateCache.put('wrapper/mtrl-mdLabel.html', '<label>{{to.label}}</label><formly-transclude></formly-transclude>');
                $templateCache.put('wrapper/mtrl-mdNoFloatLabel.html', '<label class="md-no-float" style="font-size: 13px;">{{to.label}}</label><formly-transclude></formly-transclude>');
                $templateCache.put('wrapper/mtrl-mdInputContainer.html', '<md-input-container style="width: 100%"><formly-transclude></formly-transclude></md-input-container>');

                $templateCache.put('wrapper/mtrl-mdIQtyContainer.html',
                    '<div layout>' +
                    '<div layout="column" style="width: 90%">' +
                    '<md-input-container style="width: 100%">' +
                    '<formly-transclude></formly-transclude>' +
                    '</md-input-container>' +
                    '</div>' +
                    '<div layout="column" style="width: 10%">' +
                    '<div style="height: 50%">' +
                    '<md-button class="md-fab md-mini md-primary md-hue-3" ' +
                    'ng-click="model[options.key]=model[options.key]+1" ng-disabled="model.del">' +
                    '<vv-ng-md-icon icon="exposure_plus_1" style="fill: whitesmoke; position: absolute; top:6px; left:6px; border: 0;" ' +
                    'options=\'{"duration": 375,  "easing": "elastic-in-out"}\'></vv-ng-md-icon>' +
                    '</md-button>' +
                    '</div>' +
                    '<div style="height: 50%">' +
                    '<md-button class="md-fab md-mini md-primary md-hue-3" ng-click="model[options.key] = (model[options.key] >=2 ? model[options.key]-1 : 1)" ' +
                    'ng-disabled="model.del">' +
                    '<vv-ng-md-icon icon="exposure_minus_1" style="fill: whitesmoke; position: absolute; top:6px; left:6px; border: 0;" ' +
                    'options=\'{"duration": 375,  "easing": "elastic-in-out"}\'></vv-ng-md-icon>' +
                    '</md-button>' +
                    '</div></div></div>');

                $templateCache.put('wrapper/mtrl-validationMessages.html', '<formly-transclude></formly-transclude>' +
                    '<div class="hint md-body-1" ng-if="!options.formControl.$touched && !options.validation.show && to.hintNeeded">{{to.hint}}</div>' +
                    '<div class="opt-messages" ng-messages="fc.$error" ng-if="options.formControl.$touched && options.validation.show">' +
                    '<div class="error-message" ng-message="{{::name}}" ng-repeat="(name, message) in ::options.validation.messages">' +
                    '{{message(fc.$viewValue, fc.$modelValue, this) }}</div></div>');
            }
        ])
        .directive('myMessages', function () {
            return {
                templateUrl: 'custom-messages.html',
                scope: { options: '=myMessages' }
            };
        });
}
