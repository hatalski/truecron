eval("//# sourceURL=vendor/ember-cli/loader.js");

;eval("define(\"true-cron/app\", \n  [\"ember\",\"ember/resolver\",\"ember/load-initializers\",\"true-cron/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Resolver = __dependency2__[\"default\"];\n    var loadInitializers = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    Ember.MODEL_FACTORY_INJECTIONS = true;\n\n    var App = Ember.Application.extend({\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix,\n      Resolver: Resolver\n    });\n\n    loadInitializers(App, config.modulePrefix);\n\n    __exports__[\"default\"] = App;\n  });//# sourceURL=true-cron/app.js");

;eval("define(\"true-cron/initializers/export-application-global\", \n  [\"ember\",\"true-cron/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    function initialize(container, application) {\n      var classifiedName = Ember.String.classify(config.modulePrefix);\n\n      if (config.exportApplicationGlobal) {\n        window[classifiedName] = application;\n      }\n    };\n    __exports__.initialize = initialize;\n    __exports__[\"default\"] = {\n      name: \'export-application-global\',\n\n      initialize: initialize\n    };\n  });//# sourceURL=true-cron/initializers/export-application-global.js");

;eval("define(\"true-cron/models/job\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        name: DS.attr(\'string\'),\n        startsAt: DS.attr(\'date\'),\n        rrule: DS.attr(\'string\'),\n        active: DS.attr(\'boolean\'),\n        archived: DS.attr(\'boolean\'),\n        createdAt: DS.attr(\'date\'),\n        updatedAt: DS.attr(\'date\'),\n        updatedBy: DS.belongsTo(\'person\', { async: true }),\n        workspace: DS.belongsTo(\'workspace\', { async: true }),\n        tasks: DS.hasMany(\'task\', { async: true })\n    });\n  });//# sourceURL=true-cron/models/job.js");

;eval("define(\"true-cron/models/organization\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        name:       DS.attr(\'string\'),\n        email:      DS.attr(\'string\'),\n        plan:       DS.attr(\'string\'),\n        createdAt:  DS.attr(\'date\'),\n        updatedAt:  DS.attr(\'date\'),\n        updatedBy:  DS.belongsTo(\'person\', { async: true }),\n        workspaces: DS.hasMany(\'workspace\', { async: true }),\n        users:      DS.hasMany(\'person\', { async: true })\n    });\n  });//# sourceURL=true-cron/models/organization.js");

;eval("define(\"true-cron/models/person\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        login: DS.attr(\'string\'),\n        name: DS.attr(\'string\'),\n        passwordSalt: DS.attr(\'string\'),\n        passwordHash: DS.attr(\'string\'),\n        avatarUrl: DS.attr(\'string\'),\n        extensionData: DS.attr(\'string\'),\n        lastLoginAt: DS.attr(\'date\'),\n        createdAt: DS.attr(\'date\'),\n        updatedAt: DS.attr(\'date\'),\n        updatedBy: DS.belongsTo(\'person\', { async: true }),\n        organizations: DS.hasMany(\'organization\', { async: true })\n    });\n  });//# sourceURL=true-cron/models/person.js");

;eval("define(\"true-cron/models/task-type\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        name: DS.attr(\'string\')\n    });\n  });//# sourceURL=true-cron/models/task-type.js");

;eval("define(\"true-cron/models/task\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        name:      DS.attr(\'string\'),\n        active:    DS.attr(\'boolean\'),\n        settings:  DS.attr(\'string\'),\n        position:  DS.attr(\'number\'),\n        timeout:   DS.attr(\'number\'),\n        createdAt: DS.attr(\'date\'),\n        updatedAt: DS.attr(\'date\'),\n        updatedBy: DS.belongsTo(\'person\', { async: true }),\n        job:       DS.belongsTo(\'job\', { async: true }),\n        taskType:  DS.belongsTo(\'taskType\', { async: true })\n    });\n  });//# sourceURL=true-cron/models/task.js");

