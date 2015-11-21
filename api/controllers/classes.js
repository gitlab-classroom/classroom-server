/**
 * Created by ZhongyiTong on 11/7/15.
 */
"use strict";

let apiwrap = require('./apibase').apiwrap;

let classes = {};

let assignmentsFilter = require('../filters/assignments');
let classesFilter = require('../filters/classes');

classes.listAll = apiwrap((req, res, gitlab) => {
  return new Promise((resolve, reject) => {
      gitlab.groups.all((groups) => {
        resolve(classesFilter.parseClasses(groups));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.get = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.show(id, function (group) {
        resolve(classesFilter.parseClass(group));
      });
    }
  ).then((val) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listAssignments = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        resolve(assignmentsFilter.parseAssignments(projects));
      });
    }
  ).then((val)=> {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listMaterials = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
      gitlab.projects.repository.listTree(syllabus.id, function (list) {
        resolve(list);
      });
    });
  }).then((materials)=> {
    let filterFactory = require('../filters/filters');
    let val = filterFactory.materialsFilter(materials);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listMembers = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listMembers(id, function (members) {
        resolve(members);
      });
    }
  ).then((members)=> {
    let filterFactory = require('../filters/filters');
    let val = filterFactory.membersFilter(members);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listNotifications = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            resolve(project);
          }
        }
      });
    }
  ).then((syllabus)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(syllabus.id, function (issues) {
          resolve(issues);
        });
      }
    )
  }).then((issues)=> {
    let filterFactory = require('../filters/filters');
    let val = filterFactory.notificationsFilter(issues);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

classes.listActivities = apiwrap((req, res, gitlab) => {
  let id = req.swagger.params.id.value;
  return new Promise((resolve, reject) => {
      gitlab.groups.listProjects(id, function (projects) {
        for (let project of projects) {
          if (project.name == 'syllabus') {
            let activitiesObj = {'syllabus': project, 'assignments': projects};
            resolve(activitiesObj);
          }
        }
      });
    }
  ).then((activitiesObj)=> {
    return new Promise((resolve, reject) => {
        gitlab.projects.issues.list(activitiesObj.syllabus.id, function (issues) {
          activitiesObj.notifications = issues;
          resolve(activitiesObj);
        });
      }
    )
  }).then((activitiesObj)=> {
    let filterFactory = require('../filters/filters');
    let val = filterFactory.activitiesFilter(activitiesObj);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(val));
    res.end();
  });
});

module.exports = classes;
