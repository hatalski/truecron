import Ember from 'ember';
export default Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); partials = this.merge(partials, Ember.Handlebars.partials); data = data || {};
  var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;


  data.buffer.push("<!doctype html>\n<html lang=\"en\">\n<head>\n    <title>");
  stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push(":");
  stack1 = helpers._triageMustache.call(depth0, "user", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("</title>\n    <link rel=\"icon\" href=/favicon.ico\"/>\n    <link rel=\"stylesheet\" href=\"/bower_components/bootstrap/dist/css/bootstrap.min.css\"/>\n    <link rel=\"stylesheet\" href=\"/bower_components/bootstrap/dist/css/bootstrap-theme.min.css\"/>\n    <link rel=\"stylesheet\" href=\"/bower_components/font-awesome/css/font-awesome.min.css\"/>\n    \n    <link rel=\"stylesheet\" href=\"/stylesheets/theme-truecron.css\"/>\n    <link rel=\"stylesheet\" href=\"/stylesheets/style.css\"/>\n</head>\n<body>\n\n\n<script type=\"text/x-handlebars\">\n    {{#if controllers.signin.isSignedIn}}\n\n    <div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n        <div class=\"container-fluid\">\n            <div class=\"navbar-header\">\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n                    <span class=\"sr-only\">Toggle navigation</span>\n                    <span class=\"icon-bar\"></span>\n                    <span class=\"icon-bar\"></span>\n                    <span class=\"icon-bar\"></span>\n                </button>\n                <a class=\"navbar-brand\" href=\"/\"></a>\n            </div>\n            <div class=\"navbar-collapse collapse\">\n                <ul class=\"nav navbar-nav navbar-right\">\n                    <li><a href=\"#\" {{action \"signout\" target=\"controllers.signin\"}}>Sign out <i class=\"fa fa-sign-out\"></i></a></li>\n                    <li>{{#link-to \"dashboard\"}}<i class=\"fa fa-bars\"></i>{{/link-to}}</li>\n                </ul>\n                <ul class=\"nav navbar-nav navbar-right\">\n                    <li class=\"dropdown\">\n                        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Organizations <span class=\"caret\"></span></a>\n                        <ul class=\"dropdown-menu\" role=\"menu\">\n                            <li>{{#link-to \"organizations\"}}All organizations{{/link-to}}</li>\n                            <li class=\"divider\"></li>\n                            <li>{{#link-to \"organizations.add\"}} Add organization{{/link-to}}</li>\n                        </ul>\n                    </li>\n\n                    <li class=\"dropdown\">\n                        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Settings <span class=\"caret\"></span></a>\n                        <ul class=\"dropdown-menu\" role=\"menu\">\n                            <li>{{#link-to \"workspaces\"}}Workspaces{{/link-to}}</li>\n                            <li class=\"divider\"></li>\n                            <li>{{#link-to \"users\"}}<i class=\"fa fa-users\"></i> Users{{/link-to}}</li>\n                        </ul>\n                    </li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class=\"container-fluid\">\n        <div class=\"row\">\n            <div class=\"sidebar\">\n                \n\n                <ul class=\"nav nav-tabs\" role=\"tablist\">\n                    <li class=\"active\">\n                        <a {{action \"showJobs\"}}><span>Jobs</span></a>\n                    </li>\n                    <li class=\"active\">\n                        <a {{action \"showConnections\"}}><span>Connections</span></a>\n                    </li>\n                </ul>\n\n                {{outlet \"navigation\"}}\n\n                <ul class=\"nav nav-sidebar\">\n                    {{#active-li currentWhen=\"dashboard\"}}\n                    {{#link-to 'dashboard'}}Overview{{/link-to}}\n                    {{/active-li}}\n                </ul>\n                <ul class=\"nav nav-sidebar\">\n                    {{#active-li currentWhen=\"execute-bar\"}}\n                    {{#link-to 'execute-bar'}}execute-bar{{/link-to}}\n                    {{/active-li}}\n                    <li><a {{action \"signout\" target=\"controllers.signin\"}} href=\"#\">Sign out</a></li>\n                </ul>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2\">\n        <div class=\"main\">\n            ");
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
    'unescaped': ("true")
  },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n            {{outlet}}\n        </div>\n    </div>\n    {{else}}\n    <!--{{partial \"interface-menu-top\"}}\n            <div class=\"backglp\">\n                <div class=\"container-fluid\">\n                    <div class=\"formlp\">\n                        <div> \n                            <div class=\"heightblock\"></div>-->\n    ");
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "body", {hash:{
    'unescaped': ("true")
  },hashTypes:{'unescaped': "STRING"},hashContexts:{'unescaped': depth0},contexts:[depth0],types:["ID"],data:data})));
  data.buffer.push("\n    {{outlet}}\n    <!--</div>\n</div>\n</div>\n</div>-->\n    {{/if}}\n</script>\n\n\n");
  data.buffer.push(escapeExpression((helper = helpers.rawinclude || (depth0 && depth0.rawinclude),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "views/partials/about.handlebars", options) : helperMissing.call(depth0, "rawinclude", "views/partials/about.handlebars", options))));
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.dashboard, 'dashboard', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.home_page, 'home_page', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.hello, 'hello', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.index, 'index', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.rawinclude || (depth0 && depth0.rawinclude),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "views/partials/organizations.handlebars", options) : helperMissing.call(depth0, "rawinclude", "views/partials/organizations.handlebars", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.rawinclude || (depth0 && depth0.rawinclude),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "views/partials/organizations-add.handlebars", options) : helperMissing.call(depth0, "rawinclude", "views/partials/organizations-add.handlebars", options))));
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.rawinclude || (depth0 && depth0.rawinclude),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "views/partials/organizations-item.handlebars", options) : helperMissing.call(depth0, "rawinclude", "views/partials/organizations-item.handlebars", options))));
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.plans, 'plans', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.signin, 'signin', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.signup, 'signup', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.status, 'status', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  data.buffer.push(escapeExpression((helper = helpers.rawinclude || (depth0 && depth0.rawinclude),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "views/partials/teaser.handlebars", options) : helperMissing.call(depth0, "rawinclude", "views/partials/teaser.handlebars", options))));
  data.buffer.push("\n");
  stack1 = self.invokePartial(partials.terms, 'terms', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n\n\n<script type=\"text/javascript\" src=\"/bower_components/jquery/dist/jquery.min.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/bootstrap/dist/js/bootstrap.min.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/handlebars/handlebars.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/ember/ember.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/ember-data/ember-data.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/ember-addons.bs_for_ember/dist/js/bs-core.min.js\"></script>\n<script type=\"text/javascript\" src=\"/bower_components/ember-addons.bs_for_ember/dist/js/bs-modal.min.js\"></script>\n\n<script type=\"text/javascript\" src=\"/js/app.js\"></script>\n\n<script type=\"text/javascript\" src=\"/js/organizations.js\"></script>\n\n<script type=\"text/javascript\" src=\"/js/components/active-li.js\"></script>\n<script type=\"text/javascript\" src=\"/js/lib/handlebars-helpers.js\"></script>\n\n</body>\n</html>");
  return buffer;
  
});