;eval("define(\"true-cron/models/workspace\", \n  [\"ember-data\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var DS = __dependency1__[\"default\"];\n\n    __exports__[\"default\"] = DS.Model.extend({\n        name:         DS.attr(\'string\'),\n        createdAt:    DS.attr(\'date\'),\n        updatedAt:    DS.attr(\'date\'),\n        updatedBy:    DS.belongsTo(\'person\', { async: true }),\n        jobs:         DS.hasMany(\'job\', { async: true }),\n        organization: DS.belongsTo(\'organization\', { async: true })\n    });\n  });//# sourceURL=true-cron/models/workspace.js");

;eval("define(\"true-cron/router\", \n  [\"ember\",\"true-cron/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var Router = Ember.Router.extend({\n      location: config.locationType\n    });\n\n    Router.map(function() {\n    });\n\n    __exports__[\"default\"] = Router;\n  });//# sourceURL=true-cron/router.js");

;eval("define(\"true-cron/templates/application\", \n  [\"ember\",\"exports\"],\n  function(__dependency1__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    __exports__[\"default\"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {\n    this.compilerInfo = [4,\'>= 1.0.0\'];\n    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};\n      var buffer = \'\', stack1;\n\n\n      data.buffer.push(\"<h2 id=\'title\'>Welcome to Ember.js</h2>\\n\\n\");\n      stack1 = helpers._triageMustache.call(depth0, \"outlet\", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:[\"ID\"],data:data});\n      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }\n      data.buffer.push(\"\\n\");\n      return buffer;\n      \n    });\n  });//# sourceURL=true-cron/templates/application.js");

;eval("define(\"true-cron/tests/app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'app.js should pass jshint\', function() { \n      ok(true, \'app.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/app.jshint.js");

;eval("define(\"true-cron/tests/helpers/resolver\", \n  [\"ember/resolver\",\"true-cron/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __exports__) {\n    \"use strict\";\n    var Resolver = __dependency1__[\"default\"];\n    var config = __dependency2__[\"default\"];\n\n    var resolver = Resolver.create();\n\n    resolver.namespace = {\n      modulePrefix: config.modulePrefix,\n      podModulePrefix: config.podModulePrefix\n    };\n\n    __exports__[\"default\"] = resolver;\n  });//# sourceURL=true-cron/tests/helpers/resolver.js");

;eval("define(\"true-cron/tests/helpers/start-app\", \n  [\"ember\",\"true-cron/app\",\"true-cron/router\",\"true-cron/config/environment\",\"exports\"],\n  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {\n    \"use strict\";\n    var Ember = __dependency1__[\"default\"];\n    var Application = __dependency2__[\"default\"];\n    var Router = __dependency3__[\"default\"];\n    var config = __dependency4__[\"default\"];\n\n    __exports__[\"default\"] = function startApp(attrs) {\n      var App;\n\n      var attributes = Ember.merge({}, config.APP);\n      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;\n\n      Router.reopen({\n        location: \'none\'\n      });\n\n      Ember.run(function() {\n        App = Application.create(attributes);\n        App.setupForTesting();\n        App.injectTestHelpers();\n      });\n\n      App.reset(); // this shouldn\'t be needed, i want to be able to \"start an app at a specific URL\"\n\n      return App;\n    }\n  });//# sourceURL=true-cron/tests/helpers/start-app.js");

;eval("define(\"true-cron/tests/models/job.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/job.js should pass jshint\', function() { \n      ok(true, \'models/job.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/job.jshint.js");

;eval("define(\"true-cron/tests/models/organization.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/organization.js should pass jshint\', function() { \n      ok(true, \'models/organization.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/organization.jshint.js");

;eval("define(\"true-cron/tests/models/person.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/person.js should pass jshint\', function() { \n      ok(true, \'models/person.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/person.jshint.js");

;eval("define(\"true-cron/tests/models/task-type.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/task-type.js should pass jshint\', function() { \n      ok(true, \'models/task-type.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/task-type.jshint.js");

;eval("define(\"true-cron/tests/models/task.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/task.js should pass jshint\', function() { \n      ok(true, \'models/task.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/task.jshint.js");

