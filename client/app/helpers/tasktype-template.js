import Ember from 'ember';

export function tasktypeTemplate(taskTypeName) {
  return "dashboard/organization/workspace/tasks/tasktype-" + taskTypeName;
}

export default Ember.Handlebars.makeBoundHelper(tasktypeTemplate);