;eval("define(\"true-cron/tests/models/workspace.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - models\');\n    test(\'models/workspace.js should pass jshint\', function() { \n      ok(true, \'models/workspace.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/models/workspace.jshint.js");

;eval("define(\"true-cron/tests/router.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - .\');\n    test(\'router.js should pass jshint\', function() { \n      ok(true, \'router.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/router.jshint.js");

;eval("define(\"true-cron/tests/test-helper\", \n  [\"true-cron/tests/helpers/resolver\",\"ember-qunit\"],\n  function(__dependency1__, __dependency2__) {\n    \"use strict\";\n    var resolver = __dependency1__[\"default\"];\n    var setResolver = __dependency2__.setResolver;\n\n    setResolver(resolver);\n\n    document.write(\'<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>\');\n\n    QUnit.config.urlConfig.push({ id: \'nocontainer\', label: \'Hide container\'});\n    var containerVisibility = QUnit.urlParams.nocontainer ? \'hidden\' : \'visible\';\n    document.getElementById(\'ember-testing-container\').style.visibility = containerVisibility;\n  });//# sourceURL=true-cron/tests/test-helper.js");

;eval("define(\"true-cron/tests/true-cron/tests/helpers/resolver.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/helpers\');\n    test(\'true-cron/tests/helpers/resolver.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/helpers/resolver.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/helpers/resolver.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/helpers/start-app.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/helpers\');\n    test(\'true-cron/tests/helpers/start-app.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/helpers/start-app.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/helpers/start-app.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/test-helper.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests\');\n    test(\'true-cron/tests/test-helper.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/test-helper.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/test-helper.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/job-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/job-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/job-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/job-test.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/organization-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/organization-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/organization-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/organization-test.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/person-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/person-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/person-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/person-test.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/task-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/task-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/task-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/task-test.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/task-type-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/task-type-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/task-type-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/task-type-test.jshint.js");

;eval("define(\"true-cron/tests/true-cron/tests/unit/models/workspace-test.jshint\", \n  [],\n  function() {\n    \"use strict\";\n    module(\'JSHint - true-cron/tests/unit/models\');\n    test(\'true-cron/tests/unit/models/workspace-test.js should pass jshint\', function() { \n      ok(true, \'true-cron/tests/unit/models/workspace-test.js should pass jshint.\'); \n    });\n  });//# sourceURL=true-cron/tests/true-cron/tests/unit/models/workspace-test.jshint.js");

;eval("define(\"true-cron/tests/unit/models/job-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'job\', \'Job\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/job-test.js");

;eval("define(\"true-cron/tests/unit/models/organization-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'organization\', \'Organization\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/organization-test.js");

;eval("define(\"true-cron/tests/unit/models/person-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'person\', \'Person\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/person-test.js");

;eval("define(\"true-cron/tests/unit/models/task-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'task\', \'Task\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/task-test.js");

;eval("define(\"true-cron/tests/unit/models/task-type-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'task-type\', \'TaskType\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/task-type-test.js");

;eval("define(\"true-cron/tests/unit/models/workspace-test\", \n  [\"ember-qunit\"],\n  function(__dependency1__) {\n    \"use strict\";\n    var moduleForModel = __dependency1__.moduleForModel;\n    var test = __dependency1__.test;\n\n    moduleForModel(\'workspace\', \'Workspace\', {\n      // Specify the other units that are required for this test.\n      needs: []\n    });\n\n    test(\'it exists\', function() {\n      var model = this.subject();\n      // var store = this.store();\n      ok(!!model);\n    });\n  });//# sourceURL=true-cron/tests/unit/models/workspace-test.js");

/* jshint ignore:start */

define('true-cron/config/environment', ['ember'], function(Ember) {
  var prefix = 'true-cron';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */


});

if (runningTests) {
  require('true-cron/tests/test-helper');
} else {
  require('true-cron/app')['default'].create({"LOG_ACTIVE_GENERATION":true,"LOG_VIEW_LOOKUPS":true});
}

/* jshint ignore:end */
